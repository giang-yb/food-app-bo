export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string;
  image_url: string | null;
  is_available: boolean;
  product_options?: ProductOption[];
  created_at: string;
  updated_at: string;
}

export interface ProductOption {
  id: string;
  product_id: string;
  name: string;
  price: number;
  created_at: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  category_id: string;
  image_url?: string;
  is_available?: boolean;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface ProductFilters {
  category_id?: string;
  is_available?: boolean;
  search?: string;
  page?: number;
  per_page?: number;
}