import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { User, UserLogin, UserRegistration } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly currentUserSignal = signal<User | null>(null);
  private readonly authLoadingSignal = signal<boolean>(false);
  private readonly authErrorSignal = signal<string | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly authLoading = this.authLoadingSignal.asReadonly();
  readonly authError = this.authErrorSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    // Restore user from localStorage for instant display, then verify with server
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        user.createdAt = new Date(user.createdAt);
        this.currentUserSignal.set(user);
      } catch {
        localStorage.removeItem('currentUser');
      }
    }

    // Verify the cookie session is still valid
    this.http.get<User>('/api/auth/me').subscribe({
      next: (user) => {
        user.createdAt = new Date(user.createdAt);
        this.currentUserSignal.set(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      },
      error: () => {
        this.currentUserSignal.set(null);
        localStorage.removeItem('currentUser');
      },
    });
  }

  login(credentials: UserLogin): Observable<User> {
    this.authLoadingSignal.set(true);
    this.authErrorSignal.set(null);

    return this.http.post<User>('/api/auth/login', credentials).pipe(
      map((user) => {
        user.createdAt = new Date(user.createdAt);
        this.currentUserSignal.set(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.authLoadingSignal.set(false);
        return user;
      }),
      catchError((err) => {
        const message = err.error?.error ?? 'Invalid email or password';
        this.authErrorSignal.set(message);
        this.authLoadingSignal.set(false);
        return throwError(() => err);
      }),
    );
  }

  register(registration: UserRegistration): Observable<{ message: string }> {
    this.authLoadingSignal.set(true);
    this.authErrorSignal.set(null);

    return this.http.post<{ message: string }>('/api/auth/register', registration).pipe(
      map((response) => {
        this.authLoadingSignal.set(false);
        return response;
      }),
      catchError((err) => {
        const message = err.error?.error ?? 'Registration failed';
        this.authErrorSignal.set(message);
        this.authLoadingSignal.set(false);
        return throwError(() => err);
      }),
    );
  }

  confirmEmail(email: string, token: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/auth/confirm-email', { email, token });
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/auth/forgot-password', { email });
  }

  resetPassword(email: string, token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/auth/reset-password', { email, token, newPassword });
  }

  resendConfirmation(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/auth/resend-confirmation', { email });
  }

  logout(): void {
    this.http.post('/api/auth/logout', {}).subscribe({
      complete: () => {
        this.currentUserSignal.set(null);
        localStorage.removeItem('currentUser');
        this.router.navigate(['/']);
      },
    });
  }

  changeEmail(newEmail: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/auth/change-email', { newEmail });
  }

  confirmEmailChange(token: string): Observable<{ message: string; user: User }> {
    return this.http
      .post<{ message: string; user: User }>('/api/auth/confirm-email-change', { token })
      .pipe(
        map((response) => {
          response.user.createdAt = new Date(response.user.createdAt);
          this.updateCurrentUser(response.user);
          return response;
        }),
      );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  updateAvatar(avatarUrl: string | null): Observable<User> {
    return this.http.put<User>('/api/auth/avatar', { avatarUrl }).pipe(
      map((user) => {
        user.createdAt = new Date(user.createdAt);
        this.updateCurrentUser(user);
        return user;
      }),
    );
  }

  updateCurrentUser(user: User): void {
    this.currentUserSignal.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  clearError(): void {
    this.authErrorSignal.set(null);
  }
}
