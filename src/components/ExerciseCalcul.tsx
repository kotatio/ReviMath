import { useState } from 'react';
import type { Exercise } from '../types';

interface Props {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
}

export default function ExerciseCalcul({ exercise, onAnswer }: Props) {
  const [value, setValue] = useState('');
  const [answered, setAnswered] = useState(false);

  const normalize = (s: string) => s.trim().replace(/\s/g, '').toLowerCase();

  const handleSubmit = () => {
    if (answered || !value.trim()) return;
    setAnswered(true);
    onAnswer(normalize(value) === normalize(exercise.correctAnswer));
  };

  const isCorrect = normalize(value) === normalize(exercise.correctAnswer);

  return (
    <div className="space-y-4">
      <p className="text-xl font-semibold text-gray-800 text-center mb-6">{exercise.question}</p>
      {exercise.hint && !answered && (
        <p className="text-center text-sm text-blue-500 italic">{exercise.hint}</p>
      )}
      <div className="flex justify-center">
        <input
          type="text"
          value={value}
          onChange={(e) => !answered && setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Ta reponse..."
          autoFocus
          className={`text-center text-2xl font-bold p-4 rounded-xl border-2 w-64 outline-none transition-all ${
            answered
              ? isCorrect
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-red-500 bg-red-50 text-red-700'
              : 'border-gray-300 focus:border-blue-500'
          }`}
        />
      </div>
      {!answered && (
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!value.trim()}
            className="px-8 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Valider
          </button>
        </div>
      )}
      {answered && !isCorrect && (
        <p className="text-center text-gray-600">
          La bonne reponse etait : <span className="font-bold text-green-600">{exercise.correctAnswer}</span>
        </p>
      )}
    </div>
  );
}
