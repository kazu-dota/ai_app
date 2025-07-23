"use client";

import { useState, useEffect } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  useAppStore,
  useCategories,
  useTags,
  useAppFilters,
} from "@/store/appStore";
import { AppStatus } from "@/types";

interface FilterSidebarProps {
  onFilterChange?: () => void;
}

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    status: true,
    tags: true,
  });

  const { categories, fetchCategories } = useCategories();
  const { tags, fetchTags } = useTags();
  const { filters, setFilters } = useAppFilters();

  useEffect(() => {
    if (categories.length === 0) fetchCategories();
    if (tags.length === 0) fetchTags();
  }, [categories.length, tags.length, fetchCategories, fetchTags]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter((id) => id !== categoryId);

    setFilters({ categories: newCategories });
    onFilterChange?.();
  };

  const handleStatusChange = (status: AppStatus, checked: boolean) => {
    const newStatus = checked
      ? [...filters.status, status]
      : filters.status.filter((s) => s !== status);

    setFilters({ status: newStatus });
    onFilterChange?.();
  };

  const handleTagChange = (tagId: number, checked: boolean) => {
    const newTags = checked
      ? [...filters.tags, tagId]
      : filters.tags.filter((id) => id !== tagId);

    setFilters({ tags: newTags });
    onFilterChange?.();
  };

  const statusOptions = [
    { value: "active" as AppStatus, label: "稼働中", color: "text-green-600" },
    {
      value: "development" as AppStatus,
      label: "開発中",
      color: "text-yellow-600",
    },
    {
      value: "testing" as AppStatus,
      label: "テスト中",
      color: "text-blue-600",
    },
    {
      value: "maintenance" as AppStatus,
      label: "メンテナンス中",
      color: "text-orange-600",
    },
    {
      value: "deprecated" as AppStatus,
      label: "廃止予定",
      color: "text-red-600",
    },
    {
      value: "archived" as AppStatus,
      label: "廃止済み",
      color: "text-gray-600",
    },
  ];

  const FilterSection = ({
    title,
    isExpanded,
    onToggle,
    children,
  }: {
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-200 pb-6">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-900 hover:text-gray-700"
      >
        <span>{title}</span>
        {isExpanded ? (
          <ChevronUpIcon className="h-4 w-4" />
        ) : (
          <ChevronDownIcon className="h-4 w-4" />
        )}
      </button>
      {isExpanded && <div className="mt-4 space-y-3">{children}</div>}
    </div>
  );

  const businessCategories = categories.filter(
    (cat) => cat.type === "business",
  );
  const targetCategories = categories.filter((cat) => cat.type === "target");
  const difficultyCategories = categories.filter(
    (cat) => cat.type === "difficulty",
  );

  return (
    <div className="space-y-6">
      {/* Categories */}
      <FilterSection
        title="カテゴリ"
        isExpanded={expandedSections.categories}
        onToggle={() => toggleSection("categories")}
      >
        <div className="space-y-4">
          {/* Business Categories */}
          {businessCategories.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                業務カテゴリ
              </h4>
              <div className="space-y-2">
                {businessCategories.map((category) => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category.id)}
                      onChange={(e) =>
                        handleCategoryChange(category.id, e.target.checked)
                      }
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {category.name}
                    </span>
                    {category.color && (
                      <span
                        className="ml-2 w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Target Categories */}
          {targetCategories.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                利用対象
              </h4>
              <div className="space-y-2">
                {targetCategories.map((category) => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category.id)}
                      onChange={(e) =>
                        handleCategoryChange(category.id, e.target.checked)
                      }
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Difficulty Categories */}
          {difficultyCategories.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                難易度
              </h4>
              <div className="space-y-2">
                {difficultyCategories.map((category) => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category.id)}
                      onChange={(e) =>
                        handleCategoryChange(category.id, e.target.checked)
                      }
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </FilterSection>

      {/* Status */}
      <FilterSection
        title="ステータス"
        isExpanded={expandedSections.status}
        onToggle={() => toggleSection("status")}
      >
        <div className="space-y-2">
          {statusOptions.map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.status.includes(option.value)}
                onChange={(e) =>
                  handleStatusChange(option.value, e.target.checked)
                }
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className={`ml-3 text-sm ${option.color}`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Tags */}
      <FilterSection
        title="タグ"
        isExpanded={expandedSections.tags}
        onToggle={() => toggleSection("tags")}
      >
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.tags.includes(tag.id)}
                onChange={(e) => handleTagChange(tag.id, e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700">{tag.name}</span>
              {tag.color && (
                <span
                  className="ml-2 w-3 h-3 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
              )}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Active Filters Summary */}
      {(filters.categories.length > 0 ||
        filters.status.length > 0 ||
        filters.tags.length > 0) && (
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            適用中のフィルター
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            {filters.categories.length > 0 && (
              <div>カテゴリ: {filters.categories.length}件</div>
            )}
            {filters.status.length > 0 && (
              <div>ステータス: {filters.status.length}件</div>
            )}
            {filters.tags.length > 0 && (
              <div>タグ: {filters.tags.length}件</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
