"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/20/solid";
import { usePagination } from "@/store/appStore";

export function Pagination() {
  const { currentPage, totalPages, setPage } = usePagination();

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots: Array<number | string> = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    // Remove duplicates
    return rangeWithDots.filter((item, index) => {
      if (item === "...") return true;
      return rangeWithDots.indexOf(item) === index;
    });
  };

  const visiblePages = getVisiblePages();

  const buttonClass = (isActive: boolean, isDisabled: boolean = false) => {
    if (isDisabled) {
      return "relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-300 bg-white border border-gray-300 cursor-not-allowed";
    }
    if (isActive) {
      return "relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-primary-600 border border-primary-600 focus:z-20 focus:outline-offset-0";
    }
    return "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 bg-white border border-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0";
  };

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
      {/* Mobile pagination */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => setPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
            currentPage <= 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          前へ
        </button>
        <span className="flex items-center text-sm text-gray-700">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
            currentPage >= totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          次へ
        </button>
      </div>

      {/* Desktop pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            <span className="font-medium">{currentPage}</span> /{" "}
            <span className="font-medium">{totalPages}</span> ページ
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            {/* First page button */}
            <button
              onClick={() => setPage(1)}
              disabled={currentPage <= 1}
              className={`${buttonClass(false, currentPage <= 1)} rounded-l-md pr-2`}
              title="最初のページ"
            >
              <span className="sr-only">最初のページ</span>
              <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Previous page button */}
            <button
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className={`${buttonClass(false, currentPage <= 1)} px-2`}
              title="前のページ"
            >
              <span className="sr-only">前のページ</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Page numbers */}
            {visiblePages.map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`dots-${index}`}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300"
                  >
                    ...
                  </span>
                );
              }

              const pageNumber = page as number;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={buttonClass(currentPage === pageNumber)}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* Next page button */}
            <button
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className={`${buttonClass(false, currentPage >= totalPages)} px-2`}
              title="次のページ"
            >
              <span className="sr-only">次のページ</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Last page button */}
            <button
              onClick={() => setPage(totalPages)}
              disabled={currentPage >= totalPages}
              className={`${buttonClass(false, currentPage >= totalPages)} rounded-r-md pl-2`}
              title="最後のページ"
            >
              <span className="sr-only">最後のページ</span>
              <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </nav>
  );
}
