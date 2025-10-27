import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../../../core/services/notes.service';
import { TagInputComponent } from '../../../shared/components/tag-input/tag-input.component';

/**
 * NoteEditorComponent allows creating or editing a note.
 */
@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TagInputComponent],
  templateUrl: './note-editor.component.html',
  styleUrl: './note-editor.component.scss',
})
export class NoteEditorComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notes = inject(NotesService);

  readonly noteId = signal<string | null>(null);
  title = '';
  content = '';
  tags = signal<string[]>([]);
  isExisting = signal(false);

  constructor() {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id || id === 'new') {
        this.noteId.set(null);
        this.isExisting.set(false);
        this.title = '';
        this.content = '';
        this.tags.set([]);
      } else {
        this.noteId.set(id);
        const n = this.notes.getById(id);
        if (n) {
          this.isExisting.set(true);
          this.title = n.title;
          this.content = n.content;
          this.tags.set([...n.tags]);
        } else {
          // if not found, navigate to list
          this.router.navigate(['/notes']);
        }
      }
    });
  }

  // PUBLIC_INTERFACE
  onSave() {
    const payload = {
      title: this.title.trim(),
      content: this.content.trim(),
      tags: this.tags(),
    };
    if (this.noteId()) {
      this.notes.update(this.noteId()!, payload);
    } else {
      const n = this.notes.create(payload);
      this.noteId.set(n.id);
    }
    this.router.navigate(['/notes']);
  }

  // PUBLIC_INTERFACE
  onCancel() {
    this.router.navigate(['/notes']);
  }

  // PUBLIC_INTERFACE
  removeNote() {
    const g = (typeof globalThis !== 'undefined' ? (globalThis as unknown as Record<string, unknown>) : {}) as {
      confirm?: (msg?: string) => boolean;
    };
    const ok = this.noteId() ? (g.confirm ? g.confirm('Delete this note?') : true) : false;
    if (ok && this.noteId()) {
      this.notes.delete(this.noteId()!);
      this.router.navigate(['/notes']);
    }
  }
}
