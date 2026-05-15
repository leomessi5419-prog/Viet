import * as Speech from 'expo-speech';

interface SpeakOpts {
  pitch?: number;
  rate?: number;
  slow?: boolean;
}

/**
 * Speak Vietnamese using the device TTS. Falls back gracefully if
 * vi-VN isn't installed — Expo Speech will use whichever vi voice
 * exists, and otherwise just won't speak. We never throw.
 */
export const speakVi = (text: string, opts: SpeakOpts = {}) => {
  try {
    Speech.stop();
    Speech.speak(text, {
      language: 'vi-VN',
      pitch: opts.pitch ?? 1.0,
      rate: opts.slow ? (opts.rate ?? 1.0) * 0.55 : opts.rate ?? 1.0,
    });
  } catch {}
};

export const stopSpeaking = () => {
  try { Speech.stop(); } catch {}
};
