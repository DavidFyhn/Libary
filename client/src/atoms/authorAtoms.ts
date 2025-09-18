import { atom } from 'jotai';

export interface Author {
  id: string;
  name: string;
  bookIds: string[];
}

export const authorsAtom = atom<Author[]>([]);
