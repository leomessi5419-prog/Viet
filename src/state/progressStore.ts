import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useCallback } from 'react';
import type { ProgressState, CharacterId, DistrictId, ToneId } from '../types';
import { CHARACTERS } from '../data/characters';
import { DISTRICTS } from '../data/districts';

const STORAGE_KEY = '@saigonneon/progress/v1';

const initial: ProgressState = {
  xp: 0,
  streakDays: 0,
  lastPracticeISO: null,
  completedLessons: [],
  visitedCharacters: [],
  unlockedDistricts: ['q1'],
  unlockedCharacters: ['lan_receptionist'],
  tonesPracticed: [],
};

let cached: ProgressState | null = null;
const listeners = new Set<(s: ProgressState) => void>();

const notify = (next: ProgressState) => {
  cached = next;
  for (const l of listeners) l(next);
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
};

const load = async (): Promise<ProgressState> => {
  if (cached) return cached;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      cached = { ...initial, ...JSON.parse(raw) } as ProgressState;
      return cached;
    }
  } catch {}
  cached = initial;
  return cached;
};

const sameDay = (a: string, b: string) =>
  a.slice(0, 10) === b.slice(0, 10);

const isYesterday = (lastISO: string) => {
  const last = new Date(lastISO);
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  const diff = now.getTime() - last.getTime();
  return diff > 0 && diff < 2 * oneDay && !sameDay(lastISO, now.toISOString());
};

const recomputeUnlocks = (state: ProgressState): ProgressState => {
  const unlockedDistricts = DISTRICTS.filter((d) => state.xp >= d.unlockXp).map((d) => d.id);
  const unlockedCharacters = CHARACTERS.filter((c) => state.xp >= c.unlockXp).map((c) => c.id);
  return { ...state, unlockedDistricts, unlockedCharacters };
};

export const progressApi = {
  async get(): Promise<ProgressState> {
    return load();
  },

  async completeLesson(lessonId: string, xp: number): Promise<ProgressState> {
    const cur = await load();
    if (cur.completedLessons.includes(lessonId)) {
      return progressApi.touchStreak();
    }
    const next = recomputeUnlocks({
      ...cur,
      xp: cur.xp + xp,
      completedLessons: [...cur.completedLessons, lessonId],
    });
    const withStreak = applyStreak(next);
    notify(withStreak);
    return withStreak;
  },

  async visitCharacter(id: CharacterId): Promise<ProgressState> {
    const cur = await load();
    if (cur.visitedCharacters.includes(id)) return cur;
    const next = { ...cur, visitedCharacters: [...cur.visitedCharacters, id] };
    notify(next);
    return next;
  },

  async practiceTone(id: ToneId, xp: number = 4): Promise<ProgressState> {
    const cur = await load();
    const tones = cur.tonesPracticed.includes(id)
      ? cur.tonesPracticed
      : [...cur.tonesPracticed, id];
    const next = recomputeUnlocks({ ...cur, xp: cur.xp + xp, tonesPracticed: tones });
    const withStreak = applyStreak(next);
    notify(withStreak);
    return withStreak;
  },

  async touchStreak(): Promise<ProgressState> {
    const cur = await load();
    const next = applyStreak(cur);
    if (next !== cur) notify(next);
    return next;
  },

  async reset(): Promise<ProgressState> {
    notify(initial);
    return initial;
  },

  subscribe(fn: (s: ProgressState) => void) {
    listeners.add(fn);
    load().then(fn);
    return () => listeners.delete(fn);
  },
};

const applyStreak = (state: ProgressState): ProgressState => {
  const nowISO = new Date().toISOString();
  if (!state.lastPracticeISO) {
    return { ...state, streakDays: 1, lastPracticeISO: nowISO };
  }
  if (sameDay(state.lastPracticeISO, nowISO)) {
    return { ...state, lastPracticeISO: nowISO };
  }
  if (isYesterday(state.lastPracticeISO)) {
    return { ...state, streakDays: state.streakDays + 1, lastPracticeISO: nowISO };
  }
  return { ...state, streakDays: 1, lastPracticeISO: nowISO };
};

export const useProgress = () => {
  const [state, setState] = useState<ProgressState | null>(cached);

  useEffect(() => progressApi.subscribe(setState), []);

  const refresh = useCallback(() => {
    progressApi.get().then(setState);
  }, []);

  return { state, refresh };
};
