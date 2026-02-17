import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VoteService } from './vote.service';
import { AuthService } from './auth.service';
import { delay, Observable, of, tap } from 'rxjs';
import { Recipe, RecipeCategory, RecipeCreate, RecipeUpdate } from '../models/recipe.model';
import { User } from '../models/user.model';

const MOCK_AUTHOR_1: User = {
  id: 'user_1',
  username: 'johndoe',
  email: 'john@example.com',
  displayName: 'John Doe',
  avatarUrl: 'https://i.pravatar.cc/150?img=1',
  createdAt: new Date('2024-01-15'),
};

const MOCK_AUTHOR_2: User = {
  id: 'user_2',
  username: 'janesmith',
  email: 'jane@example.com',
  displayName: 'Jane Smith',
  avatarUrl: 'https://i.pravatar.cc/150?img=2',
  createdAt: new Date('2024-02-20'),
};

const MOCK_RECIPES: Recipe[] = [
  {
    id: 'recipe_1',
    title: 'Classic Spaghetti Carbonara',
    description: 'A rich and creamy Italian pasta dish made with eggs, cheese, and pancetta.',
    ingredients: [
      { name: 'Spaghetti', amount: '400', unit: 'g' },
      { name: 'Pancetta', amount: '200', unit: 'g' },
      { name: 'Eggs', amount: '4', unit: '' },
      { name: 'Pecorino Romano', amount: '100', unit: 'g' },
      { name: 'Black pepper', amount: '1', unit: 'tsp' },
    ],
    instructions: [
      'Cook spaghetti in well-salted boiling water until al dente.',
      'Fry pancetta in a pan until crispy, then set aside.',
      'Whisk eggs with grated cheese and a generous amount of black pepper.',
      'Drain pasta, reserving 1 cup of pasta water.',
      'Toss hot pasta with pancetta off the heat, then stir in the egg mixture.',
      'Add pasta water a splash at a time until the sauce is creamy.',
    ],
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: 'medium',
    category: 'dinner',
    tags: ['italian', 'pasta', 'quick'],
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
    authorId: 'user_1',
    author: MOCK_AUTHOR_1,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    voteScore: 42,
  },
  {
    id: 'recipe_2',
    title: 'Avocado Toast with Poached Egg',
    description: 'A healthy and satisfying breakfast with creamy avocado and a perfectly poached egg.',
    ingredients: [
      { name: 'Sourdough bread', amount: '2', unit: 'slices' },
      { name: 'Avocado', amount: '1', unit: '' },
      { name: 'Eggs', amount: '2', unit: '' },
      { name: 'Lemon juice', amount: '1', unit: 'tbsp' },
      { name: 'Red pepper flakes', amount: '1', unit: 'pinch' },
      { name: 'Salt', amount: '1', unit: 'pinch' },
    ],
    instructions: [
      'Toast sourdough slices until golden brown.',
      'Mash avocado with lemon juice, salt, and red pepper flakes.',
      'Bring a pan of water to a gentle simmer and add a splash of white vinegar.',
      'Crack each egg into the water and poach for 3 minutes.',
      'Spread avocado on toast and top with a poached egg.',
    ],
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: 'easy',
    category: 'breakfast',
    tags: ['healthy', 'vegetarian', 'quick'],
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800',
    authorId: 'user_2',
    author: MOCK_AUTHOR_2,
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
    voteScore: 28,
  },
  {
    id: 'recipe_3',
    title: 'Beef Tacos',
    description: 'Juicy seasoned ground beef tacos with all the classic toppings.',
    ingredients: [
      { name: 'Ground beef', amount: '500', unit: 'g' },
      { name: 'Taco shells', amount: '8', unit: '' },
      { name: 'Taco seasoning', amount: '2', unit: 'tbsp' },
      { name: 'Cheddar cheese', amount: '100', unit: 'g' },
      { name: 'Lettuce', amount: '1', unit: 'cup' },
      { name: 'Tomato', amount: '2', unit: '' },
      { name: 'Sour cream', amount: '4', unit: 'tbsp' },
    ],
    instructions: [
      'Brown ground beef in a skillet over medium-high heat.',
      'Add taco seasoning and 1/3 cup water; simmer for 5 minutes.',
      'Warm taco shells in the oven at 180°C for 3 minutes.',
      'Fill shells with beef and top with cheese, lettuce, tomato, and sour cream.',
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'easy',
    category: 'dinner',
    tags: ['mexican', 'beef', 'family-friendly'],
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
    authorId: 'user_1',
    author: MOCK_AUTHOR_1,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
    voteScore: 17,
  },
  {
    id: 'recipe_4',
    title: 'Chocolate Lava Cake',
    description: 'Decadent individual chocolate cakes with a gooey molten center.',
    ingredients: [
      { name: 'Dark chocolate', amount: '200', unit: 'g' },
      { name: 'Butter', amount: '100', unit: 'g' },
      { name: 'Eggs', amount: '4', unit: '' },
      { name: 'Sugar', amount: '100', unit: 'g' },
      { name: 'Plain flour', amount: '50', unit: 'g' },
    ],
    instructions: [
      'Preheat oven to 200°C. Grease 4 ramekins well.',
      'Melt chocolate and butter together in a bowl over simmering water.',
      'Whisk eggs and sugar until pale, then fold into the chocolate mixture.',
      'Fold in the flour until just combined.',
      'Divide into ramekins and bake for 10-12 minutes until the edges are set.',
      'Rest for 1 minute, then turn out and serve immediately.',
    ],
    prepTime: 15,
    cookTime: 12,
    servings: 4,
    difficulty: 'medium',
    category: 'dessert',
    tags: ['chocolate', 'baking', 'dinner-party'],
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800',
    authorId: 'user_2',
    author: MOCK_AUTHOR_2,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
    voteScore: 55,
  },
  {
    id: 'recipe_5',
    title: 'Greek Salad',
    description: 'A fresh and vibrant salad with ripe tomatoes, cucumber, olives, and feta.',
    ingredients: [
      { name: 'Tomatoes', amount: '4', unit: '' },
      { name: 'Cucumber', amount: '1', unit: '' },
      { name: 'Kalamata olives', amount: '100', unit: 'g' },
      { name: 'Feta cheese', amount: '200', unit: 'g' },
      { name: 'Red onion', amount: '1', unit: '' },
      { name: 'Olive oil', amount: '3', unit: 'tbsp' },
      { name: 'Dried oregano', amount: '1', unit: 'tsp' },
    ],
    instructions: [
      'Chop tomatoes, cucumber, and red onion into chunks.',
      'Combine in a bowl with olives and drizzle with olive oil.',
      'Sprinkle over dried oregano and season with salt and pepper.',
      'Top with sliced or crumbled feta and serve immediately.',
    ],
    prepTime: 10,
    cookTime: 0,
    servings: 4,
    difficulty: 'easy',
    category: 'lunch',
    tags: ['vegetarian', 'salad', 'mediterranean'],
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
    authorId: 'user_2',
    author: MOCK_AUTHOR_2,
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20'),
    voteScore: 31,
  },
];

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private voteService?: VoteService; // Lazy injection to avoid circular dependency

  // State signals
  private readonly recipesSignal = signal<Recipe[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly selectedRecipeSignal = signal<Recipe | null>(null);
  private readonly errorSignal = signal<string | null>(null);
  private readonly categoryFilterSignal = signal<RecipeCategory | null>(null);
  private readonly sortBySignal = signal<'newest' | 'top-rated'>('newest');
  private readonly sortSnapshotSignal = signal<Recipe[] | null>(null);
  private readonly allowResortSignal = signal<boolean>(true);
  private readonly searchQuerySignal = signal<string>('');

  // Public readonly signals
  readonly recipes = this.recipesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly selectedRecipe = this.selectedRecipeSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly categoryFilter = this.categoryFilterSignal.asReadonly();
  readonly sortBy = this.sortBySignal.asReadonly();

  // Computed signals
  readonly filteredAndSortedRecipes = computed(() => {
    const snapshot = this.sortSnapshotSignal();
    const allowResort = this.allowResortSignal();

    // If snapshot exists and resorting disabled, use snapshot with updated scores
    if (snapshot && !allowResort) {
      let filtered = snapshot;
      const searchQuery = this.searchQuerySignal().toLowerCase();
      const category = this.categoryFilterSignal();

      // Apply filters to snapshot
      if (searchQuery) {
        filtered = filtered.filter(
          (r) =>
            r.title.toLowerCase().includes(searchQuery) ||
            r.description.toLowerCase().includes(searchQuery) ||
            r.tags.some((tag) => tag.toLowerCase().includes(searchQuery)),
        );
      }

      if (category) {
        filtered = filtered.filter((r) => r.category === category);
      }

      // Update vote scores without reordering
      return filtered.map((r) => {
        const current = this.recipesSignal().find((cr) => cr.id === r.id);
        return current ? { ...r, voteScore: current.voteScore, userVote: current.userVote } : r;
      });
    }

    // Normal filtering and sorting
    let recipes = [...this.recipesSignal()];
    const category = this.categoryFilterSignal();
    const sortBy = this.sortBySignal();
    const searchQuery = this.searchQuerySignal().toLowerCase();

    // Apply search filter
    if (searchQuery) {
      recipes = recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery) ||
          r.description.toLowerCase().includes(searchQuery) ||
          r.tags.some((tag) => tag.toLowerCase().includes(searchQuery)),
      );
    }

    // Apply category filter
    if (category) {
      recipes = recipes.filter((r) => r.category === category);
    }

    // Apply sorting
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

    recipes.forEach((recipe) => {
      grouped[recipe.category].push(recipe);
    });

    return grouped;
  });

  /**
   * Load all recipes
   */
  loadRecipes(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Lazy inject VoteService to avoid circular dependency
    if (!this.voteService) {
      this.voteService = inject(VoteService);
    }

    // TODO: Replace with real API call
    // this.http.get<Recipe[]>('/api/recipes').subscribe({
    this.fetchRecipes().subscribe({
      next: (recipes) => {
        // Hydrate with user votes
        const recipesWithVotes = recipes.map((r) => ({
          ...r,
          userVote: this.voteService!.getUserVote(r.id),
        }));
        this.recipesSignal.set(recipesWithVotes);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set('Failed to load recipes');
        this.loadingSignal.set(false);
        console.error('Error loading recipes:', error);
      },
    });
  }

  /**
   * Load a recipe by ID
   */
  loadRecipeById(id: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // TODO: Replace with real API call
    // this.http.get<Recipe>(`/api/recipes/${id}`).subscribe({
    this.fetchRecipeById(id).subscribe({
      next: (recipe) => {
        if (recipe) {
          this.selectedRecipeSignal.set(recipe);
        } else {
          this.errorSignal.set('Recipe not found');
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set('Failed to load recipe');
        this.loadingSignal.set(false);
        console.error('Error loading recipe:', error);
      },
    });
  }

  /**
   * Get a recipe by ID (returns observable)
   */
  // TODO: Replace with real API call
  // getRecipeById(id: string): Observable<Recipe | undefined> {
  //   return this.http.get<Recipe>(`/api/recipes/${id}`);
  // }
  getRecipeById(id: string): Observable<Recipe | undefined> {
    return this.fetchRecipeById(id);
  }

  /**
   * Create a new recipe
   */
  createRecipe(recipeData: RecipeCreate): Observable<Recipe> {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      throw new Error('Must be logged in to create a recipe');
    }

    const newRecipe: Recipe = {
      id: this.generateMockId(),
      ...recipeData,
      authorId: currentUser.id,
      author: currentUser,
      createdAt: new Date(),
      updatedAt: new Date(),
      voteScore: 0,
    };

    return of(newRecipe).pipe(
      delay(500),
      tap((recipe) => {
        // Add to recipes list
        const currentRecipes = this.recipesSignal();
        this.recipesSignal.set([recipe, ...currentRecipes]);
      }),
    );
  }

  /**
   * Update an existing recipe
   */
  updateRecipe(recipeUpdate: RecipeUpdate): Observable<Recipe> {
    const currentRecipes = this.recipesSignal();
    const recipeIndex = currentRecipes.findIndex((r) => r.id === recipeUpdate.id);

    if (recipeIndex === -1) {
      throw new Error('Recipe not found');
    }

    const existingRecipe = currentRecipes[recipeIndex];
    const currentUser = this.authService.currentUser();

    if (existingRecipe.authorId !== currentUser?.id) {
      throw new Error('Not authorized to edit this recipe');
    }

    const updatedRecipe: Recipe = {
      ...existingRecipe,
      ...recipeUpdate,
      updatedAt: new Date(),
    };

    return of(updatedRecipe).pipe(
      delay(500),
      tap((recipe) => {
        // Update in recipes list
        const updatedRecipes = [...currentRecipes];
        updatedRecipes[recipeIndex] = recipe;
        this.recipesSignal.set(updatedRecipes);

        // Update selected recipe if it's the same one
        if (this.selectedRecipeSignal()?.id === recipe.id) {
          this.selectedRecipeSignal.set(recipe);
        }
      }),
    );
  }

  /**
   * Delete a recipe
   */
  deleteRecipe(id: string): Observable<void> {
    const currentRecipes = this.recipesSignal();
    const recipe = currentRecipes.find((r) => r.id === id);

    if (!recipe) {
      throw new Error('Recipe not found');
    }

    const currentUser = this.authService.currentUser();
    if (recipe.authorId !== currentUser?.id) {
      throw new Error('Not authorized to delete this recipe');
    }

    return of(void 0).pipe(
      delay(500),
      tap(() => {
        // Remove from recipes list
        const updatedRecipes = currentRecipes.filter((r) => r.id !== id);
        this.recipesSignal.set(updatedRecipes);

        // Clear selected recipe if it's the deleted one
        if (this.selectedRecipeSignal()?.id === id) {
          this.selectedRecipeSignal.set(null);
        }
      }),
    );
  }

  /**
   * Update vote score for a recipe
   */
  updateRecipeVoteScore(
    recipeId: string,
    newScore: number,
    userVote?: 'upvote' | 'downvote' | null,
  ): void {
    // Update snapshot if it exists
    const snapshot = this.sortSnapshotSignal();
    if (snapshot) {
      const updated = snapshot.map((r) =>
        r.id === recipeId ? { ...r, voteScore: newScore, userVote } : r,
      );
      this.sortSnapshotSignal.set(updated);
    }

    // Update main recipes
    const currentRecipes = this.recipesSignal();
    const updatedRecipes = currentRecipes.map((recipe) =>
      recipe.id === recipeId ? { ...recipe, voteScore: newScore, userVote } : recipe,
    );
    this.recipesSignal.set(updatedRecipes);

    // Update selected recipe if it's the same one
    const selectedRecipe = this.selectedRecipeSignal();
    if (selectedRecipe?.id === recipeId) {
      this.selectedRecipeSignal.set({ ...selectedRecipe, voteScore: newScore, userVote });
    }
  }

  /**
   * Set category filter
   */
  setCategoryFilter(category: RecipeCategory | null): void {
    this.categoryFilterSignal.set(category);
    this.allowResortSignal.set(true);
    this.sortSnapshotSignal.set(null);
  }

  /**
   * Set sort order
   */
  setSortBy(sortBy: 'newest' | 'top-rated'): void {
    this.sortBySignal.set(sortBy);
    this.allowResortSignal.set(true);
    this.sortSnapshotSignal.set(null);
  }

  /**
   * Set search query
   */
  setSearchQuery(query: string): void {
    this.searchQuerySignal.set(query);
    // Don't reset snapshot - search filters current view
  }

  /**
   * Capture snapshot of current filtered/sorted recipes
   */
  captureSnapshot(): void {
    const current = this.filteredAndSortedRecipes();
    this.sortSnapshotSignal.set([...current]);
    this.allowResortSignal.set(false);
  }

  /**
   * Clear selected recipe
   */
  clearSelectedRecipe(): void {
    this.selectedRecipeSignal.set(null);
  }

  /**
   * Clear error
   */
  clearError(): void {
    this.errorSignal.set(null);
  }

  /**
   * Fetch all recipes
   */
  // TODO: Replace with real API call
  // private fetchRecipes(): Observable<Recipe[]> {
  //   return this.http.get<Recipe[]>('/api/recipes');
  // }
  private fetchRecipes(): Observable<Recipe[]> {
    return of(MOCK_RECIPES).pipe(delay(500));
  }

  /**
   * Fetch a single recipe by ID
   */
  // TODO: Replace with real API call
  // private fetchRecipeById(id: string): Observable<Recipe | undefined> {
  //   return this.http.get<Recipe>(`/api/recipes/${id}`);
  // }
  private fetchRecipeById(id: string): Observable<Recipe | undefined> {
    return of(MOCK_RECIPES.find((r) => r.id === id)).pipe(delay(300));
  }

  /**
   * Generate a mock recipe ID
   */
  private generateMockId(): string {
    return 'recipe_' + Math.random().toString(36).substring(2);
  }
}
