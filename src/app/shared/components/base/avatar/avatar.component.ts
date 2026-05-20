import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="containerClasses">
      <img *ngIf="src && !imgError" [src]="src" [alt]="alt" (error)="imgError = true"
        class="w-full h-full object-cover">
      <span *ngIf="!src || imgError" class="w-full h-full flex items-center justify-center text-sm font-medium"
        [class]="textBgClass">
        {{ initials }}
      </span>
    </div>
  `
})
export class AvatarComponent {
  @Input() src = '';
  @Input() alt = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  imgError = false;

  get containerClasses(): string {
    const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
    return `rounded-full overflow-hidden bg-gray-200 ${sizes[this.size]}`;
  }

  get textBgClass(): string {
    return 'bg-blue-500 text-white';
  }

  get initials(): string {
    if (!this.alt) return '?';
    return this.alt.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}