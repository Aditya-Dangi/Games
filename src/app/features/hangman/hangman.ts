import { Component, HostListener, inject } from '@angular/core';
import { GamePageHeader } from '../../shared/game-page-header/game-page-header';
import { HangmanKeyboard } from './hangman-keyboard/hangman-keyboard';
import { HangmanResultModal } from './hangman-result-modal/hangman-result-modal';
import { HangmanStore, MAX_WRONG_GUESSES } from './hangman-store';

@Component({
  selector: 'app-hangman',
  imports: [GamePageHeader, HangmanKeyboard, HangmanResultModal],
  providers: [HangmanStore],
  templateUrl: './hangman.html',
  styleUrl: './hangman.scss',
})
export class Hangman {
  protected readonly store = inject(HangmanStore);
  protected readonly maxWrongGuesses = MAX_WRONG_GUESSES;

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    if (/^[a-z]$/.test(key)) {
      this.store.guessLetter(key);
    }
  }
}
