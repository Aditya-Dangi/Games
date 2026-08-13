import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-hangman-result-modal',
  imports: [],
  templateUrl: './hangman-result-modal.html',
  styleUrl: './hangman-result-modal.scss',
})
export class HangmanResultModal {
  readonly isVictory = input.required<boolean>();
  readonly word = input.required<string>();
  readonly resultText = input<string>('');
  readonly playAgain = output<void>();
}
