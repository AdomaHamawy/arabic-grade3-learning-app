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
// Web Speech API Engine with Intelligent Voice Detection
// ========================================================
let arabicVoiceCache: SpeechSynthesisVoice | null = null;
let currentAudioElement: HTMLAudioElement | null = null;
let activeSpeechToken: number = 0;
let resumeInterval: any = null;

// Clean text for speech synthesis (strip emojis, markdown, symbols that confuse TTS)
export function sanitizeArabicForSpeech(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/[•*#_~`🎬🎤🎙️🔊👦👧🧔👨‍🏫💡💬🌟⭐🎯✍️🔗🌸🔔⛔👥👉✂️❓]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getArabicVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Exact Egyptian Arabic voice
  const egVoice = voices.find(
    (v) =>
      v.lang === 'ar-EG' ||
      v.lang === 'ar_EG' ||
      v.lang.toLowerCase().includes('egypt') ||
      v.name.toLowerCase().includes('egypt')
  );
  if (egVoice) return egVoice;

  // 2. Any Arabic lang code (ar-SA, ar-XA, ar-AE, etc.)
  const anyArVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ar'));
  if (anyArVoice) return anyArVoice;

  // 3. Any voice with Arabic name or localized keywords
  const namedArVoice = voices.find((v) => {
    const name = v.name.toLowerCase();
    return (
      name.includes('arabic') ||
      name.includes('عربي') ||
      name.includes('maged') ||
      name.includes('tarik') ||
      name.includes('laila') ||
      name.includes('mariam') ||
      name.includes('maryam') ||
      name.includes('hoda') ||
      name.includes('naayf') ||
      name.includes('salma') ||
      name.includes('youssef') ||
      name.includes('shakir')
    );
  });
  if (namedArVoice) return namedArVoice;

  return null;
}

// Pre-warm voices on load
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    arabicVoiceCache = getArabicVoice();
    window.speechSynthesis.onvoiceschanged = () => {
      arabicVoiceCache = getArabicVoice();
    };
  } catch {
    // ignore
  }
}

export function stopSpeaking() {
  activeSpeechToken++;
  if (resumeInterval) {
    clearInterval(resumeInterval);
    resumeInterval = null;
  }
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
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
 * Plays crystal-clear Arabic speech immediately via HTML5 Audio element.
 * Works 100% reliably across all operating systems, browsers, and devices
 * without requiring any locally installed Arabic voice packs.
 */
export function playAudioStream(
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
    const audio = new Audio(url);
    currentAudioElement = audio;

    let hasStarted = false;

    audio.onplay = () => {
      hasStarted = true;
      if (token === activeSpeechToken && options?.onStart) {
        options.onStart();
      }
    };

    audio.onended = () => {
      if (token === activeSpeechToken) {
        currentAudioElement = null;
        if (options?.onEnd) options.onEnd();
      }
    };

    audio.onerror = (e) => {
      console.warn('Audio stream element error, attempting base64 fallback:', e);
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
          console.warn('Audio play interrupted or prevented:', err);
          if (token === activeSpeechToken && options?.onEnd) {
            options.onEnd();
          }
        });
    }
  } catch (err) {
    console.warn('Direct audio play failed:', err);
    fallbackServerTTS(text, options, token);
  }
}

/**
 * Universal Arabic Synthesizer:
 * Executes synchronously upon user click gestures.
 * If browser has a verified Arabic voice pack, uses Web Speech API.
 * Otherwise, immediately streams high-clarity Arabic audio so the user hears voice instantly.
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

  // Check if the browser actually has a native Arabic voice installed
  const nativeArabicVoice = arabicVoiceCache || getArabicVoice();

  if (nativeArabicVoice && 'speechSynthesis' in window) {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.voice = nativeArabicVoice;
      utterance.lang = nativeArabicVoice.lang || 'ar-SA';

      if (options?.voiceType === 'child_ahmed') {
        utterance.pitch = 1.35;
        utterance.rate = 1.0;
      } else if (options?.voiceType === 'child_maryam') {
        utterance.pitch = 1.45;
        utterance.rate = 1.0;
      } else {
        utterance.pitch = 0.95;
        utterance.rate = 0.92;
      }

      let started = false;

      utterance.onstart = () => {
        started = true;
        if (token === activeSpeechToken && options?.onStart) {
          options.onStart();
        }
      };

      utterance.onend = () => {
        if (resumeInterval) {
          clearInterval(resumeInterval);
          resumeInterval = null;
        }
        if (token === activeSpeechToken && options?.onEnd) {
          options.onEnd();
        }
      };

      utterance.onerror = (event: any) => {
        if (resumeInterval) {
          clearInterval(resumeInterval);
          resumeInterval = null;
        }
        if (event?.error === 'canceled' || event?.error === 'interrupted') return;
        if (token === activeSpeechToken) {
          playAudioStream(cleanedText, options, token);
        }
      };

      if (resumeInterval) clearInterval(resumeInterval);
      resumeInterval = setInterval(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        }
      }, 4000);

      window.speechSynthesis.speak(utterance);

      // Watchdog: If Web Speech fails to actually emit sound within 350ms, switch to stream
      setTimeout(() => {
        if (token === activeSpeechToken && !started && (!window.speechSynthesis.speaking || window.speechSynthesis.paused)) {
          console.info('Web speech voice stalled, switching to direct stream');
          stopSpeaking();
          playAudioStream(cleanedText, options, token);
        }
      }, 350);
      return;
    } catch (e) {
      console.warn('Web Speech API execution failed, switching to direct stream:', e);
    }
  }

  // If no native Arabic voice is installed on client OS, play directly via audio stream
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
