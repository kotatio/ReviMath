import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProgress, Exercise, ImportedSession } from '../types';

const HEARTS_MAX = 5;
const HEARTS_REGEN_MS = 60 * 60 * 1000; // 1 heure

function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function calculateHearts(hearts: number, lastRegenTime: number): number {
  if (hearts >= HEARTS_MAX) return HEARTS_MAX;
  const now = Date.now();
  const elapsed = now - lastRegenTime;
  const regained = Math.floor(elapsed / HEARTS_REGEN_MS);
  return Math.min(HEARTS_MAX, hearts + regained);
}

interface StoreState extends UserProgress {
  // Actions
  addXP: (amount: number) => void;
  loseHeart: () => void;
  updateStreak: () => void;
  completeLesson: (lessonId: string, score: number, total: number) => void;
  addCustomExercise: (exercise: Exercise) => void;
  removeCustomExercise: (exerciseId: string) => void;
  getHearts: () => number;
  resetProgress: () => void;
  addImportedSession: (session: ImportedSession) => void;
  removeImportedSession: (id: string) => void;
}

const initialState: UserProgress = {
  xp: 0,
  streak: 0,
  lastPlayedDate: '',
  hearts: HEARTS_MAX,
  heartsLastRegenTime: Date.now(),
  completedLessons: [],
  lessonScores: {},
  customExercises: [],
  importedSessions: [],
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addXP: (amount: number) => set((s) => ({ xp: s.xp + amount })),

      loseHeart: () =>
        set((s) => {
          const current = calculateHearts(s.hearts, s.heartsLastRegenTime);
          return {
            hearts: Math.max(0, current - 1),
            heartsLastRegenTime: Date.now(),
          };
        }),

      updateStreak: () =>
        set((s) => {
          const today = getTodayISO();
          if (s.lastPlayedDate === today) return {};

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayISO = yesterday.toISOString().slice(0, 10);

          const newStreak = s.lastPlayedDate === yesterdayISO ? s.streak + 1 : 1;
          return { streak: newStreak, lastPlayedDate: today };
        }),

      completeLesson: (lessonId: string, score: number, total: number) =>
        set((s) => {
          const completed = s.completedLessons.includes(lessonId)
            ? s.completedLessons
            : [...s.completedLessons, lessonId];

          const existing = s.lessonScores[lessonId];
          const isBetter = !existing || score > existing.score;

          return {
            completedLessons: completed,
            lessonScores: isBetter
              ? {
                  ...s.lessonScores,
                  [lessonId]: { score, total, date: getTodayISO() },
                }
              : s.lessonScores,
          };
        }),

      addCustomExercise: (exercise: Exercise) =>
        set((s) => ({
          customExercises: [...s.customExercises, exercise],
        })),

      removeCustomExercise: (exerciseId: string) =>
        set((s) => ({
          customExercises: s.customExercises.filter((e) => e.id !== exerciseId),
        })),

      getHearts: () => {
        const s = get();
        return calculateHearts(s.hearts, s.heartsLastRegenTime);
      },

      addImportedSession: (session: ImportedSession) =>
        set((s) => ({
          importedSessions: [...s.importedSessions, session],
        })),

      removeImportedSession: (id: string) =>
        set((s) => ({
          importedSessions: s.importedSessions.filter((ses) => ses.id !== id),
        })),

      resetProgress: () => set(initialState),
    }),
    {
      name: 'revimath-progress',
    }
  )
);
