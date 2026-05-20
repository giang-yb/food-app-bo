import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase.service';
import { Promotion, CreatePromotionDto, Product } from '../../models';
import { CardComponent } from '../../shared/components/base/card/card.component';
import { BadgeComponent } from '../../shared/components/base/badge/badge.component';
import { SpinnerComponent } from '../../shared/components/base/spinner/spinner.component';
import { ModalComponent } from '../../shared/components/base/modal/modal.component';
import { BtnComponent } from '../../shared/components/base/btn/btn.component';

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, BadgeComponent, SpinnerComponent, ModalComponent, BtnComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss']
})
export class PromotionsComponent implements OnInit {
  private supabase = inject(SupabaseService);

  loading = signal(true);
  promotions = signal<Promotion[]>([]);
  products = signal<Product[]>([]);
  modalOpen = signal(false);
  deleteModalOpen = signal(false);
  assignModalOpen = signal(false);
  editMode = signal(false);
  selectedPromotion = signal<Promotion | null>(null);

  formCode = '';
  formDiscountType: 'percent' | 'fixed' = 'percent';
  formDiscountValue: number | null = null;
  formMinOrder: number | null = null;
  formStartDate = '';
  formEndDate = '';
  formIsActive = true;
  selectedProductIds = signal<string[]>([]);

  async ngOnInit() {
    await this.loadPromotions();
  }

  async loadPromotions() {
    this.loading.set(true);
    try {
      const data = await this.supabase.getPromotions();
      this.promotions.set(data.data);
    } catch (error) {
      console.error('Error loading promotions:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async loadProducts() {
    const data = await this.supabase.getProducts({ per_page: 100 });
    this.products.set(data.data);
  }

  openAddModal() {
    this.editMode.set(false);
    this.selectedPromotion.set(null);
    this.formCode = '';
    this.formDiscountType = 'percent';
    this.formDiscountValue = null;
    this.formMinOrder = null;
    this.formStartDate = '';
    this.formEndDate = '';
    this.formIsActive = true;
    this.modalOpen.set(true);
  }

  openEditModal(promo: Promotion) {
    this.editMode.set(true);
    this.selectedPromotion.set(promo);
    this.formCode = promo.code;
    this.formDiscountType = promo.discount_type;
    this.formDiscountValue = promo.discount_value;
    this.formMinOrder = promo.min_order;
    this.formStartDate = promo.start_date;
    this.formEndDate = promo.end_date;
    this.formIsActive = promo.is_active;
    this.modalOpen.set(true);
  }

  async openAssignModal(promo: Promotion) {
    this.selectedPromotion.set(promo);
    this.selectedProductIds.set(promo.promotion_products?.map(p => p.product_id) || []);
    await this.loadProducts();
    this.assignModalOpen.set(true);
  }

  confirmDelete(promo: Promotion) {
    this.selectedPromotion.set(promo);
    this.deleteModalOpen.set(true);
  }

  async toggleActive(promo: Promotion) {
    try {
      await this.supabase.updatePromotion(promo.id, { is_active: !promo.is_active });
      await this.loadPromotions();
    } catch (error) {
      console.error('Error toggling promotion:', error);
    }
  }

  async save() {
    if (!this.formCode || !this.formDiscountValue || !this.formStartDate || !this.formEndDate) return;
    this.loading.set(true);
    try {
      const data: CreatePromotionDto = {
        code: this.formCode,
        discount_type: this.formDiscountType,
        discount_value: this.formDiscountValue,
        min_order: this.formMinOrder || undefined,
        start_date: this.formStartDate,
        end_date: this.formEndDate,
        is_active: this.formIsActive
      };
      if (this.editMode() && this.selectedPromotion()) {
        await this.supabase.updatePromotion(this.selectedPromotion()!.id, data);
      } else {
        await this.supabase.createPromotion(data);
      }
      this.modalOpen.set(false);
      await this.loadPromotions();
    } catch (error) {
      console.error('Error saving promotion:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async assignProducts() {
    const promo = this.selectedPromotion();
    if (!promo) return;
    try {
      await this.supabase.assignProductsToPromotion(promo.id, this.selectedProductIds());
      this.assignModalOpen.set(false);
      await this.loadPromotions();
    } catch (error) {
      console.error('Error assigning products:', error);
    }
  }

  async deletePromotion() {
    const promo = this.selectedPromotion();
    if (!promo) return;
    try {
      await this.supabase.deletePromotion(promo.id);
      this.deleteModalOpen.set(false);
      await this.loadPromotions();
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  }

  isExpired(promo: Promotion): boolean {
    return new Date(promo.end_date) < new Date();
  }

  isExpiringSoon(promo: Promotion): boolean {
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    const endDate = new Date(promo.end_date);
    return endDate > new Date() && (endDate.getTime() - new Date().getTime()) < threeDays;
  }

  formatDiscount(promo: Promotion): string {
    if (promo.discount_type === 'percent') return `${promo.discount_value}%`;
    return new Intl.NumberFormat('vi-VN').format(promo.discount_value) + 'đ';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  toggleProductSelection(id: string): string[] {
    const current = this.selectedProductIds();
    if (current.includes(id)) return current.filter(i => i !== id);
    return [...current, id];
  }
}