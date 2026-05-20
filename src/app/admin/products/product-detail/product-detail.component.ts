import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Product, Category, Review } from '../../../models';
import { CardComponent } from '../../../shared/components/base/card/card.component';
import { BadgeComponent } from '../../../shared/components/base/badge/badge.component';
import { SpinnerComponent } from '../../../shared/components/base/spinner/spinner.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, BadgeComponent, SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(true);
  product = signal<Product | null>(null);
  category = signal<Category | null>(null);
  reviews = signal<Review[]>([]);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/admin/products']); return; }
    await this.loadProduct(id);
  }

  async loadProduct(id: string) {
    this.loading.set(true);
    try {
      const product = await this.supabase.getProduct(id);
      if (!product) { this.router.navigate(['/admin/products']); return; }
      this.product.set(product);

      const cats = await this.supabase.getCategories();
      this.category.set(cats.find(c => c.id === product.category_id) || null);

      const reviews = await this.supabase.getProductReviews(id);
      this.reviews.set(reviews);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      this.loading.set(false);
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
  }

  goBack() {
    this.router.navigate(['/admin/products']);
  }
}