import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { AuthService } from '../../../core/auth.service';
import { RecipeService } from '../../../core/recipe.service';
import { ProfileContextService } from '../../../core/profile-context.service';
import { RecentlyViewedService } from '../../../core/recently-viewed.service';
import { slugify } from '../../utils/slugify';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  protected readonly recipeService = inject(RecipeService);
  protected readonly profileContext = inject(ProfileContextService);
  protected readonly recentlyViewed = inject(RecentlyViewedService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly searchQuery = signal('');
  private readonly searchInput$ = new Subject<string>();

  ngOnInit(): void {
    this.searchInput$
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((query) => {
        this.recipeService.setSearchQuery(query);
        if (this.router.url !== '/') {
          this.router.navigate(['/']);
        }
      });
  }

  protected get isOnNewRecipePage(): boolean {
    return this.router.url === '/recipes/new';
  }

  protected onSearchInput(value: string): void {
    this.searchQuery.set(value);
    this.searchInput$.next(value);
  }

  protected search(): void {
    this.recipeService.setSearchQuery(this.searchQuery());
    if (this.router.url !== '/') {
      this.router.navigate(['/']);
    }
  }

  protected clearSearch(): void {
    this.searchQuery.set('');
    this.recipeService.setSearchQuery('');
  }

  protected recipeLink(entry: { id: string; title: string }): string[] {
    return ['/recipes', entry.id, slugify(entry.title)];
  }
}
