import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase.service';
import { User, UserRole } from '../../models';
import { CardComponent } from '../../shared/components/base/card/card.component';
import { BadgeComponent } from '../../shared/components/base/badge/badge.component';
import { AvatarComponent } from '../../shared/components/base/avatar/avatar.component';
import { SpinnerComponent } from '../../shared/components/base/spinner/spinner.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BadgeComponent, AvatarComponent, SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  private supabase = inject(SupabaseService);

  loading = signal(true);
  users = signal<User[]>([]);
  searchQuery = signal('');

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    this.loading.set(true);
    try {
      const data = await this.supabase.getUsers({ search: this.searchQuery() || undefined });
      this.users.set(data.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      this.loading.set(false);
    }
  }

  onSearch() {
    this.loadUsers();
  }

  getRoleVariant(role: UserRole): 'danger' | 'info' {
    return role === 'admin' ? 'danger' : 'info';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}