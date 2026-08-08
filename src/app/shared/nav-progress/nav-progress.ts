import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-progress',
  imports: [],
  templateUrl: './nav-progress.html',
  styleUrl: './nav-progress.scss',
})
export class NavProgress implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private sub?: Subscription;

  protected readonly loading = signal(false);

  ngOnInit(): void {
    this.sub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loading.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loading.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
