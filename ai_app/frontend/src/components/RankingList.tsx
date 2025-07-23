"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrophyIcon,
  StarIcon,
  EyeIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { RankingItem, RankingType } from "@/types";
import { getRanking } from "@/lib/api";

interface RankingListProps {
  type?: RankingType;
  limit?: number;
  showTypeSelector?: boolean;
  className?: string;
}

const rankingTypeConfig = {
  rating: {
    label: "評価ランキング",
    icon: StarIcon,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    description: "ユーザー評価の高いアプリ",
  },
  usage: {
    label: "利用ランキング",
    icon: EyeIcon,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "最も利用されているアプリ",
  },
  combined: {
    label: "総合ランキング",
    icon: TrophyIcon,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "評価と利用回数の総合スコア",
  },
  monthly: {
    label: "月間ランキング",
    icon: CalendarIcon,
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: "月間で最も人気のアプリ",
  },
  weekly: {
    label: "週間ランキング",
    icon: ClockIcon,
    color: "text-red-600",
    bgColor: "bg-red-50",
    description: "週間で最も人気のアプリ",
  },
};

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) {
    return <div className="text-2xl">🥇</div>;
  } else if (rank === 2) {
    return <div className="text-2xl">🥈</div>;
  } else if (rank === 3) {
    return <div className="text-2xl">🥉</div>;
  }
  return (
    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
      {rank}
    </div>
  );
};

export function RankingList({
  type = "combined",
  limit = 10,
  showTypeSelector = true,
  className = "",
}: RankingListProps) {
  const [selectedType, setSelectedType] = useState<RankingType>(type);
  const [rankingData, setRankingData] = useState<RankingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const config = rankingTypeConfig[selectedType];

  useEffect(() => {
    fetchRanking();
  }, [selectedType, limit]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRanking = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getRanking({ type: selectedType, limit });
      setRankingData(data);
    } catch (error) {
      console.error("Failed to fetch ranking:", error);
      setError("ランキングの取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const renderMetric = (item: RankingItem) => {
    switch (selectedType) {
      case "rating":
        return (
          <div className="flex items-center space-x-2">
            <StarIcon className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold text-yellow-600">
              {item.avg_rating?.toFixed(1) || "N/A"}
            </span>
            <span className="text-sm text-gray-500">
              ({item.review_count || 0}件)
            </span>
          </div>
        );
      case "usage":
        return (
          <div className="flex items-center space-x-2">
            <EyeIcon className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-blue-600">
              {item.usage_count.toLocaleString()}回
            </span>
          </div>
        );
      case "combined":
        return (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <StarIcon className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-yellow-600">
                {item.avg_rating?.toFixed(1) || "N/A"}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <EyeIcon className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-600">{item.usage_count}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ChartBarIcon className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-purple-600 font-semibold">
                {item.ranking_score?.toFixed(1) || "N/A"}
              </span>
            </div>
          </div>
        );
      case "monthly":
        return (
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-green-500" />
            <span className="font-semibold text-green-600">
              {(item.monthly_usage || 0).toLocaleString()}回
            </span>
            <span className="text-sm text-gray-500">今月</span>
          </div>
        );
      case "weekly":
        return (
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-4 h-4 text-red-500" />
            <span className="font-semibold text-red-600">
              {(item.weekly_usage || 0).toLocaleString()}回
            </span>
            <span className="text-sm text-gray-500">今週</span>
          </div>
        );
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className={`p-6 bg-red-50 rounded-lg border border-red-200 ${className}`}>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchRanking}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          再試行
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <config.icon className={`w-6 h-6 ${config.color}`} />
            <h2 className="text-xl font-bold text-gray-900">{config.label}</h2>
          </div>
        </div>
        <p className="text-sm text-gray-600">{config.description}</p>

        {showTypeSelector && (
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(rankingTypeConfig).map(([key, typeConfig]) => (
              <button
                key={key}
                onClick={() => setSelectedType(key as RankingType)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedType === key
                    ? `${typeConfig.bgColor} ${typeConfig.color} font-medium`
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {typeConfig.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : rankingData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <TrophyIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>ランキングデータがありません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rankingData.map((item) => (
            <Link
              key={item.id}
              href={`/apps/${item.id}`}
              className="block group"
            >
              <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all">
                <RankIcon rank={item.rank} />
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  {renderMetric(item)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}