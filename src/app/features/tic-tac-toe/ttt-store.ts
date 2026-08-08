import { Injectable, OnDestroy, signal } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { TttCell, TttMark, checkWinner, isDraw } from './ttt.model';

type Status = 'playing' | 'won' | 'draw';

export interface TttScore {
  wins: number;
  losses: number;
  ties: number;
}

@Injectable()
export class TttStore implements OnDestroy {
  private computerSub?: Subscription;

  readonly board = signal<TttCell[]>(Array(9).fill(null));
  readonly turn = signal<TttMark>('X');
  readonly status = signal<Status>('playing');
  readonly winner = signal<TttMark | null>(null);
  readonly winLine = signal<number[] | null>(null);
  readonly computerThinking = signal(false);
  readonly score = signal<TttScore>({ wins: 0, losses: 0, ties: 0 });

  ngOnDestroy(): void {
    this.computerSub?.unsubscribe();
  }

  playerMove(index: number): void {
    if (this.status() !== 'playing' || this.turn() !== 'X' || this.board()[index]) return;
    this.applyMove(index, 'X');
  }

  newRound(): void {
    this.computerSub?.unsubscribe();
    this.board.set(Array(9).fill(null));
    this.turn.set('X');
    this.status.set('playing');
    this.winner.set(null);
    this.winLine.set(null);
    this.computerThinking.set(false);
  }

  resetScore(): void {
    this.score.set({ wins: 0, losses: 0, ties: 0 });
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
      this.score.update((s) =>
        winner === 'X' ? { ...s, wins: s.wins + 1 } : { ...s, losses: s.losses + 1 },
      );
      return;
    }

    if (isDraw(board)) {
      this.status.set('draw');
      this.score.update((s) => ({ ...s, ties: s.ties + 1 }));
      return;
    }

    const nextTurn: TttMark = mark === 'X' ? 'O' : 'X';
    this.turn.set(nextTurn);

    if (nextTurn === 'O') {
      this.computerThinking.set(true);
      this.computerSub?.unsubscribe();
      this.computerSub = timer(500).subscribe(() => {
        this.computerThinking.set(false);
        const move = this.pickComputerMove(board);
        if (move !== -1) this.applyMove(move, 'O');
      });
    }
  }

  private pickComputerMove(board: TttCell[]): number {
    const empty = board.reduce<number[]>((acc, cell, i) => (cell ? acc : [...acc, i]), []);
    if (empty.length === 0) return -1;

    const winningMove = this.findWinningMove(board, empty, 'O');
    if (winningMove !== -1) return winningMove;

    const blockingMove = this.findWinningMove(board, empty, 'X');
    if (blockingMove !== -1) return blockingMove;

    if (empty.includes(4)) return 4;

    const corners = [0, 2, 6, 8].filter((i) => empty.includes(i));
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

    return empty[Math.floor(Math.random() * empty.length)];
  }

  private findWinningMove(board: TttCell[], empty: number[], mark: TttMark): number {
    for (const index of empty) {
      const trial = [...board];
      trial[index] = mark;
      if (checkWinner(trial).winner === mark) return index;
    }
    return -1;
  }
}
