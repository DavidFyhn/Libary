import { atom } from 'jotai';

export interface Genre {
  id: string;
  name: string;
  bookIds: string[];
}

export const genresAtom = atom<Genre[]>([]);
