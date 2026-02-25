import type { Exercise } from '../../types';

export const entiersExercises: Record<string, Exercise[]> = {
  'entiers-1': [
    {
      id: 'ent-1-1',
      type: 'calcul',
      question: 'Calcule 347 + 258.',
      correctAnswer: '605',
      explanation: '347 + 258 = 605',
    },
    {
      id: 'ent-1-2',
      type: 'qcm',
      question: 'Combien font 1 250 + 750 ?',
      choices: ['2 000', '1 900', '2 100', '1 800'],
      correctAnswer: '2 000',
      explanation: '1 250 + 750 = 2 000',
    },
    {
      id: 'ent-1-3',
      type: 'calcul',
      question: 'Calcule 803 - 456.',
      correctAnswer: '347',
      explanation: '803 - 456 = 347',
    },
    {
      id: 'ent-1-4',
      type: 'true_false',
      question: '999 + 1 = 1 000',
      correctAnswer: 'true',
      explanation: 'Oui, 999 + 1 = 1 000.',
    },
    {
      id: 'ent-1-5',
      type: 'fill_blank',
      question: '500 + ... = 1 200',
      correctAnswer: '700',
      explanation: '1 200 - 500 = 700',
    },
  ],

  'entiers-2': [
    {
      id: 'ent-2-1',
      type: 'calcul',
      question: 'Calcule 12 x 15.',
      correctAnswer: '180',
      explanation: '12 x 15 = 180',
    },
    {
      id: 'ent-2-2',
      type: 'qcm',
      question: 'Combien font 25 x 4 ?',
      choices: ['100', '90', '110', '80'],
      correctAnswer: '100',
      explanation: '25 x 4 = 100. Astuce : 25 = 100/4.',
    },
    {
      id: 'ent-2-3',
      type: 'calcul',
      question: 'Calcule 144 / 12.',
      correctAnswer: '12',
      explanation: '144 / 12 = 12. C\'est aussi 12 x 12 = 144.',
    },
    {
      id: 'ent-2-4',
      type: 'true_false',
      question: '7 x 8 = 54',
      correctAnswer: 'false',
      explanation: '7 x 8 = 56, pas 54 !',
    },
    {
      id: 'ent-2-5',
      type: 'fill_blank',
      question: '9 x ... = 72',
      correctAnswer: '8',
      explanation: '72 / 9 = 8',
    },
  ],

  'entiers-3': [
    {
      id: 'ent-3-1',
      type: 'qcm',
      question: 'Quel est l\'ordre de grandeur de 498 + 312 ?',
      choices: ['800', '700', '900', '1 000'],
      correctAnswer: '800',
      explanation: '498 ≈ 500, 312 ≈ 300, donc environ 800.',
    },
    {
      id: 'ent-3-2',
      type: 'qcm',
      question: 'Quelle est la priorite dans 3 + 4 x 2 ?',
      choices: ['La multiplication', 'L\'addition', 'De gauche a droite', 'Aucune'],
      correctAnswer: 'La multiplication',
      explanation: 'La multiplication est prioritaire : 3 + (4x2) = 3 + 8 = 11.',
    },
    {
      id: 'ent-3-3',
      type: 'calcul',
      question: 'Calcule 5 + 3 x 4.',
      correctAnswer: '17',
      explanation: '5 + (3 x 4) = 5 + 12 = 17. La multiplication est prioritaire.',
    },
    {
      id: 'ent-3-4',
      type: 'calcul',
      question: 'Calcule (5 + 3) x 4.',
      correctAnswer: '32',
      explanation: '(5 + 3) x 4 = 8 x 4 = 32. Les parentheses sont prioritaires.',
    },
    {
      id: 'ent-3-5',
      type: 'true_false',
      question: '2 + 3 x 5 = 25',
      correctAnswer: 'false',
      explanation: '2 + (3 x 5) = 2 + 15 = 17. Ce n\'est pas (2+3) x 5 = 25.',
    },
  ],
};
