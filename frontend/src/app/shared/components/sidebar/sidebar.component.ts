import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { ProfileContextService } from '../../../core/profile-context.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  protected readonly authService = inject(AuthService);
  protected readonly profileContext = inject(ProfileContextService);
  private readonly router = inject(Router);

  protected get isOnNewRecipePage(): boolean {
    return this.router.url === '/recipes/new';
  }
}
