"use client";

import Link from "next/link";
import {
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
  EyeIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import {
  StarIcon,
  HeartIcon,
  TagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { AIAppWithDetails } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

interface AppCardProps {
  app: AIAppWithDetails;
  onClick?: () => void;
  className?: string;
}

export function AppCard({ app, onClick, className = "" }: AppCardProps) {
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

  const renderStars = (rating?: number) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />,
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <StarIcon className="h-4 w-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <StarIconSolid className="h-4 w-4 text-yellow-400" />
            </div>
          </div>,
        );
      } else {
        stars.push(<StarIcon key={i} className="h-4 w-4 text-gray-300" />);
      }
    }

    return stars;
  };

  const cardContent = (
    <div
      className={`group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${className}`}
    >
      {/* Status badge */}
      <div className="absolute top-4 right-4 z-10">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[app.status]}`}
        >
          {statusLabels[app.status]}
        </span>
      </div>

      {/* Card header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
              {app.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {app.description}
            </p>
          </div>
        </div>

        {/* Tags */}
        {app.tags && app.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {app.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600"
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
            {app.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                +{app.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Category */}
        {app.category && (
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
              style={
                app.category.color
                  ? {
                      backgroundColor: `${app.category.color}20`,
                      color: app.category.color,
                    }
                  : { backgroundColor: "#f3f4f6", color: "#6b7280" }
              }
            >
              {app.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="px-6 pb-4">
        {/* Rating and favorites */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {renderStars(app.avg_rating)}
            {app.avg_rating && (
              <span className="ml-1 text-sm text-gray-500">
                {app.avg_rating.toFixed(1)}
              </span>
            )}
          </div>

          {app.is_favorited !== undefined && (
            <div className="flex items-center text-sm text-gray-500">
              {app.is_favorited ? (
                <HeartIconSolid className="h-4 w-4 text-red-500 mr-1" />
              ) : (
                <HeartIcon className="h-4 w-4 mr-1" />
              )}
              <span>{app.favorites_count || 0}</span>
            </div>
          )}
        </div>

        {/* Usage count */}
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <EyeIcon className="h-4 w-4 mr-1" />
          <span>{app.usage_count} 回利用</span>
        </div>

        {/* Creator and date */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          {app.creator && (
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-1" />
              <span>{app.creator.name}</span>
            </div>
          )}
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
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-50/0 via-primary-50/0 to-primary-50/0 group-hover:from-primary-50/5 group-hover:via-primary-50/5 group-hover:to-primary-50/10 rounded-xl transition-all duration-200 pointer-events-none" />
    </div>
  );

  if (onClick) {
    return <div onClick={onClick}>{cardContent}</div>;
  }

  return <Link href={`/apps/${app.id}`}>{cardContent}</Link>;
}
