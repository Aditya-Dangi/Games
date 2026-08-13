import { Injectable, OnDestroy, computed, signal } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import {
  BOARD_SIZE,
  BOUNCE_DURATION_MS,
  DICE_ROLL_MS,
  LADDERS,
  LANDING_PAUSE_MS,
  MovePhase,
  PLAYER_LABELS,
  PlayerId,
  SNAKES,
  STEP_DURATION_MS,
  TURN_GAP_MS,
} from './snake-ladder.model';

type GameStatus = 'playing' | 'finished';

@Injectable()
export class SnakeLadderStore implements OnDestroy {
  private rollSub?: Subscription;
  private stepSub?: Subscription;
  private transitionSub?: Subscription;
  private bounceSub?: Subscription;
  private turnGapSub?: Subscription;

  readonly positions = signal<Record<PlayerId, number>>({ 1: 1, 2: 1 });
  readonly currentPlayer = signal<PlayerId>(1);
  readonly diceValue = signal<number | null>(null);
  readonly rolling = signal(false);
  readonly moving = signal(false);
  readonly turnTransitioning = signal(false);
  readonly movePhase = signal<Record<PlayerId, MovePhase>>({ 1: 'idle', 2: 'idle' });
  readonly bounce = signal<Record<PlayerId, boolean>>({ 1: false, 2: false });
  readonly status = signal<GameStatus>('playing');
  readonly winner = signal<PlayerId | null>(null);
  readonly message = signal('Roll the dice to start climbing.');

  readonly canRoll = computed(
    () =>
      this.status() === 'playing' &&
      !this.rolling() &&
      !this.moving() &&
      !this.turnTransitioning(),
  );

  ngOnDestroy(): void {
    this.clearSubs();
  }

  restart(): void {
    this.clearSubs();
    this.positions.set({ 1: 1, 2: 1 });
    this.currentPlayer.set(1);
    this.diceValue.set(null);
    this.rolling.set(false);
    this.moving.set(false);
    this.turnTransitioning.set(false);
    this.movePhase.set({ 1: 'idle', 2: 'idle' });
    this.bounce.set({ 1: false, 2: false });
    this.status.set('playing');
    this.winner.set(null);
    this.message.set('Roll the dice to start climbing.');
  }

  roll(): void {
    if (!this.canRoll()) return;
    const player = this.currentPlayer();
    this.rolling.set(true);
    this.rollSub?.unsubscribe();
    this.rollSub = timer(DICE_ROLL_MS).subscribe(() => {
      const value = 1 + Math.floor(Math.random() * 6);
      this.diceValue.set(value);
      this.rolling.set(false);
      this.beginMove(player, value);
    });
  }

  private beginMove(player: PlayerId, steps: number): void {
    const start = this.positions()[player];
    const rawTarget = start + steps;

    if (rawTarget > BOARD_SIZE) {
      this.message.set(`${PLAYER_LABELS[player]} needs an exact roll to finish.`);
      this.scheduleEndTurn(player);
      return;
    }

    this.moving.set(true);
    this.animateSteps(player, start, rawTarget, steps);
  }

  private animateSteps(player: PlayerId, from: number, to: number, steps: number): void {
    if (from >= to) {
      this.resolveLanding(player, to, steps);
      return;
    }

    const next = from + 1;
    this.setPhase(player, 'step');
    this.positions.update((pos) => ({ ...pos, [player]: next }));
    this.pulseBounce(player, STEP_DURATION_MS * 0.7);

    this.stepSub?.unsubscribe();
    this.stepSub = timer(STEP_DURATION_MS).subscribe(() => this.animateSteps(player, next, to, steps));
  }

  private resolveLanding(player: PlayerId, square: number, steps: number): void {
    if (LADDERS[square]) {
      const target = LADDERS[square];
      this.transitionSub?.unsubscribe();
      this.transitionSub = timer(LANDING_PAUSE_MS).subscribe(() =>
        this.animateConnector(player, target, 'climb', () =>
          this.finishMove(player, target, steps, ` A ladder! Climb to ${target}.`),
        ),
      );
      return;
    }

    if (SNAKES[square]) {
      const target = SNAKES[square];
      this.transitionSub?.unsubscribe();
      this.transitionSub = timer(LANDING_PAUSE_MS).subscribe(() =>
        this.animateConnector(player, target, 'slide', () =>
          this.finishMove(player, target, steps, ` Oh no, a snake — down to ${target}.`),
        ),
      );
      return;
    }

    this.finishMove(player, square, steps, '');
  }

  private animateConnector(player: PlayerId, target: number, phase: MovePhase, onDone: () => void): void {
    this.setPhase(player, phase);
    this.positions.update((pos) => ({ ...pos, [player]: target }));

    const duration = phase === 'climb' ? 700 : 550;
    this.transitionSub?.unsubscribe();
    this.transitionSub = timer(duration).subscribe(() => {
      this.setPhase(player, 'idle');
      this.pulseBounce(player, BOUNCE_DURATION_MS);
      onDone();
    });
  }

  private finishMove(player: PlayerId, square: number, steps: number, note: string): void {
    this.setPhase(player, 'idle');
    this.moving.set(false);

    const who = PLAYER_LABELS[player];
    this.message.set(`${who} rolled ${steps} and moved to ${square}.${note}`);

    if (square === BOARD_SIZE) {
      this.status.set('finished');
      this.winner.set(player);
      this.message.set(`${who} reached square 100 and wins!`);
      return;
    }

    this.scheduleEndTurn(player);
  }

  private scheduleEndTurn(player: PlayerId): void {
    const next: PlayerId = player === 1 ? 2 : 1;
    this.turnTransitioning.set(true);
    this.turnGapSub?.unsubscribe();
    this.turnGapSub = timer(TURN_GAP_MS).subscribe(() => {
      this.currentPlayer.set(next);
      this.turnTransitioning.set(false);
    });
  }

  private setPhase(player: PlayerId, phase: MovePhase): void {
    this.movePhase.update((phases) => ({ ...phases, [player]: phase }));
  }

  private pulseBounce(player: PlayerId, duration: number): void {
    this.bounce.update((b) => ({ ...b, [player]: true }));
    this.bounceSub?.unsubscribe();
    this.bounceSub = timer(duration).subscribe(() => this.bounce.update((b) => ({ ...b, [player]: false })));
  }

  private clearSubs(): void {
    this.rollSub?.unsubscribe();
    this.stepSub?.unsubscribe();
    this.transitionSub?.unsubscribe();
    this.bounceSub?.unsubscribe();
    this.turnGapSub?.unsubscribe();
  }
}
