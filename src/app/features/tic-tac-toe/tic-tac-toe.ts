import { Component, inject } from '@angular/core';
import { GamePageHeader } from '../../shared/game-page-header/game-page-header';
import { TttStore } from './ttt-store';

@Component({
  selector: 'app-tic-tac-toe',
  imports: [GamePageHeader],
  providers: [TttStore],
  templateUrl: './tic-tac-toe.html',
  styleUrl: './tic-tac-toe.scss',
})
export class TicTacToe {
  protected readonly store = inject(TttStore);
  protected readonly cellIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  protected statusMessage(): string {
    if (this.store.status() === 'won') {
      return this.store.winner() === 'X' ? 'You win! 🎉' : 'Computer wins.';
    }
    if (this.store.status() === 'draw') return "It's a draw.";
    if (this.store.computerThinking()) return 'Computer is thinking…';
    return this.store.turn() === 'X' ? 'Your move (X)' : "Computer's move (O)";
  }
}
