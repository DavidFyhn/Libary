import { atom } from 'jotai';

export interface Book {
  id: string;
  title: string;
  pages: number;
  genreId?: string;
  authorIds: string[];
}

export const booksAtom = atom<Book[]>([]);
