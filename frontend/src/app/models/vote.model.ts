export type VoteType = 'upvote' | 'downvote' | null;

export interface Vote {
  id: string;
  userId: string;
  recipeId: string;
  voteType: VoteType;
  createdAt: Date;
}

export interface VoteAction {
  recipeId: string;
  voteType: VoteType;
}
