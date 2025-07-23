"use client";

import { useState } from "react";
import { RankingList } from "@/components/RankingList";
import { RankingType } from "@/types";
import {
  TrophyIcon,
  StarIcon,
  EyeIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const rankingTypes: { type: RankingType; label: string; icon: any; description: string }[] = [
  {
    type: "combined",
    label: "総合ランキング",
    icon: TrophyIcon,
    description: "評価と利用回数を総合したランキング",
  },
  {
    type: "rating",
    label: "評価ランキング",
    icon: StarIcon,
    description: "ユーザー評価の高いアプリ",
  },
  {
    type: "usage",
    label: "利用ランキング",
    icon: EyeIcon,
    description: "最も利用されているアプリ",
  },
  {
    type: "monthly",
    label: "月間ランキング",
    icon: CalendarIcon,
    description: "今月最も人気のアプリ",
  },
  {
    type: "weekly",
    label: "週間ランキング",
    icon: ClockIcon,
    description: "今週最も人気のアプリ",
  },
];

export default function RankingPage() {
  const [selectedType, setSelectedType] = useState<RankingType>("combined");

  const selectedRanking = rankingTypes.find(r => r.type === selectedType);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8">
          <div className="text-center">
            <TrophyIcon className="mx-auto h-12 w-12 text-primary-600" />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              AIアプリランキング
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              人気のAIアプリケーションを様々な視点でランキング表示します。
              気になるアプリを見つけて活用しましょう。
            </p>
          </div>
        </div>

        {/* Ranking Type Selector */}
        <div className="mb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {rankingTypes.map((ranking) => {
              const Icon = ranking.icon;
              const isSelected = selectedType === ranking.type;
              
              return (
                <button
                  key={ranking.type}
                  onClick={() => setSelectedType(ranking.type)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? "border-primary-500 bg-primary-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`h-6 w-6 ${
                        isSelected ? "text-primary-600" : "text-gray-400"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-medium ${
                          isSelected ? "text-primary-900" : "text-gray-900"
                        }`}
                      >
                        {ranking.label}
                      </h3>
                      <p
                        className={`text-sm mt-1 ${
                          isSelected ? "text-primary-700" : "text-gray-500"
                        }`}
                      >
                        {ranking.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ranking Content */}
        <div className="pb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <RankingList
              type={selectedType}
              limit={20}
              showTypeSelector={false}
              className=""
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="pb-12">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              ランキングについて
            </h2>
            <div className="space-y-2 text-sm text-blue-800">
              <p>
                <strong>総合ランキング:</strong> 
                評価(40%)と利用回数(60%)を組み合わせたスコアで算出
              </p>
              <p>
                <strong>評価ランキング:</strong> 
                ユーザーレビューの平均評価順（最低3件のレビュー必要）
              </p>
              <p>
                <strong>利用ランキング:</strong> 
                累計利用回数順
              </p>
              <p>
                <strong>月間・週間ランキング:</strong> 
                それぞれの期間内の利用回数順
              </p>
              <p className="mt-3 text-blue-700">
                ※ ランキングは定期的に更新されます
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}