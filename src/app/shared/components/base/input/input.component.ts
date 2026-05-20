import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputComponent), multi: true }],
  template: `
    <div class="w-full">
      <label *ngIf="label" [for]="inputId" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
      <div class="relative">
        <input *ngIf="type !== 'textarea'"
          [id]="inputId"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onTouched()"
          [class]="inputClasses">
        <textarea *ngIf="type === 'textarea'"
          [id]="inputId"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onTouched()"
          [class]="inputClasses"
          rows="4"></textarea>
      </div>
      <p *ngIf="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
    </div>
  `
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'textarea' = 'text';
  @Input() error = '';
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<string>();

  value = '';
  inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
  private onChangeFn: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  get inputClasses(): string {
    const base = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all bg-white';
    const state = this.error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500/50 focus:border-blue-500';
    const disabledClass = this.disabled ? 'bg-gray-100 cursor-not-allowed' : '';
    return `${base} ${state} ${disabledClass}`;
  }

  onInput(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
    this.onChangeFn(this.value);
    this.valueChange.emit(this.value);
  }

  writeValue(v: string) { this.value = v || ''; }
  registerOnChange(fn: (v: string) => void) { this.onChangeFn = fn; }
  registerOnTouched(fn: () => void) { this.onTouched = fn; }
  setDisabledState(d: boolean) { this.disabled = d; }
}