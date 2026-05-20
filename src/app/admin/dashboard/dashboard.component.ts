import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import { CardComponent } from '../../shared/components/base/card/card.component';
import { SpinnerComponent } from '../../shared/components/base/spinner/spinner.component';
import { BadgeComponent } from '../../shared/components/base/badge/badge.component';

interface StatCard {
  label: string;
  value: number;
  icon: string;
  color: string;
  suffix?: string;
}

interface RecentOrder {
  id: string;
  user_email: string;
  status: string;
  total: number;
  created_at: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, SpinnerComponent, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private supabase = inject(SupabaseService);

  loading = signal(true);
  stats = signal<StatCard[]>([]);
  recentOrders = signal<RecentOrder[]>([]);

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    try {
      const [statsData, ordersData] = await Promise.all([
        this.supabase.getStats(),
        this.supabase.getOrders({ per_page: 10 })
      ]);

      this.stats.set([
        { label: 'Tổng đơn hàng', value: statsData.totalOrders, icon: 'orders', color: 'blue' },
        { label: 'Doanh thu tháng', value: statsData.monthlyRevenue, icon: 'revenue', color: 'green', suffix: 'đ' },
        { label: 'Người dùng mới', value: statsData.newUsers, icon: 'users', color: 'purple' },
        { label: 'Sản phẩm', value: statsData.totalProducts, icon: 'products', color: 'orange' },
      ]);

      this.recentOrders.set(ordersData.data.map(o => ({
        id: o.id,
        user_email: o.user_id,
        status: o.status,
        total: o.total,
        created_at: new Date(o.created_at).toLocaleDateString('vi-VN')
      })));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      this.loading.set(false);
    }
  }

  getStatusVariant(status: string): 'success' | 'warning' | 'danger' | 'info' | 'gray' {
    const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'gray'> = {
      delivered: 'success',
      confirmed: 'info',
      preparing: 'warning',
      delivering: 'info',
      pending: 'warning',
      cancelled: 'danger'
    };
    return map[status] || 'gray';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
  }
}