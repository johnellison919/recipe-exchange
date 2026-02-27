import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { ProfileContextService } from '../../../core/profile-context.service';
import { RecentlyViewedService } from '../../../core/recently-viewed.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { slugify } from '../../utils/slugify';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, SearchBarComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  protected readonly authService = inject(AuthService);
  protected readonly profileContext = inject(ProfileContextService);
  protected readonly recentlyViewed = inject(RecentlyViewedService);
  private readonly router = inject(Router);

  protected get isOnNewRecipePage(): boolean {
    return this.router.url === '/recipes/new';
  }

  protected recipeLink(entry: { id: string; title: string }): string[] {
    return ['/recipes', entry.id, slugify(entry.title)];
  }
}
