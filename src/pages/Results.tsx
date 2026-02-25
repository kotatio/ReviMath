import { useNavigate, useSearchParams } from 'react-router-dom';
import { Star, ArrowRight, Home } from 'lucide-react';
import { useStore } from '../store/useStore';
import { getNextLesson } from '../data/chapters';
import XPBadge from '../components/XPBadge';
import { useEffect, useRef } from 'react';

export default function Results() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const completeLesson = useStore((s) => s.completeLesson);
  const completedRef = useRef(false);

  const lessonId = params.get('lessonId') ?? '';
  const score = parseInt(params.get('score') ?? '0');
  const total = parseInt(params.get('total') ?? '0');
  const xp = parseInt(params.get('xp') ?? '0');

  const ratio = total > 0 ? score / total : 0;
  const stars = ratio === 1 ? 3 : ratio >= 0.7 ? 2 : 1;
  const nextLesson = getNextLesson(lessonId);

  useEffect(() => {
    if (!completedRef.current && lessonId) {
      completeLesson(lessonId, score, total);
      completedRef.current = true;
    }
  }, [lessonId, score, total, completeLesson]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
          {ratio === 1 ? 'Parfait !' : ratio >= 0.7 ? 'Bien joue !' : 'Continue comme ca !'}
        </h2>

        {/* Stars */}
        <div className="flex justify-center gap-2 my-6">
          {[1, 2, 3].map((n) => (
            <Star
              key={n}
              size={48}
              className={
                n <= stars
                  ? 'text-yellow-400 fill-yellow-400 animate-pop'
                  : 'text-gray-200'
              }
              style={{ animationDelay: `${n * 100}ms` }}
            />
          ))}
        </div>

        {/* Score */}
        <div className="mb-4">
          <span className="text-5xl font-black text-gray-900">
            {score}<span className="text-2xl text-gray-400">/{total}</span>
          </span>
          <p className="text-gray-500 mt-1">bonnes reponses</p>
        </div>

        {/* XP */}
        <div className="flex justify-center mb-8">
          <XPBadge xp={xp} animate />
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {nextLesson && (
            <button
              onClick={() => navigate(`/lesson/${nextLesson.id}`)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-all"
            >
              Lecon suivante <ArrowRight size={20} />
            </button>
          )}
          <button
            onClick={() => navigate(`/lesson/${lessonId}`)}
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            Recommencer
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-gray-500 font-medium hover:text-gray-700 transition-all"
          >
            <Home size={18} /> Accueil
          </button>
        </div>
      </div>
    </div>
  );
}
