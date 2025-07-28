import React, { useState, useEffect } from 'react'
import AppList from '../components/apps/AppList'
import AppSearch from '../components/apps/AppSearch'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { appsAPI } from '../services/api'
import { useAppSearch } from '../hooks/useAppSearch'
import { useFavorites } from '../hooks/useFavorites'

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
      
      // モックデータで一時的にテスト
      const mockApps = [
        {
          id: 1,
          name: "ChatGPT統合ツール",
          description: "社内文書の作成や翻訳などに活用できるChatGPT統合ツールです。効率的な文書作成をサポートします。",
          category: { id: 1, name: "生成AI" },
          creator: { id: 1, name: "山田太郎" },
          url: "https://example.com/chatgpt",
          avg_rating: 4.5,
          usage_count: 120,
          status: "active"
        },
        {
          id: 2,
          name: "データ分析ダッシュボード",  
          description: "売上データやユーザー行動データを可視化し、ビジネスインサイトを提供するダッシュボードツールです。",
          category: { id: 2, name: "データ分析" },
          creator: { id: 2, name: "佐藤花子" },
          url: "https://example.com/dashboard",
          avg_rating: 4.2,
          usage_count: 85,
          status: "active"
        },
        {
          id: 3,
          name: "画像生成AI",
          description: "テキストから高品質な画像を生成するAIツール。マーケティング素材の作成に最適です。",
          category: { id: 3, name: "画像・動画" },
          creator: { id: 3, name: "田中次郎" },
          url: "https://example.com/image-ai",
          avg_rating: 4.8,
          usage_count: 200,
          status: "active"
        }
      ]
      
      setTimeout(() => {
        setApps(mockApps)
        setLoading(false)
      }, 500)
      
      // 実際のAPIを試す（エラーが出ても続行）
      try {
        const response = await appsAPI.getApps()
        if (response.data && response.data.length > 0) {
          setApps(response.data)
        }
      } catch (apiErr) {
        console.warn('API接続に失敗しました。モックデータを表示します。', apiErr)
      }
      
    } catch (err) {
      setError('アプリ一覧の読み込みに失敗しました')
      console.error('Error fetching apps:', err)
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="アプリ一覧を読み込み中..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8">AIアプリ一覧</h1>
            <ErrorMessage message={error} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">AIアプリ一覧</h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600">社内で利用可能なAIアプリケーションを探索しましょう</p>
        </div>
        <AppList apps={apps} />
      </div>
    </div>
  )
}

export default AppsPage