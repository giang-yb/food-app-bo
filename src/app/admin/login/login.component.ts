import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 class="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        <form (ngSubmit)="signIn()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input [(ngModel)]="email" name="email" type="email" required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Password</label>
            <input [(ngModel)]="password" name="password" type="password" required
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <button type="submit" [disabled]="loading"
            class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
          <p *ngIf="error" class="text-red-500 text-sm text-center">{{ error }}</p>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private supabase: SupabaseService, private router: Router) {}

  async signIn() {
    this.loading = true;
    this.error = '';
    try {
      const { user } = await this.supabase.signIn(this.email, this.password);
      if (user) {
        this.router.navigate(['/admin']);
      }
    } catch (e: any) {
      this.error = e.message || 'Sign in failed';
    } finally {
      this.loading = false;
    }
  }
}