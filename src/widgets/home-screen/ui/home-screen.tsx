'use client';

import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { SparklesIcon, Upload04Icon } from '@hugeicons/core-free-icons';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import Image from 'next/image';

export function HomeScreen() {
  return (
    <div className="animate-in fade-in duration-300">
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-12 pt-20 pb-16 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Badge variant="default" className="mb-5">
            <HugeiconsIcon icon={SparklesIcon} size={12} /> AI로 5초 만에 변환
          </Badge>
          <h1 className="text-4xl leading-[1.05] font-bold tracking-tight md:text-[56px]">
            우리 아이 전용
            <br />
            색칠공부,
            <br />
            <span className="text-primary">5초면 끝</span>
          </h1>
          <p className="text-muted-foreground mt-5 max-w-md text-lg leading-relaxed">
            가족사진, 반려동물, 좋아하는 장난감까지 —
            <br />
            어떤 사진이든 예쁜 색칠 도안으로 바꿔드려요.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Button size="lg" className="h-12 px-6" render={<Link href="/convert" />}>
              <HugeiconsIcon icon={Upload04Icon} size={32} />
              <span className="text-lg">도안 만들기</span>
            </Button>
          </div>
        </div>

        <div className="relative hidden h-[440px] md:block">
          <Card className="absolute top-0 left-0 h-[72%] w-[62%] overflow-hidden p-0">
            <Badge variant="secondary" className="absolute top-3 left-3 z-10">
              Before
            </Badge>
            <div className="relative size-full">
              <Image src="/images/hero-origin.jpg" alt="" fill style={{ objectFit: 'cover' }} />
            </div>
          </Card>
          <Card className="absolute right-0 bottom-0 h-[72%] w-[60%] overflow-hidden p-0">
            <Badge className="bg-primary absolute top-3 left-3 z-10 border-transparent text-white">
              After
            </Badge>
            <div className="relative size-full">
              <Image src="/images/hero-converted.png" alt="" fill style={{ objectFit: 'cover' }} />
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-12 pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { k: '01', t: '사진 업로드', d: 'jpg, png, webp 최대 10MB' },
            { k: '02', t: 'AI 자동 변환', d: '평균 5초' },
            { k: '03', t: '저장', d: '저장 후 평생 사용' },
          ].map((f) => (
            <Card key={f.k} size="sm">
              <CardContent>
                <div className="text-muted-foreground mb-1 font-mono text-xs">{f.k}</div>
                <div className="mb-1 text-[15px] font-semibold">{f.t}</div>
                <div className="text-muted-foreground text-sm">{f.d}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
