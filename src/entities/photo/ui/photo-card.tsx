import Image from 'next/image';
import type { Photo } from '@/entities/photo/model/photo.types';

interface PhotoCardProps {
  photo: Photo;
  index: number;
}

export function PhotoCard({ photo, index }: PhotoCardProps) {
  return (
    <li className="overflow-hidden rounded-lg border bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <Image
        src={`https://picsum.photos/id/${index + 500}/200`}
        alt={photo.title}
        width={150}
        height={150}
        unoptimized
        className="aspect-square w-full object-cover"
      />
      <div className="px-3 py-2">
        <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{photo.title}</p>
      </div>
    </li>
  );
}
