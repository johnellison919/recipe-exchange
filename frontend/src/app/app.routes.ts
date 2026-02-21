import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register.component';
import { guestGuard } from './core/guards/guest.guard';
import { authGuard } from './core/guards/auth.guard';
import { RecipeFeedComponent } from './features/recipes/recipe-feed/recipe-feed.component';
import { RecipeCreateComponent } from './features/recipes/recipe-create/recipe-create.component';
import { RecipeDetailComponent } from './features/recipes/recipe-detail/recipe-detail.component';
import { LoginComponent } from './features/auth/login/login.component';
import { ConfirmEmailComponent } from './features/auth/confirm-email/confirm-email.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { UserProfileComponent } from './features/profile/user-profile.component';
import { SavedRecipesComponent } from './features/saved/saved-recipes.component';
import { SettingsComponent } from './features/settings/settings.component';
import { ConfirmEmailChangeComponent } from './features/auth/confirm-email-change/confirm-email-change.component';

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
    path: 'saved',
    component: SavedRecipesComponent,
    title: 'Saved Recipes - Recipe Exchange',
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    title: 'Settings - Recipe Exchange',
    canActivate: [authGuard],
  },
  {
    path: 'confirm-email-change',
    component: ConfirmEmailChangeComponent,
    title: 'Confirm Email Change - Recipe Exchange',
    canActivate: [authGuard],
  },
  {
    path: 'profile/:username',
    component: UserProfileComponent,
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
  {
    path: 'confirm-email',
    component: ConfirmEmailComponent,
    title: 'Confirm Email - Recipe Exchange',
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    title: 'Forgot Password - Recipe Exchange',
    canActivate: [guestGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    title: 'Reset Password - Recipe Exchange',
    canActivate: [guestGuard],
  },
];
