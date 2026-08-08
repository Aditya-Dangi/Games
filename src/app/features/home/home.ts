import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameCard } from '../../shared/game-card/game-card';
import { GameIcon } from '../../shared/game-icon/game-icon';
import { GAMES } from '../../core/data/games.data';
import { CATEGORY_LABELS, GameCategory } from '../../core/models/game.model';

type CategoryFilter = GameCategory | 'all';

@Component({
  selector: 'app-home',
  imports: [GameCard, GameIcon, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly games = GAMES;
  protected readonly featuredGame = GAMES.find((g) => g.featured) ?? GAMES[0];
  protected readonly categoryLabels = CATEGORY_LABELS;

  protected readonly categories: CategoryFilter[] = [
    'all',
    ...Array.from(new Set(GAMES.map((g) => g.category))),
  ];

  protected readonly activeCategory = signal<CategoryFilter>('all');

  protected readonly filteredGames = computed(() => {
    const category = this.activeCategory();
    const games = category === 'all' ? this.games : this.games.filter((g) => g.category === category);
    return games.filter((g) => g.id !== this.featuredGame.id);
  });

  setCategory(category: CategoryFilter): void {
    this.activeCategory.set(category);
  }
}
