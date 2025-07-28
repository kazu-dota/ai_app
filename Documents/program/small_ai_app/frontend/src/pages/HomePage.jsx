import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヒーローセクション */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              AI App Catalog
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              社内のAIアプリケーションを簡単に発見・管理
            </p>
            {isAuthenticated ? (
              <div className="mt-8">
                <p className="text-lg text-gray-700 mb-4">
                  こんにちは、{user.name}さん！
                </p>
                <Link
                  to="/apps"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  アプリを探す
                </Link>
              </div>
            ) : (
              <div className="mt-8">
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  ログインして始める
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 機能紹介 */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              主な機能
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                アプリ検索
              </h3>
              <p className="text-gray-600">
                カテゴリやキーワードで社内のAIアプリを簡単に検索できます。
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                お気に入り
              </h3>
              <p className="text-gray-600">
                よく使うアプリをお気に入りに登録して、すぐにアクセスできます。
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                評価システム
              </h3>
              <p className="text-gray-600">
                アプリを評価して、他のユーザーの参考になる情報を共有できます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;