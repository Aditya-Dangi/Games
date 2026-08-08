import { Injectable, OnDestroy, computed, signal } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import {
  BubbleGameStatus,
  GAME_DURATION_SECONDS,
  POINTS_PER_HIT,
  maxBubblesForWidth,
} from './bubble-game.model';

@Injectable()
export class BubbleGameStore implements OnDestroy {
  private readonly bubbleCount = signal(maxBubblesForWidth(typeof window !== 'undefined' ? window.innerWidth : 1024));
  private timerSub?: Subscription;

  readonly status = signal<BubbleGameStatus>('idle');
  readonly timeLeft = signal(GAME_DURATION_SECONDS);
  readonly score = signal(0);
  readonly targetNumber = signal(this.randomDigit());
  readonly bubbles = signal<number[]>([]);
  readonly lastHit = signal<number | null>(null);

  readonly isRunning = computed(() => this.status() === 'running');
  readonly isFinished = computed(() => this.status() === 'finished');

  constructor() {
    this.regenerateBubbles();
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }

  setViewportWidth(width: number): void {
    const count = maxBubblesForWidth(width);
    if (count !== this.bubbleCount()) {
      this.bubbleCount.set(count);
    }
    this.regenerateBubbles();
  }

  start(): void {
    if (this.status() !== 'idle') return;

    this.status.set('running');
    this.targetNumber.set(this.randomDigit());
    this.regenerateBubbles();

    this.timerSub = interval(1000).subscribe(() => {
      if (this.timeLeft() > 0) {
        this.timeLeft.update((t) => t - 1);
      } else {
        this.finish();
      }
    });
  }

  reset(): void {
    this.timerSub?.unsubscribe();
    this.status.set('idle');
    this.timeLeft.set(GAME_DURATION_SECONDS);
    this.score.set(0);
    this.lastHit.set(null);
    this.targetNumber.set(this.randomDigit());
    this.regenerateBubbles();
  }

  selectBubble(value: number): void {
    if (!this.isRunning()) return;

    this.lastHit.set(value);
    if (value === this.targetNumber()) {
      this.score.update((s) => s + POINTS_PER_HIT);
      this.targetNumber.set(this.randomDigit());
      this.regenerateBubbles();
    }
  }

  private finish(): void {
    this.timerSub?.unsubscribe();
    this.status.set('finished');
  }

  private regenerateBubbles(): void {
    const difficultyBonus = Math.min(40, Math.floor(this.score() / 50) * 8);
    const total = this.bubbleCount() + difficultyBonus;
    this.bubbles.set(Array.from({ length: total }, () => this.randomDigit()));
  }

  private randomDigit(): number {
    return Math.floor(Math.random() * 10);
  }
}
