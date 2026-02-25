import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

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
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
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

  remove(id: string): void {
    const updated = this.entriesSignal().filter((e) => e.id !== id);
    this.entriesSignal.set(updated);
    this.save(updated);
  }

  private load(): RecentlyViewedEntry[] {
    if (!this.isBrowser) return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private save(entries: RecentlyViewedEntry[]): void {
    if (!this.isBrowser) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }
}
