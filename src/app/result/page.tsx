'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useConvertStore } from '@/features/convert';
import { ResultScreen } from '@/widgets/result-screen';
import { SaveModal } from '@/widgets/save-modal';

export default function ResultPage() {
  const results = useConvertStore((s) => s.results);
  const router = useRouter();

  // 변환 결과가 없으면 /convert로 리다이렉트
  useEffect(() => {
    if (results.length === 0) {
      router.replace('/convert');
    }
  }, [results.length, router]);

  if (results.length === 0) {
    return null;
  }

  return (
    <>
      <ResultScreen />
      <SaveModal />
    </>
  );
}
