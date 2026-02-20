import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { Recipe, RecipeCategory, RecipeCreate, RecipeUpdate } from '../models/recipe.model';

export type DateRange = 'today' | 'this-week' | 'this-month' | 'this-year' | 'all-time';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly http = inject(HttpClient);

  private readonly recipesSignal = signal<Recipe[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly selectedRecipeSignal = signal<Recipe | null>(null);
  private readonly errorSignal = signal<string | null>(null);
  private readonly categoryFilterSignal = signal<RecipeCategory | null>(null);
  private readonly sortBySignal = signal<'newest' | 'top-rated'>('top-rated');
  private readonly sortSnapshotSignal = signal<Recipe[] | null>(null);
  private readonly allowResortSignal = signal<boolean>(true);
  private readonly searchQuerySignal = signal<string>('');
  private readonly dateRangeSignal = signal<DateRange>('all-time');

  readonly recipes = this.recipesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly selectedRecipe = this.selectedRecipeSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly categoryFilter = this.categoryFilterSignal.asReadonly();
  readonly sortBy = this.sortBySignal.asReadonly();
  readonly dateRange = this.dateRangeSignal.asReadonly();

  readonly filteredAndSortedRecipes = computed(() => {
    const snapshot = this.sortSnapshotSignal();
    const allowResort = this.allowResortSignal();

    if (snapshot && !allowResort) {
      let filtered = snapshot;
      const searchQuery = this.searchQuerySignal().toLowerCase();
      const category = this.categoryFilterSignal();
      const dateRange = this.dateRangeSignal();

      if (searchQuery) {
        filtered = filtered.filter(
          (r) =>
            r.title.toLowerCase().includes(searchQuery) ||
            r.description.toLowerCase().includes(searchQuery) ||
            r.author.username.toLowerCase().includes(searchQuery) ||
            r.tags.some((tag) => tag.toLowerCase().includes(searchQuery)),
        );
      }
      if (category) {
        filtered = filtered.filter((r) => r.category === category);
      }
      if (dateRange !== 'all-time') {
        const cutoff = this.getDateRangeCutoff(dateRange);
        filtered = filtered.filter((r) => r.createdAt >= cutoff);
      }

      return filtered.map((r) => {
        const current = this.recipesSignal().find((cr) => cr.id === r.id);
        return current ? { ...r, voteScore: current.voteScore, userVote: current.userVote } : r;
      });
    }

    let recipes = [...this.recipesSignal()];
    const category = this.categoryFilterSignal();
    const sortBy = this.sortBySignal();
    const searchQuery = this.searchQuerySignal().toLowerCase();
    const dateRange = this.dateRangeSignal();

    if (searchQuery) {
      recipes = recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery) ||
          r.description.toLowerCase().includes(searchQuery) ||
          r.author.username.toLowerCase().includes(searchQuery) ||
          r.tags.some((tag) => tag.toLowerCase().includes(searchQuery)),
      );
    }
    if (category) {
      recipes = recipes.filter((r) => r.category === category);
    }
    if (dateRange !== 'all-time') {
      const cutoff = this.getDateRangeCutoff(dateRange);
      recipes = recipes.filter((r) => r.createdAt >= cutoff);
    }
    if (sortBy === 'newest') {
      recipes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (sortBy === 'top-rated') {
      recipes.sort((a, b) => b.voteScore - a.voteScore);
    }

    return recipes;
  });

  readonly recipesByCategory = computed(() => {
    const recipes = this.recipesSignal();
    const grouped: Record<RecipeCategory, Recipe[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      dessert: [],
      snack: [],
      beverage: [],
      other: [],
    };
    recipes.forEach((recipe) => grouped[recipe.category].push(recipe));
    return grouped;
  });

  loadRecipes(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.allowResortSignal.set(true);
    this.sortSnapshotSignal.set(null);

    this.http
      .get<Recipe[]>('/api/recipes')
      .pipe(map((recipes) => recipes.map((r) => this.parseDates(r))))
      .subscribe({
        next: (recipes) => {
          this.recipesSignal.set(recipes);
          this.loadingSignal.set(false);
          this.captureSnapshot();
        },
        error: () => {
          this.errorSignal.set('Failed to load recipes');
          this.loadingSignal.set(false);
        },
      });
  }

  loadRecipeById(id: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http
      .get<Recipe>(`/api/recipes/${id}`)
      .pipe(map((r) => this.parseDates(r)))
      .subscribe({
        next: (recipe) => {
          this.selectedRecipeSignal.set(recipe);
          this.loadingSignal.set(false);
        },
        error: () => {
          this.errorSignal.set('Recipe not found');
          this.loadingSignal.set(false);
        },
      });
  }

  getRecipeById(id: string): Observable<Recipe> {
    return this.http
      .get<Recipe>(`/api/recipes/${id}`)
      .pipe(map((r) => this.parseDates(r)));
  }

  getRecipesByAuthor(authorId: string): Observable<Recipe[]> {
    return this.http
      .get<Recipe[]>('/api/recipes', { params: { authorId } })
      .pipe(map((recipes) => recipes.map((r) => this.parseDates(r))));
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>('/api/upload', formData);
  }

  createRecipe(recipeData: RecipeCreate): Observable<Recipe> {
    return this.http.post<Recipe>('/api/recipes', recipeData).pipe(
      map((r) => this.parseDates(r)),
      tap((recipe) => {
        this.recipesSignal.update((recipes) => [recipe, ...recipes]);
      }),
    );
  }

  updateRecipe(recipeUpdate: RecipeUpdate): Observable<Recipe> {
    const { id, ...body } = recipeUpdate;
    return this.http.put<Recipe>(`/api/recipes/${id}`, body).pipe(
      map((r) => this.parseDates(r)),
      tap((recipe) => {
        this.recipesSignal.update((recipes) =>
          recipes.map((r) => (r.id === recipe.id ? recipe : r)),
        );
        if (this.selectedRecipeSignal()?.id === recipe.id) {
          this.selectedRecipeSignal.set(recipe);
        }
      }),
    );
  }

  deleteRecipe(id: string): Observable<void> {
    return this.http.delete<void>(`/api/recipes/${id}`).pipe(
      tap(() => {
        this.recipesSignal.update((recipes) => recipes.filter((r) => r.id !== id));
        if (this.selectedRecipeSignal()?.id === id) {
          this.selectedRecipeSignal.set(null);
        }
      }),
    );
  }

  updateRecipeVoteScore(
    recipeId: string,
    newScore: number,
    userVote?: 'upvote' | 'downvote' | null,
  ): void {
    const snapshot = this.sortSnapshotSignal();
    if (snapshot) {
      this.sortSnapshotSignal.set(
        snapshot.map((r) =>
          r.id === recipeId ? { ...r, voteScore: newScore, userVote } : r,
        ),
      );
    }
    this.recipesSignal.update((recipes) =>
      recipes.map((r) => (r.id === recipeId ? { ...r, voteScore: newScore, userVote } : r)),
    );
    const selected = this.selectedRecipeSignal();
    if (selected?.id === recipeId) {
      this.selectedRecipeSignal.set({ ...selected, voteScore: newScore, userVote });
    }
  }

  updateRecipeSavedStatus(recipeId: string, isSaved: boolean): void {
    const snapshot = this.sortSnapshotSignal();
    if (snapshot) {
      this.sortSnapshotSignal.set(
        snapshot.map((r) => (r.id === recipeId ? { ...r, isSaved } : r)),
      );
    }
    this.recipesSignal.update((recipes) =>
      recipes.map((r) => (r.id === recipeId ? { ...r, isSaved } : r)),
    );
    const selected = this.selectedRecipeSignal();
    if (selected?.id === recipeId) {
      this.selectedRecipeSignal.set({ ...selected, isSaved });
    }
  }

  setCategoryFilter(category: RecipeCategory | null): void {
    this.categoryFilterSignal.set(category);
    this.allowResortSignal.set(true);
    this.sortSnapshotSignal.set(null);
  }

  setSortBy(sortBy: 'newest' | 'top-rated'): void {
    this.sortBySignal.set(sortBy);
    this.allowResortSignal.set(true);
    this.sortSnapshotSignal.set(null);
  }

  setDateRange(dateRange: DateRange): void {
    this.dateRangeSignal.set(dateRange);
    this.allowResortSignal.set(true);
    this.sortSnapshotSignal.set(null);
  }

  setSearchQuery(query: string): void {
    this.searchQuerySignal.set(query);
  }

  captureSnapshot(): void {
    this.sortSnapshotSignal.set([...this.filteredAndSortedRecipes()]);
    this.allowResortSignal.set(false);
  }

  clearSelectedRecipe(): void {
    this.selectedRecipeSignal.set(null);
  }

  clearError(): void {
    this.errorSignal.set(null);
  }

  private getDateRangeCutoff(dateRange: DateRange): Date {
    const now = new Date();
    switch (dateRange) {
      case 'today': {
        const d = new Date(now);
        d.setHours(0, 0, 0, 0);
        return d;
      }
      case 'this-week': {
        const d = new Date(now);
        d.setDate(d.getDate() - d.getDay());
        d.setHours(0, 0, 0, 0);
        return d;
      }
      case 'this-month': {
        return new Date(now.getFullYear(), now.getMonth(), 1);
      }
      case 'this-year': {
        return new Date(now.getFullYear(), 0, 1);
      }
      default:
        return new Date(0);
    }
  }

  private parseDates(recipe: any): Recipe {
    return {
      ...recipe,
      createdAt: new Date(recipe.createdAt),
      updatedAt: new Date(recipe.updatedAt),
      author: {
        ...recipe.author,
        createdAt: new Date(recipe.author.createdAt),
      },
    };
  }
}
