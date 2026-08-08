import { Component, input, output } from '@angular/core';
import { MemoryCard as MemoryCardModel } from '../memory-matcher.model';

@Component({
  selector: 'app-memory-card',
  imports: [],
  templateUrl: './memory-card.html',
  styleUrl: './memory-card.scss',
})
export class MemoryCardComponent {
  readonly card = input.required<MemoryCardModel>();
  readonly cardClick = output<void>();
}
