import type { Chapter } from '../types';
import { entiersExercises } from './exercises/entiers';
import { fractionsExercises } from './exercises/fractions';
import { decimauxExercises } from './exercises/decimaux';
import { geometrieExercises } from './exercises/geometrie';
import { proportionnaliteExercises } from './exercises/proportionnalite';
import { calculLitteralExercises } from './exercises/calcul-litteral';

export const chapters: Chapter[] = [
  {
    id: 'entiers',
    title: 'Nombres entiers et calculs',
    description: 'Additions, soustractions, multiplications, divisions et priorites',
    level: '6e',
    icon: 'Calculator',
    color: '#3b82f6',
    lessons: [
      { id: 'entiers-1', title: 'Additions et soustractions', exercises: entiersExercises['entiers-1'], xpReward: 30 },
      { id: 'entiers-2', title: 'Multiplications et divisions', exercises: entiersExercises['entiers-2'], xpReward: 30 },
      { id: 'entiers-3', title: 'Priorites operatoires', exercises: entiersExercises['entiers-3'], xpReward: 35 },
    ],
  },
  {
    id: 'fractions',
    title: 'Fractions',
    description: 'Additions, soustractions, multiplications et simplification de fractions',
    level: '6e',
    icon: 'Divide',
    color: '#8b5cf6',
    lessons: [
      { id: 'fractions-1', title: 'Addition de fractions', exercises: fractionsExercises['fractions-1'], xpReward: 30 },
      { id: 'fractions-2', title: 'Soustraction de fractions', exercises: fractionsExercises['fractions-2'], xpReward: 30 },
      { id: 'fractions-3', title: 'Multiplication de fractions', exercises: fractionsExercises['fractions-3'], xpReward: 35 },
      { id: 'fractions-4', title: 'Simplification de fractions', exercises: fractionsExercises['fractions-4'], xpReward: 35 },
    ],
  },
  {
    id: 'decimaux',
    title: 'Nombres decimaux',
    description: 'Operations avec les nombres a virgule',
    level: '6e',
    icon: 'Hash',
    color: '#06b6d4',
    lessons: [
      { id: 'decimaux-1', title: 'Addition de decimaux', exercises: decimauxExercises['decimaux-1'], xpReward: 30 },
      { id: 'decimaux-2', title: 'Soustraction de decimaux', exercises: decimauxExercises['decimaux-2'], xpReward: 30 },
      { id: 'decimaux-3', title: 'Multiplication de decimaux', exercises: decimauxExercises['decimaux-3'], xpReward: 35 },
    ],
  },
  {
    id: 'geometrie',
    title: 'Geometrie',
    description: 'Figures, aires, perimetres, angles et cercles',
    level: '6e',
    icon: 'Triangle',
    color: '#10b981',
    lessons: [
      { id: 'geometrie-1', title: 'Aires et perimetres', exercises: geometrieExercises['geometrie-1'], xpReward: 30 },
      { id: 'geometrie-2', title: 'Les angles', exercises: geometrieExercises['geometrie-2'], xpReward: 30 },
      { id: 'geometrie-3', title: 'Les cercles', exercises: geometrieExercises['geometrie-3'], xpReward: 35 },
      { id: 'geometrie-4', title: 'Figures et symetries', exercises: geometrieExercises['geometrie-4'], xpReward: 35 },
    ],
  },
  {
    id: 'proportionnalite',
    title: 'Proportionnalite',
    description: 'Tableaux, pourcentages et echelles',
    level: '5e',
    icon: 'Percent',
    color: '#f59e0b',
    lessons: [
      { id: 'proportionnalite-1', title: 'Situations de proportionnalite', exercises: proportionnaliteExercises['proportionnalite-1'], xpReward: 30 },
      { id: 'proportionnalite-2', title: 'Les pourcentages', exercises: proportionnaliteExercises['proportionnalite-2'], xpReward: 35 },
      { id: 'proportionnalite-3', title: 'Echelles et coefficients', exercises: proportionnaliteExercises['proportionnalite-3'], xpReward: 35 },
    ],
  },
  {
    id: 'calcul-litteral',
    title: 'Calcul litteral',
    description: 'Expressions, developpement et substitution',
    level: '5e',
    icon: 'Variable',
    color: '#ef4444',
    lessons: [
      { id: 'calcul-litteral-1', title: 'Expressions litterales', exercises: calculLitteralExercises['calcul-litteral-1'], xpReward: 30 },
      { id: 'calcul-litteral-2', title: 'Developper avec la distributivite', exercises: calculLitteralExercises['calcul-litteral-2'], xpReward: 35 },
      { id: 'calcul-litteral-3', title: 'Substitution (calculer une expression)', exercises: calculLitteralExercises['calcul-litteral-3'], xpReward: 35 },
    ],
  },
];

export function findLesson(lessonId: string) {
  for (const chapter of chapters) {
    const lesson = chapter.lessons.find((l) => l.id === lessonId);
    if (lesson) return { chapter, lesson };
  }
  return null;
}

export function getNextLesson(lessonId: string) {
  for (const chapter of chapters) {
    const idx = chapter.lessons.findIndex((l) => l.id === lessonId);
    if (idx !== -1 && idx < chapter.lessons.length - 1) {
      return chapter.lessons[idx + 1];
    }
  }
  return null;
}
