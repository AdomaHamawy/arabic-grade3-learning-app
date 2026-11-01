/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API Synthesizer for 100% reliable sound effects
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playSound = {
  // Gentle pop for button click
  click: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio context error or blocked
    }
  },

  // Joyful bright chime for star collection
  star: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.3);
      });
    } catch {
      // Fallback
    }
  },

  // Warm celebratory arpeggio for correct answer
  success: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const chords = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      chords.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + i * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.35);
      });
    } catch {
      // Fallback
    }
  },

  // Soft encouraging chime (never harsh or punishing for a child)
  tryAgain: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
      osc.frequency.exponentialRampToValueAtTime(293.66, ctx.currentTime + 0.2); // D4
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Fallback
    }
  },

  // Grand celebration fanfare for completing a unit or exam
  fanfare: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const melody = [
        { f: 523.25, t: 0, d: 0.12 },
        { f: 659.25, t: 0.12, d: 0.12 },
        { f: 783.99, t: 0.24, d: 0.15 },
        { f: 1046.5, t: 0.4, d: 0.4 },
      ];
      melody.forEach(({ f, t, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + t);
        gain.gain.setValueAtTime(0.28, ctx.currentTime + t);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + d);
      });
    } catch {
      // Fallback
    }
  },
};

// ========================================================
// Web Speech API Engine with Intelligent Voice Detection & Fallback
// ========================================================
let arabicVoiceCache: SpeechSynthesisVoice[] = [];
let currentAudioElement: HTMLAudioElement | null = null;
let activeSpeechToken: number = 0;
let resumeInterval: ReturnType<typeof setInterval> | null = null;

// Clean text for speech synthesis (strip emojis, markdown, symbols that confuse TTS)
export function sanitizeArabicForSpeech(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/[•*#_~`🎬🎤🎙️🔊👦👧🧔👨‍🏫💡💬🌟⭐🎯✍️🔗🌸🔔⛔👥👉✂️❓]/g, ' ')
    .replace(/["«»]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Populate and cache voices reliably across browsers
function refreshVoiceList(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  try {
    const list = window.speechSynthesis.getVoices();
    if (list && list.length > 0) {
      arabicVoiceCache = list;
    }
  } catch {
    // ignore
  }
  return arabicVoiceCache;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    refreshVoiceList();
    window.speechSynthesis.onvoiceschanged = () => {
      refreshVoiceList();
    };
  } catch {
    // ignore
  }
}

export function getArabicVoice(
  voiceType?: 'child_ahmed' | 'child_maryam' | 'male_teacher'
): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = refreshVoiceList();
  if (!voices || voices.length === 0) return null;

  // Filter all Arabic voices
  const arVoices = voices.filter(
    (v) =>
      v.lang.toLowerCase().startsWith('ar') ||
      v.name.toLowerCase().includes('arabic') ||
      v.name.includes('عربي')
  );

  if (arVoices.length === 0) return null;

  // If Maryam (Egyptian school girl), prefer female Arabic voices
  if (voiceType === 'child_maryam') {
    const femaleVoice = arVoices.find((v) => {
      const n = v.name.toLowerCase();
      return (
        n.includes('salma') ||
        n.includes('hoda') ||
        n.includes('laila') ||
        n.includes('mariam') ||
        n.includes('maryam') ||
        n.includes('zeina') ||
        n.includes('zariyah') ||
        n.includes('fatima') ||
        n.includes('nour')
      );
    });
    if (femaleVoice) return femaleVoice;
  }

  // If Ahmed (Egyptian school boy) or Teacher, prefer male Arabic voices
  if (voiceType === 'child_ahmed' || voiceType === 'male_teacher') {
    const maleVoice = arVoices.find((v) => {
      const n = v.name.toLowerCase();
      return (
        n.includes('maged') ||
        n.includes('tarik') ||
        n.includes('shakir') ||
        n.includes('naayf') ||
        n.includes('youssef') ||
        n.includes('hamed')
      );
    });
    if (maleVoice) return maleVoice;
  }

  // 1. Exact Egyptian Arabic voice
  const egVoice = arVoices.find(
    (v) =>
      v.lang === 'ar-EG' ||
      v.lang === 'ar_EG' ||
      v.lang.toLowerCase().includes('egypt') ||
      v.name.toLowerCase().includes('egypt')
  );
  if (egVoice) return egVoice;

  // 2. Any Arabic voice (ar-SA, ar-XA, etc.)
  return arVoices[0];
}

let activeAbortController: AbortController | null = null;

export function stopSpeaking() {
  activeSpeechToken++;
  if (activeAbortController) {
    activeAbortController.abort();
    activeAbortController = null;
  }
  if (resumeInterval) {
    clearInterval(resumeInterval);
    resumeInterval = null;
  }
  if (typeof window !== 'undefined') {
    (window as unknown as { __activeSpeechUtterance: SpeechSynthesisUtterance | null }).__activeSpeechUtterance = null;
  }
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.src = '';
      currentAudioElement.load();
    } catch {
      // ignore
    }
    currentAudioElement = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

/**
 * Direct Audio Streaming Engine:
 * Uses fetch with credentials + Blob objectUrl to seamlessly support preview iframes,
 * cross-origin proxies, and all mobile/desktop browsers without cookie dropping.
 */
export async function playAudioStream(
  text: string,
  options?: {
    voiceType?: 'male_teacher' | 'child_ahmed' | 'child_maryam';
    onStart?: () => void;
    onEnd?: () => void;
  },
  token: number = activeSpeechToken
) {
  try {
    const url = `/api/audio?text=${encodeURIComponent(text)}&voiceType=${options?.voiceType || 'male_teacher'}`;

    if (activeAbortController) {
      activeAbortController.abort();
    }
    const abortController = new AbortController();
    activeAbortController = abortController;

    // Use fetch with credentials to ensure session cookies and tokens pass inside iframes/proxies
    const res = await fetch(url, {
      credentials: 'include',
      signal: abortController.signal,
    });

    if (!res.ok) {
      throw new Error(`Audio fetch failed with HTTP ${res.status}`);
    }

    if (token !== activeSpeechToken) return;

    const blob = await res.blob();
    if (token !== activeSpeechToken) return;

    const objectUrl = URL.createObjectURL(blob);
    const audio = new Audio(objectUrl);
    currentAudioElement = audio;

    let hasStarted = false;

    audio.onplay = () => {
      hasStarted = true;
      if (token === activeSpeechToken && options?.onStart) {
        options.onStart();
      }
    };

    audio.onended = () => {
      URL.revokeObjectURL(objectUrl);
      if (token === activeSpeechToken) {
        currentAudioElement = null;
        if (options?.onEnd) options.onEnd();
      }
    };

    audio.onerror = (e) => {
      URL.revokeObjectURL(objectUrl);
      console.warn('Audio blob element error, attempting base64 fallback:', e);
      if (token === activeSpeechToken) {
        fallbackServerTTS(text, options, token);
      }
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (!hasStarted && token === activeSpeechToken && options?.onStart) {
            options.onStart();
          }
        })
        .catch((err) => {
          URL.revokeObjectURL(objectUrl);
          console.warn('Audio play interrupted or prevented by browser:', err);
          if (token === activeSpeechToken) {
            fallbackServerTTS(text, options, token);
          }
        });
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') return;
    console.warn('Direct audio fetch failed, attempting base64 fallback:', err);
    if (token === activeSpeechToken) {
      fallbackServerTTS(text, options, token);
    }
  }
}

/**
 * Universal Arabic Synthesizer:
 * 1. Checks if a verified Arabic voice pack is available in the browser/OS.
 * 2. If an Arabic voice is present, uses Web Speech API with tuned pitch/rate.
 * 3. If NO Arabic voice is present in the OS, directly streams crystal-clear audio from the server.
 */
export function speakArabic(
  text: string,
  options?: {
    voiceType?: 'male_teacher' | 'child_ahmed' | 'child_maryam';
    onStart?: () => void;
    onEnd?: () => void;
  }
) {
  stopSpeaking();
  const token = ++activeSpeechToken;

  const cleanedText = sanitizeArabicForSpeech(text);
  if (!cleanedText || typeof window === 'undefined') {
    if (options?.onEnd) options.onEnd();
    return;
  }

  // Wake up Web Audio Context immediately on user click gesture
  getAudioContext();

  const hasSpeechSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const verifiedArabicVoice = hasSpeechSynthesis ? getArabicVoice(options?.voiceType) : null;

  // ONLY use Web Speech API if the browser actually has a verified Arabic voice installed!
  // If the OS has no Arabic voice (like standard Windows or unconfigured browsers),
  // calling speechSynthesis results in total silence. Instead, directly stream audio!
  if (hasSpeechSynthesis && verifiedArabicVoice) {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.voice = verifiedArabicVoice;
      utterance.lang = verifiedArabicVoice.lang || 'ar-EG';

      // Authentic child & teacher vocal pitch and rate calibration
      if (options?.voiceType === 'child_ahmed') {
        utterance.pitch = 1.30; // Cheerful Egyptian boy tone
        utterance.rate = 1.0;
      } else if (options?.voiceType === 'child_maryam') {
        utterance.pitch = 1.42; // Gentle Egyptian girl tone
        utterance.rate = 1.0;
      } else {
        utterance.pitch = 1.0; // Clear articulate teacher tone
        utterance.rate = 0.94;
      }

      // CRITICAL FOR CHROMIUM / ANDROID CHROME:
      // Prevent Garbage Collection from silencing the utterance mid-playback
      (window as unknown as { __activeSpeechUtterance: SpeechSynthesisUtterance | null }).__activeSpeechUtterance = utterance;

      utterance.onstart = () => {
        if (token === activeSpeechToken && options?.onStart) {
          options.onStart();
        }
      };

      utterance.onend = () => {
        if (resumeInterval) {
          clearInterval(resumeInterval);
          resumeInterval = null;
        }
        (window as unknown as { __activeSpeechUtterance: SpeechSynthesisUtterance | null }).__activeSpeechUtterance = null;
        if (token === activeSpeechToken && options?.onEnd) {
          options.onEnd();
        }
      };

      utterance.onerror = (event: any) => {
        if (resumeInterval) {
          clearInterval(resumeInterval);
          resumeInterval = null;
        }
        (window as unknown as { __activeSpeechUtterance: SpeechSynthesisUtterance | null }).__activeSpeechUtterance = null;

        // Ignore intentional user cancels
        if (event?.error === 'canceled' || event?.error === 'interrupted') return;

        console.warn('Web Speech API error, falling back to direct stream:', event?.error);
        if (token === activeSpeechToken) {
          playAudioStream(cleanedText, options, token);
        }
      };

      // Keepalive heartbeat for Chromium 14-second pause bug
      if (resumeInterval) clearInterval(resumeInterval);
      resumeInterval = setInterval(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        }
      }, 2500);

      window.speechSynthesis.speak(utterance);
      return;
    } catch (e) {
      console.warn('Web Speech API execution failed, falling back to direct stream:', e);
    }
  }

  // If no native Arabic voice is installed on client OS, stream directly via audio element
  playAudioStream(cleanedText, options, token);
}

/**
 * Fallback to server-side base64 audio
 */
async function fallbackServerTTS(
  text: string,
  options?: {
    voiceType?: 'male_teacher' | 'child_ahmed' | 'child_maryam';
    onStart?: () => void;
    onEnd?: () => void;
  },
  token: number = activeSpeechToken
) {
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voiceType: options?.voiceType || 'male_teacher',
      }),
    });

    if (token !== activeSpeechToken) return;

    if (res.ok) {
      const data = await res.json();
      if (data.audioBase64) {
        const audio = new Audio(`data:${data.mimeType || 'audio/mpeg'};base64,${data.audioBase64}`);
        currentAudioElement = audio;

        if (options?.onStart) options.onStart();

        audio.onended = () => {
          if (token === activeSpeechToken) {
            currentAudioElement = null;
            if (options?.onEnd) options.onEnd();
          }
        };

        audio.onerror = () => {
          if (token === activeSpeechToken) {
            currentAudioElement = null;
            if (options?.onEnd) options.onEnd();
          }
        };

        await audio.play();
        return;
      }
    }
  } catch (err) {
    console.warn('Server TTS base64 fallback failed:', err);
  }

  if (token === activeSpeechToken && options?.onEnd) {
    options.onEnd();
  }
}

