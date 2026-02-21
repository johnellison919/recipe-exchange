import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { getAvatarUrl } from '../../shared/utils/avatar.util';

@Component({
  selector: 'app-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  protected readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  // Avatar
  protected readonly avatarPreview = signal<string>('');
  protected readonly avatarUrl = signal<string | null>(null);
  protected readonly avatarLoading = signal(false);
  protected readonly avatarSuccess = signal<string | null>(null);
  protected readonly avatarError = signal<string | null>(null);
  protected readonly avatarUrlInput = signal('');

  // Email
  protected readonly emailForm = this.fb.group({
    newEmail: ['', [Validators.required, Validators.email]],
  });
  protected readonly emailLoading = signal(false);
  protected readonly emailSuccess = signal<string | null>(null);
  protected readonly emailError = signal<string | null>(null);

  // Password
  protected readonly passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });
  protected readonly passwordLoading = signal(false);
  protected readonly passwordSuccess = signal<string | null>(null);
  protected readonly passwordError = signal<string | null>(null);

  constructor() {
    const user = this.authService.currentUser();
    if (user) {
      this.avatarUrl.set(user.avatarUrl ?? null);
      this.avatarPreview.set(getAvatarUrl(user.avatarUrl, user.username));
    }
  }

  onAvatarUrlChange(url: string): void {
    this.avatarUrlInput.set(url);
    if (url) {
      this.avatarPreview.set(url);
    } else {
      const user = this.authService.currentUser();
      this.avatarPreview.set(getAvatarUrl(null, user?.username ?? ''));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.avatarError.set('Please select an image file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.avatarError.set('Image must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.avatarPreview.set(dataUrl);
      this.avatarUrlInput.set('');
      this.avatarUrl.set(dataUrl);
      this.avatarError.set(null);
    };
    reader.readAsDataURL(file);
  }

  saveAvatar(): void {
    const urlInput = this.avatarUrlInput();
    const newUrl = urlInput || this.avatarUrl();

    this.avatarLoading.set(true);
    this.avatarSuccess.set(null);
    this.avatarError.set(null);

    this.authService.updateAvatar(newUrl).subscribe({
      next: (user) => {
        this.avatarUrl.set(user.avatarUrl ?? null);
        this.avatarPreview.set(getAvatarUrl(user.avatarUrl, user.username));
        this.avatarUrlInput.set('');
        this.avatarLoading.set(false);
        this.avatarSuccess.set('Avatar updated successfully.');
      },
      error: (err) => {
        this.avatarLoading.set(false);
        this.avatarError.set(err.error?.error ?? 'Failed to update avatar.');
      },
    });
  }

  resetAvatar(): void {
    this.avatarLoading.set(true);
    this.avatarSuccess.set(null);
    this.avatarError.set(null);

    this.authService.updateAvatar(null).subscribe({
      next: (user) => {
        this.avatarUrl.set(null);
        this.avatarPreview.set(getAvatarUrl(null, user.username));
        this.avatarUrlInput.set('');
        this.avatarLoading.set(false);
        this.avatarSuccess.set('Avatar reset to default.');
      },
      error: (err) => {
        this.avatarLoading.set(false);
        this.avatarError.set(err.error?.error ?? 'Failed to reset avatar.');
      },
    });
  }

  submitEmail(): void {
    if (this.emailForm.invalid) return;

    this.emailLoading.set(true);
    this.emailSuccess.set(null);
    this.emailError.set(null);

    this.authService.changeEmail(this.emailForm.value.newEmail!).subscribe({
      next: (res) => {
        this.emailLoading.set(false);
        this.emailSuccess.set(res.message);
        this.emailForm.reset();
      },
      error: (err) => {
        this.emailLoading.set(false);
        this.emailError.set(err.error?.error ?? 'Failed to change email.');
      },
    });
  }

  submitPassword(): void {
    if (this.passwordForm.invalid) return;
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      this.passwordError.set('Passwords do not match.');
      return;
    }

    this.passwordLoading.set(true);
    this.passwordSuccess.set(null);
    this.passwordError.set(null);

    this.authService.changePassword(currentPassword!, newPassword!).subscribe({
      next: (res) => {
        this.passwordLoading.set(false);
        this.passwordSuccess.set(res.message);
        this.passwordForm.reset();
      },
      error: (err) => {
        this.passwordLoading.set(false);
        this.passwordError.set(err.error?.error ?? 'Failed to change password.');
      },
    });
  }
}
