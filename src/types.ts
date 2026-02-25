export type ExerciseType = 'qcm' | 'fill_blank' | 'true_false' | 'calcul';

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  choices?: string[];
  correctAnswer: string;
  explanation?: string;
  hint?: string;
}

export interface Lesson {
  id: string;
  title: string;
  exercises: Exercise[];
  xpReward: number;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  level: '6e' | '5e';
  lessons: Lesson[];
  icon: string;
  color: string;
}

export interface LessonScore {
  score: number;
  total: number;
  date: string;
}

export interface ImportedSession {
  id: string;
  title: string;
  sourceFileName: string;
  exercises: Exercise[];
  createdAt: string;
  level?: '6e' | '5e';
}

export interface UserProgress {
  xp: number;
  streak: number;
  lastPlayedDate: string;
  hearts: number;
  heartsLastRegenTime: number;
  completedLessons: string[];
  lessonScores: Record<string, LessonScore>;
  customExercises: Exercise[];
  importedSessions: ImportedSession[];
}
