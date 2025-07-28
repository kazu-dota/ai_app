import axios from 'axios';

// APIベースURL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Axiosインスタンスを作成
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター（認証トークンを自動付与）
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター（エラーハンドリング）
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 認証エラーの場合、トークンをクリアしてログイン画面にリダイレクト
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 認証API
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData) =>
    api.post('/auth/register', userData),
  
  getCurrentUser: () =>
    api.get('/auth/me'),
};

// アプリAPI
export const appsAPI = {
  getApps: (params = {}) =>
    api.get('/apps', { params }),
  
  getApp: (id) =>
    api.get(`/apps/${id}`),
  
  createApp: (appData) =>
    api.post('/apps', appData),
  
  updateApp: (id, appData) =>
    api.put(`/apps/${id}`, appData),
  
  deleteApp: (id) =>
    api.delete(`/apps/${id}`),
  
  incrementUsage: (id) =>
    api.post(`/apps/${id}/use`),
  
  rateApp: (id, rating) =>
    api.post(`/apps/${id}/rate`, { rating }),
};

// カテゴリAPI
export const categoriesAPI = {
  getCategories: () =>
    api.get('/categories'),
  
  createCategory: (categoryData) =>
    api.post('/categories', categoryData),
};

// お気に入りAPI
export const favoritesAPI = {
  getFavorites: () =>
    api.get('/favorites'),
  
  addFavorite: (appId) =>
    api.post('/favorites', { app_id: appId }),
  
  removeFavorite: (appId) =>
    api.delete(`/favorites/${appId}`),
};

export default api;