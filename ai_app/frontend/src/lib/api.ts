import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { 
  ApiResponse, 
  PaginatedResponse, 
  AIApp, 
  AIAppWithDetails, 
  Category, 
  Tag, 
  Review, 
  LoginRequest, 
  LoginResponse,
  AppListQuery,
  CreateAppForm
} from '@/types';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        // Get token from localStorage or state
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token') || this.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        const message = this.extractErrorMessage(error);
        
        // Don't show toast for certain errors
        const silentErrors = [401, 403];
        if (!silentErrors.includes(error.response?.status || 0)) {
          toast.error(message);
        }

        // Handle 401 - redirect to login
        if (error.response?.status === 401) {
          this.clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private extractErrorMessage(error: AxiosError): string {
    if (error.response?.data) {
      const data = error.response.data as any;
      return data.error || data.message || 'An error occurred';
    }
    if (error.message) {
      return error.message;
    }
    return 'Network error occurred';
  }

  // Auth methods
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearAuth(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  // Generic request method
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.request({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  }

  // Auth API
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<ApiResponse<LoginResponse>>(
      'POST',
      '/auth/login',
      credentials
    );
    
    if (response.success && response.data) {
      this.setToken(response.data.token);
      return response.data;
    }
    
    throw new Error(response.error || 'Login failed');
  }

  async logout(): Promise<void> {
    try {
      await this.request('POST', '/auth/logout');
    } finally {
      this.clearAuth();
    }
  }

  // Apps API
  async getApps(params?: AppListQuery): Promise<PaginatedResponse<AIAppWithDetails>> {
    return this.request<PaginatedResponse<AIAppWithDetails>>('GET', '/apps', undefined, {
      params,
    });
  }

  async getApp(id: number): Promise<AIAppWithDetails> {
    const response = await this.request<ApiResponse<AIAppWithDetails>>(
      'GET',
      `/apps/${id}`
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch app');
  }

  async createApp(appData: CreateAppForm): Promise<AIApp> {
    const response = await this.request<ApiResponse<AIApp>>(
      'POST',
      '/apps',
      appData
    );
    
    if (response.success && response.data) {
      toast.success('App created successfully!');
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to create app');
  }

  async updateApp(id: number, appData: Partial<CreateAppForm>): Promise<AIApp> {
    const response = await this.request<ApiResponse<AIApp>>(
      'PUT',
      `/apps/${id}`,
      appData
    );
    
    if (response.success && response.data) {
      toast.success('App updated successfully!');
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to update app');
  }

  async deleteApp(id: number): Promise<void> {
    const response = await this.request<ApiResponse<null>>(
      'DELETE',
      `/apps/${id}`
    );
    
    if (response.success) {
      toast.success('App deleted successfully!');
      return;
    }
    
    throw new Error(response.error || 'Failed to delete app');
  }

  async getPopularApps(limit = 10): Promise<AIApp[]> {
    const response = await this.request<ApiResponse<AIApp[]>>(
      'GET',
      '/apps/popular',
      undefined,
      { params: { limit } }
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return [];
  }

  async getRecentApps(limit = 10): Promise<AIApp[]> {
    const response = await this.request<ApiResponse<AIApp[]>>(
      'GET',
      '/apps/recent',
      undefined,
      { params: { limit } }
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return [];
  }

  async searchApps(query: string, limit = 20): Promise<AIApp[]> {
    const response = await this.request<ApiResponse<AIApp[]>>(
      'GET',
      '/apps/search',
      undefined,
      { params: { q: query, limit } }
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return [];
  }

  // Categories API
  async getCategories(): Promise<Category[]> {
    const response = await this.request<ApiResponse<Category[]>>('GET', '/categories');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return [];
  }

  // Tags API
  async getTags(): Promise<Tag[]> {
    const response = await this.request<ApiResponse<Tag[]>>('GET', '/tags');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return [];
  }

  // Reviews API
  async getAppReviews(appId: number): Promise<Review[]> {
    const response = await this.request<ApiResponse<Review[]>>(
      'GET',
      `/apps/${appId}/reviews`
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return [];
  }

  async createReview(appId: number, review: { rating: number; comment?: string }): Promise<Review> {
    const response = await this.request<ApiResponse<Review>>(
      'POST',
      `/apps/${appId}/reviews`,
      review
    );
    
    if (response.success && response.data) {
      toast.success('Review submitted successfully!');
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to submit review');
  }

  // Favorites API
  async addToFavorites(appId: number): Promise<void> {
    const response = await this.request<ApiResponse<null>>(
      'POST',
      `/favorites/${appId}`
    );
    
    if (response.success) {
      toast.success('Added to favorites!');
      return;
    }
    
    throw new Error(response.error || 'Failed to add to favorites');
  }

  async removeFromFavorites(appId: number): Promise<void> {
    const response = await this.request<ApiResponse<null>>(
      'DELETE',
      `/favorites/${appId}`
    );
    
    if (response.success) {
      toast.success('Removed from favorites!');
      return;
    }
    
    throw new Error(response.error || 'Failed to remove from favorites');
  }

  async getUserFavorites(): Promise<AIApp[]> {
    const response = await this.request<ApiResponse<AIApp[]>>('GET', '/favorites');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return [];
  }

  // Usage tracking
  async trackUsage(appId: number, actionType: 'view' | 'use' | 'download'): Promise<void> {
    try {
      await this.request('POST', '/usage', {
        app_id: appId,
        action_type: actionType,
      });
    } catch (error) {
      // Don't show error for usage tracking failures
      console.warn('Failed to track usage:', error);
    }
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export individual methods for convenience
export const {
  login,
  logout,
  getApps,
  getApp,
  createApp,
  updateApp,
  deleteApp,
  getPopularApps,
  getRecentApps,
  searchApps,
  getCategories,
  getTags,
  getAppReviews,
  createReview,
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  trackUsage,
} = apiClient;