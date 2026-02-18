import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class ProfileContextService {
  private readonly profileUser = signal<User | null>(null);

  readonly user = this.profileUser.asReadonly();

  set(user: User): void {
    this.profileUser.set(user);
  }

  clear(): void {
    this.profileUser.set(null);
  }
}
