import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeader } from './shared/site-header/site-header';
import { NavProgress } from './shared/nav-progress/nav-progress';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, NavProgress],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
