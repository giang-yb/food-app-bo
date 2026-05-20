export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface UserFilters {
  role?: UserRole;
  search?: string;
  page?: number;
  per_page?: number;
}