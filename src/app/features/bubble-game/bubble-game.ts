import { Component, HostListener, inject } from '@angular/core';
import { GamePageHeader } from '../../shared/game-page-header/game-page-header';
import { BubbleGameStore } from './bubble-game-store';
import { GAME_DURATION_SECONDS } from './bubble-game.model';

@Component({
  selector: 'app-bubble-game',
  imports: [GamePageHeader],
  providers: [BubbleGameStore],
  templateUrl: './bubble-game.html',
  styleUrl: './bubble-game.scss',
})
export class BubbleGame {
  protected readonly store = inject(BubbleGameStore);
  protected readonly gameDuration = GAME_DURATION_SECONDS;

  @HostListener('window:resize')
  onResize(): void {
    this.store.setViewportWidth(window.innerWidth);
  }
}
