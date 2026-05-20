export * from './product.model';
export * from './category.model';
export * from './order.model';
export * from './user.model';
export * from './promotion.model';
export * from './review.model';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}