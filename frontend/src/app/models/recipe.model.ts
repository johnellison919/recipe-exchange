import { User } from './user.model';
import { VoteType } from './vote.model';

export type RecipeCategory =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'dessert'
  | 'snack'
  | 'beverage'
  | 'other';

export type RecipeDifficulty = 'easy' | 'medium' | 'hard';

export interface IngredientGroup {
  name: string;
  items: string[];
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: IngredientGroup[];
  instructions: string[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: RecipeDifficulty;
  category: RecipeCategory;
  tags: string[];
  imageUrl?: string;
  authorId: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
  voteScore: number; // net upvotes - downvotes
  userVote?: VoteType; // current user's vote status
  isSaved?: boolean; // whether current user has saved this recipe
}

export interface RecipeCreate {
  title: string;
  description: string;
  ingredients: IngredientGroup[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: RecipeDifficulty;
  category: RecipeCategory;
  tags: string[];
  imageUrl?: string;
}

export interface RecipeUpdate extends Partial<RecipeCreate> {
  id: string;
}
