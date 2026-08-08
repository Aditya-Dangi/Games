export type TttMark = 'X' | 'O';
export type TttCell = TttMark | null;

export const WIN_LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export interface WinResult {
  winner: TttMark | null;
  line: number[] | null;
}

export function checkWinner(board: TttCell[]): WinResult {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return { winner: null, line: null };
}

export function isDraw(board: TttCell[]): boolean {
  return board.every((cell) => cell !== null);
}
