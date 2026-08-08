import { Injectable, signal } from '@angular/core';
import { RPS_MOVES, RpsMove, RpsResult, RpsScore, resolveRound } from './rps.model';

const STORAGE_KEY = 'score';

@Injectable({ providedIn: 'root' })
export class RpsStore {
  readonly score = signal<RpsScore>(this.loadScore());
  readonly playerMove = signal<RpsMove | null>(null);
  readonly computerMove = signal<RpsMove | null>(null);
  readonly result = signal<RpsResult | null>(null);

  play(move: RpsMove): void {
    const computerMove = RPS_MOVES[Math.floor(Math.random() * RPS_MOVES.length)];
    const result = resolveRound(move, computerMove);

    this.playerMove.set(move);
    this.computerMove.set(computerMove);
    this.result.set(result);

    this.score.update((score) => {
      if (result === 'Win') return { ...score, wins: score.wins + 1 };
      if (result === 'Lose') return { ...score, losses: score.losses + 1 };
      return { ...score, ties: score.ties + 1 };
    });

    this.persistScore();
  }

  resetScore(): void {
    this.score.set({ wins: 0, losses: 0, ties: 0 });
    localStorage.removeItem(STORAGE_KEY);
  }

  private loadScore(): RpsScore {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      const isValid =
        parsed &&
        typeof parsed.wins === 'number' &&
        typeof parsed.losses === 'number' &&
        typeof parsed.ties === 'number';
      return isValid ? (parsed as RpsScore) : { wins: 0, losses: 0, ties: 0 };
    } catch {
      return { wins: 0, losses: 0, ties: 0 };
    }
  }

  private persistScore(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.score()));
  }
}
