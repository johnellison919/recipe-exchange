import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/auth.service';
import { Router, RouterLink } from '@angular/router';
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
  private readonly router = inject(Router);

  protected readonly registerForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    displayName: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

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
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
      },
    });
  }
}
