import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AppsPage from './AppsPage'

// fetchをモック化
global.fetch = vi.fn()

const mockApps = [
  {
    id: 1,
    name: 'テストアプリ1',
    description: 'テスト用のアプリです1',
    category: { name: 'テストカテゴリ1' },
    avg_rating: 4.5,
    usage_count: 100,
    url: 'https://example.com/1'
  },
  {
    id: 2,
    name: 'テストアプリ2',
    description: 'テスト用のアプリです2',
    category: { name: 'テストカテゴリ2' },
    avg_rating: 3.8,
    usage_count: 50,
    url: 'https://example.com/2'
  }
]

describe('AppsPage', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('ページタイトル「AIアプリ一覧」が表示される', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApps,
    })
    
    render(<AppsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('AIアプリ一覧')).toBeInTheDocument()
    })
  })

  it('ローディング中にLoadingSpinnerが表示される', () => {
    fetch.mockImplementation(() => new Promise(() => {})) // 永続的にpending状態
    
    render(<AppsPage />)
    
    expect(screen.getByText('アプリ一覧を読み込み中...')).toBeInTheDocument()
  })

  it('アプリ一覧が正しく表示される', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApps,
    })
    
    render(<AppsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('テストアプリ1')).toBeInTheDocument()
      expect(screen.getByText('テストアプリ2')).toBeInTheDocument()
    })
  })

  it('APIエラー時にエラーメッセージが表示される', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'))
    
    render(<AppsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('アプリ一覧の読み込みに失敗しました')).toBeInTheDocument()
    })
  })
})