import { fetchPhotos } from '@/entities/photo';
import { PhotoList } from './photo-list';

export default async function SsrPage() {
  const photos = await fetchPhotos();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Photos (SSR)</h1>
      <p className="mb-6 text-sm text-zinc-500">Server Component fetch + Zustand hydrate</p>
      <PhotoList initialPhotos={photos} />
    </div>
  );
}
