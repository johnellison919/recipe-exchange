import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../../models/recipe.model';
import { VoteButtonsComponent } from '../../../shared/components/vote-buttons/vote-buttons.component';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-recipe-card',
  imports: [CommonModule, RouterLink, VoteButtonsComponent, RelativeTimePipe],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css',
})
export class RecipeCardComponent {
  recipe = input.required<Recipe>();

  onVoteChange(): void {
    // Vote change is handled by VoteButtonsComponent
  }
}
