import { api } from '@/shared/lib';
import type { Photo } from '@/entities/photo/model/photo.types';

const PHOTOS_URL = 'https://jsonplaceholder.typicode.com/photos';

export function fetchPhotos(limit = 12) {
  return api.get<Photo[]>(PHOTOS_URL, { params: { _limit: String(limit) } });
}
