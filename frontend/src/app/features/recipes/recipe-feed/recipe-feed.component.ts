import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DateRange, RecipeService } from '../../../core/recipe.service';
import { RecipeCategory } from '../../../models/recipe.model';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-recipe-feed',
  imports: [CommonModule, RecipeCardComponent, LoadingSpinnerComponent],
  templateUrl: './recipe-feed.component.html',
  styleUrl: './recipe-feed.component.css',
})
export class RecipeFeedComponent {
  protected readonly recipeService = inject(RecipeService);
  private readonly http = inject(HttpClient);

  protected readonly categories = signal<string[]>([]);

  ngOnInit(): void {
    this.recipeService.loadRecipes();
    this.http.get<string[]>('/api/recipes/categories').subscribe({
      next: (cats) => this.categories.set(cats),
    });
  }

  get recipes() {
    return this.recipeService.filteredAndSortedRecipes();
  }

  get loading() {
    return this.recipeService.loading();
  }

  get currentCategory() {
    return this.recipeService.categoryFilter();
  }

  get currentSort() {
    return this.recipeService.sortBy();
  }

  get currentDateRange() {
    return this.recipeService.dateRange();
  }

  setCategory(category: RecipeCategory | null): void {
    this.recipeService.setCategoryFilter(category);
    setTimeout(() => {
      this.recipeService.captureSnapshot();
    }, 100);
  }

  setSortBy(sortBy: 'newest' | 'top-rated'): void {
    this.recipeService.setSortBy(sortBy);
    setTimeout(() => {
      this.recipeService.captureSnapshot();
    }, 100);
  }

  setDateRange(dateRange: DateRange): void {
    this.recipeService.setDateRange(dateRange);
    setTimeout(() => {
      this.recipeService.captureSnapshot();
    }, 100);
  }
}
