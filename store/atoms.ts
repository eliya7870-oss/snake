import { atom } from "jotai";
import { GAMEBOARD_SIZE } from "../utils/constants";

export const gameboardAtom = atom<(string | number)[][]>(
  Array.from({ length: GAMEBOARD_SIZE }, () => Array(GAMEBOARD_SIZE).fill(""))
);
export const scoreAtom = atom<{ score: number; highscore: number }>({
  score: 0,
  highscore: 0,
});
