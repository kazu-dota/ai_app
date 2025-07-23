// User related types
export interface User {
  id: number;
  email: string;
  name: string;
  department?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export type UserRole = "user" | "admin" | "super_admin";

// Category related types
export interface Category {
  id: number;
  name: string;
  type: CategoryType;
  description?: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export type CategoryType = "business" | "target" | "difficulty";

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
  tech_stack?: Record<string, any>;
  usage_guide?: string;
  input_example?: string;
  output_example?: string;
  model_info?: string;
  environment?: string;
  usage_count: number;
  avg_rating?: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export type AppStatus =
  | "development"
  | "testing"
  | "active"
  | "maintenance"
  | "deprecated"
  | "archived";

export interface AIAppWithDetails extends AIApp {
  category?: Category;
  creator?: User;
  tags?: Tag[];
  reviews?: ReviewWithUser[];
  favorites_count?: number;
  is_favorited?: boolean;
}

// Tag related types
export interface Tag {
  id: number;
  name: string;
  color?: string;
  created_at: string;
}

// Review related types
export interface Review {
  id: number;
  app_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewWithUser extends Review {
  user?: User;
}

// Favorite related types
export interface Favorite {
  id: number;
  user_id: number;
  app_id: number;
  created_at: string;
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
  created_at: string;
}

export type ActionType = "view" | "use" | "download";

// Notification related types
export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  related_id?: number;
  is_read: boolean;
  created_at: string;
}

export type NotificationType =
  | "new_app"
  | "app_update"
  | "maintenance"
  | "recommendation";

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: any[];
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
  page?: number;
  limit?: number;
}

export interface SortQuery {
  sort_by?: string;
  order?: "asc" | "desc";
}

export interface SearchQuery {
  q?: string;
}

export interface FilterQuery {
  category_id?: number;
  status?: AppStatus;
  is_public?: boolean;
  creator_id?: number;
  tags?: number[];
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
  avatar_url?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

// Form types
export interface CreateAppForm {
  name: string;
  description: string;
  category_id: number;
  status?: AppStatus;
  url?: string;
  api_endpoint?: string;
  tech_stack?: Record<string, string[]>;
  usage_guide?: string;
  input_example?: string;
  output_example?: string;
  model_info?: string;
  environment?: string;
  is_public?: boolean;
}

export interface ReviewForm {
  rating: number;
  comment?: string;
}

// UI State types
export interface UIState {
  isLoading: boolean;
  error?: string | null;
  success?: string | null;
}

export interface FilterState {
  categories: number[];
  tags: number[];
  status: AppStatus[];
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
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

// Component Props types
export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export interface InputProps extends BaseProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
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
  type?: RankingType;
  limit?: number;
}

// Error types
export interface AppError {
  message: string;
  status?: number;
  code?: string;
}
