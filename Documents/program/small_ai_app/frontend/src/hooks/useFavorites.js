import { useState, useEffect, useCallback } from 'react'

/**
 * お気に入り機能のカスタムフック
 * @returns {Object} お気に入り関連の状態と関数
 */
export const useFavorites = () => {
  const [favoriteAppIds, setFavoriteAppIds] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // ローカルストレージからお気に入りを読み込み
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem('favoriteApps')
        if (stored) {
          const favorites = JSON.parse(stored)
          setFavoriteAppIds(Array.isArray(favorites) ? favorites : [])
        }
      } catch (error) {
        console.error('お気に入りの読み込みに失敗しました:', error)
        setFavoriteAppIds([])
      }
    }

    loadFavorites()
  }, [])

  // ローカルストレージに保存
  const saveFavorites = useCallback((favorites) => {
    try {
      localStorage.setItem('favoriteApps', JSON.stringify(favorites))
    } catch (error) {
      console.error('お気に入りの保存に失敗しました:', error)
    }
  }, [])

  // お気に入りの切り替え
  const toggleFavorite = useCallback(async (appId) => {
    if (isLoading) return

    setIsLoading(true)

    try {
      setFavoriteAppIds(prev => {
        const newFavorites = prev.includes(appId) 
          ? prev.filter(id => id !== appId)
          : [...prev, appId]
        
        // 即座にローカルストレージに保存
        saveFavorites(newFavorites)
        
        return newFavorites
      })

      // 実際のAPIコールは後で実装
      // await api.toggleFavorite(appId)
      
    } catch (error) {
      console.error('お気に入りの切り替えに失敗しました:', error)
      // エラー時は元に戻す
      setFavoriteAppIds(prev => {
        const revertedFavorites = prev.includes(appId) 
          ? prev.filter(id => id !== appId)
          : [...prev, appId]
        saveFavorites(revertedFavorites)
        return revertedFavorites
      })
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, saveFavorites])

  // お気に入りかどうかをチェック
  const isFavorite = useCallback((appId) => {
    return favoriteAppIds.includes(appId)
  }, [favoriteAppIds])

  // お気に入りアプリのフィルタリング
  const filterFavoriteApps = useCallback((apps) => {
    return apps.filter(app => favoriteAppIds.includes(app.id))
  }, [favoriteAppIds])

  // お気に入りの数を取得
  const favoriteCount = favoriteAppIds.length

  return {
    favoriteAppIds,
    isLoading,
    toggleFavorite,
    isFavorite,
    filterFavoriteApps,
    favoriteCount
  }
}