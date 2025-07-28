import React, { useState } from 'react'
import { StarIcon, ArrowTopRightOnSquareIcon, HeartIcon } from '@heroicons/react/24/solid'
import { EyeIcon, HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline'

const AppCard = ({ app, onFavoriteToggle, isFavorite = false }) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const handleCardClick = (e) => {
    // お気に入りボタンクリック時はカード全体のクリックを防ぐ
    if (e.target.closest('.favorite-btn')) {
      return
    }
    
    if (app.url) {
      window.open(app.url, '_blank', 'noopener,noreferrer')
    }
  }
  
  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    setIsAnimating(true)
    onFavoriteToggle?.(app.id)
    
    // アニメーション完了後にリセット
    setTimeout(() => setIsAnimating(false), 200)
  }

  const getCategoryColor = (categoryName) => {
    const colors = {
      '生成AI': 'bg-blue-100 text-blue-800 border-blue-200',
      'データ分析': 'bg-green-100 text-green-800 border-green-200',
      '自動化': 'bg-amber-100 text-amber-800 border-amber-200',
      '翻訳・言語': 'bg-red-100 text-red-800 border-red-200',
      '画像・動画': 'bg-purple-100 text-purple-800 border-purple-200',
    }
    return colors[categoryName] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <article 
      className="app-card animate-slide-up group"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick(e)
        }
      }}
      aria-label={`${app.name} - ${app.description}`}
    >
      {/* ヘッダー部分 */}
      <header className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 pr-2">
          {app.name}
        </h3>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            className="favorite-btn p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 focus-ring"
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
            type="button"
          >
            {isFavorite ? (
              <HeartIcon className={`h-5 w-5 text-red-500 ${isAnimating ? 'animate-scale-in' : ''}`} />
            ) : (
              <HeartOutlineIcon className={`h-5 w-5 text-gray-400 hover:text-red-500 transition-colors duration-200 ${isAnimating ? 'animate-scale-in' : ''}`} />
            )}
          </button>
          <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" aria-hidden="true" />
        </div>
      </header>

      {/* 説明文 */}
      <p className="text-gray-600 text-base leading-relaxed mb-6 line-clamp-3">
        {app.description}
      </p>
      
      {/* フッター部分 */}
      <footer className="flex items-center justify-between">
        {/* カテゴリバッジ */}
        <span 
          className={`category-badge ${getCategoryColor(app.category?.name || '')}`}
          aria-label={`カテゴリ: ${app.category?.name || 'その他'}`}
        >
          {app.category?.name || 'その他'}
        </span>
        
        {/* 評価と利用回数 */}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center" aria-label={`評価: ${app.avg_rating || '0.0'}点`}>
            <StarIcon className="h-4 w-4 text-yellow-400 mr-1" aria-hidden="true" />
            <span className="font-medium" aria-hidden="true">{app.avg_rating || '0.0'}</span>
          </div>
          <div className="flex items-center" aria-label={`利用回数: ${app.usage_count || 0}回`}>
            <EyeIcon className="h-4 w-4 text-gray-400 mr-1" aria-hidden="true" />
            <span aria-hidden="true">{app.usage_count || 0}</span>
          </div>
        </div>
      </footer>

      {/* ホバー効果用のオーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" aria-hidden="true" />
    </article>
  )
}

export default AppCard