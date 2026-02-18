import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { RecipeService } from '../../../core/recipe.service';
import { VoteButtonsComponent } from '../../../shared/components/vote-buttons/vote-buttons.component';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-recipe-detail',
  imports: [
    CommonModule,
    RouterLink,
    VoteButtonsComponent,
    RelativeTimePipe,
    LoadingSpinnerComponent,
  ],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css',
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly recipeService = inject(RecipeService);
  private readonly titleService = inject(Title);

  protected readonly recipe = this.recipeService.selectedRecipe;
  protected readonly loading = this.recipeService.loading;
  protected readonly error = this.recipeService.error;

  private paramSub?: Subscription;

  constructor() {
    effect(() => {
      const r = this.recipe();
      if (r) {
        this.titleService.setTitle(`${r.title} - Recipe Exchange`);
      }
    });
  }

  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.recipeService.loadRecipeById(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
    this.recipeService.clearSelectedRecipe();
  }

  onVoteChange(): void {}
}
