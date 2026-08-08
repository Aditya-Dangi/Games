import { Component, input } from '@angular/core';
import { GameIconId } from '../../core/models/game.model';

@Component({
  selector: 'app-game-icon',
  imports: [],
  templateUrl: './game-icon.html',
  styleUrl: './game-icon.scss',
})
export class GameIcon {
  readonly id = input.required<GameIconId>();
}
