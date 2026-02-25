import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { getUserErrorMessage } from '../../../shared/utils/error.util';

@Component({
  selector: 'app-confirm-email-change',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './confirm-email-change.component.html',
  styleUrl: './confirm-email-change.component.css',
})
export class ConfirmEmailChangeComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  protected readonly loading = signal(true);
  protected readonly success = signal(false);
  protected readonly errorMessage = signal('');

  constructor() {
    const token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!token) {
      this.loading.set(false);
      this.errorMessage.set('Invalid confirmation link.');
      return;
    }

    this.authService.confirmEmailChange(token).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(getUserErrorMessage(err, 'Email change confirmation failed.'));
      },
    });
  }
}
