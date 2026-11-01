/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Enable CORS and audio streaming headers for all requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-memory cache for generated audio
const audioBufferCache = new Map<string, { buffer: Buffer; mimeType: string }>();

// Helper to fetch Arabic TTS audio from Google TTS (fallback when Gemini quota is exhausted)
async function fetchGoogleArabicTTS(text: string): Promise<Buffer> {
  // Google TTS allows up to ~200 characters per request
  const sentences = text.match(/[^.!?،؛\n]+[.!?،؛\n]?/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + ' ' + sentence).length < 180) {
      currentChunk = currentChunk ? currentChunk + ' ' + sentence : sentence;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = sentence;
    }
  }
  if (currentChunk) chunks.push(currentChunk);

  const buffers: Buffer[] = [];
  for (const chunk of chunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(trimmed)}&tl=ar&client=tw-ob`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });
    if (res.ok) {
      const arrayBuf = await res.arrayBuffer();
      buffers.push(Buffer.from(arrayBuf));
    }
  }

  if (buffers.length === 0) {
    throw new Error('Failed to generate Arabic audio chunks');
  }
  return Buffer.concat(buffers);
}

// Generate Arabic audio buffer with high-clarity reading pronunciation and character voices
async function getArabicAudio(text: string, voiceType?: string): Promise<{ buffer: Buffer; mimeType: string }> {
  const cleanText = text.trim();
  const cacheKey = `${voiceType || 'default'}-${cleanText}`;

  if (audioBufferCache.has(cacheKey)) {
    return audioBufferCache.get(cacheKey)!;
  }

  // 1. For reading lesson paragraphs (educational texts with full tashkeel/diacritics),
  // Google Arabic TTS provides instant (<450ms) classical pronunciation with exact diacritics accuracy
  if (voiceType === 'male_teacher' && cleanText.length > 80) {
    try {
      const mp3Buffer = await fetchGoogleArabicTTS(cleanText);
      const result = { buffer: mp3Buffer, mimeType: 'audio/mpeg' };
      if (audioBufferCache.size > 200) {
        const firstKey = audioBufferCache.keys().next().value;
        if (firstKey) audioBufferCache.delete(firstKey);
      }
      audioBufferCache.set(cacheKey, result);
      return result;
    } catch (err) {
      console.warn('Google Arabic TTS failed for reading text, trying Gemini:', err);
    }
  }

  // 2. For character dialogues (Ahmed & Maryam), use Gemini 3.8 Flash Lite TTS with race timeout
  if (process.env.GEMINI_API_KEY) {
    try {
      let voiceName = 'Puck'; // Ahmed
      if (voiceType === 'child_maryam') {
        voiceName = 'Kore'; // Maryam
      } else if (voiceType === 'male_teacher') {
        voiceName = 'Charon'; // Teacher
      }

      const geminiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [{ text: cleanText }],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini TTS timeout (2500ms)')), 2500)
      );

      const response = await Promise.race([geminiPromise, timeoutPromise]);
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const buffer = Buffer.from(base64Audio, 'base64');
        const result = { buffer, mimeType: 'audio/wav' };
        if (audioBufferCache.size > 200) {
          const firstKey = audioBufferCache.keys().next().value;
          if (firstKey) audioBufferCache.delete(firstKey);
        }
        audioBufferCache.set(cacheKey, result);
        return result;
      }
    } catch (geminiError: any) {
      console.warn('Gemini TTS timed out or failed, using Google Arabic TTS:', geminiError?.message || geminiError);
    }
  }

  // 3. High-reliability Google Arabic TTS
  const mp3Buffer = await fetchGoogleArabicTTS(cleanText);
  const result = { buffer: mp3Buffer, mimeType: 'audio/mpeg' };

  if (audioBufferCache.size > 200) {
    const firstKey = audioBufferCache.keys().next().value;
    if (firstKey) audioBufferCache.delete(firstKey);
  }
  audioBufferCache.set(cacheKey, result);
  return result;
}

// GET /api/audio: Direct streaming audio endpoint for HTML5 Audio playback
app.get('/api/audio', async (req, res) => {
  try {
    const text = req.query.text as string;
    const voiceType = req.query.voiceType as string | undefined;

    if (!text || typeof text !== 'string') {
      return res.status(400).send('Text query param is required');
    }

    const { buffer, mimeType } = await getArabicAudio(text, voiceType);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', buffer.length.toString());
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.end(buffer);
  } catch (err: any) {
    console.error('Audio stream error:', err?.message || err);
    return res.status(500).send('Failed to generate audio');
  }
});

// POST /api/tts: Base64 JSON endpoint
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceType } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const { buffer, mimeType } = await getArabicAudio(text, voiceType);
    return res.json({
      audioBase64: buffer.toString('base64'),
      mimeType,
    });
  } catch (error: any) {
    console.error('Server TTS error:', error?.message || error);
    return res.status(500).json({
      error: error?.message || 'TTS generation failed',
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasKey: !!process.env.GEMINI_API_KEY });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
