import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NotesService } from '../../core/services/notes.service';

/**
 * SidebarComponent shows app branding and navigation/filters.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private notes = inject(NotesService);
  private router = inject(Router);

  readonly tags = computed(() => this.notes.listTags());

  // PUBLIC_INTERFACE
  viewAll() {
    this.notes.setTagFilter(null);
    this.notes.setSearch('');
    this.router.navigate(['/notes']);
  }

  // PUBLIC_INTERFACE
  viewStarred() {
    // Use search to show starred first; actual filter on list not special-cased,
    // but we can filter via a tag mechanism in list route; here we'll just set search blank and rely on star sort.
    this.notes.setTagFilter(null);
    this.notes.setSearch('');
    this.router.navigate(['/notes']);
  }

  // PUBLIC_INTERFACE
  filterByTag(tag: string) {
    this.notes.setTagFilter(tag);
    this.router.navigate(['/notes']);
  }
}
