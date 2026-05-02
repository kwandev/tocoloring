import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle02Icon, SchoolIcon, UserMultiple02Icon } from '@hugeicons/core-free-icons';
import { Card, CardContent } from '@/shared/components/ui/card';

const PERSONAS = [
  {
    icon: UserMultiple02Icon,
    title: '아이가 있는 부모',
    description: '우리 아이가 좋아하는 사진으로 만든 색칠 도안',
    points: [
      '가족사진을 도안으로 만들어 함께 색칠하기',
      '반려동물·좋아하는 장난감으로 맞춤형 학습자료',
      '주말 활동, 생일파티, 여행 추억 콘텐츠',
    ],
  },
  {
    icon: SchoolIcon,
    title: '유치원·어린이집 교사',
    description: '수업 주제에 맞는 도안을 5초 만에',
    points: [
      '계절·행사별 맞춤 수업 자료 빠르게 준비',
      '시중에 없는 주제도 사진 한 장으로 도안화',
      '아이들이 직접 가져온 사진으로 활동 만들기',
    ],
  },
];

export function PersonasSection() {
  return (
    <section className="mx-auto max-w-6xl px-12 pb-20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          이런 분들이 사용하면 좋아요
        </h2>
        <p className="text-muted-foreground mt-3 text-base md:text-lg">
          평범한 사진을 우리 아이의 색칠 도안으로 5초 만에 바꿔드려요.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {PERSONAS.map((p) => (
          <Card key={p.title}>
            <CardContent>
              <div className="bg-primary/10 text-primary mb-4 flex size-12 items-center justify-center rounded-xl">
                <HugeiconsIcon icon={p.icon} size={24} />
              </div>
              <div className="mb-1 text-xl font-semibold">{p.title}</div>
              <p className="text-muted-foreground mb-5 text-sm">{p.description}</p>
              <ul className="space-y-2.5">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5 shrink-0">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
