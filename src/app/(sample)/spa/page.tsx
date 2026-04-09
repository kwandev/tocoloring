'use client';

import { useEffect } from 'react';
import { PhotoCard, useFilteredPhotos, usePhotoStore, usePhotos } from '@/entities/photo';

export default function SpaPage() {
  const { data: photos, isLoading, error } = usePhotos();
  const setPhotos = usePhotoStore((s) => s.setPhotos);
  const filter = usePhotoStore((s) => s.filter);
  const setFilter = usePhotoStore((s) => s.setFilter);
  const filteredPhotos = useFilteredPhotos();

  useEffect(() => {
    if (photos) {
      setPhotos(photos);
    }
  }, [photos, setPhotos]);

  if (isLoading) {
    return <p className="p-12 text-center">Loading...</p>;
  }
  if (error) {
    return <p className="p-12 text-center text-red-500">Error: {error.message}</p>;
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Photos (SPA)</h1>
      <p className="mb-6 text-sm text-zinc-500">TanStack Query + Zustand</p>

      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter by title..."
        className="mb-8 w-full rounded-lg border px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
      />

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {filteredPhotos.map((photo, index) => (
          <PhotoCard key={photo.id} photo={photo} index={index} />
        ))}
      </ul>
    </div>
  );
}
