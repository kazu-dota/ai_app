"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AppCard } from "@/components/AppCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Pagination } from "@/components/Pagination";
import { SortDropdown } from "@/components/SortDropdown";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function AppsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    apps,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalItems,
    filters,
    fetchApps,
    fetchCategories,
    fetchTags,
    setFilters,
    resetFilters,
  } = useAppStore();
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
    fetchApps();
    fetchCategories();
    fetchTags();
  }, [initializeAuth, fetchApps, fetchCategories, fetchTags]);

  const handleSearch = (query: string) => {
    setFilters({ search: query });
  };

  const clearFilters = () => {
    resetFilters();
  };

  const hasActiveFilters =
    filters.search ||
    filters.categories.length > 0 ||
    filters.tags.length > 0 ||
    filters.status.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AIアプリ一覧</h1>
          <p className="mt-2 text-lg text-gray-600">
            社内で利用可能な生成AIアプリケーションを探索できます
          </p>
        </div>

        {/* Search and Controls */}
        <div className="mb-8 space-y-4 lg:flex lg:items-center lg:justify-between lg:space-y-0">
          {/* Search Bar */}
          <div className="lg:flex-1 lg:max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="アプリを検索..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
              フィルター
              {hasActiveFilters && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-700 bg-primary-100 rounded-full">
                  {filters.categories.length +
                    filters.tags.length +
                    filters.status.length +
                    (filters.search ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <SortDropdown />

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <XMarkIcon className="h-4 w-4 mr-1" />
                クリア
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            {isLoading ? (
              "読み込み中..."
            ) : (
              <>
                {totalItems}件のアプリが見つかりました
                {hasActiveFilters && " (フィルター適用中)"}
              </>
            )}
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar (Desktop) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8">
              <FilterSidebar />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Error State */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      エラーが発生しました
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 h-80 animate-pulse"
                  >
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                      <div className="flex space-x-1 mb-3">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-6 bg-gray-200 rounded w-12"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Apps Grid */}
            {!isLoading && !error && (
              <>
                {apps.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {apps.map((app) => (
                      <AppCard key={app.id} app={app} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      アプリが見つかりません
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      検索条件を変更して再度お試しください
                    </p>
                    {hasActiveFilters && (
                      <div className="mt-6">
                        <button
                          onClick={clearFilters}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-100 hover:bg-primary-200"
                        >
                          すべてのフィルターをクリア
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="relative flex flex-col w-full max-w-xs bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">フィルター</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <FilterSidebar onFilterChange={() => setIsSidebarOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
