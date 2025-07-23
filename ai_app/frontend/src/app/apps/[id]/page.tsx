"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
  EyeIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  LinkIcon,
  PlayIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";
import { StarIcon, HeartIcon, ShareIcon } from "@heroicons/react/24/outline";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ReviewSection } from "@/components/ReviewSection";
import {
  getApp,
  trackUsage,
  addToFavorites,
  removeFromFavorites,
} from "@/lib/api";
import { useAuth } from "@/store/authStore";
import { AIAppWithDetails } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import toast from "react-hot-toast";

export default function AppDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [app, setApp] = useState<AIAppWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const appId = parseInt(params.id as string);

  const fetchApp = useCallback(async () => {
    try {
      setIsLoading(true);
      const appData = await getApp(appId);
      setApp(appData);
      setIsFavorited(appData.is_favorited || false);
    } catch (error) {
      setError("アプリの詳細を取得できませんでした");
      console.error("Failed to fetch app:", error);
    } finally {
      setIsLoading(false);
    }
  }, [appId]);

  const trackAppView = useCallback(async () => {
    try {
      await trackUsage(appId, "view");
    } catch (error) {
      // Silent fail for tracking
      console.warn("Failed to track view:", error);
    }
  }, [appId]);

  useEffect(() => {
    if (appId) {
      fetchApp();
      trackAppView();
    }
  }, [appId, fetchApp, trackAppView]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      toast.error("お気に入りに追加するにはログインが必要です");
      return;
    }

    try {
      setFavoriteLoading(true);

      if (isFavorited) {
        await removeFromFavorites(appId);
        setIsFavorited(false);
        setApp((prev) =>
          prev
            ? { ...prev, favorites_count: (prev.favorites_count || 0) - 1 }
            : null,
        );
      } else {
        await addToFavorites(appId);
        setIsFavorited(true);
        setApp((prev) =>
          prev
            ? { ...prev, favorites_count: (prev.favorites_count || 0) + 1 }
            : null,
        );
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleUseApp = async () => {
    if (app?.url) {
      try {
        await trackUsage(appId, "use");
        window.open(app.url, "_blank");
      } catch (error) {
        console.warn("Failed to track usage:", error);
        window.open(app.url, "_blank");
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: app?.name,
        text: app?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("URLをクリップボードにコピーしました");
    }
  };

  const renderStars = (rating?: number) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIconSolid key={i} className="h-5 w-5 text-yellow-400" />,
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <StarIcon className="h-5 w-5 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <StarIconSolid className="h-5 w-5 text-yellow-400" />
            </div>
          </div>,
        );
      } else {
        stars.push(<StarIcon key={i} className="h-5 w-5 text-gray-300" />);
      }
    }

    return stars;
  };

  const statusColors = {
    active: "bg-green-100 text-green-800",
    development: "bg-yellow-100 text-yellow-800",
    testing: "bg-blue-100 text-blue-800",
    maintenance: "bg-orange-100 text-orange-800",
    deprecated: "bg-red-100 text-red-800",
    archived: "bg-gray-100 text-gray-800",
  };

  const statusLabels = {
    active: "稼働中",
    development: "開発中",
    testing: "テスト中",
    maintenance: "メンテナンス",
    deprecated: "廃止予定",
    archived: "廃止済み",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="mb-8">
              <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>

            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6 h-40"></div>
                <div className="bg-white rounded-lg shadow-sm p-6 h-32"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || "アプリが見つかりません"}
            </h1>
            <Link
              href="/apps"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              アプリ一覧に戻る
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                ホーム
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link
                  href="/apps"
                  className="text-gray-500 hover:text-gray-700"
                >
                  アプリ一覧
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-900">{app.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* App Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-2">
                <h1 className="text-2xl font-bold text-gray-900 mr-4">
                  {app.name}
                </h1>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[app.status]}`}
                >
                  {statusLabels[app.status]}
                </span>
              </div>

              <p className="text-lg text-gray-600 mb-4">{app.description}</p>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {app.creator && (
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-1" />
                    <span>{app.creator.name}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  <span>{app.usage_count} 回利用</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>
                    {formatDistanceToNow(new Date(app.updated_at), {
                      addSuffix: true,
                      locale: ja,
                    })}
                  </span>
                </div>
              </div>

              {/* Rating */}
              {app.avg_rating && (
                <div className="flex items-center mt-3">
                  <div className="flex items-center mr-2">
                    {renderStars(app.avg_rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {app.avg_rating.toFixed(1)} ({app.reviews?.length || 0}{" "}
                    レビュー)
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0 sm:ml-6">
              <button
                onClick={handleFavoriteToggle}
                disabled={favoriteLoading}
                className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                  isFavorited
                    ? "border-red-300 text-red-700 bg-red-50 hover:bg-red-100"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                } ${favoriteLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isFavorited ? (
                  <HeartIconSolid className="h-4 w-4 mr-2 text-red-500" />
                ) : (
                  <HeartIcon className="h-4 w-4 mr-2" />
                )}
                {isFavorited ? "お気に入り済み" : "お気に入り"}
                {app.favorites_count !== undefined && (
                  <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                    {app.favorites_count}
                  </span>
                )}
              </button>

              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ShareIcon className="h-4 w-4 mr-2" />
                シェア
              </button>

              {app.url && (
                <button
                  onClick={handleUseApp}
                  className="inline-flex items-center px-6 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  <PlayIcon className="h-4 w-4 mr-2" />
                  アプリを使用
                </button>
              )}
            </div>
          </div>

          {/* Tags */}
          {app.tags && app.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {app.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
                  style={
                    tag.color
                      ? { backgroundColor: `${tag.color}20`, color: tag.color }
                      : {}
                  }
                >
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Usage Guide */}
            {app.usage_guide && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  使い方
                </h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                  {app.usage_guide}
                </div>
              </div>
            )}

            {/* Input/Output Examples */}
            {(app.input_example || app.output_example) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CodeBracketIcon className="h-5 w-5 mr-2" />
                  入出力例
                </h2>
                <div className="space-y-4">
                  {app.input_example && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        入力例
                      </h3>
                      <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-700 font-mono">
                        {app.input_example}
                      </div>
                    </div>
                  )}
                  {app.output_example && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        出力例
                      </h3>
                      <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-700 font-mono">
                        {app.output_example}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews */}
            <ReviewSection appId={app.id} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                基本情報
              </h3>
              <dl className="space-y-3">
                {app.category && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      カテゴリ
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {app.category.name}
                    </dd>
                  </div>
                )}
                {app.model_info && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      使用モデル
                    </dt>
                    <dd className="text-sm text-gray-900">{app.model_info}</dd>
                  </div>
                )}
                {app.environment && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      動作環境
                    </dt>
                    <dd className="text-sm text-gray-900">{app.environment}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    公開設定
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {app.is_public ? "公開" : "限定公開"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">作成日</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(app.created_at).toLocaleDateString("ja-JP")}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    最終更新
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(app.updated_at).toLocaleDateString("ja-JP")}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Tech Stack */}
            {app.tech_stack && Object.keys(app.tech_stack).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  技術スタック
                </h3>
                <div className="space-y-3">
                  {Object.entries(app.tech_stack).map(
                    ([category, technologies]) => (
                      <div key={category}>
                        <dt className="text-sm font-medium text-gray-500 capitalize">
                          {category}
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {Array.isArray(technologies)
                            ? technologies.join(", ")
                            : String(technologies)}
                        </dd>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* External Links */}
            {(app.url || app.api_endpoint) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  リンク
                </h3>
                <div className="space-y-2">
                  {app.url && (
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                    >
                      <LinkIcon className="h-4 w-4 mr-2" />
                      アプリケーション
                    </a>
                  )}
                  {app.api_endpoint && (
                    <a
                      href={app.api_endpoint}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                    >
                      <CodeBracketIcon className="h-4 w-4 mr-2" />
                      API エンドポイント
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
