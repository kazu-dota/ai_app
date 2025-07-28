import React from 'react'
import AppCard from './AppCard'
import { FolderOpenIcon } from '@heroicons/react/24/outline'

const AppList = ({ apps, onFavoriteToggle, favoriteAppIds = [] }) => {
  if (apps.length === 0) {
    return (
      <section className="text-center py-20" role="status" aria-live="polite">
        <FolderOpenIcon className="mx-auto h-20 w-20 text-gray-300 mb-6 animate-pulse-gentle" aria-hidden="true" />
        <h3 className="text-2xl font-medium text-gray-900 mb-4">アプリが見つかりません</h3>
        <p className="text-gray-500 max-w-lg mx-auto text-lg leading-relaxed">
          現在表示可能なアプリがありません。検索条件を変更するか、後でもう一度お試しください。
        </p>
      </section>
    )
  }

  return (
    <section 
      className="app-grid"
      role="grid"
      aria-label={`${apps.length}個のアプリが見つかりました`}
    >
      {apps.map((app, index) => (
        <div 
          key={app.id} 
          className="relative"
          role="gridcell"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <AppCard 
            app={app} 
            onFavoriteToggle={onFavoriteToggle}
            isFavorite={favoriteAppIds.includes(app.id)}
          />
        </div>
      ))}
    </section>
  )
}

export default AppList