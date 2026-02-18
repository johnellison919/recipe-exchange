import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { RecipeService } from './recipe.service';
import { catchError, map, Observable, tap } from 'rxjs';
import { VoteType } from '../models/vote.model';

interface VoteResponse {
  voteType: VoteType;
  voteScore: number;
}

@Injectable({
  providedIn: 'root',
})
export class VoteService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly recipeService = inject(RecipeService);

  /**
   * Vote on a recipe. Pass null voteType to remove vote.
   * Uses optimistic updates: UI updates immediately, rolls back on error.
   */
  vote(recipeId: string, voteType: VoteType): Observable<void> {
    if (!this.authService.currentUser()) {
      throw new Error('Must be logged in to vote');
    }

    const recipe = this.recipeService.recipes().find((r) => r.id === recipeId);
    if (!recipe) throw new Error('Recipe not found');

    const oldScore = recipe.voteScore;
    const oldVote = recipe.userVote ?? null;

    // Calculate optimistic score
    let scoreChange = 0;
    if (!voteType) {
      scoreChange = oldVote === 'upvote' ? -1 : oldVote === 'downvote' ? 1 : 0;
    } else if (!oldVote) {
      scoreChange = voteType === 'upvote' ? 1 : -1;
    } else if (oldVote !== voteType) {
      scoreChange = voteType === 'upvote' ? 2 : -2;
    }

    // Optimistic update
    this.recipeService.updateRecipeVoteScore(recipeId, oldScore + scoreChange, voteType);

    return this.http.post<VoteResponse>(`/api/recipes/${recipeId}/vote`, { voteType }).pipe(
      tap((result) => {
        // Reconcile with actual server values
        this.recipeService.updateRecipeVoteScore(recipeId, result.voteScore, result.voteType);
      }),
      map(() => void 0),
      catchError((err) => {
        // Rollback
        this.recipeService.updateRecipeVoteScore(recipeId, oldScore, oldVote);
        throw err;
      }),
    );
  }

  removeVote(recipeId: string): Observable<void> {
    return this.vote(recipeId, null);
  }

  getUserVote(recipeId: string): VoteType {
    return this.recipeService.recipes().find((r) => r.id === recipeId)?.userVote ?? null;
  }

  hasUserVoted(recipeId: string): boolean {
    return this.getUserVote(recipeId) !== null;
  }
}
