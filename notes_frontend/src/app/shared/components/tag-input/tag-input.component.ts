import { Component, EventEmitter, Input, Output, forwardRef, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * TagInputComponent provides a chip input for tags.
 */
@Component({
  selector: 'app-tag-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag-input.component.html',
  styleUrl: './tag-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagInputComponent),
      multi: true,
    },
  ],
})
export class TagInputComponent {
  private _tags = signal<string[]>([]);
  @Input()
  set tagsSignal(val: Signal<string[]>) {
    this._tags.set([...val()]);
  }

  @Input()
  get tags(): string[] { return this._tags(); }
  set tags(v: string[]) { this._tags.set(v); this.tagsChange.emit(this._tags()); }

  @Output() tagsChange = new EventEmitter<string[]>();

  inputValue = '';

  // PUBLIC_INTERFACE
  onKeydown(e: any) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      this.addTagFromInput();
    } else if (e.key === 'Backspace' && this.inputValue === '') {
      this.removeLast();
    }
  }

  // PUBLIC_INTERFACE
  addTagFromInput() {
    const raw = this.inputValue.trim().replace(/,/g, '');
    if (!raw) return;
    const set = new Set(this._tags());
    set.add(raw);
    this._tags.set(Array.from(set));
    this.tagsChange.emit(this._tags());
    this.inputValue = '';
  }

  // PUBLIC_INTERFACE
  removeTag(tag: string) {
    this._tags.set(this._tags().filter((t) => t !== tag));
    this.tagsChange.emit(this._tags());
  }

  private removeLast() {
    const curr = [...this._tags()];
    curr.pop();
    this._tags.set(curr);
    this.tagsChange.emit(this._tags());
  }
}
