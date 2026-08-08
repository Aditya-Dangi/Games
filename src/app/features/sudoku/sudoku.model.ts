export type SudokuDifficulty = 'easy' | 'medium' | 'hard';

export interface SudokuCell {
  value: number | null;
  given: boolean;
}

export const SUDOKU_CLUES: Record<SudokuDifficulty, number> = {
  easy: 40,
  medium: 32,
  hard: 26,
};

export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
