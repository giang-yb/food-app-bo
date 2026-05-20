import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="wrapperClasses">
      <svg [class]="svgClasses" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      <span *ngIf="label && label !== 'overlay'" class="ml-2 text-sm text-gray-500">{{ label }}</span>
    </div>
  `
})
export class SpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() label = '';

  get wrapperClasses(): string {
    const overlay = this.label === 'overlay' ? 'fixed inset-0 bg-white/80 flex items-center justify-center z-50' : 'flex items-center';
    return overlay;
  }

  get svgClasses(): string {
    const sizes = { sm: 'w-4 h-4 animate-spin', md: 'w-6 h-6 animate-spin', lg: 'w-8 h-8 animate-spin' };
    const color = 'text-blue-600';
    return `${sizes[this.size]} ${color}`;
  }
}