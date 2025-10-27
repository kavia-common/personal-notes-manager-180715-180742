import { Injectable, signal, computed } from '@angular/core';
import { Note, createNote } from '../models/note.model';
import { LocalStorageEngine, StorageEngine } from '../storage/local-storage';

/**
 * NotesService provides CRUD operations for notes with localStorage persistence.
 * Designed to be swappable for a backend implementation in the future.
 */
@Injectable({ providedIn: 'root' })
export class NotesService {
  private storage: StorageEngine = new LocalStorageEngine();
  private STORAGE_KEY = 'notes.data.v1';

  private _notes = signal<Note[]>([]);
  readonly notes = computed(() => this._notes());

  private _search = signal<string>('');
  readonly search = computed(() => this._search());

  private _tagFilter = signal<string | null>(null);
  readonly tagFilter = computed(() => this._tagFilter());

  readonly filteredNotes = computed(() => {
    const q = this._search().toLowerCase().trim();
    const tag = this._tagFilter();
    let arr = [...this._notes()];
    if (q) {
      arr = arr.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      );
    }
    if (tag) {
      arr = arr.filter((n) => n.tags.includes(tag));
    }
    // Sort recently updated first, starred prioritized
    arr.sort((a, b) => {
      if (a.starred !== b.starred) return a.starred ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return arr;
  });

  constructor() {
    const data = this.storage.getItem<Note[]>(this.STORAGE_KEY, []);
    this._notes.set(data ?? []);
  }

  // PUBLIC_INTERFACE
  setSearch(query: string): void {
    this._search.set(query);
  }

  // PUBLIC_INTERFACE
  setTagFilter(tag: string | null): void {
    this._tagFilter.set(tag);
  }

  // PUBLIC_INTERFACE
  getById(id: string): Note | undefined {
    return this._notes().find((n) => n.id === id);
  }

  // PUBLIC_INTERFACE
  create(note: Partial<Note>): Note {
    const n = createNote({ ...note });
    this._notes.update((arr) => [n, ...arr]);
    this.persist();
    return n;
  }

  // PUBLIC_INTERFACE
  update(id: string, patch: Partial<Note>): Note | undefined {
    let updated: Note | undefined;
    this._notes.update((arr) =>
      arr.map((n) => {
        if (n.id !== id) return n;
        updated = {
          ...n,
          ...patch,
          updatedAt: new Date().toISOString(),
        };
        return updated!;
      })
    );
    this.persist();
    return updated;
  }

  // PUBLIC_INTERFACE
  delete(id: string): void {
    this._notes.update((arr) => arr.filter((n) => n.id !== id));
    this.persist();
  }

  // PUBLIC_INTERFACE
  toggleStar(id: string): void {
    this.update(id, { starred: !this.getById(id)?.starred });
  }

  // PUBLIC_INTERFACE
  listTags(): string[] {
    const set = new Set<string>();
    this._notes().forEach((n) => n.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  private persist(): void {
    this.storage.setItem(this.STORAGE_KEY, this._notes());
  }
}
