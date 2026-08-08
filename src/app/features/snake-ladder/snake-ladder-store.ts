import { Injectable, OnDestroy, computed, signal } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { BOARD_SIZE, LADDERS, PlayerId, SNAKES } from './snake-ladder.model';

type GameStatus = 'playing' | 'finished';

@Injectable()
export class SnakeLadderStore implements OnDestroy {
  private rollSub?: Subscription;
  private computerTurnSub?: Subscription;

  readonly positions = signal<Record<PlayerId, number>>({ 1: 1, 2: 1 });
  readonly currentPlayer = signal<PlayerId>(1);
  readonly diceValue = signal<number | null>(null);
  readonly rolling = signal(false);
  readonly status = signal<GameStatus>('playing');
  readonly winner = signal<PlayerId | null>(null);
  readonly message = signal('Roll the dice to start climbing.');

  readonly canRoll = computed(
    () => this.status() === 'playing' && this.currentPlayer() === 1 && !this.rolling(),
  );

  ngOnDestroy(): void {
    this.rollSub?.unsubscribe();
    this.computerTurnSub?.unsubscribe();
  }

  restart(): void {
    this.rollSub?.unsubscribe();
    this.computerTurnSub?.unsubscribe();
    this.positions.set({ 1: 1, 2: 1 });
    this.currentPlayer.set(1);
    this.diceValue.set(null);
    this.rolling.set(false);
    this.status.set('playing');
    this.winner.set(null);
    this.message.set('Roll the dice to start climbing.');
  }

  rollForPlayer(): void {
    if (!this.canRoll()) return;
    this.performRoll(1);
  }

  private performRoll(player: PlayerId): void {
    this.rolling.set(true);
    this.rollSub?.unsubscribe();
    this.rollSub = timer(500).subscribe(() => {
      const roll = 1 + Math.floor(Math.random() * 6);
      this.diceValue.set(roll);
      this.rolling.set(false);
      this.movePlayer(player, roll);
    });
  }

  private movePlayer(player: PlayerId, steps: number): void {
    const current = this.positions()[player];
    let next = current + steps;

    if (next > BOARD_SIZE) {
      this.message.set(`${player === 1 ? 'You' : 'Computer'} need${player === 1 ? '' : 's'} an exact roll to finish.`);
      this.endTurn(player);
      return;
    }

    let note = '';
    if (LADDERS[next]) {
      note = ` A ladder! Climb to ${LADDERS[next]}.`;
      next = LADDERS[next];
    } else if (SNAKES[next]) {
      note = ` Oh no, a snake — down to ${SNAKES[next]}.`;
      next = SNAKES[next];
    }

    this.positions.update((pos) => ({ ...pos, [player]: next }));

    const who = player === 1 ? 'You' : 'Computer';
    this.message.set(`${who} rolled ${steps} and moved to ${next}.${note}`);

    if (next === BOARD_SIZE) {
      this.status.set('finished');
      this.winner.set(player);
      this.message.set(`${who} reached square 100 — ${player === 1 ? 'you win!' : 'computer wins.'}`);
      return;
    }

    this.endTurn(player);
  }

  private endTurn(player: PlayerId): void {
    const next: PlayerId = player === 1 ? 2 : 1;
    this.currentPlayer.set(next);

    if (next === 2 && this.status() === 'playing') {
      this.computerTurnSub?.unsubscribe();
      this.computerTurnSub = timer(900).subscribe(() => this.performRoll(2));
    }
  }
}
