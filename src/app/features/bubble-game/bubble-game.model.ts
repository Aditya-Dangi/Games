export type BubbleGameStatus = 'idle' | 'running' | 'finished';

export const GAME_DURATION_SECONDS = 60;
export const POINTS_PER_HIT = 10;

export function maxBubblesForWidth(viewportWidth: number): number {
  if (viewportWidth > 2000) return 128;
  if (viewportWidth >= 1440) return 105;
  if (viewportWidth >= 1024) return 126;
  if (viewportWidth >= 768) return 100;
  return 70;
}
