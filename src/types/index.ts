export type ToneId = 'ngang' | 'huyen' | 'sac' | 'hoi' | 'nga' | 'nang';

export interface Tone {
  id: ToneId;
  name: string;
  diacritic: string;        // visual mark
  exampleSyllable: string;  // e.g. "má"
  exampleMeaning: string;
  description: string;
  contour: number[];        // 0-100 pitch points, for the SVG curve
}

export interface DialogueLine {
  speaker: 'character' | 'you';
  vi: string;
  en: string;
  literal?: string;
  audioSlow?: boolean;
}

export interface Phrase {
  vi: string;
  en: string;
  note?: string;
}

export interface Lesson {
  id: string;
  title: string;
  intro: string;
  newPhrases: Phrase[];
  dialogue: DialogueLine[];
  xpReward: number;
}

export type DistrictId = 'q1' | 'buivien' | 'q3';

export interface District {
  id: DistrictId;
  name: string;
  vietnameseName: string;
  tagline: string;
  // Position on the isometric map, in normalized 0-1 coords
  mapX: number;
  mapY: number;
  accentColor: string;        // one of the neon palette
  unlockXp: number;           // XP required to enter
}

export type CharacterId =
  | 'lan_receptionist'
  | 'ba_tu_banhmi'
  | 'hung_xeom'
  | 'mai_nightclub'
  | 'ong_bay_alley';

export interface Character {
  id: CharacterId;
  name: string;
  role: string;
  district: DistrictId;
  vibe: string;                  // short personality blurb
  description: string;           // longer flavor text
  voicePitch: number;            // 0.7 - 1.4, TTS modulation
  voiceRate: number;             // 0.6 - 1.1
  accentColor: string;           // neon color for this character
  portrait: PortraitSpec;        // for the procedural SVG portrait
  lessons: Lesson[];
  unlockXp: number;
}

export interface PortraitSpec {
  skin: string;
  hair: string;
  accent: string;       // eye / augment glow
  outfit: string;
  augment: 'visor' | 'eye' | 'antenna' | 'hat' | 'horns' | 'mask';
  silhouette: 'slim' | 'broad' | 'tall' | 'curvy' | 'hulking';
  emoji: string;        // fallback flair on portrait
}

export interface ProgressState {
  xp: number;
  streakDays: number;
  lastPracticeISO: string | null;
  completedLessons: string[];      // lesson ids
  visitedCharacters: CharacterId[];
  unlockedDistricts: DistrictId[];
  unlockedCharacters: CharacterId[];
  tonesPracticed: ToneId[];
}
