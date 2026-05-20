import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import { Order, OrderStatus } from '../../models';
import { BadgeComponent } from '../../shared/components/base/badge/badge.component';
import { SpinnerComponent } from '../../shared/components/base/spinner/spinner.component';
import { ModalComponent } from '../../shared/components/base/modal/modal.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BadgeComponent, SpinnerComponent, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  private supabase = inject(SupabaseService);

  loading = signal(true);
  orders = signal<Order[]>([]);
  selectedStatus = signal<OrderStatus | ''>('');
  detailModalOpen = signal(false);
  selectedOrder = signal<Order | null>(null);

  statuses: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'];

  async ngOnInit() {
    await this.loadOrders();
  }

  async loadOrders() {
    this.loading.set(true);
    try {
      const filters = this.selectedStatus() ? { status: this.selectedStatus() as OrderStatus } : {};
      const data = await this.supabase.getOrders(filters);
      this.orders.set(data.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      this.loading.set(false);
    }
  }

  onStatusFilter() {
    this.loadOrders();
  }

  openDetail(order: Order) {
    this.selectedOrder.set(order);
    this.detailModalOpen.set(true);
  }

  async updateStatus(order: Order, status: OrderStatus) {
    try {
      await this.supabase.updateOrderStatus(order.id, status);
      await this.loadOrders();
      if (this.selectedOrder()?.id === order.id) {
        this.selectedOrder.set({ ...order, status });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }

  getStatusVariant(status: string): 'success' | 'warning' | 'danger' | 'info' | 'gray' {
    const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'gray'> = {
      delivered: 'success', confirmed: 'info', preparing: 'warning',
      delivering: 'info', pending: 'warning', cancelled: 'danger'
    };
    return map[status] || 'gray';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}