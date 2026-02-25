import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { findLesson } from '../data/chapters';
import { useStore } from '../store/useStore';
import type { Exercise } from '../types';
import ProgressBar from '../components/ProgressBar';
import Hearts from '../components/Hearts';
import ExerciseQCM from '../components/ExerciseQCM';
import ExerciseFillBlank from '../components/ExerciseFillBlank';
import ExerciseTrueFalse from '../components/ExerciseTrueFalse';
import ExerciseCalcul from '../components/ExerciseCalcul';

const XP_PER_CORRECT = 10;
const PERFECT_BONUS = 20;

export default function Lesson() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addXP, loseHeart, updateStreak, getHearts } = useStore();

  const result = findLesson(id ?? '');
  const customExercises = useStore((s) => s.customExercises);
  const importedSessions = useStore((s) => s.importedSessions);

  // Check if this is an imported session
  const importedSession = id?.startsWith('import-')
    ? importedSessions.find((s) => s.id === id)
    : null;

  // Merge custom exercises for this lesson
  const allExercises: Exercise[] = importedSession
    ? importedSession.exercises
    : result
      ? [...result.lesson.exercises, ...customExercises.filter((e) => e.id.startsWith(id ?? 'NONE'))]
      : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [heartsShaking, setHeartsShaking] = useState(false);
  const [xpGained, setXpGained] = useState(0);

  const hearts = getHearts();
  const exercise = allExercises[currentIndex];
  const isFinished = currentIndex >= allExercises.length;

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (correct) {
        setScore((s) => s + 1);
        addXP(XP_PER_CORRECT);
        setXpGained((x) => x + XP_PER_CORRECT);
        setFeedback('correct');
      } else {
        loseHeart();
        setHeartsShaking(true);
        setTimeout(() => setHeartsShaking(false), 400);
        setFeedback('incorrect');
      }
    },
    [addXP, loseHeart]
  );

  const handleContinue = () => {
    setFeedback(null);
    const next = currentIndex + 1;
    if (next >= allExercises.length) {
      // Lesson complete
      const finalScore = score;
      const total = allExercises.length;
      const bonus = finalScore === total ? PERFECT_BONUS : 0;
      if (bonus > 0) addXP(bonus);
      navigate(`/results?lessonId=${id}&score=${finalScore}&total=${total}&xp=${xpGained + bonus}`);
    } else {
      setCurrentIndex(next);
    }
  };

  if (!result && !importedSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Lecon introuvable</p>
          <button onClick={() => navigate('/')} className="text-blue-500 font-bold">
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (hearts <= 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8">
          <p className="text-6xl mb-4">💔</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Plus de coeurs !</h2>
          <p className="text-gray-600 mb-6">Ils se regenerent avec le temps (1 par heure).</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600"
          >
            Retour a l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (isFinished) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white shadow-sm px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <ProgressBar current={currentIndex} total={allExercises.length} />
          </div>
          <Hearts count={hearts} shaking={heartsShaking} />
        </div>
      </header>

      {/* Exercise Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <p className="text-sm text-gray-400 text-center mb-2">
            {importedSession
              ? `PDF Import \u00b7 ${importedSession.title}`
              : `${result!.chapter.title} \u00b7 ${result!.lesson.title}`}
          </p>

          {/* Render exercise by type */}
          {exercise.type === 'qcm' && (
            <ExerciseQCM key={exercise.id} exercise={exercise} onAnswer={handleAnswer} />
          )}
          {exercise.type === 'fill_blank' && (
            <ExerciseFillBlank key={exercise.id} exercise={exercise} onAnswer={handleAnswer} />
          )}
          {exercise.type === 'true_false' && (
            <ExerciseTrueFalse key={exercise.id} exercise={exercise} onAnswer={handleAnswer} />
          )}
          {exercise.type === 'calcul' && (
            <ExerciseCalcul key={exercise.id} exercise={exercise} onAnswer={handleAnswer} />
          )}
        </div>
      </main>

      {/* Feedback Bar */}
      {feedback && (
        <div
          className={`px-4 py-5 ${
            feedback === 'correct' ? 'bg-green-50 border-t-2 border-green-400' : 'bg-red-50 border-t-2 border-red-400'
          }`}
        >
          <div className="max-w-lg mx-auto flex flex-col items-center gap-3">
            <p className={`font-bold text-lg ${feedback === 'correct' ? 'text-green-700' : 'text-red-700'}`}>
              {feedback === 'correct' ? 'Bravo ! +10 XP' : 'Pas tout a fait...'}
            </p>
            {exercise.explanation && feedback === 'incorrect' && (
              <div className="flex items-start gap-2 text-sm text-gray-600 bg-white p-3 rounded-lg">
                <Lightbulb size={18} className="text-amber-500 mt-0.5 shrink-0" />
                <span>{exercise.explanation}</span>
              </div>
            )}
            <button
              onClick={handleContinue}
              className={`px-8 py-3 font-bold rounded-xl text-white transition-all ${
                feedback === 'correct' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              Continuer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
