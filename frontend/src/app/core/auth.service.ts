import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, delay, map } from 'rxjs';
import { User, UserLogin, UserRegistration, AuthResponse } from '../models/user.model';

const MOCK_USERS: User[] = [
  {
    id: 'user_1',
    username: 'johndoe',
    email: 'john@example.com',
    displayName: 'John Doe',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'user_2',
    username: 'janesmith',
    email: 'jane@example.com',
    displayName: 'Jane Smith',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    createdAt: new Date('2024-02-20'),
  },
];

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // State signals
  private readonly currentUserSignal = signal<User | null>(null);
  private readonly authLoadingSignal = signal<boolean>(false);
  private readonly authErrorSignal = signal<string | null>(null);

  // Public readonly signals
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly authLoading = this.authLoadingSignal.asReadonly();
  readonly authError = this.authErrorSignal.asReadonly();

  // Computed signals
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  constructor() {
    this.initialize();
  }

  /**
   * Initialize auth state from localStorage
   */
  private initialize(): void {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');

    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        // Convert date strings back to Date objects
        user.createdAt = new Date(user.createdAt);
        this.currentUserSignal.set(user);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.logout();
      }
    }
  }

  /**
   * Log in with email and password
   */
  login(credentials: UserLogin): Observable<AuthResponse> {
    this.authLoadingSignal.set(true);
    this.authErrorSignal.set(null);

    // TODO: Replace with real API call
    // return this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
    return this.getUserByEmail(credentials.email).pipe(
      delay(500),
      map((user) => {
        if (!user) {
          this.authLoadingSignal.set(false);
          this.authErrorSignal.set('Invalid email or password');
          throw new Error('Invalid email or password');
        }

        const token = this.generateMockToken();
        const authResponse: AuthResponse = {
          user,
          token,
        };

        this.setAuthData(user, token);
        this.authLoadingSignal.set(false);

        return authResponse;
      }),
    );
  }

  /**
   * Register a new user
   */
  register(registration: UserRegistration): Observable<AuthResponse> {
    this.authLoadingSignal.set(true);
    this.authErrorSignal.set(null);

    // TODO: Replace with real API call
    // return this.http.post<AuthResponse>('/api/auth/register', registration).pipe(
    return this.getUserByEmail(registration.email).pipe(
      delay(500),
      map((existingUser) => {
        if (existingUser) {
          this.authLoadingSignal.set(false);
          this.authErrorSignal.set('Email already registered');
          throw new Error('Email already registered');
        }

        const newUser: User = {
          id: this.generateMockId(),
          username: registration.username,
          email: registration.email,
          displayName: registration.displayName,
          avatarUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
          createdAt: new Date(),
        };

        const token = this.generateMockToken();
        const authResponse: AuthResponse = {
          user: newUser,
          token,
        };

        this.setAuthData(newUser, token);
        this.authLoadingSignal.set(false);

        return authResponse;
      }),
    );
  }

  /**
   * Log out the current user
   */
  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.router.navigate(['/']);
  }

  /**
   * Clear auth error
   */
  clearError(): void {
    this.authErrorSignal.set(null);
  }

  /**
   * Set auth data in memory and localStorage
   */
  private setAuthData(user: User, token: string): void {
    this.currentUserSignal.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('authToken', token);
  }

  /**
   * Look up a user by email
   */
  // TODO: Replace with real API call
  // private getUserByEmail(email: string): Observable<User | null> {
  //   return this.http.get<User | null>(`/api/users?email=${email}`);
  // }
  private getUserByEmail(email: string): Observable<User | null> {
    const user = MOCK_USERS.find((u) => u.email === email) ?? null;
    return of(user);
  }

  /**
   * Generate a mock authentication token
   */
  private generateMockToken(): string {
    return 'mock_token_' + Math.random().toString(36).substring(2);
  }

  /**
   * Generate a mock user ID
   */
  private generateMockId(): string {
    return 'user_' + Math.random().toString(36).substring(2);
  }
}
