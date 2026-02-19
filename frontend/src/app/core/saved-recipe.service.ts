import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from './recipe.service';
import { catchError, map, Observable, tap } from 'rxjs';
import { Recipe } from '../models/recipe.model';

interface SaveRecipeResponse {
  isSaved: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SavedRecipeService {
  private readonly http = inject(HttpClient);
  private readonly recipeService = inject(RecipeService);

  toggleSave(recipeId: string): Observable<void> {
    const recipe = this.recipeService.recipes().find((r) => r.id === recipeId);
    const oldIsSaved = recipe?.isSaved ?? false;

    // Optimistic update
    this.recipeService.updateRecipeSavedStatus(recipeId, !oldIsSaved);

    return this.http.post<SaveRecipeResponse>(`/api/recipes/${recipeId}/save`, {}).pipe(
      tap((result) => {
        this.recipeService.updateRecipeSavedStatus(recipeId, result.isSaved);
      }),
      map(() => void 0),
      catchError((err) => {
        // Rollback
        this.recipeService.updateRecipeSavedStatus(recipeId, oldIsSaved);
        throw err;
      }),
    );
  }

  getSavedRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>('/api/recipes/saved').pipe(
      map((recipes) =>
        recipes.map((r) => ({
          ...r,
          createdAt: new Date(r.createdAt),
          updatedAt: new Date(r.updatedAt),
          author: {
            ...r.author,
            createdAt: new Date(r.author.createdAt),
          },
        })),
      ),
    );
  }
}
