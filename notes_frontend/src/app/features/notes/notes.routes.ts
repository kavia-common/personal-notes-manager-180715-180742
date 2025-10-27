import { Routes } from '@angular/router';

export const NOTES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./notes-list/notes-list.component').then((m) => m.NotesListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./note-editor/note-editor.component').then((m) => m.NoteEditorComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./note-editor/note-editor.component').then((m) => m.NoteEditorComponent),
  },
];
