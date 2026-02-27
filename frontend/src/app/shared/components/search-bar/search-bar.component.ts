import { Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { RecipeService } from '../../../core/recipe.service';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent implements OnInit {
  private readonly recipeService = inject(RecipeService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly searchQuery = signal('');
  private readonly searchInput$ = new Subject<string>();

  readonly searched = output<void>();

  ngOnInit(): void {
    this.searchInput$
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((query) => {
        this.recipeService.setSearchQuery(query);
        if (this.router.url !== '/') {
          this.router.navigate(['/']);
        }
      });
  }

  protected onSearchInput(value: string): void {
    this.searchQuery.set(value);
    this.searchInput$.next(value);
  }

  protected search(): void {
    this.recipeService.setSearchQuery(this.searchQuery());
    if (this.router.url !== '/') {
      this.router.navigate(['/']);
    }
    this.searched.emit();
  }
}
