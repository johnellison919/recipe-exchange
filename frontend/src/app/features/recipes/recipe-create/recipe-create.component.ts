import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../../../core/recipe.service';
import { RecipeCreate, RecipeUpdate } from '../../../models/recipe.model';
import { slugify } from '../../../shared/utils/slugify';

@Component({
  selector: 'app-recipe-create',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recipe-create.component.html',
  styleUrl: './recipe-create.component.css',
})
export class RecipeCreateComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly recipeService = inject(RecipeService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);

  protected readonly editMode = signal(false);
  protected readonly editRecipeId = signal<string | null>(null);
  private readonly editRecipeTitle = signal('');
  protected readonly cancelLink = computed(() => {
    if (this.editMode()) {
      return ['/recipes', this.editRecipeId(), slugify(this.editRecipeTitle())];
    }
    return ['/'];
  });
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly categories = signal<string[]>([]);
  protected readonly uploadingImage = signal(false);
  protected readonly imagePreviewUrl = signal<string | null>(null);

  protected readonly difficulties = ['easy', 'medium', 'hard'] as const;

  protected readonly recipeForm = this.formBuilder.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    prepTime: [0, [Validators.required, Validators.min(0)]],
    cookTime: [0, [Validators.required, Validators.min(0)]],
    servings: [1, [Validators.required, Validators.min(1)]],
    difficulty: ['easy', [Validators.required]],
    category: ['', [Validators.required]],
    imageUrl: [''],
    ingredients: this.formBuilder.array([this.createIngredientGroup()]),
    instructions: this.formBuilder.array([this.formBuilder.control('', Validators.required)]),
  });

  ngOnInit(): void {
    this.http.get<string[]>('/api/recipes/categories').subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => this.error.set('Failed to load categories. Please refresh and try again.'),
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode.set(true);
      this.editRecipeId.set(id);
      this.recipeService.getRecipeById(id).subscribe({
        next: (recipe) => {
          this.editRecipeTitle.set(recipe.title);
          this.recipeForm.patchValue({
            title: recipe.title,
            description: recipe.description,
            prepTime: recipe.prepTime,
            cookTime: recipe.cookTime,
            servings: recipe.servings,
            difficulty: recipe.difficulty,
            category: recipe.category,
            imageUrl: recipe.imageUrl ?? '',
          });

          if (recipe.imageUrl) {
            this.imagePreviewUrl.set(recipe.imageUrl);
          }

          // Rebuild ingredients FormArray
          this.ingredients.clear();
          for (const ing of recipe.ingredients) {
            this.ingredients.push(this.formBuilder.group({
              name: [ing.name, Validators.required],
              amount: [ing.amount, Validators.required],
              unit: [ing.unit],
            }));
          }

          // Rebuild instructions FormArray
          this.instructions.clear();
          for (const step of recipe.instructions) {
            this.instructions.push(this.formBuilder.control(step, Validators.required));
          }
        },
        error: () => this.error.set('Failed to load recipe.'),
      });
    }
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructions(): FormArray {
    return this.recipeForm.get('instructions') as FormArray;
  }

  private createIngredientGroup(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      amount: ['', Validators.required],
      unit: [''],
    });
  }

  addIngredient(): void {
    this.ingredients.push(this.createIngredientGroup());
  }

  removeIngredient(index: number): void {
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }

  addInstruction(): void {
    this.instructions.push(this.formBuilder.control('', Validators.required));
  }

  removeInstruction(index: number): void {
    if (this.instructions.length > 1) {
      this.instructions.removeAt(index);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => this.imagePreviewUrl.set(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to server
    this.uploadingImage.set(true);
    this.recipeService.uploadImage(file).subscribe({
      next: ({ url }) => {
        this.recipeForm.get('imageUrl')?.setValue(url);
        this.uploadingImage.set(false);
      },
      error: () => {
        this.error.set('Image upload failed. Please try again.');
        this.imagePreviewUrl.set(null);
        this.recipeForm.get('imageUrl')?.setValue('');
        this.uploadingImage.set(false);
      },
    });
  }

  removeImage(): void {
    this.imagePreviewUrl.set(null);
    this.recipeForm.get('imageUrl')?.setValue('');
  }

  onSubmit(): void {
    if (this.recipeForm.invalid || this.submitting() || this.uploadingImage()) {
      this.recipeForm.markAllAsTouched();
      return;
    }

    const value = this.recipeForm.value;
    const recipeData: RecipeCreate = {
      title: value.title!,
      description: value.description!,
      prepTime: Number(value.prepTime),
      cookTime: Number(value.cookTime),
      servings: Number(value.servings),
      difficulty: value.difficulty as RecipeCreate['difficulty'],
      category: value.category as RecipeCreate['category'],
      imageUrl: value.imageUrl || undefined,
      ingredients: (value.ingredients as { name: string; amount: string; unit: string }[]).map(
        (ing) => ({ name: ing.name, amount: ing.amount, unit: ing.unit }),
      ),
      instructions: (value.instructions as string[]).filter((s) => s.trim() !== ''),
      tags: [],
    };

    this.submitting.set(true);
    this.error.set(null);

    if (this.editMode()) {
      const updateData: RecipeUpdate = { id: this.editRecipeId()!, ...recipeData };
      this.recipeService.updateRecipe(updateData).subscribe({
        next: (recipe) => {
          this.router.navigate(['/recipes', recipe.id, slugify(recipe.title)]);
        },
        error: () => {
          this.error.set('Failed to update recipe. Please try again.');
          this.submitting.set(false);
        },
      });
    } else {
      this.recipeService.createRecipe(recipeData).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: () => {
          this.error.set('Failed to create recipe. Please try again.');
          this.submitting.set(false);
        },
      });
    }
  }
}
