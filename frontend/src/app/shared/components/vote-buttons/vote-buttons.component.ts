import { Component, inject, input, output } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { CommonModule } from '@angular/common';
import { VoteType } from '../../../models/vote.model';
import { VoteService } from '../../../core/vote.service';

@Component({
  selector: 'app-vote-buttons',
  imports: [CommonModule],
  templateUrl: './vote-buttons.component.html',
  styleUrl: './vote-buttons.component.css',
})
export class VoteButtonsComponent {
  private readonly authService = inject(AuthService);
  private readonly voteService = inject(VoteService);

  // Inputs
  recipeId = input.required<string>();
  voteScore = input.required<number>();
  userVote = input<VoteType>(null);

  // Output
  voteChange = output<void>();

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
    if (!this.isAuthenticated) {
      return;
    }

    const newVoteType: VoteType = this.isUpvoted ? null : 'upvote';
    this.voteService.vote(this.recipeId(), newVoteType).subscribe(() => {
      this.voteChange.emit();
    });
  }

  onDownvote(): void {
    if (!this.isAuthenticated) {
      return;
    }

    const newVoteType: VoteType = this.isDownvoted ? null : 'downvote';
    this.voteService.vote(this.recipeId(), newVoteType).subscribe(() => {
      this.voteChange.emit();
    });
  }
}
