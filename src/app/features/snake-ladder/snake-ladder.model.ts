export type PlayerId = 1 | 2;

export const BOARD_SIZE = 100;
export const BOARD_COLUMNS = 10;

export const LADDERS: Record<number, number> = {
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  51: 67,
  72: 91,
  80: 99,
};

export const SNAKES: Record<number, number> = {
  17: 7,
  54: 34,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  98: 79,
};

export interface CellGridPosition {
  row: number;
  col: number;
}

export function cellPosition(cellNumber: number): CellGridPosition {
  const rowFromBottom = Math.floor((cellNumber - 1) / BOARD_COLUMNS);
  const positionInRow = (cellNumber - 1) % BOARD_COLUMNS;
  const leftToRight = rowFromBottom % 2 === 0;
  const col = leftToRight ? positionInRow + 1 : BOARD_COLUMNS - positionInRow;
  const row = BOARD_COLUMNS - rowFromBottom;
  return { row, col };
}

export function cellPercent(cellNumber: number): { left: number; top: number } {
  const { row, col } = cellPosition(cellNumber);
  const left = ((col - 0.5) / BOARD_COLUMNS) * 100;
  const top = ((row - 0.5) / BOARD_COLUMNS) * 100;
  return { left, top };
}

export const PLAYER_LABELS: Record<PlayerId, string> = {
  1: 'Player 1',
  2: 'Player 2',
};

export type MovePhase = 'idle' | 'step' | 'climb' | 'slide';

// Timing for the step-by-step board animation. Kept as named constants so the
// store (state machine) and component (CSS custom-property bindings) agree
// on exactly how long each phase takes.
export const DICE_ROLL_MS = 500;
export const STEP_DURATION_MS = 260;
export const LANDING_PAUSE_MS = 200;
export const CLIMB_DURATION_MS = 700;
export const SLIDE_DURATION_MS = 550;
export const BOUNCE_DURATION_MS = 260;
export const TURN_GAP_MS = 450;

export function moveDurationMs(phase: MovePhase): number {
  switch (phase) {
    case 'climb':
      return CLIMB_DURATION_MS;
    case 'slide':
      return SLIDE_DURATION_MS;
    default:
      return STEP_DURATION_MS;
  }
}

export function moveEasing(phase: MovePhase): string {
  switch (phase) {
    case 'climb':
      return 'var(--ease-climb)';
    case 'slide':
      return 'var(--ease-slide)';
    default:
      return 'var(--ease-out)';
  }
}
