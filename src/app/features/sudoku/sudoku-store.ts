import { Injectable, OnDestroy, computed, signal } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { carvePuzzle, generateSolvedGrid } from './sudoku-generator';
import { SUDOKU_CLUES, SudokuCell, SudokuDifficulty } from './sudoku.model';

export interface CellPosition {
  row: number;
  col: number;
}

@Injectable()
export class SudokuStore implements OnDestroy {
  private solution: number[][] = [];
  private timerSub?: Subscription;

  readonly difficulty = signal<SudokuDifficulty>('easy');
  readonly board = signal<SudokuCell[][]>([]);
  readonly selected = signal<CellPosition | null>(null);
  readonly elapsedSeconds = signal(0);
  readonly isComplete = signal(false);

  readonly invalidCells = computed(() => {
    const board = this.board();
    const invalid = new Set<string>();
    if (!board.length) return invalid;

    const groups: CellPosition[][] = [];
    for (let i = 0; i < 9; i++) {
      groups.push(Array.from({ length: 9 }, (_, c) => ({ row: i, col: c })));
      groups.push(Array.from({ length: 9 }, (_, r) => ({ row: r, col: i })));
    }
    for (let br = 0; br < 9; br += 3) {
      for (let bc = 0; bc < 9; bc += 3) {
        const box: CellPosition[] = [];
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) box.push({ row: br + r, col: bc + c });
        }
        groups.push(box);
      }
    }

    for (const group of groups) {
      const seen = new Map<number, CellPosition[]>();
      for (const pos of group) {
        const value = board[pos.row][pos.col].value;
        if (value === null) continue;
        const list = seen.get(value) ?? [];
        list.push(pos);
        seen.set(value, list);
      }
      for (const positions of seen.values()) {
        if (positions.length > 1) {
          positions.forEach((p) => invalid.add(`${p.row}-${p.col}`));
        }
      }
    }
    return invalid;
  });

  constructor() {
    this.newPuzzle('easy');
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }

  newPuzzle(difficulty: SudokuDifficulty = this.difficulty()): void {
    this.difficulty.set(difficulty);
    this.solution = generateSolvedGrid();
    const puzzle = carvePuzzle(this.solution, SUDOKU_CLUES[difficulty]);
    this.board.set(puzzle.map((row) => row.map((value) => ({ value: value || null, given: value !== 0 }))));
    this.selected.set(null);
    this.isComplete.set(false);
    this.elapsedSeconds.set(0);
    this.startTimer();
  }

  reset(): void {
    this.board.update((board) =>
      board.map((row) => row.map((cell) => (cell.given ? cell : { value: null, given: false }))),
    );
    this.isComplete.set(false);
    this.elapsedSeconds.set(0);
    this.startTimer();
  }

  selectCell(row: number, col: number): void {
    if (this.isComplete()) return;
    if (this.board()[row][col].given) return;
    this.selected.set({ row, col });
  }

  setValue(value: number | null): void {
    const pos = this.selected();
    if (!pos || this.isComplete()) return;
    const cell = this.board()[pos.row][pos.col];
    if (cell.given) return;

    this.board.update((board) => {
      const next = board.map((row) => [...row]);
      next[pos.row][pos.col] = { value, given: false };
      return next;
    });

    this.checkCompletion();
  }

  private checkCompletion(): void {
    const board = this.board();
    const filled = board.every((row) => row.every((cell) => cell.value !== null));
    if (filled && this.invalidCells().size === 0) {
      this.isComplete.set(true);
      this.timerSub?.unsubscribe();
    }
  }

  private startTimer(): void {
    this.timerSub?.unsubscribe();
    this.timerSub = interval(1000).subscribe(() => this.elapsedSeconds.update((s) => s + 1));
  }
}
