import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Category, CreateProductDto } from '../../../models';
import { BtnComponent } from '../../../shared/components/base/btn/btn.component';
import { InputComponent } from '../../../shared/components/base/input/input.component';
import { SpinnerComponent } from '../../../shared/components/base/spinner/spinner.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, BtnComponent, InputComponent, SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = signal(false);
  categories = signal<Category[]>([]);
  isEditMode = signal(false);
  productId = signal<string | null>(null);

  name = '';
  description = '';
  price: number | null = null;
  category_id = '';
  image_url = '';
  is_available = true;
  imageFile: File | null = null;
  imagePreview = '';

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productId.set(id);
      await this.loadProduct(id);
    }
    await this.loadCategories();
  }

  async loadProduct(id: string) {
    this.loading.set(true);
    try {
      const product = await this.supabase.getProduct(id);
      if (product) {
        this.name = product.name;
        this.description = product.description || '';
        this.price = product.price;
        this.category_id = product.category_id;
        this.image_url = product.image_url || '';
        this.is_available = product.is_available;
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async loadCategories() {
    const cats = await this.supabase.getCategories();
    this.categories.set(cats);
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.imageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => this.imagePreview = e.target?.result as string;
    reader.readAsDataURL(file);
  }

  async save() {
    if (!this.name || !this.price || !this.category_id) return;
    this.loading.set(true);
    try {
      let finalImageUrl = this.image_url;
      if (this.imageFile) {
        const path = `products/${Date.now()}-${this.imageFile.name}`;
        finalImageUrl = await this.supabase.uploadImage('images', path, this.imageFile);
      }

      const data: CreateProductDto = {
        name: this.name,
        description: this.description,
        price: this.price,
        category_id: this.category_id,
        image_url: finalImageUrl,
        is_available: this.is_available
      };

      if (this.isEditMode() && this.productId()) {
        await this.supabase.updateProduct(this.productId()!, data);
      } else {
        await this.supabase.createProduct(data);
      }
      this.router.navigate(['/admin/products']);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      this.loading.set(false);
    }
  }

  goBack() {
    this.router.navigate(['/admin/products']);
  }
}