import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
export class SidebarComponent {
  protected readonly authService = inject(AuthService);
  protected readonly recipeService = inject(RecipeService);
  protected readonly profileContext = inject(ProfileContextService);
  protected readonly recentlyViewed = inject(RecentlyViewedService);
  private readonly router = inject(Router);

  protected readonly searchQuery = signal('');

  protected get isOnNewRecipePage(): boolean {
    return this.router.url === '/recipes/new';
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
