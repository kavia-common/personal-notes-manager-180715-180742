import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotesService } from '../../core/services/notes.service';

/**
 * HeaderComponent provides quick search and primary actions.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private notes = inject(NotesService);
  query = '';

  // PUBLIC_INTERFACE
  onSearch(value: string) {
    this.query = value;
    this.notes.setSearch(value);
  }
}
