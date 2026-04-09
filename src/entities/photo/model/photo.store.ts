import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import type { Photo } from './photo.types';

interface PhotoState {
  photos: Photo[];
  filter: string;
  setPhotos: (photos: Photo[]) => void;
  setFilter: (filter: string) => void;
}

export const usePhotoStore = create<PhotoState>((set) => ({
  photos: [],
  filter: '',
  setPhotos: (photos) => set({ photos }),
  setFilter: (filter) => set({ filter }),
}));

export function useFilteredPhotos() {
  return usePhotoStore(
    useShallow((state) => {
      const { photos, filter } = state;
      if (!filter) {
        return photos;
      }
      return photos.filter((photo) => photo.title.toLowerCase().includes(filter.toLowerCase()));
    }),
  );
}
