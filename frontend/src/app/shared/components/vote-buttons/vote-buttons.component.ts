import { Component, inject, input, output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/auth.service';
import { CommonModule } from '@angular/common';
import { VoteType } from '../../../models/vote.model';

export interface VoteChangeEvent {
  voteScore: number;
  userVote: VoteType;
}

interface VoteResponse {
  voteType: VoteType;
  voteScore: number;
}

@Component({
  selector: 'app-vote-buttons',
  imports: [CommonModule],
  templateUrl: './vote-buttons.component.html',
  styleUrl: './vote-buttons.component.css',
})
export class VoteButtonsComponent {
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);

  // Inputs
  recipeId = input.required<string>();
  voteScore = input.required<number>();
  userVote = input<VoteType>(null);

  // Output
  voteChange = output<VoteChangeEvent>();

  // Computed
  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get isUpvoted(): boolean {
    return this.userVote() === 'upvote';
  }

  get isDownvoted(): boolean {
    return this.userVote() === 'downvote';
  }

  onUpvote(): void {
    if (!this.isAuthenticated) return;

    const oldVote = this.userVote();
    const newVoteType: VoteType = this.isUpvoted ? null : 'upvote';

    // Optimistic: calculate expected score change
    let scoreChange = 0;
    if (!newVoteType) {
      scoreChange = oldVote === 'upvote' ? -1 : oldVote === 'downvote' ? 1 : 0;
    } else if (!oldVote) {
      scoreChange = 1;
    } else if (oldVote !== newVoteType) {
      scoreChange = 2;
    }

    this.voteChange.emit({ voteScore: this.voteScore() + scoreChange, userVote: newVoteType });

    this.http.post<VoteResponse>(`/api/recipes/${this.recipeId()}/vote`, { voteType: newVoteType }).subscribe({
      next: (result) => {
        this.voteChange.emit({ voteScore: result.voteScore, userVote: result.voteType });
      },
      error: () => {
        // Rollback
        this.voteChange.emit({ voteScore: this.voteScore(), userVote: oldVote });
      },
    });
  }

  onDownvote(): void {
    if (!this.isAuthenticated) return;

    const oldVote = this.userVote();
    const newVoteType: VoteType = this.isDownvoted ? null : 'downvote';

    let scoreChange = 0;
    if (!newVoteType) {
      scoreChange = oldVote === 'upvote' ? -1 : oldVote === 'downvote' ? 1 : 0;
    } else if (!oldVote) {
      scoreChange = -1;
    } else if (oldVote !== newVoteType) {
      scoreChange = -2;
    }

    this.voteChange.emit({ voteScore: this.voteScore() + scoreChange, userVote: newVoteType });

    this.http.post<VoteResponse>(`/api/recipes/${this.recipeId()}/vote`, { voteType: newVoteType }).subscribe({
      next: (result) => {
        this.voteChange.emit({ voteScore: result.voteScore, userVote: result.voteType });
      },
      error: () => {
        this.voteChange.emit({ voteScore: this.voteScore(), userVote: oldVote });
      },
    });
  }
}
