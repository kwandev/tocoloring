import { Card, CardContent } from '@/shared/components/ui/card';

const STEPS = [
  { number: '01', title: '사진 업로드', description: 'jpg, png, webp 최대 10MB' },
  { number: '02', title: 'AI 자동 변환', description: '평균 5초' },
  { number: '03', title: '저장', description: '저장 후 평생 사용' },
];

export function ProcessSection() {
  return (
    <section className="mx-auto max-w-6xl px-12 pb-20">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((step) => (
          <Card key={step.number} size="sm">
            <CardContent>
              <div className="text-muted-foreground mb-1 font-mono text-xs">{step.number}</div>
              <div className="mb-1 text-[15px] font-semibold">{step.title}</div>
              <div className="text-muted-foreground text-sm">{step.description}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
