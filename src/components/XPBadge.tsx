import { Zap } from 'lucide-react';

interface XPBadgeProps {
  xp: number;
  animate?: boolean;
}

export default function XPBadge({ xp, animate }: XPBadgeProps) {
  return (
    <div className={`flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-bold text-sm ${animate ? 'animate-pop' : ''}`}>
      <Zap size={16} className="fill-amber-500 text-amber-500" />
      {xp} XP
    </div>
  );
}
