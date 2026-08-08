export type MemoryDifficulty = 'easy' | 'medium' | 'hard';

export interface MemoryCard {
  id: number;
  symbol: string;
  flipped: boolean;
  matched: boolean;
}

export const MEMORY_SYMBOLS = ['🎮', '🎲', '🎯', '🎨', '🎵', '🚀', '🌟', '🍀', '🔥', '🦊', '🐙', '🍕'];

export const MEMORY_PAIRS: Record<MemoryDifficulty, number> = {
  easy: 6,
  medium: 8,
  hard: 12,
};

export const MEMORY_COLUMNS: Record<MemoryDifficulty, number> = {
  easy: 4,
  medium: 4,
  hard: 6,
};

export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
