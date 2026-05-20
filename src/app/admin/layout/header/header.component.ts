import { Component, Output, EventEmitter, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';
import { AvatarComponent } from '../../../shared/components/base/avatar/avatar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  userMenuOpen = false;

  async signOut() {
    await this.supabase.signOut();
    this.router.navigate(['/admin/login']);
  }
}