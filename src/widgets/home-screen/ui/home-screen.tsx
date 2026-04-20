'use client';

import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { SparklesIcon, Upload04Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { RabbitSvg } from '@/widgets/loading-screen';

export function HomeScreen() {
  return (
    <div className="animate-in fade-in duration-300">
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-12 pt-20 pb-16 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Badge variant="default" className="mb-5">
            <HugeiconsIcon icon={SparklesIcon} size={12} /> AI로 15초 만에 변환
          </Badge>
          <h1 className="text-4xl leading-[1.05] font-bold tracking-tight md:text-[56px]">
            우리 아이 전용
            <br />
            색칠공부,
            <br />
            <span className="text-primary">10초면 끝</span>
          </h1>
          <p className="text-muted-foreground mt-5 max-w-md text-lg leading-relaxed">
            가족사진, 반려동물, 좋아하는 장난감까지 —
            <br />
            어떤 사진이든 예쁜 색칠 도안으로 바꿔드려요.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Button variant="outline" size="lg">
              예시 보기
            </Button>
            <Button size="lg" render={<Link href="/convert" />}>
              <HugeiconsIcon icon={Upload04Icon} size={16} /> 도안 만들기
            </Button>
          </div>
          <div className="text-muted-foreground mt-8 flex items-center gap-3 text-sm">
            <div className="flex -space-x-2">
              {['bg-orange-200', 'bg-sky-200', 'bg-emerald-200', 'bg-amber-200'].map((c) => (
                <div key={c} className={`size-7 rounded-full border-2 border-white ${c}`} />
              ))}
            </div>
            <span>
              <b className="text-foreground">1,284명</b>의 부모가 사용 중이에요
            </span>
          </div>
        </div>

        <div className="relative hidden h-[440px] md:block">
          <Card className="absolute top-0 left-0 h-[72%] w-[62%] overflow-hidden p-0">
            <Badge variant="secondary" className="absolute top-3 left-3 z-10">
              원본
            </Badge>
            <div
              className="size-full"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, #ffe4b8 0, #ffbe80 55%, #ff9b5c 100%)',
              }}
            />
          </Card>
          <div className="absolute top-[44%] left-[46%] z-10">
            <div className="border-border text-primary flex size-10 items-center justify-center rounded-full border bg-white shadow-sm">
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
            </div>
          </div>
          <Card className="absolute right-0 bottom-0 h-[72%] w-[60%] overflow-hidden p-0">
            <Badge className="bg-primary absolute top-3 left-3 z-10 border-transparent text-white">
              색칠 도안
            </Badge>
            <div className="text-foreground flex size-full items-center justify-center p-6">
              <div className="h-[85%] w-[78%]">
                <RabbitSvg stroke={2} />
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-12 pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: '01', t: '사진 업로드', d: 'JPG·PNG, 최대 10MB' },
            { k: '02', t: 'AI 자동 변환', d: '평균 15초 · 건당 500원' },
            { k: '03', t: '선 조정·편집', d: '굵기·디테일 실시간 조절' },
            { k: '04', t: '프린트·저장', d: 'A4 / PDF / 공유 링크' },
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
