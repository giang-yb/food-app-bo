import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DropdownItem {
  label: string;
  icon?: string;
  action?: () => void;
  divider?: boolean;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative">
      <button (click)="toggle()" class="flex items-center gap-2">
        <ng-content></ng-content>
      </button>
      <div *ngIf="open" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
        <ng-container *ngFor="let item of items">
          <div *ngIf="item.divider" class="border-t border-gray-100 my-1"></div>
          <button *ngIf="!item.divider"
            (click)="selectItem(item)"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
            <span *ngIf="item.label">{{ item.label }}</span>
          </button>
        </ng-container>
      </div>
    </div>
  `
})
export class DropdownComponent {
  @Input() items: DropdownItem[] = [];
  open = false;

  @Output() selected = new EventEmitter<DropdownItem>();

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent) {
    // handled by template
  }

  toggle() { this.open = !this.open; }

  selectItem(item: DropdownItem) {
    this.open = false;
    if (item.action) item.action();
    this.selected.emit(item);
  }
}