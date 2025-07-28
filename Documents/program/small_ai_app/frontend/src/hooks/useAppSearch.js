import { useState, useEffect, useMemo } from 'react'

/**
 * アプリ検索・フィルタリング機能のカスタムフック
 * @param {Array} apps - 全アプリのリスト
 * @param {Object} options - オプション設定
 * @returns {Object} 検索・フィルタリングの状態と関数
 */
export const useAppSearch = (apps = [], options = {}) => {
  const {
    searchFields = ['name', 'description', 'category.name'], // 検索対象フィールド
    caseSensitive = false, // 大文字小文字を区別するか
    minSearchLength = 0 // 最小検索文字数
  } = options

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('name') // name, rating, usage_count, created_at
  const [sortOrder, setSortOrder] = useState('asc') // asc, desc

  // カテゴリ一覧を生成（アプリ数も含む）
  const categories = useMemo(() => {
    const categoryMap = new Map()
    
    apps.forEach(app => {
      if (app.category) {
        const categoryId = app.category.id
        const categoryName = app.category.name
        
        if (categoryMap.has(categoryId)) {
          categoryMap.get(categoryId).app_count++
        } else {
          categoryMap.set(categoryId, {
            id: categoryId,
            name: categoryName,
            app_count: 1
          })
        }
      }
    })
    
    return Array.from(categoryMap.values()).sort((a, b) => 
      a.name.localeCompare(b.name, 'ja')
    )
  }, [apps])

  // 検索とフィルタリングを実行
  const filteredApps = useMemo(() => {
    let filtered = [...apps]

    // カテゴリフィルタ
    if (selectedCategory) {
      filtered = filtered.filter(app => 
        app.category && app.category.id === selectedCategory
      )
    }

    // 検索フィルタ
    if (searchTerm && searchTerm.length >= minSearchLength) {
      const searchWords = searchTerm
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0)

      filtered = filtered.filter(app => {
        return searchWords.every(word => {
          return searchFields.some(field => {
            const value = getNestedValue(app, field)
            if (typeof value !== 'string') return false
            
            const searchValue = caseSensitive ? value : value.toLowerCase()
            const searchWord = caseSensitive ? word : word.toLowerCase()
            
            return searchValue.includes(searchWord)
          })
        })
      })
    }

    // ソート
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'rating':
          aValue = a.avg_rating || 0
          bValue = b.avg_rating || 0
          break
        case 'usage_count':
          aValue = a.usage_count || 0
          bValue = b.usage_count || 0
          break
        case 'created_at':
          aValue = new Date(a.created_at || 0)
          bValue = new Date(b.created_at || 0)
          break
        case 'name':
        default:
          aValue = a.name || ''
          bValue = b.name || ''
          break
      }

      let comparison = 0
      if (typeof aValue === 'string') {
        comparison = aValue.localeCompare(bValue, 'ja')
      } else {
        comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      }

      return sortOrder === 'desc' ? -comparison : comparison
    })

    return filtered
  }, [apps, searchTerm, selectedCategory, sortBy, sortOrder, searchFields, caseSensitive, minSearchLength])

  // ネストしたオブジェクトの値を取得
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : ''
    }, obj)
  }

  // 検索語句を設定
  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  // カテゴリフィルタを設定
  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId)
  }

  // ソート設定を変更
  const handleSort = (field, order = null) => {
    setSortBy(field)
    if (order) {
      setSortOrder(order)
    } else {
      // 同じフィールドの場合は順序を反転
      setSortOrder(prev => sortBy === field ? (prev === 'asc' ? 'desc' : 'asc') : 'asc')
    }
  }

  // フィルタをクリア
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
  }

  // 検索・フィルタリングの統計情報
  const searchStats = {
    totalApps: apps.length,
    filteredApps: filteredApps.length,
    hasActiveFilters: !!(searchTerm || selectedCategory),
    searchTerm,
    selectedCategory,
    sortBy,
    sortOrder
  }

  return {
    // 状態
    searchTerm,
    selectedCategory,
    sortBy,
    sortOrder,
    
    // データ
    filteredApps,
    categories,
    searchStats,
    
    // アクション
    handleSearch,
    handleCategoryFilter,
    handleSort,
    clearFilters
  }
}