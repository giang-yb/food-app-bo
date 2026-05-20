export interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  image_url?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}