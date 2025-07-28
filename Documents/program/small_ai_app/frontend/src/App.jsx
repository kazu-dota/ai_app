import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/common/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AppsPage from './pages/AppsPage';
import LoadingSpinner from './components/common/LoadingSpinner';

// 認証が必要なルートを保護するコンポーネント
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner message="認証状態を確認中..." />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// ログイン済みユーザーがログインページにアクセスした場合のリダイレクト
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner message="認証状態を確認中..." />;
  }
  
  return isAuthenticated ? <Navigate to="/" /> : children;
};

const AppContent = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          {/* 将来のルート用のプレースホルダー */}
          <Route 
            path="/apps" 
            element={
              <ProtectedRoute>
                <AppsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/favorites" 
            element={
              <ProtectedRoute>
                <div className="text-center py-8">お気に入りページ（開発予定）</div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;