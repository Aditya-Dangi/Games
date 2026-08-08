import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORY_LABELS, Game } from '../../core/models/game.model';
import { GameIcon } from '../game-icon/game-icon';

@Component({
  selector: 'app-game-card',
  imports: [RouterLink, GameIcon],
  templateUrl: './game-card.html',
  styleUrl: './game-card.scss',
})
export class GameCard {
  readonly game = input.required<Game>();
  protected readonly categoryLabels = CATEGORY_LABELS;
}
