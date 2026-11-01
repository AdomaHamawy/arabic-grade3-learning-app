import { GoogleGenAI } from '@google/genai';

interface ServerlessRequest {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
  body?: any;
}

interface ServerlessResponse {
  setHeader: (name: string, value: string) => this;
  status: (code: number) => this;
  json: (body: any) => this;
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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { text, voiceType } = req.body || {};
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    const cleanText = text.trim();

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
        });

        let voiceName = 'Puck';
        if (voiceType === 'child_maryam') voiceName = 'Kore';
        else if (voiceType === 'male_teacher') voiceName = 'Charon';

        const response = await ai.models.generateContent({
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

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          return res.status(200).json({
            audioBase64: base64Audio,
            mimeType: 'audio/wav',
          });
        }
      } catch (geminiError) {
        console.warn('Gemini TTS base64 failed on Vercel, switching to Google Arabic TTS fallback:', geminiError);
      }
    }

    const mp3Buffer = await fetchGoogleArabicTTS(cleanText);
    return res.status(200).json({
      audioBase64: mp3Buffer.toString('base64'),
      mimeType: 'audio/mpeg',
    });
  } catch (err: any) {
    console.error('TTS handler error:', err?.message || err);
    return res.status(500).json({ error: 'Failed to generate audio' });
  }
}
