import { Pipe, PipeTransform } from '@angular/core';

/**
 * HighlightPipe wraps occurrences of a query string in a text with <mark>.
 */
@Pipe({ name: 'highlight', standalone: true })
export class HighlightPipe implements PipeTransform {
  // PUBLIC_INTERFACE
  transform(text: string, query: string): string {
    if (!query) return text;
    const q = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${q})`, 'gi'), '<mark>$1</mark>');
  }
}
