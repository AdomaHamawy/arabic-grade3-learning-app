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

// Generate Arabic audio buffer using Gemini (primary) with Google Arabic TTS fallback
async function getArabicAudio(text: string, voiceType?: string): Promise<{ buffer: Buffer; mimeType: string }> {
  const cleanText = text.trim();
  const cacheKey = `${voiceType || 'default'}-${cleanText}`;

  if (audioBufferCache.has(cacheKey)) {
    return audioBufferCache.get(cacheKey)!;
  }

  // 1. Try Gemini 3.8 Flash Lite TTS first
  if (process.env.GEMINI_API_KEY) {
    try {
      let voiceName = 'Puck'; // Ahmed
      let promptStyle = 'Enthusiastic friendly Egyptian boy';

      if (voiceType === 'child_maryam') {
        voiceName = 'Kore'; // Maryam
        promptStyle = 'Curious gentle Egyptian girl speaking warmly';
      } else if (voiceType === 'male_teacher') {
        voiceName = 'Charon'; // Teacher
        promptStyle = 'Inspiring articulate elementary school Arabic teacher';
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: cleanText,
                speechMetadata: {
                  style: promptStyle,
                },
              },
            ],
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
      console.warn('Gemini TTS failed or quota exceeded, switching to Google Arabic TTS fallback:', geminiError?.message || geminiError);
    }
  }

  // 2. High-reliability Google Arabic TTS fallback
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
