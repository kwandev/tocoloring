'use client';

import { useConvertStore } from '@/features/convert/model/convert.store';
import { ResultItem } from './result-item';

export function ResultList() {
  const results = useConvertStore((s) => s.results);

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">변환 결과</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((result, i) => (
          <ResultItem key={result.id} result={result} index={i} />
        ))}
      </div>
    </div>
  );
}
