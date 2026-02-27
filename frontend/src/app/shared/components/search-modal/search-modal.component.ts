import { Component, ElementRef, HostListener, input, output, viewChild } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-search-modal',
  imports: [SearchBarComponent],
  templateUrl: './search-modal.component.html',
  styleUrl: './search-modal.component.css',
})
export class SearchModalComponent {
  readonly isOpen = input.required<boolean>();
  readonly closed = output<void>();

  private readonly searchInput = viewChild<ElementRef>('searchInput');

  protected close(): void {
    this.closed.emit();
  }

  protected onSearched(): void {
    this.closed.emit();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('search-modal-overlay')) {
      this.closed.emit();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.isOpen()) {
      this.closed.emit();
    }
  }
}
