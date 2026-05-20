import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Product, Category } from '../../../models';
import { CardComponent } from '../../../shared/components/base/card/card.component';
import { BtnComponent } from '../../../shared/components/base/btn/btn.component';
import { InputComponent } from '../../../shared/components/base/input/input.component';
import { SpinnerComponent } from '../../../shared/components/base/spinner/spinner.component';
import { BadgeComponent } from '../../../shared/components/base/badge/badge.component';
import { ModalComponent } from '../../../shared/components/base/modal/modal.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CardComponent, BtnComponent, InputComponent, SpinnerComponent, BadgeComponent, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  private supabase = inject(SupabaseService);

  loading = signal(true);
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  selectedCategory = signal<string>('');
  searchQuery = signal('');
  deleteModalOpen = signal(false);
  productToDelete = signal<Product | null>(null);

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.loading.set(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        this.supabase.getProducts({ category_id: this.selectedCategory() || undefined, search: this.searchQuery() || undefined }),
        this.supabase.getCategories()
      ]);
      this.products.set(productsData.data);
      this.categories.set(categoriesData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      this.loading.set(false);
    }
  }

  onSearch() {
    this.loadData();
  }

  onCategoryFilter() {
    this.loadData();
  }

  confirmDelete(product: Product) {
    this.productToDelete.set(product);
    this.deleteModalOpen.set(true);
  }

  async deleteProduct() {
    const product = this.productToDelete();
    if (!product) return;
    try {
      await this.supabase.deleteProduct(product.id);
      this.deleteModalOpen.set(false);
      this.productToDelete.set(null);
      this.loadData();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
  }

  getCategoryName(categoryId: string): string {
    return this.categories().find(c => c.id === categoryId)?.name || '-';
  }
}