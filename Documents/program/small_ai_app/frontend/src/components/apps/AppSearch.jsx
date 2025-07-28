import React, { useState, useEffect, useCallback } from 'react'
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { debounce } from '../../utils/debounce'

const AppSearch = ({ 
  onSearch, 
  onCategoryFilter, 
  categories = [], 
  selectedCategory = '',
  initialSearchTerm = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [showFilters, setShowFilters] = useState(false)

  // デバウンス処理された検索関数
  const debouncedSearch = useCallback(
    debounce((term) => {
      onSearch(term)
    }, 300),
    [onSearch]
  )

  // 検索語句の変更処理
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedSearch(value)
  }

  // 検索のクリア
  const clearSearch = () => {
    setSearchTerm('')
    onSearch('')
  }

  // カテゴリ選択の変更
  const handleCategoryChange = (categoryId) => {
    onCategoryFilter(categoryId)
  }

  // フィルタのクリア
  const clearFilters = () => {
    onCategoryFilter('')
  }

  // キーボードショートカット（Ctrl+K で検索フォーカス）
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        document.getElementById('app-search-input')?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8" role="search">
      <div className="space-y-4">
        {/* 検索バー */}
        <div className="relative">
          <label htmlFor="app-search-input" className="visually-hidden">
            アプリを検索
          </label>
          <div className="relative">
            <MagnifyingGlassIcon 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
              aria-hidden="true" 
            />
            <input
              id="app-search-input"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="アプリ名やキーワードで検索... (Ctrl+K)"
              className="search-input pl-10 pr-10"
              aria-describedby="search-help"
              autoComplete="off"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 focus-ring"
                aria-label="検索をクリア"
                type="button"
              >
                <XMarkIcon className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
          <p id="search-help" className="visually-hidden">
            アプリの名前、説明、カテゴリで検索できます
          </p>
        </div>

        {/* フィルタセクション */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-colors duration-200 focus-ring ${
              showFilters 
                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            aria-expanded={showFilters}
            aria-controls="filter-options"
            type="button"
          >
            <FunnelIcon className="h-4 w-4 mr-2" aria-hidden="true" />
            フィルタ
            {selectedCategory && (
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                1
              </span>
            )}
          </button>

          {/* アクティブフィルタの表示とクリア */}
          {selectedCategory && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">フィルタ中:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {categories.find(cat => cat.id === selectedCategory)?.name}
                <button
                  onClick={clearFilters}
                  className="ml-2 p-0.5 rounded-full hover:bg-blue-200 transition-colors duration-200 focus-ring"
                  aria-label="カテゴリフィルタをクリア"
                  type="button"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            </div>
          )}
        </div>

        {/* カテゴリフィルタ（展開時） */}
        {showFilters && (
          <div 
            id="filter-options"
            className="animate-slide-up border-t pt-4"
            role="group"
            aria-labelledby="category-filter-label"
          >
            <h3 id="category-filter-label" className="text-sm font-medium text-gray-900 mb-3">
              カテゴリで絞り込み
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('')}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors duration-200 focus-ring ${
                  selectedCategory === '' 
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                aria-pressed={selectedCategory === ''}
                type="button"
              >
                すべて
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors duration-200 focus-ring ${
                    selectedCategory === category.id 
                      ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  aria-pressed={selectedCategory === category.id}
                  type="button"
                >
                  {category.name}
                  <span className="ml-2 text-xs opacity-75">
                    ({category.app_count || 0})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 検索結果のヘルプテキスト */}
        {(searchTerm || selectedCategory) && (
          <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3" role="status">
            {searchTerm && selectedCategory ? (
              <>「<strong>{searchTerm}</strong>」で検索中、カテゴリ「<strong>{categories.find(cat => cat.id === selectedCategory)?.name}</strong>」で絞り込み中</>
            ) : searchTerm ? (
              <>「<strong>{searchTerm}</strong>」で検索中</>
            ) : (
              <>カテゴリ「<strong>{categories.find(cat => cat.id === selectedCategory)?.name}</strong>」で絞り込み中</>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default AppSearch