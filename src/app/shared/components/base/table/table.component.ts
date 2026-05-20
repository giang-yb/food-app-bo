import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th *ngFor="let col of columns"
              [style.width]="col.width || 'auto'"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr *ngFor="let row of data" class="hover:bg-gray-50 transition-colors">
            <td *ngFor="let col of columns" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <ng-container [ngSwitch]="col.key">
                <ng-container *ngSwitchCase="'actions'">
                  <ng-content></ng-content>
                </ng-container>
                <ng-container *ngSwitchDefault>
                  {{ row[col.key] }}
                </ng-container>
              </ng-container>
            </td>
          </tr>
          <tr *ngIf="data.length === 0">
            <td [attr.colspan]="columns.length" class="px-6 py-12 text-center text-sm text-gray-500">
              <ng-content select="[empty-message]"></ng-content>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Output() sort = new EventEmitter<{ column: string; direction: 'asc' | 'desc' }>();
}