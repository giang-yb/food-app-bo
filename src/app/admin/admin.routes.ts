import { Routes } from '@angular/router';
import { adminAuthGuard } from './guards/admin-auth.guard';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    canActivate: [adminAuthGuard],
    loadComponent: () => import('./layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'products',
        children: [
          { path: '', loadComponent: () => import('./products/product-list/product-list.component').then(m => m.ProductListComponent) },
          { path: 'add', loadComponent: () => import('./products/product-form/product-form.component').then(m => m.ProductFormComponent) },
          { path: 'edit/:id', loadComponent: () => import('./products/product-form/product-form.component').then(m => m.ProductFormComponent) },
          { path: ':id', loadComponent: () => import('./products/product-detail/product-detail.component').then(m => m.ProductDetailComponent) }
        ]
      },
      {
        path: 'categories',
        loadComponent: () => import('./categories/categories.component').then(m => m.CategoriesComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./orders/orders.component').then(m => m.OrdersComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'promotions',
        loadComponent: () => import('./promotions/promotions.component').then(m => m.PromotionsComponent)
      }
    ]
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  }
];