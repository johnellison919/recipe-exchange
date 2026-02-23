import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { RecipeService } from '../../../core/recipe.service';
import { AuthService } from '../../../core/auth.service';
import { RecentlyViewedService } from '../../../core/recently-viewed.service';
import { VoteButtonsComponent, VoteChangeEvent } from '../../../shared/components/vote-buttons/vote-buttons.component';
import { VoteType } from '../../../models/vote.model';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { getAvatarUrl } from '../../../shared/utils/avatar.util';

interface SaveRecipeResponse {
  isSaved: boolean;
}

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
  private readonly http = inject(HttpClient);
  private readonly recentlyViewed = inject(RecentlyViewedService);

  protected readonly recipe = this.recipeService.selectedRecipe;
  protected readonly loading = this.recipeService.loading;
  protected readonly error = this.recipeService.error;
  protected readonly isAuthor = computed(
    () => this.recipe()?.authorId === this.authService.currentUser()?.id,
  );
  protected readonly isAuthenticated = this.authService.isAuthenticated;
  protected readonly getAvatarUrl = getAvatarUrl;

  // Local mutable state for vote/save
  private readonly localVoteScore = signal<number | undefined>(undefined);
  private readonly localUserVote = signal<VoteType | undefined>(undefined);
  private readonly localIsSaved = signal<boolean | undefined>(undefined);

  protected readonly displayVoteScore = computed(() =>
    this.localVoteScore() ?? this.recipe()?.voteScore ?? 0,
  );
  protected readonly displayUserVote = computed(() =>
    this.localUserVote() !== undefined ? this.localUserVote()! : (this.recipe()?.userVote ?? null),
  );
  protected readonly displayIsSaved = computed(() =>
    this.localIsSaved() ?? this.recipe()?.isSaved ?? false,
  );

  private paramSub?: Subscription;

  constructor() {
    effect(() => {
      const r = this.recipe();
      if (r) {
        this.titleService.setTitle(`${r.title} - Recipe Exchange`);
        this.recentlyViewed.add({ id: r.id, title: r.title });
        // Reset local overrides when a new recipe loads
        this.localVoteScore.set(undefined);
        this.localUserVote.set(undefined);
        this.localIsSaved.set(undefined);
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

  onVoteChange(event: VoteChangeEvent): void {
    this.localVoteScore.set(event.voteScore);
    this.localUserVote.set(event.userVote);
  }

  onToggleSave(): void {
    const r = this.recipe();
    if (!this.isAuthenticated() || !r) return;

    const oldIsSaved = this.displayIsSaved();
    this.localIsSaved.set(!oldIsSaved);

    this.http.post<SaveRecipeResponse>(`/api/recipes/${r.id}/save`, {}).subscribe({
      next: (result) => {
        this.localIsSaved.set(result.isSaved);
      },
      error: () => {
        this.localIsSaved.set(oldIsSaved);
      },
    });
  }
}
