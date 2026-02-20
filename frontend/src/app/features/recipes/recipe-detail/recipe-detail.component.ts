import { Component, computed, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { RecipeService } from '../../../core/recipe.service';
import { AuthService } from '../../../core/auth.service';
import { SavedRecipeService } from '../../../core/saved-recipe.service';
import { RecentlyViewedService } from '../../../core/recently-viewed.service';
import { VoteButtonsComponent } from '../../../shared/components/vote-buttons/vote-buttons.component';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-recipe-detail',
  imports: [
    CommonModule,
    RouterLink,
    VoteButtonsComponent,
    RelativeTimePipe,
    LoadingSpinnerComponent,
  ],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css',
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly recipeService = inject(RecipeService);
  private readonly authService = inject(AuthService);
  private readonly titleService = inject(Title);
  private readonly savedRecipeService = inject(SavedRecipeService);
  private readonly recentlyViewed = inject(RecentlyViewedService);

  protected readonly recipe = this.recipeService.selectedRecipe;
  protected readonly loading = this.recipeService.loading;
  protected readonly error = this.recipeService.error;
  protected readonly isAuthor = computed(
    () => this.recipe()?.authorId === this.authService.currentUser()?.id,
  );
  protected readonly isAuthenticated = this.authService.isAuthenticated;

  private paramSub?: Subscription;

  constructor() {
    effect(() => {
      const r = this.recipe();
      if (r) {
        this.titleService.setTitle(`${r.title} - Recipe Exchange`);
        this.recentlyViewed.add({ id: r.id, title: r.title });
      }
    });
  }

  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.recipeService.loadRecipeById(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
    this.recipeService.clearSelectedRecipe();
  }

  onVoteChange(): void {}

  onToggleSave(): void {
    const r = this.recipe();
    if (!this.isAuthenticated() || !r) return;
    this.savedRecipeService.toggleSave(r.id).subscribe();
  }
}
