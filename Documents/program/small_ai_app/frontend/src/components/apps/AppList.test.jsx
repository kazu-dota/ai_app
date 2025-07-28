import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AppList from './AppList'

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

describe('AppList', () => {
  it('渡されたアプリ配列を正しくレンダリングする', () => {
    render(<AppList apps={mockApps} />)
    expect(screen.getByText('テストアプリ1')).toBeInTheDocument()
    expect(screen.getByText('テストアプリ2')).toBeInTheDocument()
  })

  it('アプリが0件の場合「アプリが見つかりません」メッセージを表示する', () => {
    render(<AppList apps={[]} />)
    expect(screen.getByText('アプリが見つかりません')).toBeInTheDocument()
  })
})