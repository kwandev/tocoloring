'use client';

import { Card } from '@/shared/components/ui/card';
import { BeforeAfterSlider } from '@/shared/components/before-after-slider';

const EXAMPLES = [
  {
    label: '캐릭터',
    before: '/images/sample-before-1.webp',
    after: '/images/sample-after-1.webp',
  },
  {
    label: '반려동물',
    before: '/images/sample-before-2.jpg',
    after: '/images/sample-after-2.webp',
  },
  {
    label: '장난감',
    before: '/images/sample-before-3.jpg',
    after: '/images/sample-after-3.webp',
  },
];

export function ExamplesSection() {
  return (
    <section className="mx-auto max-w-6xl px-12 pb-20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">다양한 사진을 도안으로</h2>
        <p className="text-muted-foreground mt-3 text-base md:text-lg">
          좌우로 드래그해서 변환 결과를 직접 비교해보세요.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {EXAMPLES.map((ex) => (
          <Card key={ex.label} className="gap-3 overflow-hidden p-0">
            <BeforeAfterSlider
              beforeSrc={ex.before}
              afterSrc={ex.after}
              className="bg-card h-[280px]"
            />
            <div className="px-4 py-3 text-sm font-semibold">{ex.label}</div>
          </Card>
        ))}
      </div>
    </section>
  );
}
