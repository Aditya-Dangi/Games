import { Injectable, signal } from '@angular/core';
import { TttCell, TttMark, checkWinner, isDraw } from './ttt.model';

type Status = 'playing' | 'won' | 'draw';

export interface TttScore {
  p1: number;
  p2: number;
  ties: number;
}

@Injectable()
export class TttStore {
  readonly board = signal<TttCell[]>(Array(9).fill(null));
  readonly turn = signal<TttMark>('X');
  readonly status = signal<Status>('playing');
  readonly winner = signal<TttMark | null>(null);
  readonly winLine = signal<number[] | null>(null);
  readonly score = signal<TttScore>({ p1: 0, p2: 0, ties: 0 });

  move(index: number): void {
    if (this.status() !== 'playing' || this.board()[index]) return;
    this.applyMove(index, this.turn());
  }

  newRound(): void {
    this.board.set(Array(9).fill(null));
    this.turn.set('X');
    this.status.set('playing');
    this.winner.set(null);
    this.winLine.set(null);
  }

  resetScore(): void {
    this.score.set({ p1: 0, p2: 0, ties: 0 });
  }

  private applyMove(index: number, mark: TttMark): void {
    const board = [...this.board()];
    board[index] = mark;
    this.board.set(board);

    const { winner, line } = checkWinner(board);
    if (winner) {
      this.winner.set(winner);
      this.winLine.set(line);
      this.status.set('won');
      this.score.update((s) => (winner === 'X' ? { ...s, p1: s.p1 + 1 } : { ...s, p2: s.p2 + 1 }));
      return;
    }

    if (isDraw(board)) {
      this.status.set('draw');
      this.score.update((s) => ({ ...s, ties: s.ties + 1 }));
      return;
    }

    this.turn.set(mark === 'X' ? 'O' : 'X');
  }
}
