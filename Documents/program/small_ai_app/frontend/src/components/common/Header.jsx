import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* ロゴ */}
          <div className="flex items-center">
            <Link to="/" className="text-base sm:text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
              AI App Catalog
            </Link>
          </div>

          {/* ナビゲーション */}
          <nav className="flex flex-wrap gap-2 sm:gap-4 md:gap-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 sm:px-4 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 hover:bg-blue-50"
            >
              ホーム
            </Link>
            <Link
              to="/apps"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 sm:px-4 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 hover:bg-blue-50"
            >
              アプリ一覧
            </Link>
            <Link
              to="/favorites"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 sm:px-4 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 hover:bg-blue-50"
            >
              お気に入り
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;