import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  protected readonly registerForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected readonly registrationSuccess = signal(false);
  protected readonly resendLoading = signal(false);

  get authError() {
    return this.authService.authError();
  }

  get authLoading() {
    return this.authService.authLoading();
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const registration = this.registerForm.value as any;
    this.authService.register(registration).subscribe({
      next: () => {
        this.registrationSuccess.set(true);
      },
      error: (error) => {
        console.error('Registration failed:', error);
      },
    });
  }

  resendConfirmation(): void {
    const email = this.registerForm.value.email;
    if (!email) return;

    this.resendLoading.set(true);
    this.authService.resendConfirmation(email).subscribe({
      next: () => this.resendLoading.set(false),
      error: () => this.resendLoading.set(false),
    });
  }
}
