import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, delay, Observable, of } from 'rxjs';
import { Vote, VoteType } from '../models/vote.model';
import { RecipeService } from './recipe.service';

@Injectable({
  providedIn: 'root',
})
export class VoteService {
  private readonly authService = inject(AuthService);
  private readonly recipeService = inject(RecipeService);

  // In-memory vote storage (in a real app, this would be managed by the backend)
  private votes: Map<string, Vote> = new Map();

  /**
   * Vote on a recipe (upvote or downvote)
   * Uses optimistic updates: UI updates immediately, rollback on error
   */
  vote(recipeId: string, voteType: VoteType): Observable<void> {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      throw new Error('Must be logged in to vote');
    }

    if (!voteType) {
      return this.removeVote(recipeId);
    }

    // Get current vote for this user and recipe
    const voteKey = `${currentUser.id}_${recipeId}`;
    const existingVote = this.votes.get(voteKey);

    // Calculate score change
    let scoreChange = 0;
    if (!existingVote) {
      // New vote
      scoreChange = voteType === 'upvote' ? 1 : -1;
    } else if (existingVote.voteType !== voteType) {
      // Changing vote (e.g., from upvote to downvote or vice versa)
      scoreChange = voteType === 'upvote' ? 2 : -2;
    }

    // Get current recipe to calculate new score
    const recipes = this.recipeService.recipes();
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) {
      throw new Error('Recipe not found');
    }

    const oldScore = recipe.voteScore;
    const newScore = oldScore + scoreChange;

    // Optimistic update: update UI immediately
    this.recipeService.updateRecipeVoteScore(recipeId, newScore, voteType);

    // Create or update vote
    const vote: Vote = {
      id: existingVote?.id || this.generateMockId(),
      userId: currentUser.id,
      recipeId,
      voteType,
      createdAt: existingVote?.createdAt || new Date(),
    };

    this.votes.set(voteKey, vote);

    // Simulate API call
    return of(void 0).pipe(
      delay(300),
      catchError((error) => {
        // Rollback on error
        this.recipeService.updateRecipeVoteScore(
          recipeId,
          oldScore,
          existingVote?.voteType || null,
        );
        if (existingVote) {
          this.votes.set(voteKey, existingVote);
        } else {
          this.votes.delete(voteKey);
        }
        throw error;
      }),
    );
  }

  /**
   * Remove vote from a recipe
   */
  removeVote(recipeId: string): Observable<void> {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      throw new Error('Must be logged in to remove vote');
    }

    const voteKey = `${currentUser.id}_${recipeId}`;
    const existingVote = this.votes.get(voteKey);

    if (!existingVote) {
      // No vote to remove
      return of(void 0);
    }

    // Get current recipe to calculate new score
    const recipes = this.recipeService.recipes();
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) {
      throw new Error('Recipe not found');
    }

    const oldScore = recipe.voteScore;
    const scoreChange = existingVote.voteType === 'upvote' ? -1 : 1;
    const newScore = oldScore + scoreChange;

    // Optimistic update
    this.recipeService.updateRecipeVoteScore(recipeId, newScore, null);
    this.votes.delete(voteKey);

    // Simulate API call
    return of(void 0).pipe(
      delay(300),
      catchError((error) => {
        // Rollback on error
        this.recipeService.updateRecipeVoteScore(recipeId, oldScore, existingVote.voteType);
        this.votes.set(voteKey, existingVote);
        throw error;
      }),
    );
  }

  /**
   * Get user's vote for a specific recipe
   */
  getUserVote(recipeId: string): VoteType {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      return null;
    }

    const voteKey = `${currentUser.id}_${recipeId}`;
    const vote = this.votes.get(voteKey);
    return vote?.voteType || null;
  }

  /**
   * Check if user has voted on a recipe
   */
  hasUserVoted(recipeId: string): boolean {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      return false;
    }

    const voteKey = `${currentUser.id}_${recipeId}`;
    return this.votes.has(voteKey);
  }

  /**
   * Generate a mock vote ID
   */
  private generateMockId(): string {
    return 'vote_' + Math.random().toString(36).substring(2);
  }
}
