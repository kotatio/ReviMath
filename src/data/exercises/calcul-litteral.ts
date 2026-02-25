import type { Exercise } from '../../types';

export const calculLitteralExercises: Record<string, Exercise[]> = {
  'calcul-litteral-1': [
    {
      id: 'cl-1-1',
      type: 'qcm',
      question: 'Simplifie : 3x + 2x',
      choices: ['5x', '6x', '5x2', '32x'],
      correctAnswer: '5x',
      explanation: '3x + 2x = 5x. On additionne les coefficients des termes semblables.',
    },
    {
      id: 'cl-1-2',
      type: 'calcul',
      question: 'Simplifie : 7a - 3a. Ecris le resultat (ex: 4a).',
      correctAnswer: '4a',
      explanation: '7a - 3a = 4a',
    },
    {
      id: 'cl-1-3',
      type: 'true_false',
      question: '2x + 3y = 5xy',
      correctAnswer: 'false',
      explanation: 'On ne peut pas additionner 2x et 3y car ce ne sont pas des termes semblables !',
    },
    {
      id: 'cl-1-4',
      type: 'qcm',
      question: 'Simplifie : 4x + 3 + 2x + 1',
      choices: ['6x + 4', '10x', '6x + 31', '4x + 6'],
      correctAnswer: '6x + 4',
      explanation: '4x + 2x = 6x et 3 + 1 = 4, donc 6x + 4',
    },
    {
      id: 'cl-1-5',
      type: 'fill_blank',
      question: '8b - 5b = ...b',
      correctAnswer: '3',
      explanation: '8 - 5 = 3, donc 8b - 5b = 3b',
    },
  ],

  'calcul-litteral-2': [
    {
      id: 'cl-2-1',
      type: 'qcm',
      question: 'Developpe : 2(x + 3)',
      choices: ['2x + 6', '2x + 3', 'x + 6', '2x + 5'],
      correctAnswer: '2x + 6',
      explanation: '2(x + 3) = 2 x x + 2 x 3 = 2x + 6 (distributivite)',
    },
    {
      id: 'cl-2-2',
      type: 'calcul',
      question: 'Developpe : 3(a + 4). Ecris le resultat (ex: 3a + 12).',
      correctAnswer: '3a + 12',
      explanation: '3(a + 4) = 3a + 12',
    },
    {
      id: 'cl-2-3',
      type: 'true_false',
      question: '5(x - 2) = 5x - 10',
      correctAnswer: 'true',
      explanation: '5(x - 2) = 5x - 10. On distribue le 5 sur chaque terme.',
    },
    {
      id: 'cl-2-4',
      type: 'qcm',
      question: 'Developpe : 4(2x + 1)',
      choices: ['8x + 4', '6x + 4', '8x + 1', '2x + 4'],
      correctAnswer: '8x + 4',
      explanation: '4(2x + 1) = 8x + 4',
    },
    {
      id: 'cl-2-5',
      type: 'fill_blank',
      question: '2(x + 5) = 2x + ...',
      correctAnswer: '10',
      explanation: '2 x 5 = 10',
    },
  ],

  'calcul-litteral-3': [
    {
      id: 'cl-3-1',
      type: 'qcm',
      question: 'Si x = 3, combien vaut 2x + 1 ?',
      choices: ['7', '6', '8', '5'],
      correctAnswer: '7',
      explanation: '2 x 3 + 1 = 6 + 1 = 7',
    },
    {
      id: 'cl-3-2',
      type: 'calcul',
      question: 'Si a = 4, combien vaut 3a - 2 ?',
      correctAnswer: '10',
      explanation: '3 x 4 - 2 = 12 - 2 = 10',
    },
    {
      id: 'cl-3-3',
      type: 'true_false',
      question: 'Si x = 5, alors x^2 = 10',
      correctAnswer: 'false',
      explanation: 'x^2 = 5 x 5 = 25, pas 10 ! x^2 signifie x fois x.',
    },
    {
      id: 'cl-3-4',
      type: 'qcm',
      question: 'Si x = 2, combien vaut x^2 + 3x ?',
      choices: ['10', '8', '12', '7'],
      correctAnswer: '10',
      explanation: '2^2 + 3 x 2 = 4 + 6 = 10',
    },
    {
      id: 'cl-3-5',
      type: 'fill_blank',
      question: 'Si x = 6, alors 2x = ...',
      correctAnswer: '12',
      explanation: '2 x 6 = 12',
    },
  ],
};
