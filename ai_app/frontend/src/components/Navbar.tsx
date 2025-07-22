'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useAuth, useAuthActions } from '@/store/authStore';
import { SearchBar } from './SearchBar';

const navigation = [
  { name: 'ホーム', href: '/' },
  { name: 'アプリ一覧', href: '/apps' },
  { name: 'カテゴリ', href: '/categories' },
  { name: 'ランキング', href: '/ranking' },
];

const userMenuItems = [
  { name: 'プロフィール', href: '/profile', icon: UserIcon },
  { name: '設定', href: '/settings', icon: Cog6ToothIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { logout } = useAuthActions();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">AI App Catalog</span>
            <div className="flex items-center space-x-2">
              <SparklesIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">AI App Catalog</span>
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">メニューを開く</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop navigation */}
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </Popover.Group>

        {/* Search bar (desktop) */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:px-8">
          <div className="w-full max-w-md">
            <SearchBar placeholder="アプリを検索..." size="sm" />
          </div>
        </div>

        {/* User menu */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:space-x-4">
          {isAuthenticated && user ? (
            <>
              <Link
                href="/apps/new"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
              >
                <SparklesIcon className="w-4 h-4 mr-2" />
                アプリ登録
              </Link>
              
              <Popover className="relative">
                <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.name}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <UserIcon className="h-5 w-5 text-primary-600" />
                      )}
                    </div>
                    <span className="hidden sm:block">{user.name}</span>
                  </div>
                  <ChevronDownIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                </Popover.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute right-0 top-full z-10 mt-3 w-56 rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-900/5">
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-2">
                          <item.icon className="h-5 w-5 text-gray-400" />
                          <span>{item.name}</span>
                        </div>
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="block w-full rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50 text-left"
                    >
                      <div className="flex items-center space-x-2">
                        <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-400" />
                        <span>ログアウト</span>
                      </div>
                    </button>
                  </Popover.Panel>
                </Transition>
              </Popover>
            </>
          ) : (
            <div className="space-x-4">
              <Link
                href="/login"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600"
              >
                ログイン
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
              >
                新規登録
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <span className="sr-only">AI App Catalog</span>
              <div className="flex items-center space-x-2">
                <SparklesIcon className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">AI App Catalog</span>
              </div>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">メニューを閉じる</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              {/* Search bar (mobile) */}
              <div className="py-6">
                <SearchBar placeholder="アプリを検索..." />
              </div>

              {/* Navigation */}
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* User menu (mobile) */}
              <div className="py-6">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.name}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <UserIcon className="h-6 w-6 text-primary-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    
                    <Link
                      href="/apps/new"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white bg-primary-600 hover:bg-primary-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <SparklesIcon className="h-5 w-5" />
                        <span>アプリ登録</span>
                      </div>
                    </Link>

                    {userMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <item.icon className="h-5 w-5 text-gray-400" />
                          <span>{item.name}</span>
                        </div>
                      </Link>
                    ))}
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="-mx-3 block w-full rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 text-left"
                    >
                      <div className="flex items-center space-x-2">
                        <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-400" />
                        <span>ログアウト</span>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      ログイン
                    </Link>
                    <Link
                      href="/register"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white bg-primary-600 hover:bg-primary-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      新規登録
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}