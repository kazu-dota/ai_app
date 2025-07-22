'use client';

import Link from 'next/link';
import { SparklesIcon } from '@heroicons/react/24/outline';

const navigation = {
  main: [
    { name: 'ホーム', href: '/' },
    { name: 'アプリ一覧', href: '/apps' },
    { name: 'カテゴリ', href: '/categories' },
    { name: 'ランキング', href: '/ranking' },
    { name: 'ヘルプ', href: '/help' },
  ],
  support: [
    { name: 'お問い合わせ', href: '/contact' },
    { name: 'よくある質問', href: '/faq' },
    { name: 'アプリ登録ガイド', href: '/guide' },
    { name: 'API ドキュメント', href: '/api-docs' },
  ],
  company: [
    { name: '利用規約', href: '/terms' },
    { name: 'プライバシーポリシー', href: '/privacy' },
    { name: '運営方針', href: '/policy' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand section */}
          <div className="space-y-8">
            <div className="flex items-center space-x-2">
              <SparklesIcon className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold text-white">AI App Catalog</span>
            </div>
            <p className="text-sm leading-6 text-gray-300">
              社内で開発された生成AIアプリケーションを簡単に発見し、業務効率を向上させるプラットフォーム。
              レビューと評価で最適なツールを見つけられます。
            </p>
            <div className="flex space-x-6">
              {/* Social links could go here if needed */}
            </div>
          </div>

          {/* Navigation sections */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">メインナビゲーション</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.main.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">サポート</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">会社情報</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-300">
              <p>© {new Date().getFullYear()} AI App Catalog. All rights reserved.</p>
              <p className="mt-1">社内向けAIアプリケーション統合プラットフォーム</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <p className="text-xs text-gray-400">
                Version 1.0.0 - 最終更新: {new Date().toLocaleDateString('ja-JP')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}