import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div *ngIf="title" class="px-6 py-4 border-b border-gray-100 font-semibold text-gray-900">
        {{ title }}
        <span *ngIf="subtitle" class="block text-sm font-normal text-gray-500">{{ subtitle }}</span>
      </div>
      <div class="p-6">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class CardComponent {
  @Input() title = '';
  @Input() subtitle = '';
}