import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register.component';
import { guestGuard } from './core/guards/guest.guard';
import { authGuard } from './core/guards/auth.guard';
import { RecipeFeedComponent } from './features/recipes/recipe-feed/recipe-feed.component';
import { RecipeCreateComponent } from './features/recipes/recipe-create/recipe-create.component';
import { RecipeDetailComponent } from './features/recipes/recipe-detail/recipe-detail.component';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: RecipeFeedComponent,
    title: 'Recipe Exchange',
  },
  {
    path: 'recipes/new',
    component: RecipeCreateComponent,
    title: 'New Recipe - Recipe Exchange',
    canActivate: [authGuard],
  },
  {
    path: 'recipes/:id/edit',
    component: RecipeCreateComponent,
    title: 'Edit Recipe - Recipe Exchange',
    canActivate: [authGuard],
  },
  {
    path: 'recipes/:id/:slug',
    component: RecipeDetailComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register - Recipe Exchange',
    canActivate: [guestGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login - Recipe Exchange',
    canActivate: [guestGuard],
  },
];
