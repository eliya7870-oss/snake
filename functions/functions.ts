import { GAMEBOARD_SIZE } from "../utils/constants";

export function random(x: number) {
  //returns random integer from 0 to x
  return Math.floor(Math.random() * x);
}

export function getGreenGradient(value: number): string {
  // Clamp value between 1 and 100
  const v = Math.max(1, Math.min(100, value));

  // HSL: hue = 120 (green), saturation = 100%, lightness = 20% (dark) -> 80% (light)
  const lightness = 20 + (v - 1) * (60 / 99); // maps 1-100 to 20%-80%

  return `hsl(120, 100%, ${lightness}%)`;
}

export const generatefruitcoords = (currentSnake: number[][]) => {
  let attempts = 0;
  const maxAttempts = 1000; // Prevent infinite loop

  while (attempts < maxAttempts) {
    const coord = [random(GAMEBOARD_SIZE), random(GAMEBOARD_SIZE)];
    const isOnSnake = currentSnake.some(
      ([x, y]) => x === coord[0] && y === coord[1]
    );

    if (!isOnSnake) {
      console.log(coord);
      return coord;
    }
    attempts++;
  }

  // Fallback: find any empty cell
  for (let row = 0; row < GAMEBOARD_SIZE; row++) {
    for (let col = 0; col < GAMEBOARD_SIZE; col++) {
      if (!currentSnake.some(([x, y]) => x === row && y === col)) {
        return [row, col];
      }
    }
  }

  // Should never reach here unless board is full
  return [0, 0];
};
