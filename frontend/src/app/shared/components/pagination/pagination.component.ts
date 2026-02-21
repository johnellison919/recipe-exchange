import { Component, computed, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  totalItems = input.required<number>();
  currentPage = input.required<number>();
  pageSize = input<number>(12);

  pageChange = output<number>();

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalItems() / this.pageSize())),
  );

  protected readonly rangeText = computed(() => {
    const total = this.totalItems();
    if (total === 0) return '0 items';
    const start = (this.currentPage() - 1) * this.pageSize() + 1;
    const end = Math.min(this.currentPage() * this.pageSize(), total);
    return `${start}\u2013${end} of ${total}`;
  });

  protected readonly pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const set: number[] = [];
    const addPage = (p: number) => {
      if (!set.includes(p) && p >= 1 && p <= total) set.push(p);
    };
    addPage(1);
    for (let i = current - 1; i <= current + 1; i++) addPage(i);
    addPage(total);
    set.sort((a, b) => a - b);

    const result: number[] = [];
    for (let i = 0; i < set.length; i++) {
      if (i > 0 && set[i] - set[i - 1] > 1) result.push(-1);
      result.push(set[i]);
    }
    return result;
  });

  protected goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) return;
    this.pageChange.emit(page);
  }
}
