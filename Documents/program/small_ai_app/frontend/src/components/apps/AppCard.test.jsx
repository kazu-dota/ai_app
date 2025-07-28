import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AppCard from './AppCard'

const mockApp = {
  id: 1,
  name: 'テストアプリ',
  description: 'テスト用のアプリです',
  category: { name: 'テストカテゴリ' },
  avg_rating: 4.5,
  usage_count: 100,
  url: 'https://example.com'
}

describe('AppCard', () => {
  it('アプリ名が表示される', () => {
    render(<AppCard app={mockApp} />)
    expect(screen.getByText('テストアプリ')).toBeInTheDocument()
  })

  it('アプリの説明が表示される', () => {
    render(<AppCard app={mockApp} />)
    expect(screen.getByText('テスト用のアプリです')).toBeInTheDocument()
  })

  it('カテゴリ名が表示される', () => {
    render(<AppCard app={mockApp} />)
    expect(screen.getByText('テストカテゴリ')).toBeInTheDocument()
  })

  it('星評価が表示される', () => {
    render(<AppCard app={mockApp} />)
    expect(screen.getByText('4.5')).toBeInTheDocument()
  })

  it('利用回数が表示される', () => {
    render(<AppCard app={mockApp} />)
    expect(screen.getByText('100回利用')).toBeInTheDocument()
  })
})