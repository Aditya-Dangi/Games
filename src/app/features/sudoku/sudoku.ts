import { Component, HostListener, inject } from '@angular/core';
import { GamePageHeader } from '../../shared/game-page-header/game-page-header';
import { SudokuCellComponent } from './sudoku-cell/sudoku-cell';
import { SudokuStore } from './sudoku-store';
import { SudokuDifficulty, formatTime } from './sudoku.model';

@Component({
  selector: 'app-sudoku',
  imports: [GamePageHeader, SudokuCellComponent],
  providers: [SudokuStore],
  templateUrl: './sudoku.html',
  styleUrl: './sudoku.scss',
})
export class Sudoku {
  protected readonly store = inject(SudokuStore);
  protected readonly difficulties: SudokuDifficulty[] = ['easy', 'medium', 'hard'];
  protected readonly numpad = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  protected readonly formatTime = formatTime;

  protected isPeer(row: number, col: number): boolean {
    const sel = this.store.selected();
    if (!sel) return false;
    const sameBox = Math.floor(sel.row / 3) === Math.floor(row / 3) && Math.floor(sel.col / 3) === Math.floor(col / 3);
    return sel.row === row || sel.col === col || sameBox;
  }

  protected isSelected(row: number, col: number): boolean {
    const sel = this.store.selected();
    return !!sel && sel.row === row && sel.col === col;
  }

  protected isInvalid(row: number, col: number): boolean {
    return this.store.invalidCells().has(`${row}-${col}`);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (/^[1-9]$/.test(event.key)) {
      this.store.setValue(Number(event.key));
    } else if (event.key === 'Backspace' || event.key === 'Delete' || event.key === '0') {
      this.store.setValue(null);
    }
  }
}
