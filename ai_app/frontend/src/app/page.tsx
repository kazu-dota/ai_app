"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  SparklesIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  StarIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { AppCard } from "@/components/AppCard";
import { SearchBar } from "@/components/SearchBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RankingList } from "@/components/RankingList";

export default function HomePage() {
  const { apps, isLoading, fetchApps } = useAppStore();
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
    fetchApps({ limit: 8, sort_by: "usage_count", order: "desc" });
  }, [initializeAuth, fetchApps]);

  const stats = [
    {
      name: "登録アプリ数",
      value: "24",
      icon: SparklesIcon,
      change: "+12%",
      changeType: "increase" as const,
    },
    {
      name: "月間利用回数",
      value: "1,234",
      icon: ChartBarIcon,
      change: "+23%",
      changeType: "increase" as const,
    },
    {
      name: "アクティブユーザー",
      value: "156",
      icon: UserGroupIcon,
      change: "+8%",
      changeType: "increase" as const,
    },
    {
      name: "平均評価",
      value: "4.3",
      icon: StarIcon,
      change: "+0.2",
      changeType: "increase" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center lg:text-left">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                  <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:mx-0">
                    <h1>
                      <span className="block text-sm font-semibold uppercase tracking-wide text-primary-600">
                        社内向けAIプラットフォーム
                      </span>
                      <span className="mt-1 block text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl">
                        <span className="block xl:inline">AIアプリを</span>{" "}
                        <span className="block text-primary-600 xl:inline">
                          見つけよう
                        </span>
                      </span>
                    </h1>
                    <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                      社内で開発された生成AIアプリケーションを簡単に発見し、業務効率を向上させましょう。
                      レビューと評価で最適なツールを見つけられます。
                    </p>

                    {/* Search Bar */}
                    <div className="mt-8 sm:mt-10">
                      <SearchBar placeholder="アプリを検索..." />
                    </div>

                    {/* CTA Buttons */}
                    <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start">
                      <div className="rounded-md shadow">
                        <Link
                          href="/apps"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition-colors"
                        >
                          <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                          アプリを探す
                        </Link>
                      </div>
                      <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                        <Link
                          href="/apps/new"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors"
                        >
                          <SparklesIcon className="w-5 h-5 mr-2" />
                          アプリを登録
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Hero Image/Illustration */}
                  <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                    <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                      <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                        <div className="bg-gradient-to-br from-primary-400 to-primary-600 h-80 flex items-center justify-center">
                          <div className="text-center text-white">
                            <SparklesIcon className="w-16 h-16 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold">
                              AI App Catalog
                            </h3>
                            <p className="text-primary-100 mt-2">
                              社内AIアプリの統合プラットフォーム
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              プラットフォーム統計
            </h2>
            <p className="mt-3 text-xl text-gray-500 sm:mt-4">
              社内のAI活用状況をリアルタイムで確認
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-4 sm:gap-8">
            {stats.map((stat) => (
              <div key={stat.name} className="flex flex-col">
                <div className="flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary-600 mr-2" />
                  <dt className="text-lg leading-6 font-medium text-gray-500">
                    {stat.name}
                  </dt>
                </div>
                <dd className="mt-2 text-3xl font-bold text-gray-900">
                  {stat.value}
                </dd>
                <dd
                  className={`mt-1 text-sm ${
                    stat.changeType === "increase"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Popular Apps Section */}
      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900">人気のAIアプリ</h2>
            <p className="mt-3 text-xl text-gray-500 sm:mt-4">
              よく利用されている社内AIアプリをチェック
            </p>
          </div>

          {isLoading ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm h-64 animate-pulse"
                >
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {apps.slice(0, 4).map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              href="/apps"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 border-primary-300 hover:border-primary-400 transition-colors"
            >
              <ClockIcon className="w-5 h-5 mr-2" />
              すべてのアプリを見る
            </Link>
          </div>
        </div>
      </div>

      {/* Ranking Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">ランキング</h2>
            <p className="mt-3 text-xl text-gray-500 sm:mt-4">
              人気と評価で選ばれたトップAIアプリ
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 総合ランキング */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <RankingList
                type="combined"
                limit={5}
                showTypeSelector={false}
                className=""
              />
            </div>

            {/* 評価ランキング */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <RankingList
                type="rating"
                limit={5}
                showTypeSelector={false}
                className=""
              />
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/ranking"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 border-primary-300 hover:border-primary-400 transition-colors"
            >
              <TrophyIcon className="w-5 h-5 mr-2" />
              すべてのランキングを見る
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
              機能
            </h2>
            <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              AIアプリの発見から利用まで
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              必要なAIツールを簡単に見つけて、すぐに業務に活用できます
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {[
                {
                  name: "簡単検索",
                  description:
                    "キーワード検索やカテゴリフィルターで、必要なAIアプリをすぐに見つけられます。",
                  icon: MagnifyingGlassIcon,
                },
                {
                  name: "レビュー・評価",
                  description:
                    "他のユーザーのレビューと評価を参考に、最適なツールを選択できます。",
                  icon: StarIcon,
                },
                {
                  name: "利用統計",
                  description:
                    "アプリの利用状況や人気度を可視化し、トレンドを把握できます。",
                  icon: ChartBarIcon,
                },
              ].map((feature) => (
                <div key={feature.name} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    {feature.name}
                  </p>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
