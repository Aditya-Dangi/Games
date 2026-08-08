import { Injectable, OnDestroy, computed, signal } from '@angular/core';
import { Subscription, interval, timer } from 'rxjs';
import { MEMORY_PAIRS, MEMORY_SYMBOLS, MemoryCard, MemoryDifficulty } from './memory-matcher.model';

@Injectable()
export class MemoryStore implements OnDestroy {
  private timerSub?: Subscription;
  private flipBackSub?: Subscription;

  readonly difficulty = signal<MemoryDifficulty>('easy');
  readonly cards = signal<MemoryCard[]>([]);
  readonly flippedIds = signal<number[]>([]);
  readonly busy = signal(false);
  readonly moves = signal(0);
  readonly elapsedSeconds = signal(0);

  readonly totalPairs = computed(() => MEMORY_PAIRS[this.difficulty()]);
  readonly matchedPairs = computed(() => this.cards().filter((c) => c.matched).length / 2);
  readonly isWon = computed(() => this.totalPairs() > 0 && this.matchedPairs() === this.totalPairs());

  constructor() {
    this.newGame('easy');
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
    this.flipBackSub?.unsubscribe();
  }

  newGame(difficulty: MemoryDifficulty = this.difficulty()): void {
    this.difficulty.set(difficulty);
    const pairCount = MEMORY_PAIRS[difficulty];
    const symbols = MEMORY_SYMBOLS.slice(0, pairCount);
    const deck: MemoryCard[] = [...symbols, ...symbols]
      .map((symbol, index) => ({ id: index, symbol, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5);

    this.cards.set(deck);
    this.flippedIds.set([]);
    this.busy.set(false);
    this.moves.set(0);
    this.elapsedSeconds.set(0);
    this.flipBackSub?.unsubscribe();

    this.timerSub?.unsubscribe();
    this.timerSub = interval(1000).subscribe(() => this.elapsedSeconds.update((s) => s + 1));
  }

  flipCard(id: number): void {
    if (this.busy()) return;
    const card = this.cards().find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    this.setFlipped(id, true);
    const flipped = [...this.flippedIds(), id];
    this.flippedIds.set(flipped);

    if (flipped.length < 2) return;

    this.moves.update((m) => m + 1);
    const [firstId, secondId] = flipped;
    const first = this.cards().find((c) => c.id === firstId)!;
    const second = this.cards().find((c) => c.id === secondId)!;

    if (first.symbol === second.symbol) {
      this.cards.update((cards) =>
        cards.map((c) => (c.id === firstId || c.id === secondId ? { ...c, matched: true } : c)),
      );
      this.flippedIds.set([]);
      if (this.isWon()) {
        this.timerSub?.unsubscribe();
      }
      return;
    }

    this.busy.set(true);
    this.flipBackSub = timer(700).subscribe(() => {
      this.setFlipped(firstId, false);
      this.setFlipped(secondId, false);
      this.flippedIds.set([]);
      this.busy.set(false);
    });
  }

  private setFlipped(id: number, flipped: boolean): void {
    this.cards.update((cards) => cards.map((c) => (c.id === id ? { ...c, flipped } : c)));
  }
}
