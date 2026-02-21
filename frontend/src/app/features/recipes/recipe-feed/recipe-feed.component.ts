import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DateRange, RecipeService } from '../../../core/recipe.service';
import { RecipeCategory } from '../../../models/recipe.model';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-recipe-feed',
  imports: [CommonModule, RecipeCardComponent, LoadingSpinnerComponent, PaginationComponent],
  templateUrl: './recipe-feed.component.html',
  styleUrl: './recipe-feed.component.css',
})
export class RecipeFeedComponent {
  protected readonly recipeService = inject(RecipeService);
  private readonly http = inject(HttpClient);

  protected readonly categories = signal<string[]>([]);
  protected readonly currentPage = signal(1);
  protected readonly pageSize = 12;

  protected readonly totalRecipes = computed(() =>
    this.recipeService.filteredAndSortedRecipes().length,
  );

  protected readonly paginatedRecipes = computed(() => {
    const all = this.recipeService.filteredAndSortedRecipes();
    const start = (this.currentPage() - 1) * this.pageSize;
    return all.slice(start, start + this.pageSize);
  });

  constructor() {
    effect(() => {
      this.recipeService.searchQuery();
      untracked(() => this.currentPage.set(1));
    });
  }

  ngOnInit(): void {
    this.recipeService.loadRecipes();
    this.http.get<string[]>('/api/recipes/categories').subscribe({
      next: (cats) => this.categories.set(cats),
    });
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
    this.currentPage.set(1);
    this.recipeService.setCategoryFilter(category);
    setTimeout(() => {
      this.recipeService.captureSnapshot();
    }, 100);
  }

  setSortBy(sortBy: 'newest' | 'top-rated'): void {
    this.currentPage.set(1);
    this.recipeService.setSortBy(sortBy);
    setTimeout(() => {
      this.recipeService.captureSnapshot();
    }, 100);
  }

  setDateRange(dateRange: DateRange): void {
    this.currentPage.set(1);
    this.recipeService.setDateRange(dateRange);
    setTimeout(() => {
      this.recipeService.captureSnapshot();
    }, 100);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
