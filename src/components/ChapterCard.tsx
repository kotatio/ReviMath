import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import type { Chapter } from '../types';
import { useStore } from '../store/useStore';

interface ChapterCardProps {
  chapter: Chapter;
}

export default function ChapterCard({ chapter }: ChapterCardProps) {
  const navigate = useNavigate();
  const completedLessons = useStore((s) => s.completedLessons);
  const lessonScores = useStore((s) => s.lessonScores);

  const totalLessons = chapter.lessons.length;
  const done = chapter.lessons.filter((l) => completedLessons.includes(l.id)).length;
  const pct = totalLessons > 0 ? Math.round((done / totalLessons) * 100) : 0;

  // Get stars for completed lessons
  const totalStars = chapter.lessons.reduce((acc, l) => {
    const score = lessonScores[l.id];
    if (!score) return acc;
    const ratio = score.score / score.total;
    if (ratio === 1) return acc + 3;
    if (ratio >= 0.7) return acc + 2;
    return acc + 1;
  }, 0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[chapter.icon] ?? Icons.BookOpen;

  return (
    <div
      onClick={() => {
        const nextLesson = chapter.lessons.find((l) => !completedLessons.includes(l.id)) ?? chapter.lessons[0];
        navigate(`/lesson/${nextLesson.id}`);
      }}
      className="cursor-pointer rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
      style={{ backgroundColor: chapter.color }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="bg-white/20 rounded-xl p-2">
          <IconComponent size={28} className="text-white" />
        </div>
        <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full uppercase">
          {chapter.level}
        </span>
      </div>

      <h3 className="font-bold text-lg mb-1">{chapter.title}</h3>
      <p className="text-white/80 text-sm mb-3">{chapter.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex-1 mr-3">
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-white/80 mt-1 block">
            {done}/{totalLessons} lecons
          </span>
        </div>
        {totalStars > 0 && (
          <div className="flex items-center gap-0.5 text-yellow-200 text-sm font-bold">
            <Icons.Star size={14} className="fill-yellow-200" />
            {totalStars}
          </div>
        )}
      </div>
    </div>
  );
}
