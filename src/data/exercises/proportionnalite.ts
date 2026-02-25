import type { Exercise } from '../../types';

export const proportionnaliteExercises: Record<string, Exercise[]> = {
  'proportionnalite-1': [
    {
      id: 'prop-1-1',
      type: 'qcm',
      question: '3 croissants coutent 3,60 euros. Combien coute 1 croissant ?',
      choices: ['1,20 euros', '1,30 euros', '1,10 euros', '1,50 euros'],
      correctAnswer: '1,20 euros',
      explanation: '3,60 / 3 = 1,20 euros le croissant.',
    },
    {
      id: 'prop-1-2',
      type: 'calcul',
      question: '5 kg de pommes coutent 10 euros. Combien coutent 8 kg ?',
      correctAnswer: '16',
      hint: 'Trouve d\'abord le prix d\'1 kg',
      explanation: '10/5 = 2 euros/kg, donc 8 x 2 = 16 euros.',
    },
    {
      id: 'prop-1-3',
      type: 'true_false',
      question: 'Si 4 stylos coutent 6 euros, alors 8 stylos coutent 12 euros',
      correctAnswer: 'true',
      explanation: 'Double la quantite = double le prix (proportionnalite).',
    },
    {
      id: 'prop-1-4',
      type: 'qcm',
      question: 'Un robinet remplit 15 litres en 3 minutes. Combien en 10 minutes ?',
      choices: ['50 litres', '45 litres', '30 litres', '60 litres'],
      correctAnswer: '50 litres',
      explanation: '15/3 = 5 litres/min, donc 5 x 10 = 50 litres.',
    },
    {
      id: 'prop-1-5',
      type: 'fill_blank',
      question: '2 pizzas pour 4 personnes. Pour 10 personnes, il faut ... pizzas',
      correctAnswer: '5',
      explanation: '2/4 = 0,5 pizza par personne, 0,5 x 10 = 5 pizzas.',
    },
  ],

  'proportionnalite-2': [
    {
      id: 'prop-2-1',
      type: 'qcm',
      question: 'Que represente 25% de 200 ?',
      choices: ['50', '25', '75', '40'],
      correctAnswer: '50',
      explanation: '25% de 200 = 25/100 x 200 = 50',
    },
    {
      id: 'prop-2-2',
      type: 'calcul',
      question: 'Calcule 10% de 350.',
      correctAnswer: '35',
      explanation: '10% = diviser par 10. 350/10 = 35.',
    },
    {
      id: 'prop-2-3',
      type: 'true_false',
      question: '50% de 80 = 40',
      correctAnswer: 'true',
      explanation: '50% = la moitie. 80/2 = 40.',
    },
    {
      id: 'prop-2-4',
      type: 'qcm',
      question: 'Un article a 60 euros est solde a -20%. Quel est le nouveau prix ?',
      choices: ['48 euros', '40 euros', '52 euros', '50 euros'],
      correctAnswer: '48 euros',
      explanation: '20% de 60 = 12 euros de reduction. 60 - 12 = 48 euros.',
    },
    {
      id: 'prop-2-5',
      type: 'fill_blank',
      question: '75% de 40 = ...',
      correctAnswer: '30',
      explanation: '75% de 40 = 3/4 x 40 = 30',
    },
  ],

  'proportionnalite-3': [
    {
      id: 'prop-3-1',
      type: 'qcm',
      question: 'Sur une carte a l\'echelle 1/10 000, 3 cm representent :',
      choices: ['300 m', '30 m', '3 km', '30 km'],
      correctAnswer: '300 m',
      explanation: '3 cm x 10 000 = 30 000 cm = 300 m.',
    },
    {
      id: 'prop-3-2',
      type: 'calcul',
      question: 'Une recette pour 4 personnes demande 200g de farine. Combien pour 6 personnes ?',
      correctAnswer: '300',
      explanation: '200/4 = 50g par personne, 50 x 6 = 300g.',
    },
    {
      id: 'prop-3-3',
      type: 'true_false',
      question: 'Un tableau est de proportionnalite si on peut passer d\'une ligne a l\'autre en multipliant toujours par le meme nombre',
      correctAnswer: 'true',
      explanation: 'C\'est la definition ! Ce nombre s\'appelle le coefficient de proportionnalite.',
    },
    {
      id: 'prop-3-4',
      type: 'qcm',
      question: 'Le coefficient de proportionnalite entre ces valeurs : 2→6, 5→15, 8→24 est :',
      choices: ['3', '4', '2', '5'],
      correctAnswer: '3',
      explanation: '6/2 = 3, 15/5 = 3, 24/8 = 3. Le coefficient est 3.',
    },
    {
      id: 'prop-3-5',
      type: 'fill_blank',
      question: 'Si 3 → 12, 5 → 20, alors 7 → ...',
      correctAnswer: '28',
      explanation: 'Coefficient = 12/3 = 4. Donc 7 x 4 = 28.',
    },
  ],
};
