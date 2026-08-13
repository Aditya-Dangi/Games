import { Component, inject } from '@angular/core';
import { GamePageHeader } from '../../shared/game-page-header/game-page-header';
import { SnakeLadderStore } from './snake-ladder-store';
import {
  BOARD_SIZE,
  LADDERS,
  PLAYER_LABELS,
  PlayerId,
  SNAKES,
  cellPercent,
  cellPosition,
  moveDurationMs,
  moveEasing,
} from './snake-ladder.model';

interface BoardCell {
  number: number;
  row: number;
  col: number;
  isLadderStart: boolean;
  isSnakeHead: boolean;
}

const DICE_PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

@Component({
  selector: 'app-snake-ladder',
  imports: [GamePageHeader],
  providers: [SnakeLadderStore],
  templateUrl: './snake-ladder.html',
  styleUrl: './snake-ladder.scss',
})
export class SnakeLadder {
  protected readonly store = inject(SnakeLadderStore);
  protected readonly playerLabels = PLAYER_LABELS;
  protected readonly dicePips = DICE_PIPS;
  protected readonly pipSlots = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  protected readonly cells: BoardCell[] = Array.from({ length: BOARD_SIZE }, (_, i) => {
    const number = i + 1;
    const { row, col } = cellPosition(number);
    return {
      number,
      row,
      col,
      isLadderStart: number in LADDERS,
      isSnakeHead: number in SNAKES,
    };
  });

  protected readonly connectors = [
    ...Object.entries(LADDERS).map(([from, to]) => ({
      type: 'ladder' as const,
      from: cellPercent(Number(from)),
      to: cellPercent(to),
    })),
    ...Object.entries(SNAKES).map(([from, to]) => ({
      type: 'snake' as const,
      from: cellPercent(Number(from)),
      to: cellPercent(to),
    })),
  ];

  protected tokenPosition(player: PlayerId): { left: string; top: string } {
    const pos = cellPercent(this.store.positions()[player]);
    const offset = player === 1 ? -6 : 6;
    return { left: `calc(${pos.left}% + ${offset}px)`, top: `${pos.top}%` };
  }

  protected tokenDuration(player: PlayerId): string {
    return `${moveDurationMs(this.store.movePhase()[player])}ms`;
  }

  protected tokenEasing(player: PlayerId): string {
    return moveEasing(this.store.movePhase()[player]);
  }

  protected isClimbing(player: PlayerId): boolean {
    return this.store.movePhase()[player] === 'climb';
  }

  protected isSliding(player: PlayerId): boolean {
    return this.store.movePhase()[player] === 'slide';
  }

  protected isBouncing(player: PlayerId): boolean {
    return this.store.bounce()[player];
  }

  protected activePips(value: number | null): number[] {
    return value ? DICE_PIPS[value] : [];
  }

  protected rollButtonLabel(): string {
    if (this.store.status() !== 'playing') return 'Game Over';
    if (this.store.rolling()) return 'Rolling…';
    if (this.store.moving() || this.store.turnTransitioning()) return 'Moving…';
    return `Roll Dice — ${this.playerLabels[this.store.currentPlayer()]}`;
  }
}
