import { Component, inject } from '@angular/core';
import { GamePageHeader } from '../../../shared/game-page-header/game-page-header';
import { RpsStore } from '../rps-store';
import { RPS_MOVES } from '../rps.model';

@Component({
  selector: 'app-rps-play',
  imports: [GamePageHeader],
  providers: [RpsStore],
  templateUrl: './rps-play.html',
  styleUrl: './rps-play.scss',
})
export class RpsPlay {
  protected readonly store = inject(RpsStore);
  protected readonly moves = RPS_MOVES;

  protected resultText(): string {
    const result = this.store.result();
    if (result === 'Win') return 'Player 1 wins the round!';
    if (result === 'Lose') return 'Player 2 wins the round!';
    return "It's a tie!";
  }
}
