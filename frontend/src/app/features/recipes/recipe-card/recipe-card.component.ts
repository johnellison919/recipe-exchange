import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../../models/recipe.model';
import { VoteButtonsComponent } from '../../../shared/components/vote-buttons/vote-buttons.component';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';
import { slugify } from '../../../shared/utils/slugify';
import { AuthService } from '../../../core/auth.service';
import { SavedRecipeService } from '../../../core/saved-recipe.service';

@Component({
  selector: 'app-recipe-card',
  imports: [CommonModule, RouterLink, VoteButtonsComponent, RelativeTimePipe],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css',
})
export class RecipeCardComponent {
  private readonly authService = inject(AuthService);
  private readonly savedRecipeService = inject(SavedRecipeService);

  recipe = input.required<Recipe>();
  protected readonly slugify = slugify;

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  onVoteChange(): void {
    // Vote change is handled by VoteButtonsComponent
  }

  onToggleSave(): void {
    if (!this.isAuthenticated) return;
    this.savedRecipeService.toggleSave(this.recipe().id).subscribe();
  }
}
