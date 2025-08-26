import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Types
export interface ModalState {
  isOpen: boolean;
  type: string | null;
  data: any;
}

export interface DrawerState {
  isOpen: boolean;
  content: string | null;
  width?: number;
}

export interface UIState {
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
  modal: ModalState;
  drawer: DrawerState;
  sidebar: {
    isCollapsed: boolean;
    isMobile: boolean;
  };
  theme: {
    mode: 'light' | 'dark';
    primaryColor: string;
  };
  layout: {
    containerWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    density: 'comfortable' | 'compact' | 'spacious';
  };
  filters: Record<string, any>;
  pagination: Record<
    string,
    {
      page: number;
      pageSize: number;
      total: number;
    }
  >;
  sorting: Record<
    string,
    {
      field: string;
      direction: 'asc' | 'desc';
    }
  >;
}

// Initial state
const initialState: UIState = {
  loading: {},
  errors: {},
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
  drawer: {
    isOpen: false,
    content: null,
    width: 250,
  },
  sidebar: {
    isCollapsed: false,
    isMobile: false,
  },
  theme: {
    mode: 'light',
    primaryColor: '#1976d2',
  },
  layout: {
    containerWidth: 'lg',
    density: 'comfortable',
  },
  filters: {},
  pagination: {},
  sorting: {},
};

// Slice
export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (
      state,
      action: PayloadAction<{ key: string; loading: boolean }>
    ) => {
      const { key, loading } = action.payload;
      state.loading[key] = loading;
    },
    clearLoading: (state, action: PayloadAction<string>) => {
      delete state.loading[action.payload];
    },
    setError: (
      state,
      action: PayloadAction<{ key: string; error: string | null }>
    ) => {
      const { key, error } = action.payload;
      state.errors[key] = error;
    },
    clearError: (state, action: PayloadAction<string>) => {
      delete state.errors[action.payload];
    },
    clearAllErrors: (state) => {
      state.errors = {};
    },
    openModal: (state, action: PayloadAction<{ type: string; data?: any }>) => {
      const { type, data } = action.payload;
      state.modal = {
        isOpen: true,
        type,
        data: data || null,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null,
      };
    },
    updateModalData: (state, action: PayloadAction<any>) => {
      state.modal.data = action.payload;
    },
    openDrawer: (
      state,
      action: PayloadAction<{ content: string; width?: number }>
    ) => {
      const { content, width } = action.payload;
      state.drawer = {
        isOpen: true,
        content,
        width: width || state.drawer.width,
      };
    },
    closeDrawer: (state) => {
      state.drawer = {
        isOpen: false,
        content: null,
        width: state.drawer.width,
      };
    },
    toggleSidebar: (state) => {
      state.sidebar.isCollapsed = !state.sidebar.isCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebar.isCollapsed = action.payload;
    },
    setMobileMode: (state, action: PayloadAction<boolean>) => {
      state.sidebar.isMobile = action.payload;
    },
    setThemeMode: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme.mode = action.payload;
    },
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.theme.primaryColor = action.payload;
    },
    setContainerWidth: (
      state,
      action: PayloadAction<'xs' | 'sm' | 'md' | 'lg' | 'xl' | false>
    ) => {
      state.layout.containerWidth = action.payload;
    },
    setDensity: (
      state,
      action: PayloadAction<'comfortable' | 'compact' | 'spacious'>
    ) => {
      state.layout.density = action.payload;
    },
    setFilter: (state, action: PayloadAction<{ key: string; filter: any }>) => {
      const { key, filter } = action.payload;
      state.filters[key] = filter;
    },
    clearFilter: (state, action: PayloadAction<string>) => {
      delete state.filters[action.payload];
    },
    clearAllFilters: (state) => {
      state.filters = {};
    },
    setPagination: (
      state,
      action: PayloadAction<{
        key: string;
        pagination: { page: number; pageSize: number; total: number };
      }>
    ) => {
      const { key, pagination } = action.payload;
      state.pagination[key] = pagination;
    },
    setSorting: (
      state,
      action: PayloadAction<{
        key: string;
        sorting: { field: string; direction: 'asc' | 'desc' };
      }>
    ) => {
      const { key, sorting } = action.payload;
      state.sorting[key] = sorting;
    },
    resetPageState: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      delete state.filters[key];
      delete state.pagination[key];
      delete state.sorting[key];
    },
  },
});

// Actions
export const {
  setLoading,
  clearLoading,
  setError,
  clearError,
  clearAllErrors,
  openModal,
  closeModal,
  updateModalData,
  openDrawer,
  closeDrawer,
  toggleSidebar,
  setSidebarCollapsed,
  setMobileMode,
  setThemeMode,
  setPrimaryColor,
  setContainerWidth,
  setDensity,
  setFilter,
  clearFilter,
  clearAllFilters,
  setPagination,
  setSorting,
  resetPageState,
} = uiSlice.actions;

// Selectors (commented out to avoid circular dependencies)
// export const selectLoading = (key: string) => (state: RootState) => state.ui.loading[key] || false;
// ... other selectors commented out

// Selectors (commented out to avoid circular dependencies)
// export const selectIsAnyLoading = (state: RootState) => Object.values(state.ui.loading).some(Boolean);
// export const selectHasAnyError = (state: RootState) => Object.values(state.ui.errors).some(Boolean);

// Default export
export default uiSlice.reducer;
