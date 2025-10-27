import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotesService } from '../../../core/services/notes.service';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';

/**
 * NotesListComponent displays the searchable/filterable list of notes.
 */
@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule, RouterLink, EmptyStateComponent],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.scss',
})
export class NotesListComponent {
  private notes = inject(NotesService);

  readonly filteredNotes = this.notes.filteredNotes;
  readonly tags = computed(() => this.notes.listTags());

  query = '';
  activeTag: string | null = null;

  // PUBLIC_INTERFACE
  onSearch(value: string) {
    this.query = value;
    this.notes.setSearch(value);
  }

  // PUBLIC_INTERFACE
  selectTag(tag: string | null) {
    this.activeTag = tag;
    this.notes.setTagFilter(tag);
  }

  // PUBLIC_INTERFACE
  toggleStar(id: string) {
    this.notes.toggleStar(id);
  }

  // PUBLIC_INTERFACE
  delete(id: string) {
    const g = (typeof globalThis !== 'undefined' ? (globalThis as unknown as Record<string, unknown>) : {}) as {
      confirm?: (msg?: string) => boolean;
    };
    const ok = g.confirm ? g.confirm('Delete this note?') : true;
    if (ok) {
      this.notes.delete(id);
    }
  }

  // PUBLIC_INTERFACE
  newNoteLink(): string {
    return '/notes/new';
  }

  // PUBLIC_INTERFACE
  editLink(id: string): string {
    return `/notes/${id}`;
  }

  // PUBLIC_INTERFACE
  preview(text: string): string {
    const t = text.replace(/\s+/g, ' ').trim();
    return t.length > 120 ? t.slice(0, 120) + '…' : t;
  }

  // PUBLIC_INTERFACE
  fmtDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString();
  }
}
