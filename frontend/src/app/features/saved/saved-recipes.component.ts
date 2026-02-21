import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavedRecipeService } from '../../core/saved-recipe.service';
import { Recipe } from '../../models/recipe.model';
import { RecipeCardComponent } from '../recipes/recipe-card/recipe-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-saved-recipes',
  imports: [CommonModule, RecipeCardComponent, LoadingSpinnerComponent, PaginationComponent],
  templateUrl: './saved-recipes.component.html',
  styleUrl: './saved-recipes.component.css',
})
export class SavedRecipesComponent implements OnInit {
  private readonly savedRecipeService = inject(SavedRecipeService);

  protected readonly recipes = signal<Recipe[]>([]);
  protected readonly loading = signal(true);
  protected readonly currentPage = signal(1);
  protected readonly pageSize = 12;

  protected readonly paginatedRecipes = computed(() => {
    const all = this.recipes();
    const start = (this.currentPage() - 1) * this.pageSize;
    return all.slice(start, start + this.pageSize);
  });

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

  onPageChange(page: number): void {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
