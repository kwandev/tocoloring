import { useQuery } from '@tanstack/react-query';
import { fetchPhotos } from './photo.api';

export function usePhotos(limit = 12) {
  return useQuery({
    queryKey: ['photos', limit],
    queryFn: () => fetchPhotos(limit),
  });
}
