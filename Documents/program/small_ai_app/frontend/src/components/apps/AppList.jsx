import React from 'react'
import AppCard from './AppCard'

const AppList = ({ apps }) => {
  if (apps.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">アプリが見つかりません</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {apps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  )
}

export default AppList