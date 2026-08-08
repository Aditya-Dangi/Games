import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GamePageHeader } from '../../../shared/game-page-header/game-page-header';
import { GameIcon } from '../../../shared/game-icon/game-icon';

@Component({
  selector: 'app-rps-intro',
  imports: [RouterLink, GamePageHeader, GameIcon],
  templateUrl: './rps-intro.html',
  styleUrl: './rps-intro.scss',
})
export class RpsIntro {}
