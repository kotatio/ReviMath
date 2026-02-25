import { Heart } from 'lucide-react';

interface HeartsProps {
  count: number;
  shaking?: boolean;
}

export default function Hearts({ count, shaking }: HeartsProps) {
  return (
    <div className={`flex items-center gap-1 ${shaking ? 'animate-shake' : ''}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Heart
          key={i}
          size={20}
          className={i < count ? 'text-red-500 fill-red-500' : 'text-gray-300'}
        />
      ))}
    </div>
  );
}
