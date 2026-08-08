import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-game-page-header',
  imports: [RouterLink],
  templateUrl: './game-page-header.html',
  styleUrl: './game-page-header.scss',
})
export class GamePageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly accentVar = input<string>('--color-primary');
}
