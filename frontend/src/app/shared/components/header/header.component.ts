import { Component, inject, signal, computed, HostListener, ElementRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { getAvatarUrl } from '../../utils/avatar.util';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  protected readonly authService = inject(AuthService);
  protected readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);

  protected readonly dropdownOpen = signal(false);
  protected readonly avatarSrc = computed(() => {
    const user = this.authService.currentUser();
    return user ? getAvatarUrl(user.avatarUrl, user.username) : '';
  });

  protected toggleDropdown(): void {
    this.dropdownOpen.update((open) => !open);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownOpen.set(false);
    }
  }
}
