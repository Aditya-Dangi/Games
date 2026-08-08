export interface HangmanWord {
  word: string;
  hint: string;
}

export interface HangmanLetter {
  char: string;
  revealed: boolean;
}
