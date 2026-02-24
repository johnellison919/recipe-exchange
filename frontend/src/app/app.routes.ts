import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest.guard';
import { authGuard } from './core/guards/auth.guard';
import { RecipeFeedComponent } from './features/recipes/recipe-feed/recipe-feed.component';

export const routes: Routes = [
  {
    path: '',
    component: RecipeFeedComponent,
    title: 'Recipe Exchange',
  },
  {
    path: 'recipes/new',
    loadComponent: () =>
      import(
        './features/recipes/recipe-create/recipe-create.component'
      ).then((m) => m.RecipeCreateComponent),
    title: 'New Recipe - Recipe Exchange',
    canActivate: [authGuard],
  },
  {
    path: 'recipes/:id/edit',
    loadComponent: () =>
      import(
        './features/recipes/recipe-create/recipe-create.component'
      ).then((m) => m.RecipeCreateComponent),
    title: 'Edit Recipe - Recipe Exchange',
    canActivate: [authGuard],
  },
  {
    path: 'recipes/:id/:slug',
    loadComponent: () =>
      import(
        './features/recipes/recipe-detail/recipe-detail.component'
      ).then((m) => m.RecipeDetailComponent),
  },
  {
    path: 'saved',
    loadComponent: () =>
      import('./features/saved/saved-recipes.component').then(
        (m) => m.SavedRecipesComponent
      ),
    title: 'Saved Recipes - Recipe Exchange',
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
    title: 'Settings - Recipe Exchange',
    canActivate: [authGuard],
  },
  {
    path: 'confirm-email-change',
    loadComponent: () =>
      import(
        './features/auth/confirm-email-change/confirm-email-change.component'
      ).then((m) => m.ConfirmEmailChangeComponent),
    title: 'Confirm Email Change - Recipe Exchange',
    canActivate: [authGuard],
  },
  {
    path: 'profile/:username',
    loadComponent: () =>
      import('./features/profile/user-profile.component').then(
        (m) => m.UserProfileComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    title: 'Register - Recipe Exchange',
    canActivate: [guestGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
    title: 'Login - Recipe Exchange',
    canActivate: [guestGuard],
  },
  {
    path: 'confirm-email',
    loadComponent: () =>
      import(
        './features/auth/confirm-email/confirm-email.component'
      ).then((m) => m.ConfirmEmailComponent),
    title: 'Confirm Email - Recipe Exchange',
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import(
        './features/auth/forgot-password/forgot-password.component'
      ).then((m) => m.ForgotPasswordComponent),
    title: 'Forgot Password - Recipe Exchange',
    canActivate: [guestGuard],
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import(
        './features/auth/reset-password/reset-password.component'
      ).then((m) => m.ResetPasswordComponent),
    title: 'Reset Password - Recipe Exchange',
    canActivate: [guestGuard],
  },
];
