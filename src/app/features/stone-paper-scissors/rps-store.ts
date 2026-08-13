import { Injectable, computed, signal } from '@angular/core';
import { RpsMove, RpsResult, resolveRound } from './rps.model';

export interface RpsScore {
  p1: number;
  p2: number;
  ties: number;
}

@Injectable()
export class RpsStore {
  readonly p1Move = signal<RpsMove | null>(null);
  readonly p2Move = signal<RpsMove | null>(null);
  readonly result = signal<RpsResult | null>(null);
  readonly score = signal<RpsScore>({ p1: 0, p2: 0, ties: 0 });

  readonly p1Picked = computed(() => this.p1Move() !== null);
  readonly p2Picked = computed(() => this.p2Move() !== null);
  readonly revealed = computed(() => this.p1Picked() && this.p2Picked());

  pickP1(move: RpsMove): void {
    if (this.p1Move()) return;
    this.p1Move.set(move);
    this.tryResolve();
  }

  pickP2(move: RpsMove): void {
    if (this.p2Move()) return;
    this.p2Move.set(move);
    this.tryResolve();
  }

  nextRound(): void {
    this.p1Move.set(null);
    this.p2Move.set(null);
    this.result.set(null);
  }

  resetScore(): void {
    this.score.set({ p1: 0, p2: 0, ties: 0 });
    this.nextRound();
  }

  private tryResolve(): void {
    const p1 = this.p1Move();
    const p2 = this.p2Move();
    if (!p1 || !p2) return;

    const result = resolveRound(p1, p2);
    this.result.set(result);

    this.score.update((s) => {
      if (result === 'Win') return { ...s, p1: s.p1 + 1 };
      if (result === 'Lose') return { ...s, p2: s.p2 + 1 };
      return { ...s, ties: s.ties + 1 };
    });
  }
}
