import { Injectable, signal } from '@angular/core';

export interface RecentlyViewedEntry {
  id: string;
  title: string;
}

const STORAGE_KEY = 'recently_viewed_recipes';
const MAX_ENTRIES = 5;

@Injectable({
  providedIn: 'root',
})
export class RecentlyViewedService {
  private readonly entriesSignal = signal<RecentlyViewedEntry[]>(this.load());

  readonly entries = this.entriesSignal.asReadonly();

  add(entry: RecentlyViewedEntry): void {
    const current = this.entriesSignal();
    if (current.some((e) => e.id === entry.id)) {
      return;
    }
    const updated = [entry, ...current].slice(0, MAX_ENTRIES);
    this.entriesSignal.set(updated);
    this.save(updated);
  }

  private load(): RecentlyViewedEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private save(entries: RecentlyViewedEntry[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }
}
