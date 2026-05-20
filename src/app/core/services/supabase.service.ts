import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Product, ProductFilters, CreateProductDto, UpdateProductDto,
  Category, CreateCategoryDto, UpdateCategoryDto,
  Order, OrderFilters, OrderStatus,
  User as AppUser, UserFilters, UserRole,
  Promotion, CreatePromotionDto, UpdatePromotionDto,
  Review, PaginatedResult
} from '../../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;
  private _user = new BehaviorSubject<User | null>(null);
  user$ = this._user.asObservable();

  constructor() {
    const supabaseUrl = environment.supabaseUrl;
    const supabaseKey = environment.supabaseKey;
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.getCurrentUser();
  }

  // ============ Auth ============
  async signIn(email: string, password: string): Promise<{ user: User | null; session: Session | null }> {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    this._user.next(data.user);
    return { user: data.user, session: data.session };
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
    this._user.next(null);
  }

  async getCurrentUser(): Promise<User | null> {
    const { data } = await this.supabase.auth.getUser();
    this._user.next(data.user);
    return data.user;
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return this.supabase.auth.onAuthStateChange((_, session) => {
      callback(session?.user ?? null);
    });
  }

  // ============ Products ============
  async getProducts(filters?: ProductFilters): Promise<PaginatedResult<Product>> {
    let query = this.supabase.from('products').select('*', { count: 'exact' });
    if (filters?.category_id) query = query.eq('category_id', filters.category_id);
    if (filters?.is_available !== undefined) query = query.eq('is_available', filters.is_available);
    if (filters?.search) query = query.ilike('name', `%${filters.search}%`);
    if (filters?.page) query = query.range((filters.page - 1) * (filters.per_page || 20), filters.page * (filters.per_page || 20));
    const { data, error, count } = await query;
    if (error) throw error;
    return { data: data || [], total: count || 0, page: filters?.page || 1, per_page: filters?.per_page || 20 };
  }

  async getProduct(id: string): Promise<Product | null> {
    const { data, error } = await this.supabase.from('products').select('*').eq('id', id).single();
    if (error) return null;
    return data;
  }

  async createProduct(data: CreateProductDto): Promise<Product> {
    const { data: result, error } = await this.supabase.from('products').insert(data).select().single();
    if (error) throw error;
    return result;
  }

  async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
    const { data: result, error } = await this.supabase.from('products').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await this.supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  }

  // ============ Categories ============
  async getCategories(): Promise<Category[]> {
    const { data, error } = await this.supabase.from('categories').select('*').order('name');
    if (error) throw error;
    return data || [];
  }

  async createCategory(data: CreateCategoryDto): Promise<Category> {
    const { data: result, error } = await this.supabase.from('categories').insert(data).select().single();
    if (error) throw error;
    return result;
  }

  async updateCategory(id: string, data: UpdateCategoryDto): Promise<Category> {
    const { data: result, error } = await this.supabase.from('categories').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
  }

  async deleteCategory(id: string): Promise<void> {
    const { error } = await this.supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  }

  // ============ Orders ============
  async getOrders(filters?: OrderFilters): Promise<PaginatedResult<Order>> {
    let query = this.supabase.from('orders').select('*, order_items(*)', { count: 'exact' });
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.user_id) query = query.eq('user_id', filters.user_id);
    if (filters?.date_from) query = query.gte('created_at', filters.date_from);
    if (filters?.date_to) query = query.lte('created_at', filters.date_to);
    if (filters?.page) query = query.range((filters.page - 1) * (filters.per_page || 20), filters.page * (filters.per_page || 20));
    const { data, error, count } = await query;
    if (error) throw error;
    return { data: data || [], total: count || 0, page: filters?.page || 1, per_page: filters?.per_page || 20 };
  }

  async getOrder(id: string): Promise<Order | null> {
    const { data, error } = await this.supabase.from('orders').select('*, order_items(*, products(name))').eq('id', id).single();
    if (error) return null;
    return data;
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const { data: result, error } = await this.supabase.from('orders').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return result;
  }

  // ============ Users ============
  async getUsers(filters?: UserFilters): Promise<PaginatedResult<AppUser>> {
    let query = this.supabase.from('users').select('*', { count: 'exact' });
    if (filters?.role) query = query.eq('role', filters.role);
    if (filters?.search) query = query.or(`email.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%`);
    if (filters?.page) query = query.range((filters.page - 1) * (filters.per_page || 20), filters.page * (filters.per_page || 20));
    const { data, error, count } = await this.supabase.from('users').select('*', { count: 'exact' });
    if (error) throw error;
    return { data: data || [], total: count || 0, page: filters?.page || 1, per_page: filters?.per_page || 20 };
  }

  async getUser(id: string): Promise<AppUser | null> {
    const { data, error } = await this.supabase.from('users').select('*').eq('id', id).single();
    if (error) return null;
    return data;
  }

  // ============ Promotions ============
  async getPromotions(): Promise<PaginatedResult<Promotion>> {
    const { data, error, count } = await this.supabase.from('promotions').select('*', { count: 'exact' });
    if (error) throw error;
    return { data: data || [], total: count || 0, page: 1, per_page: 50 };
  }

  async createPromotion(data: CreatePromotionDto): Promise<Promotion> {
    const { data: result, error } = await this.supabase.from('promotions').insert(data).select().single();
    if (error) throw error;
    return result;
  }

  async updatePromotion(id: string, data: UpdatePromotionDto): Promise<Promotion> {
    const { data: result, error } = await this.supabase.from('promotions').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
  }

  async deletePromotion(id: string): Promise<void> {
    const { error } = await this.supabase.from('promotions').delete().eq('id', id);
    if (error) throw error;
  }

  async assignProductsToPromotion(promotionId: string, productIds: string[]): Promise<void> {
    await this.supabase.from('promotion_products').delete().eq('promotion_id', promotionId);
    if (productIds.length === 0) return;
    const rows = productIds.map(pid => ({ promotion_id: promotionId, product_id: pid }));
    const { error } = await this.supabase.from('promotion_products').insert(rows);
    if (error) throw error;
  }

  // ============ Reviews ============
  async getProductReviews(productId: string): Promise<Review[]> {
    const { data, error } = await this.supabase.from('reviews').select('*, users(full_name)').eq('product_id', productId);
    if (error) throw error;
    return data || [];
  }

  // ============ Stats ============
  async getStats(): Promise<{ totalOrders: number; monthlyRevenue: number; newUsers: number; totalProducts: number }> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [ordersRes, usersRes, productsRes] = await Promise.all([
      this.supabase.from('orders').select('total, created_at', { count: 'exact' }),
      this.supabase.from('users').select('*', { count: 'exact' }).gte('created_at', startOfMonth),
      this.supabase.from('products').select('*', { count: 'exact' })
    ]);

    const monthlyOrders = ordersRes.data?.filter(o => new Date(o.created_at) >= new Date(startOfMonth)) || [];
    const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    return {
      totalOrders: ordersRes.count || 0,
      monthlyRevenue,
      newUsers: usersRes.count || 0,
      totalProducts: productsRes.count || 0
    };
  }

  // ============ File Upload ============
  async uploadImage(bucket: string, path: string, file: File): Promise<string> {
    const { data, error } = await this.supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) throw error;
    const { data: urlData } = this.supabase.storage.from(bucket).getPublicUrl(data.path);
    return urlData.publicUrl;
  }
}