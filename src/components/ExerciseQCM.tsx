import { useState } from 'react';
import type { Exercise } from '../types';

interface Props {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

export default function ExerciseQCM({ exercise, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (choice: string) => {
    if (answered) return;
    setSelected(choice);
    setAnswered(true);
    onAnswer(choice === exercise.correctAnswer);
  };

  return (
    <div className="space-y-3">
      <p className="text-xl font-semibold text-gray-800 text-center mb-6">{exercise.question}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {exercise.choices?.map((choice) => {
          let classes = 'w-full p-4 rounded-xl border-2 text-left font-medium text-lg transition-all ';
          if (!answered) {
            classes += selected === choice
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50';
          } else if (choice === exercise.correctAnswer) {
            classes += 'border-green-500 bg-green-50 text-green-700';
          } else if (choice === selected) {
            classes += 'border-red-500 bg-red-50 text-red-700';
          } else {
            classes += 'border-gray-200 bg-white opacity-50';
          }

          return (
            <button
              key={choice}
              onClick={() => handleSelect(choice)}
              className={classes}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}
