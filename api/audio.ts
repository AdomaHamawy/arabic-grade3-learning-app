import { GoogleGenAI } from '@google/genai';

interface ServerlessRequest {
  method?: string;
  query: Record<string, string | string[] | undefined>;
  body?: any;
}

interface ServerlessResponse {
  setHeader: (name: string, value: string) => this;
  status: (code: number) => this;
  send: (body: any) => this;
  end: (chunk?: any) => this;
}

async function fetchGoogleArabicTTS(text: string): Promise<Buffer> {
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

export default async function handler(req: ServerlessRequest, res: ServerlessResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const text = req.query.text as string;
    const voiceType = req.query.voiceType as string | undefined;

    if (!text || typeof text !== 'string') {
      return res.status(400).send('Text parameter is required');
    }

    const cleanText = text.trim();

    // 1. For reading lesson paragraphs (educational texts with full tashkeel/diacritics),
    // Google Arabic TTS provides instant (<450ms) classical pronunciation with exact diacritics accuracy
    if (voiceType === 'male_teacher' && cleanText.length > 80) {
      try {
        const mp3Buffer = await fetchGoogleArabicTTS(cleanText);
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', mp3Buffer.length.toString());
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.status(200).send(mp3Buffer);
      } catch (err) {
        console.warn('Google Arabic TTS failed on Vercel for reading text, trying Gemini:', err);
      }
    }

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
        });

        let voiceName = 'Puck'; // Ahmed
        if (voiceType === 'child_maryam') {
          voiceName = 'Kore'; // Maryam
        } else if (voiceType === 'male_teacher') {
          voiceName = 'Charon'; // Teacher
        }

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [{ role: 'user', parts: [{ text: cleanText }] }],
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
          res.setHeader('Content-Type', 'audio/wav');
          res.setHeader('Content-Length', buffer.length.toString());
          res.setHeader('Accept-Ranges', 'bytes');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          return res.status(200).send(buffer);
        }
      } catch (geminiError) {
        console.warn('Gemini TTS failed on Vercel, switching to Google Arabic TTS fallback:', geminiError);
      }
    }

    const mp3Buffer = await fetchGoogleArabicTTS(cleanText);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', mp3Buffer.length.toString());
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(mp3Buffer);
  } catch (err: any) {
    console.error('Audio stream handler error:', err?.message || err);
    return res.status(500).send('Failed to generate audio');
  }
}
