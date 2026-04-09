'use client';

import { useEffect } from 'react';
import { type Photo, PhotoCard, useFilteredPhotos, usePhotoStore } from '@/entities/photo';

interface PhotoListProps {
  initialPhotos: Photo[];
}

export function PhotoList({ initialPhotos }: PhotoListProps) {
  const setPhotos = usePhotoStore((s) => s.setPhotos);
  const filter = usePhotoStore((s) => s.filter);
  const setFilter = usePhotoStore((s) => s.setFilter);
  const filteredPhotos = useFilteredPhotos();

  useEffect(() => {
    setPhotos(initialPhotos);
  }, [initialPhotos, setPhotos]);

  return (
    <>
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
    </>
  );
}
