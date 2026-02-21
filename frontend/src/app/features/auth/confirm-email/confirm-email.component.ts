import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-confirm-email',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="confirm-email">
      <div class="confirm-email-container">
        @if (loading()) {
          <h1>Confirming your email...</h1>
          <p class="subtitle">Please wait while we verify your email address.</p>
        } @else if (success()) {
          <h1>Email Confirmed!</h1>
          <p class="subtitle">Your email has been confirmed successfully. You can now log in to your account.</p>
          <a routerLink="/login" class="button button-primary submit-button">Go to Login</a>
        } @else {
          <h1>Confirmation Failed</h1>
          <div class="error-message">{{ errorMessage() }}</div>
          <a routerLink="/login" class="button button-primary submit-button">Go to Login</a>
        }
      </div>
    </div>
  `,
  styles: `
    .confirm-email {
      display: flex;
      justify-content: center;
      padding: 2rem 1rem;
    }
    .confirm-email-container {
      max-width: 420px;
      width: 100%;
      background: var(--color-white);
      border: 1px solid var(--color-gray-200);
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
    }
    .subtitle {
      color: var(--color-gray-500);
      margin: 0.5rem 0 1.5rem;
      font-size: 0.875rem;
    }
    .submit-button {
      display: inline-block;
      margin-top: 1rem;
      text-decoration: none;
    }
  `,
})
export class ConfirmEmailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  protected readonly loading = signal(true);
  protected readonly success = signal(false);
  protected readonly errorMessage = signal('');

  constructor() {
    const email = this.route.snapshot.queryParamMap.get('email') ?? '';
    const token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!email || !token) {
      this.loading.set(false);
      this.errorMessage.set('Invalid confirmation link.');
      return;
    }

    this.authService.confirmEmail(email, token).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.error ?? 'Confirmation failed.');
      },
    });
  }
}
