export type GameCategory = 'word' | 'reflex' | 'strategy' | 'logic' | 'memory' | 'board';

export type GameIconId =
  | 'hangman'
  | 'bubble-game'
  | 'rps'
  | 'sudoku'
  | 'memory-matcher'
  | 'snake-ladder'
  | 'tic-tac-toe';

export interface Game {
  id: string;
  title: string;
  tagline: string;
  description: string;
  route: string;
  icon: GameIconId;
  category: GameCategory;
  accentVar: string;
  difficulty: 1 | 2 | 3;
  playTime: string;
  players: 1 | 2;
  featured?: boolean;
}

export const CATEGORY_LABELS: Record<GameCategory, string> = {
  word: 'Word',
  reflex: 'Reflex',
  strategy: 'Strategy',
  logic: 'Logic',
  memory: 'Memory',
  board: 'Board',
};
