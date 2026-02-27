import { Component, computed, effect, inject, OnDestroy, PLATFORM_ID, signal, untracked } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
export class RecipeFeedComponent implements OnDestroy {
  protected readonly recipeService = inject(RecipeService);
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  protected readonly categories = signal<string[]>([]);
  protected readonly currentPage = signal(1);
  protected readonly pageSize = 12;
  protected readonly mobileMenuOpen = signal(false);

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
    if (!this.isBrowser) return;
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

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  setCategory(category: RecipeCategory | null): void {
    this.currentPage.set(1);
    this.recipeService.setCategoryFilter(category);
    this.scheduleSnapshot();
  }

  setSortBy(sortBy: 'newest' | 'top-rated'): void {
    this.currentPage.set(1);
    this.recipeService.setSortBy(sortBy);
    this.scheduleSnapshot();
  }

  setDateRange(dateRange: DateRange): void {
    this.currentPage.set(1);
    this.recipeService.setDateRange(dateRange);
    this.scheduleSnapshot();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  setSortNewest(): void {
    this.currentPage.set(1);
    this.recipeService.setSortBy('newest');
    this.recipeService.setDateRange('all-time');
    this.scheduleSnapshot();
    this.closeMobileMenu();
  }

  setSortTopRated(dateRange: DateRange): void {
    this.currentPage.set(1);
    this.recipeService.setSortBy('top-rated');
    this.recipeService.setDateRange(dateRange);
    this.scheduleSnapshot();
    this.closeMobileMenu();
  }

  setCategoryMobile(category: RecipeCategory | null): void {
    this.setCategory(category);
    this.closeMobileMenu();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    if (this.isBrowser) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private scheduleSnapshot(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      this.recipeService.captureSnapshot();
      this.timeoutId = null;
    }, 100);
  }
}
