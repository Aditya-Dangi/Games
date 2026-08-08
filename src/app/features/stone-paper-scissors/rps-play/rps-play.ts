import { Component, inject } from '@angular/core';
import { GamePageHeader } from '../../../shared/game-page-header/game-page-header';
import { RpsStore } from '../rps-store';
import { RPS_MOVES } from '../rps.model';

@Component({
  selector: 'app-rps-play',
  imports: [GamePageHeader],
  templateUrl: './rps-play.html',
  styleUrl: './rps-play.scss',
})
export class RpsPlay {
  protected readonly store = inject(RpsStore);
  protected readonly moves = RPS_MOVES;
}
