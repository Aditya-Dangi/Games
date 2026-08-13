import { Component, inject } from '@angular/core';
import { GamePageHeader } from '../../shared/game-page-header/game-page-header';
import { MemoryCardComponent } from './memory-card/memory-card';
import { MemoryStore } from './memory-store';
import { MEMORY_COLUMNS, MemoryDifficulty, formatTime } from './memory-matcher.model';

@Component({
  selector: 'app-memory-matcher',
  imports: [GamePageHeader, MemoryCardComponent],
  providers: [MemoryStore],
  templateUrl: './memory-matcher.html',
  styleUrl: './memory-matcher.scss',
})
export class MemoryMatcher {
  protected readonly store = inject(MemoryStore);
  protected readonly difficulties: MemoryDifficulty[] = ['easy', 'medium', 'hard'];
  protected readonly formatTime = formatTime;

  protected get columns(): number {
    return MEMORY_COLUMNS[this.store.difficulty()];
  }

  protected resultText(): string {
    const winner = this.store.winner();
    const scores = this.store.scores();
    if (winner === 'tie') return `🤝 It's a tie — ${scores[1]} pairs each!`;
    if (winner === 1 || winner === 2) {
      const loserScore = winner === 1 ? scores[2] : scores[1];
      return `🏆 Player ${winner} wins ${scores[winner]} to ${loserScore}!`;
    }
    return '';
  }
}
