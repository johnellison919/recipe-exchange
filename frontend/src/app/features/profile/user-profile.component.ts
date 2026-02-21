import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Subscription, switchMap } from 'rxjs';
import { RecipeService } from '../../core/recipe.service';
import { ProfileContextService } from '../../core/profile-context.service';
import { RecipeCardComponent } from '../recipes/recipe-card/recipe-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { User } from '../../models/user.model';
import { Recipe } from '../../models/recipe.model';
import { RelativeTimePipe } from '../../shared/pipes/relative-time.pipe';
import { getAvatarUrl } from '../../shared/utils/avatar.util';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, RecipeCardComponent, LoadingSpinnerComponent, RelativeTimePipe],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  private readonly recipeService = inject(RecipeService);
  private readonly titleService = inject(Title);
  private readonly profileContext = inject(ProfileContextService);
  private routeSub?: Subscription;

  protected readonly profile = signal<User | null>(null);
  protected readonly recipes = signal<Recipe[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly getAvatarUrl = getAvatarUrl;

  ngOnInit(): void {
    this.routeSub = this.route.paramMap
      .pipe(
        switchMap((params) => {
          const username = params.get('username');
          this.loading.set(true);
          this.error.set(null);
          this.profile.set(null);
          this.recipes.set([]);

          if (!username) {
            this.error.set('User not found');
            this.loading.set(false);
            return [];
          }

          return this.http.get<User>(`/api/users/${username}`);
        }),
      )
      .subscribe({
        next: (user) => {
          user.createdAt = new Date(user.createdAt);
          this.profile.set(user);
          this.profileContext.set(user);
          this.titleService.setTitle(`${user.username} - Recipe Exchange`);

          this.recipeService.getRecipesByAuthor(user.id).subscribe({
            next: (recipes) => {
              this.recipes.set(recipes);
              this.loading.set(false);
            },
            error: () => {
              this.loading.set(false);
            },
          });
        },
        error: () => {
          this.error.set('User not found');
          this.loading.set(false);
        },
      });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.profileContext.clear();
  }
}
