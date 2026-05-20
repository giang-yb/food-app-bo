export type DiscountType = 'percent' | 'fixed';

export interface Promotion {
  id: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order: number | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
  promotion_products?: PromotionProduct[];
  created_at: string;
}

export interface PromotionProduct {
  promotion_id: string;
  product_id: string;
}

export interface CreatePromotionDto {
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order?: number;
  start_date: string;
  end_date: string;
  is_active?: boolean;
}

export interface UpdatePromotionDto extends Partial<CreatePromotionDto> {}