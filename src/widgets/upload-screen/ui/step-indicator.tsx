import { cn } from '@/shared/lib/utils';

const STEPS = [
  { n: 1, label: '업로드' },
  { n: 2, label: '변환' },
  { n: 3, label: '결과' },
  { n: 4, label: '저장' },
] as const;

interface StepIndicatorProps {
  /** 현재 활성 단계 (1-based) */
  activeStep: number;
}

export function StepIndicator({ activeStep }: StepIndicatorProps) {
  return (
    <div className="text-muted-foreground mb-10 flex items-center gap-3 text-sm">
      {STEPS.map((s, i) => (
        <div key={s.n} className="contents">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex size-6 items-center justify-center rounded-full border text-xs font-semibold',
                s.n <= activeStep
                  ? 'border-transparent bg-primary text-white'
                  : 'border-border bg-muted',
              )}
            >
              {s.n}
            </div>
            <span className={cn(s.n === activeStep && 'font-medium text-foreground')}>
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && <div className="bg-border h-px max-w-[40px] flex-1" />}
        </div>
      ))}
    </div>
  );
}
