import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
    { label: 'Sản phẩm', icon: 'products', route: '/admin/products' },
    { label: 'Danh mục', icon: 'categories', route: '/admin/categories' },
    { label: 'Đơn hàng', icon: 'orders', route: '/admin/orders' },
    { label: 'Người dùng', icon: 'users', route: '/admin/users' },
    { label: 'Khuyến mãi', icon: 'promotions', route: '/admin/promotions' },
  ];

  toggle() {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }
}