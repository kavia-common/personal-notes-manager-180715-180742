import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * NotesComponent acts as a host for notes feature routes.
 */
@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss',
})
export class NotesComponent {}
