import { Injectable, computed, signal } from '@angular/core';
import { HangmanLetter } from './hangman.model';
import { HANGMAN_WORD_LIST } from './hangman-word-list.data';

export const MAX_WRONG_GUESSES = 6;

@Injectable()
export class HangmanStore {
  private readonly word = signal('');
  readonly hint = signal('');
  readonly guessedLetters = signal<ReadonlySet<string>>(new Set());
  readonly wrongGuessCount = signal(0);

  readonly letters = computed<HangmanLetter[]>(() => {
    const guessed = this.guessedLetters();
    return [...this.word()].map((char) => ({ char, revealed: guessed.has(char) }));
  });

  readonly isVictory = computed(() => this.letters().length > 0 && this.letters().every((l) => l.revealed));
  readonly isDefeat = computed(() => this.wrongGuessCount() >= MAX_WRONG_GUESSES);
  readonly isGameOver = computed(() => this.isVictory() || this.isDefeat());
  readonly currentWord = computed(() => this.word());

  constructor() {
    this.newGame();
  }

  newGame(): void {
    const entry = HANGMAN_WORD_LIST[Math.floor(Math.random() * HANGMAN_WORD_LIST.length)];
    this.word.set(entry.word.toLowerCase());
    this.hint.set(entry.hint);
    this.guessedLetters.set(new Set());
    this.wrongGuessCount.set(0);
  }

  guessLetter(letter: string): void {
    const normalized = letter.toLowerCase();
    if (this.isGameOver() || this.guessedLetters().has(normalized)) {
      return;
    }

    this.guessedLetters.update((prev) => new Set(prev).add(normalized));

    if (!this.word().includes(normalized)) {
      this.wrongGuessCount.update((count) => count + 1);
    }
  }
}
