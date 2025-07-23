import { create } from "zustand";
import {
  AIAppWithDetails,
  Category,
  Tag,
  FilterState,
  AppListQuery,
} from "@/types";
import { getApps, getCategories, getTags } from "@/lib/api";

interface AppState {
  // Data
  apps: AIAppWithDetails[];
  categories: Category[];
  tags: Tag[];

  // UI State
  isLoading: boolean;
  error: string | null;

  // Pagination
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;

  // Filters
  filters: FilterState;

  // Selected app (for details page)
  selectedApp: AIAppWithDetails | null;
}

interface AppActions {
  // Data fetching
  fetchApps: (params?: AppListQuery) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchTags: () => Promise<void>;

  // Filters
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  // Pagination
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Selected app
  setSelectedApp: (app: AIAppWithDetails | null) => void;

  // Utils
  clearError: () => void;
  refreshApps: () => Promise<void>;
}

type AppStore = AppState & AppActions;

const defaultFilters: FilterState = {
  categories: [],
  tags: [],
  status: [],
  search: "",
  sortBy: "created_at",
  sortOrder: "desc",
};

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  apps: [],
  categories: [],
  tags: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  pageSize: 20,
  filters: defaultFilters,
  selectedApp: null,

  // Actions
  fetchApps: async (params?: AppListQuery) => {
    set({ isLoading: true, error: null });

    try {
      const state = get();
      const queryParams: AppListQuery = {
        page: state.currentPage,
        limit: state.pageSize,
        sort_by: state.filters.sortBy,
        order: state.filters.sortOrder,
        q: state.filters.search || undefined,
        category_id:
          state.filters.categories.length > 0
            ? state.filters.categories[0]
            : undefined,
        tags: state.filters.tags.length > 0 ? state.filters.tags : undefined,
        status:
          state.filters.status.length > 0 ? state.filters.status[0] : undefined,
        ...params,
      };

      const response = await getApps(queryParams);

      set({
        apps: response.data,
        currentPage: response.pagination.page,
        totalPages: response.pagination.total_pages,
        totalItems: response.pagination.total,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch apps";
      set({
        apps: [],
        isLoading: false,
        error: message,
      });
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await getCategories();
      set({ categories });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  },

  fetchTags: async () => {
    try {
      const tags = await getTags();
      set({ tags });
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  },

  setFilters: (newFilters: Partial<FilterState>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1, // Reset to first page when filters change
    }));

    // Automatically refresh apps when filters change
    get().fetchApps();
  },

  resetFilters: () => {
    set({
      filters: defaultFilters,
      currentPage: 1,
    });

    get().fetchApps();
  },

  setPage: (page: number) => {
    set({ currentPage: page });
    get().fetchApps();
  },

  setPageSize: (size: number) => {
    set({
      pageSize: size,
      currentPage: 1, // Reset to first page when page size changes
    });

    get().fetchApps();
  },

  setSelectedApp: (app: AIAppWithDetails | null) => {
    set({ selectedApp: app });
  },

  clearError: () => {
    set({ error: null });
  },

  refreshApps: async () => {
    await get().fetchApps();
  },
}));

// Selectors for convenience
export const useApps = () => {
  const { apps, isLoading, error } = useAppStore();
  return { apps, isLoading, error };
};

export const useAppFilters = () => {
  const { filters, setFilters, resetFilters } = useAppStore();
  return { filters, setFilters, resetFilters };
};

export const usePagination = () => {
  const {
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    setPage,
    setPageSize,
  } = useAppStore();
  return {
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    setPage,
    setPageSize,
  };
};

export const useCategories = () => {
  const { categories, fetchCategories } = useAppStore();
  return { categories, fetchCategories };
};

export const useTags = () => {
  const { tags, fetchTags } = useAppStore();
  return { tags, fetchTags };
};

export const useSelectedApp = () => {
  const { selectedApp, setSelectedApp } = useAppStore();
  return { selectedApp, setSelectedApp };
};
