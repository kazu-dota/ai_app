import React, { useState, useEffect } from 'react'
import { appsAPI } from '../services/api'
import AppList from '../components/apps/AppList'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

const AppsPage = () => {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchApps()
  }, [])

  const fetchApps = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await appsAPI.getApps()
      setApps(response.data)
    } catch (err) {
      setError('アプリ一覧の読み込みに失敗しました')
      console.error('Error fetching apps:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="アプリ一覧を読み込み中..." />
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">AIアプリ一覧</h1>
        <ErrorMessage message={error} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">AIアプリ一覧</h1>
      <AppList apps={apps} />
    </div>
  )
}

export default AppsPage