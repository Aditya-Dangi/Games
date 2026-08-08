import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
    title: 'Games 4 Fun',
  },
  {
    path: 'sudoku',
    loadComponent: () => import('./features/sudoku/sudoku').then((m) => m.Sudoku),
    title: 'Sudoku · Games 4 Fun',
  },
  {
    path: 'hangman',
    loadComponent: () => import('./features/hangman/hangman').then((m) => m.Hangman),
    title: 'Hangman · Games 4 Fun',
  },
  {
    path: 'bubble-game',
    loadComponent: () => import('./features/bubble-game/bubble-game').then((m) => m.BubbleGame),
    title: 'Bubble Game · Games 4 Fun',
  },
  {
    path: 'memory-matcher',
    loadComponent: () =>
      import('./features/memory-matcher/memory-matcher').then((m) => m.MemoryMatcher),
    title: 'Memory Matcher · Games 4 Fun',
  },
  {
    path: 'stone-paper-scissors',
    loadComponent: () =>
      import('./features/stone-paper-scissors/rps-intro/rps-intro').then((m) => m.RpsIntro),
    title: 'Stone Paper Scissors · Games 4 Fun',
  },
  {
    path: 'stone-paper-scissors/play',
    loadComponent: () =>
      import('./features/stone-paper-scissors/rps-play/rps-play').then((m) => m.RpsPlay),
    title: 'Stone Paper Scissors · Games 4 Fun',
  },
  {
    path: 'tic-tac-toe',
    loadComponent: () => import('./features/tic-tac-toe/tic-tac-toe').then((m) => m.TicTacToe),
    title: 'Tic-Tac-Toe · Games 4 Fun',
  },
  {
    path: 'snake-ladder',
    loadComponent: () => import('./features/snake-ladder/snake-ladder').then((m) => m.SnakeLadder),
    title: 'Snake & Ladder · Games 4 Fun',
  },
  {
    path: '**',
    loadComponent: () => import('./shared/not-found/not-found').then((m) => m.NotFound),
    title: 'Page not found · Games 4 Fun',
  },
];
