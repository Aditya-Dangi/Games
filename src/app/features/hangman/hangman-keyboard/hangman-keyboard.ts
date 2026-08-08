import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-hangman-keyboard',
  imports: [],
  templateUrl: './hangman-keyboard.html',
  styleUrl: './hangman-keyboard.scss',
})
export class HangmanKeyboard {
  readonly guessedLetters = input.required<ReadonlySet<string>>();
  readonly disabled = input(false);
  readonly letterSelected = output<string>();

  readonly alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
}
