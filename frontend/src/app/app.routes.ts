import { Routes } from '@angular/router';
import { RecipeFeedComponent } from './features/recipes/recipe-feed/recipe-feed.component';

export const routes: Routes = [
  {
    path: '',
    component: RecipeFeedComponent,
    title: 'Recipe Exchange: ',
  },
];
