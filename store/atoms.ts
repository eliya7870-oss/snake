import { atom } from "jotai";

export const gameboardAtom = atom<(string | number)[][]>(
  Array.from({ length: 20 }, () => Array(20).fill(""))
);
