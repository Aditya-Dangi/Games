export type RpsMove = 'Stone' | 'Paper' | 'Scissors';
export type RpsResult = 'Win' | 'Lose' | 'Tie';

export interface RpsScore {
  wins: number;
  losses: number;
  ties: number;
}

export const RPS_MOVES: RpsMove[] = ['Stone', 'Paper', 'Scissors'];

const BEATS: Record<RpsMove, RpsMove> = {
  Stone: 'Scissors',
  Paper: 'Stone',
  Scissors: 'Paper',
};

export function resolveRound(player: RpsMove, computer: RpsMove): RpsResult {
  if (player === computer) return 'Tie';
  return BEATS[player] === computer ? 'Win' : 'Lose';
}
