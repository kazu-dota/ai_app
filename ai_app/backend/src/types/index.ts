// User related types
export interface User {
  id: number;
  email: string;
  name: string;
  department?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

export type UserRole = 'user' | 'admin' | 'super_admin';

export interface CreateUserRequest {
  email: string;
  name: string;
  department?: string;
  role?: UserRole;
  avatar_url?: string;
}

export interface UpdateUserRequest {
  name?: string;
  department?: string;
  role?: UserRole;
  avatar_url?: string;
}

// Category related types
export interface Category {
  id: number;
  name: string;
  type: CategoryType;
  description?: string;
  color?: string;
  created_at: Date;
  updated_at: Date;
}

export type CategoryType = 'business' | 'target' | 'difficulty';

export interface CreateCategoryRequest {
  name: string;
  type: CategoryType;
  description?: string;
  color?: string;
}

// AI App related types
export interface AIApp {
  id: number;
  name: string;
  description: string;
  category_id: number;
  creator_id: number;
  status: AppStatus;
  url?: string;
  api_endpoint?: string;
  api_key?: string;
  tech_stack?: Record<string, unknown>;
  usage_guide?: string;
  input_example?: string;
  output_example?: string;
  model_info?: string;
  environment?: string;
  usage_count: number;
  avg_rating?: number | null;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}

export type AppStatus =
  | 'development'
  | 'testing'
  | 'active'
  | 'maintenance'
  | 'deprecated'
  | 'archived';

export interface CreateAIAppRequest {
  name: string;
  description: string;
  category_id: number;
  status?: AppStatus;
  url?: string;
  api_endpoint?: string;
  api_key?: string;
  tech_stack?: Record<string, unknown>;
  usage_guide?: string;
  input_example?: string;
  output_example?: string;
  model_info?: string;
  environment?: string;
  is_public?: boolean;
}

export interface UpdateAIAppRequest {
  name?: string;
  description?: string;
  category_id?: number;
  status?: AppStatus;
  url?: string;
  api_endpoint?: string;
  api_key?: string;
  tech_stack?: Record<string, unknown>;
  usage_guide?: string;
  input_example?: string;
  output_example?: string;
  model_info?: string;
  environment?: string;
  is_public?: boolean;
}

export interface AIAppWithDetails extends AIApp {
  category?: Category | undefined;
  creator?: User | undefined;
  tags?: Tag[] | undefined;
  reviews?: Review[] | undefined;
  favorites_count?: number | undefined;
  is_favorited?: boolean | undefined;
}

// Tag related types
export interface Tag {
  id: number;
  name: string;
  color?: string;
  created_at: Date;
}

export interface CreateTagRequest {
  name: string;
  color?: string;
}

// Review related types
export interface Review {
  id: number;
  app_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ReviewWithUser extends Review {
  user?: User;
}

export interface CreateReviewRequest {
  rating: number;
  comment?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
}

// Favorite related types
export interface Favorite {
  id: number;
  user_id: number;
  app_id: number;
  created_at: Date;
}

// Usage Log related types
export interface UsageLog {
  id: number;
  app_id: number;
  user_id: number;
  action_type: ActionType;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

export type ActionType = 'view' | 'use' | 'download';

export interface CreateUsageLogRequest {
  app_id: number;
  action_type: ActionType;
  session_id?: string;
}

// Notification related types
export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  related_id?: number;
  is_read: boolean;
  created_at: Date;
}

export type NotificationType =
  | 'new_app'
  | 'app_update'
  | 'maintenance'
  | 'recommendation';

export interface CreateNotificationRequest {
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  related_id?: number;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Query parameters
export interface PaginationQuery {
  page?: number | undefined;
  limit?: number | undefined;
}

export interface SortQuery {
  sort_by?: string | undefined;
  order?: 'asc' | 'desc' | undefined;
}

export interface SearchQuery {
  q?: string | undefined;
}

export interface FilterQuery {
  category_id?: number | undefined;
  status?: AppStatus | undefined;
  is_public?: boolean | undefined;
  creator_id?: number | undefined;
  tags?: number[] | undefined;
}

export interface AppListQuery
  extends PaginationQuery,
    SortQuery,
    SearchQuery,
    FilterQuery {}

// Authentication types
export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

// Statistics types
export interface AppStatistics {
  total_apps: number;
  active_apps: number;
  total_users: number;
  total_reviews: number;
  avg_rating: number;
}

export interface UsageStatistics {
  daily_usage: Array<{ date: string; count: number }>;
  popular_apps: Array<{
    app_id: number;
    app_name: string;
    usage_count: number;
  }>;
  top_rated_apps: Array<{
    app_id: number;
    app_name: string;
    avg_rating: number;
  }>;
}

// Ranking types
export interface RankingItem {
  id: number;
  name: string;
  description: string;
  rank: number;
  avg_rating?: number | null;
  usage_count: number;
  monthly_usage?: number;
  weekly_usage?: number;
  ranking_score?: number;
  review_count?: number;
  category?: Category;
}

export type RankingType = 'rating' | 'usage' | 'combined' | 'monthly' | 'weekly';

export interface RankingQuery {
  type: RankingType;
  limit?: number;
  offset?: number;
}

// Error types
export interface AppError {
  statusCode: number;
  message: string;
  isOperational: boolean;
}
