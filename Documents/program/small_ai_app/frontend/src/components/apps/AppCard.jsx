import React from 'react'
import { StarIcon } from '@heroicons/react/24/solid'

const AppCard = ({ app }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold">{app.name}</h3>
      <p className="text-gray-600 mt-2">{app.description}</p>
      
      <div className="mt-4 flex items-center justify-between">
        <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
          {app.category.name}
        </span>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
            <span>{app.avg_rating}</span>
          </div>
          <span>{app.usage_count}回利用</span>
        </div>
      </div>
    </div>
  )
}

export default AppCard