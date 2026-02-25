import { useState } from 'react';
import { Check, X } from 'lucide-react';
import type { Exercise } from '../types';

interface Props {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

export default function ExerciseTrueFalse({ exercise, onAnswer }: Props) {
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (val: string) => {
    if (answered) return;
    setSelected(val);
    setAnswered(true);
    onAnswer(val === exercise.correctAnswer);
  };

  const btnClasses = (val: string) => {
    let base = 'flex items-center justify-center gap-3 p-5 rounded-xl border-2 font-bold text-lg transition-all flex-1 ';
    if (!answered) {
      base += 'border-gray-200 bg-white hover:border-blue-300';
    } else if (val === exercise.correctAnswer) {
      base += 'border-green-500 bg-green-50 text-green-700';
    } else if (val === selected) {
      base += 'border-red-500 bg-red-50 text-red-700';
    } else {
      base += 'border-gray-200 bg-white opacity-50';
    }
    return base;
  };

  return (
    <div className="space-y-4">
      <p className="text-xl font-semibold text-gray-800 text-center mb-6">{exercise.question}</p>
      <div className="flex gap-4 max-w-md mx-auto">
        <button onClick={() => handleSelect('true')} className={btnClasses('true')}>
          <Check size={24} /> Vrai
        </button>
        <button onClick={() => handleSelect('false')} className={btnClasses('false')}>
          <X size={24} /> Faux
        </button>
      </div>
    </div>
  );
}
