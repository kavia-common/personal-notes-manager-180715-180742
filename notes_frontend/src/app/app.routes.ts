import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'notes' },
  {
    path: 'notes',
    loadComponent: () =>
      import('./features/notes/notes.component').then((m) => m.NotesComponent),
    loadChildren: () =>
      import('./features/notes/notes.routes').then((m) => m.NOTES_ROUTES),
  },
  { path: '**', redirectTo: 'notes' },
];
