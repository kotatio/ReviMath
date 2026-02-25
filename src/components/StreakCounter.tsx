import { Flame } from 'lucide-react';

interface StreakCounterProps {
  streak: number;
}

export default function StreakCounter({ streak }: StreakCounterProps) {
  if (streak === 0) return null;
  return (
    <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold text-sm">
      <Flame size={16} className="fill-orange-500 text-orange-500" />
      {streak} jour{streak > 1 ? 's' : ''}
    </div>
  );
}
