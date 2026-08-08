import { Component, input, output } from '@angular/core';
import { SudokuCell as SudokuCellModel } from '../sudoku.model';

@Component({
  selector: 'app-sudoku-cell',
  imports: [],
  templateUrl: './sudoku-cell.html',
  styleUrl: './sudoku-cell.scss',
})
export class SudokuCellComponent {
  readonly cell = input.required<SudokuCellModel>();
  readonly row = input.required<number>();
  readonly col = input.required<number>();
  readonly selected = input(false);
  readonly peer = input(false);
  readonly invalid = input(false);
  readonly cellClick = output<void>();
}
