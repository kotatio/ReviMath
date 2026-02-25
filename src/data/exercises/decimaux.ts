import type { Exercise } from '../../types';

export const decimauxExercises: Record<string, Exercise[]> = {
  'decimaux-1': [
    {
      id: 'dec-1-1',
      type: 'qcm',
      question: 'Combien font 1,5 + 2,3 ?',
      choices: ['3,8', '3,7', '4,8', '3,9'],
      correctAnswer: '3,8',
      explanation: '1,5 + 2,3 = 3,8. On additionne les parties entieres et les parties decimales.',
    },
    {
      id: 'dec-1-2',
      type: 'calcul',
      question: 'Calcule 4,7 + 3,6.',
      correctAnswer: '8,3',
      explanation: '4,7 + 3,6 = 8,3. Attention a la retenue : 7+6=13, on pose 3 et on retient 1.',
    },
    {
      id: 'dec-1-3',
      type: 'true_false',
      question: '0,5 + 0,5 = 1',
      correctAnswer: 'true',
      explanation: '0,5 + 0,5 = 1,0 = 1. Deux moities font un entier !',
    },
    {
      id: 'dec-1-4',
      type: 'qcm',
      question: 'Combien font 12,45 + 3,55 ?',
      choices: ['16', '15,9', '16,1', '15'],
      correctAnswer: '16',
      explanation: '12,45 + 3,55 = 16,00 = 16',
    },
    {
      id: 'dec-1-5',
      type: 'fill_blank',
      question: '6,2 + ... = 10',
      correctAnswer: '3,8',
      explanation: '10 - 6,2 = 3,8',
    },
  ],

  'decimaux-2': [
    {
      id: 'dec-2-1',
      type: 'qcm',
      question: 'Combien font 5,8 - 2,3 ?',
      choices: ['3,5', '3,6', '2,5', '3,4'],
      correctAnswer: '3,5',
      explanation: '5,8 - 2,3 = 3,5',
    },
    {
      id: 'dec-2-2',
      type: 'calcul',
      question: 'Calcule 10 - 3,7.',
      correctAnswer: '6,3',
      explanation: '10,0 - 3,7 = 6,3',
    },
    {
      id: 'dec-2-3',
      type: 'true_false',
      question: '7,2 - 3,8 = 3,4',
      correctAnswer: 'true',
      explanation: '7,2 - 3,8 = 3,4. Attention a l\'emprunt !',
    },
    {
      id: 'dec-2-4',
      type: 'qcm',
      question: 'Combien font 15,06 - 8,06 ?',
      choices: ['7', '7,06', '6,06', '7,12'],
      correctAnswer: '7',
      explanation: '15,06 - 8,06 = 7,00 = 7',
    },
    {
      id: 'dec-2-5',
      type: 'fill_blank',
      question: '9,5 - ... = 4,2',
      correctAnswer: '5,3',
      explanation: '9,5 - 4,2 = 5,3',
    },
  ],

  'decimaux-3': [
    {
      id: 'dec-3-1',
      type: 'qcm',
      question: 'Combien font 0,3 x 4 ?',
      choices: ['1,2', '0,12', '12', '0,7'],
      correctAnswer: '1,2',
      explanation: '0,3 x 4 = 1,2',
    },
    {
      id: 'dec-3-2',
      type: 'calcul',
      question: 'Calcule 2,5 x 3.',
      correctAnswer: '7,5',
      explanation: '2,5 x 3 = 7,5',
    },
    {
      id: 'dec-3-3',
      type: 'true_false',
      question: '0,1 x 10 = 1',
      correctAnswer: 'true',
      explanation: 'Multiplier par 10 decale la virgule d\'un rang vers la droite.',
    },
    {
      id: 'dec-3-4',
      type: 'qcm',
      question: 'Combien font 1,5 x 1,5 ?',
      choices: ['2,25', '2,5', '3', '2,15'],
      correctAnswer: '2,25',
      explanation: '1,5 x 1,5 = 2,25',
    },
    {
      id: 'dec-3-5',
      type: 'fill_blank',
      question: '0,5 x ... = 3',
      correctAnswer: '6',
      explanation: '3 / 0,5 = 6, donc 0,5 x 6 = 3',
    },
  ],
};
