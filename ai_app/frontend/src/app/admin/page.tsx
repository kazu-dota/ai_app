"use client";

import { useState } from "react";
import {
  Cog6ToothIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { CSVManager } from "@/components/CSVManager";

type TabType = "overview" | "csv" | "stats" | "users";

const tabs = [
  {
    id: "overview" as TabType,
    name: "概要",
    icon: Cog6ToothIcon,
  },
  {
    id: "csv" as TabType,
    name: "CSV管理",
    icon: DocumentTextIcon,
  },
  {
    id: "stats" as TabType,
    name: "統計",
    icon: ChartBarIcon,
  },
  {
    id: "users" as TabType,
    name: "ユーザー",
    icon: UsersIcon,
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                管理者ダッシュボード
              </h2>
              <p className="text-gray-600 mb-6">
                AI App Catalogの管理機能へようこそ。こちらから各種管理操作を実行できます。
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-primary-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <DocumentTextIcon className="w-8 h-8 text-primary-600" />
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-primary-900">
                        CSV管理
                      </h3>
                      <p className="text-sm text-primary-700">
                        アプリデータの一括管理
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <ChartBarIcon className="w-8 h-8 text-green-600" />
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-green-900">
                        統計情報
                      </h3>
                      <p className="text-sm text-green-700">
                        利用状況の分析
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <UsersIcon className="w-8 h-8 text-blue-600" />
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-blue-900">
                        ユーザー管理
                      </h3>
                      <p className="text-sm text-blue-700">
                        権限とアクセス制御
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Cog6ToothIcon className="w-8 h-8 text-purple-600" />
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-purple-900">
                        システム設定
                      </h3>
                      <p className="text-sm text-purple-700">
                        プラットフォーム設定
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    注意事項
                  </h3>
                  <div className="mt-1 text-sm text-yellow-700">
                    <p>
                      管理者機能は慎重に使用してください。データの変更は元に戻せない場合があります。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "csv":
        return <CSVManager />;

      case "stats":
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              統計情報
            </h2>
            <p className="text-gray-600">
              統計機能は今後のアップデートで実装予定です。
            </p>
          </div>
        );

      case "users":
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              ユーザー管理
            </h2>
            <p className="text-gray-600">
              ユーザー管理機能は今後のアップデートで実装予定です。
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                管理者コンソール
              </h1>
              <p className="mt-2 text-gray-600">
                AI App Catalogの管理機能とシステム設定
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium ${
                      isActive
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    <Icon
                      className={`-ml-0.5 mr-2 h-5 w-5 ${
                        isActive
                          ? "text-primary-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="pb-12">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}