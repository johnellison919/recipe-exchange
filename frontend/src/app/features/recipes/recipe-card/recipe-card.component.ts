import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../../models/recipe.model';
import { VoteButtonsComponent, VoteChangeEvent } from '../../../shared/components/vote-buttons/vote-buttons.component';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';
import { slugify } from '../../../shared/utils/slugify';
import { AuthService } from '../../../core/auth.service';
import { VoteType } from '../../../models/vote.model';

interface SaveRecipeResponse {
  isSaved: boolean;
}

@Component({
  selector: 'app-recipe-card',
  imports: [CommonModule, RouterLink, VoteButtonsComponent, RelativeTimePipe],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css',
})
export class RecipeCardComponent {
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);

  recipe = input.required<Recipe>();
  protected readonly slugify = slugify;

  // Local mutable state that tracks vote/save changes
  private readonly localVoteScore = signal<number | undefined>(undefined);
  private readonly localUserVote = signal<VoteType | undefined>(undefined);
  private readonly localIsSaved = signal<boolean | undefined>(undefined);

  // Reset local state when the recipe input changes
  constructor() {
    effect(() => {
      this.recipe(); // track
      this.localVoteScore.set(undefined);
      this.localUserVote.set(undefined);
      this.localIsSaved.set(undefined);
    });
  }

  protected readonly displayVoteScore = computed(() =>
    this.localVoteScore() ?? this.recipe().voteScore,
  );

  protected readonly displayUserVote = computed(() =>
    this.localUserVote() !== undefined ? this.localUserVote()! : (this.recipe().userVote ?? null),
  );

  protected readonly displayIsSaved = computed(() =>
    this.localIsSaved() ?? this.recipe().isSaved ?? false,
  );

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  onVoteChange(event: VoteChangeEvent): void {
    this.localVoteScore.set(event.voteScore);
    this.localUserVote.set(event.userVote);
  }

  onToggleSave(): void {
    if (!this.isAuthenticated) return;

    const oldIsSaved = this.displayIsSaved();
    // Optimistic update
    this.localIsSaved.set(!oldIsSaved);

    this.http.post<SaveRecipeResponse>(`/api/recipes/${this.recipe().id}/save`, {}).subscribe({
      next: (result) => {
        this.localIsSaved.set(result.isSaved);
      },
      error: () => {
        // Rollback
        this.localIsSaved.set(oldIsSaved);
      },
    });
  }
}
