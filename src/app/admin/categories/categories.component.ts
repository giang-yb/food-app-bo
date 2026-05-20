import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase.service';
import { Category, CreateCategoryDto } from '../../models';
import { SpinnerComponent } from '../../shared/components/base/spinner/spinner.component';
import { ModalComponent } from '../../shared/components/base/modal/modal.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  private supabase = inject(SupabaseService);

  loading = signal(true);
  categories = signal<Category[]>([]);
  modalOpen = signal(false);
  deleteModalOpen = signal(false);
  editMode = signal(false);
  selectedCategory = signal<Category | null>(null);

  formName = '';
  formDescription = '';
  formImageUrl = '';
  imageFile: File | null = null;
  imagePreview = '';

  async ngOnInit() {
    await this.loadCategories();
  }

  async loadCategories() {
    this.loading.set(true);
    try {
      const data = await this.supabase.getCategories();
      this.categories.set(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      this.loading.set(false);
    }
  }

  openAddModal() {
    this.editMode.set(false);
    this.selectedCategory.set(null);
    this.formName = '';
    this.formDescription = '';
    this.formImageUrl = '';
    this.imageFile = null;
    this.imagePreview = '';
    this.modalOpen.set(true);
  }

  openEditModal(cat: Category) {
    this.editMode.set(true);
    this.selectedCategory.set(cat);
    this.formName = cat.name;
    this.formDescription = cat.description || '';
    this.formImageUrl = cat.image_url || '';
    this.imageFile = null;
    this.imagePreview = '';
    this.modalOpen.set(true);
  }

  confirmDelete(cat: Category) {
    this.selectedCategory.set(cat);
    this.deleteModalOpen.set(true);
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
    if (!this.formName) return;
    this.loading.set(true);
    try {
      let imageUrl = this.formImageUrl;
      if (this.imageFile) {
        const path = `categories/${Date.now()}-${this.imageFile.name}`;
        imageUrl = await this.supabase.uploadImage('images', path, this.imageFile);
      }
      const data: CreateCategoryDto = { name: this.formName, description: this.formDescription, image_url: imageUrl };
      if (this.editMode() && this.selectedCategory()) {
        await this.supabase.updateCategory(this.selectedCategory()!.id, data);
      } else {
        await this.supabase.createCategory(data);
      }
      this.modalOpen.set(false);
      await this.loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async deleteCategory() {
    const cat = this.selectedCategory();
    if (!cat) return;
    try {
      await this.supabase.deleteCategory(cat.id);
      this.deleteModalOpen.set(false);
      await this.loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Không thể xóa danh mục này vì đang có sản phẩm');
    }
  }
}