import { cn } from '@/shared/lib/utils';

interface RabbitSvgProps {
  stroke?: number;
  animated?: boolean;
}

/** 토끼 윤곽선 SVG. animated=true 이면 stroke-dasharray 애니메이션으로 그려지는 효과를 적용한다. */
export function RabbitSvg({ stroke = 2.2, animated = false }: RabbitSvgProps) {
  const cls = animated ? 'draw-path' : '';
  return (
    <svg
      viewBox="0 0 100 100"
      className="size-full"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path className={cn(cls, animated && 'd1')} d="M 35 22 Q 28 4 40 6 Q 46 18 46 32" />
      <path className={cn(cls, animated && 'd2')} d="M 65 22 Q 72 4 60 6 Q 54 18 54 32" />
      <ellipse className={cn(cls, animated && 'd3')} cx="50" cy="58" rx="26" ry="24" />
      <circle className={cn(cls, animated && 'd4')} cx="40" cy="54" r="2.6" />
      <circle className={cn(cls, animated && 'd4')} cx="60" cy="54" r="2.6" />
      <path className={cn(cls, animated && 'd5')} d="M 47 62 Q 50 66 53 62" />
      <path className={cn(cls, animated && 'd5')} d="M 42 70 Q 50 76 58 70" />
      <path
        className={cn(cls, animated && 'd6')}
        d="M 30 58 L 22 56 M 30 60 L 22 62 M 30 62 L 22 64"
      />
      <path
        className={cn(cls, animated && 'd6')}
        d="M 70 58 L 78 56 M 70 60 L 78 62 M 70 62 L 78 64"
      />
    </svg>
  );
}
