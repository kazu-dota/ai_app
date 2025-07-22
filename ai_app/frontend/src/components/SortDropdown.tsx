"use client";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useAppFilters } from "@/store/appStore";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const sortOptions = [
  { value: "created_at", label: "作成日", orders: ["desc", "asc"] },
  { value: "updated_at", label: "更新日", orders: ["desc", "asc"] },
  { value: "name", label: "名前", orders: ["asc", "desc"] },
  { value: "usage_count", label: "利用回数", orders: ["desc", "asc"] },
  { value: "avg_rating", label: "平均評価", orders: ["desc", "asc"] },
];

export function SortDropdown() {
  const { filters, setFilters } = useAppFilters();

  const currentSort = sortOptions.find(
    (option) => option.value === filters.sortBy,
  );
  const currentLabel = currentSort
    ? `${currentSort.label} (${filters.sortOrder === "desc" ? "降順" : "昇順"})`
    : "並び替え";

  const handleSortChange = (sortBy: string, order: "asc" | "desc") => {
    setFilters({ sortBy, sortOrder: order });
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-lg px-4 py-2">
          {currentLabel}
          <ChevronDownIcon
            className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {sortOptions.map((option) => (
              <div key={option.value}>
                {/* Primary sort order */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() =>
                        handleSortChange(
                          option.value,
                          option.orders[0] as "asc" | "desc",
                        )
                      }
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        filters.sortBy === option.value &&
                          filters.sortOrder === option.orders[0]
                          ? "bg-primary-50 text-primary-700 font-medium"
                          : "",
                        "group flex items-center px-4 py-2 text-sm w-full text-left",
                      )}
                    >
                      <span className="flex-1">
                        {option.label} (
                        {option.orders[0] === "desc" ? "降順" : "昇順"})
                      </span>
                      {filters.sortBy === option.value &&
                        filters.sortOrder === option.orders[0] && (
                          <span className="text-primary-600">✓</span>
                        )}
                    </button>
                  )}
                </Menu.Item>

                {/* Secondary sort order */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() =>
                        handleSortChange(
                          option.value,
                          option.orders[1] as "asc" | "desc",
                        )
                      }
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        filters.sortBy === option.value &&
                          filters.sortOrder === option.orders[1]
                          ? "bg-primary-50 text-primary-700 font-medium"
                          : "",
                        "group flex items-center px-4 py-2 text-sm w-full text-left",
                      )}
                    >
                      <span className="flex-1">
                        {option.label} (
                        {option.orders[1] === "desc" ? "降順" : "昇順"})
                      </span>
                      {filters.sortBy === option.value &&
                        filters.sortOrder === option.orders[1] && (
                          <span className="text-primary-600">✓</span>
                        )}
                    </button>
                  )}
                </Menu.Item>

                {/* Separator after each option group except the last */}
                {option !== sortOptions[sortOptions.length - 1] && (
                  <hr className="border-gray-200" />
                )}
              </div>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
