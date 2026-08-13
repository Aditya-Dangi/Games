export type RpsMove = 'Stone' | 'Paper' | 'Scissors';
export type RpsResult = 'Win' | 'Lose' | 'Tie';

export const RPS_MOVES: RpsMove[] = ['Stone', 'Paper', 'Scissors'];

const BEATS: Record<RpsMove, RpsMove> = {
  Stone: 'Scissors',
  Paper: 'Stone',
  Scissors: 'Paper',
};

export function resolveRound(p1: RpsMove, p2: RpsMove): RpsResult {
  if (p1 === p2) return 'Tie';
  return BEATS[p1] === p2 ? 'Win' : 'Lose';
}
