import { ConvertPanel } from '@/widgets/convert-panel';

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-center text-2xl font-bold">toColoring</h1>
      <p className="text-muted-foreground mb-8 text-center">
        이미지를 업로드하면 AI가 색칠공부 도안으로 변환해드립니다
      </p>
      <ConvertPanel />
    </main>
  );
}
