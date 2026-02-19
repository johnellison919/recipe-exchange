import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavedRecipeService } from '../../core/saved-recipe.service';
import { Recipe } from '../../models/recipe.model';
import { RecipeCardComponent } from '../recipes/recipe-card/recipe-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-saved-recipes',
  imports: [CommonModule, RecipeCardComponent, LoadingSpinnerComponent],
  templateUrl: './saved-recipes.component.html',
  styleUrl: './saved-recipes.component.css',
})
export class SavedRecipesComponent implements OnInit {
  private readonly savedRecipeService = inject(SavedRecipeService);

  protected readonly recipes = signal<Recipe[]>([]);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.savedRecipeService.getSavedRecipes().subscribe({
      next: (recipes) => {
        this.recipes.set(recipes);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
