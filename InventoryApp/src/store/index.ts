import { configureStore } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import authReducer from './slices/authSlice';
import vendorReducer from './slices/vendorSlice';
import inventoryReducer from './slices/inventorySlice';
import { listenerMiddleware } from './middleware';
import { inventoryApi } from './api/inventoryApi';
import rootSaga from './sagas';

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// Simple UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: { mode: 'light', primaryColor: '#1976d2' },
    layout: { density: 'comfortable' },
    sidebar: { isCollapsed: false },
    loading: {},
    errors: {},
    modal: { isOpen: false, type: null, data: null },
    drawer: { isOpen: false, content: null, width: 250 },
    filters: {},
    pagination: {},
    sorting: {},
  } as any,
  reducers: {
    setThemeMode: (state, action) => {
      state.theme.mode = action.payload;
    },
    setDensity: (state, action) => {
      state.layout.density = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebar.isCollapsed = !state.sidebar.isCollapsed;
    },
    setLoading: (state, action) => {
      const { key, loading } = action.payload;
      state.loading[key] = loading;
    },
    setError: (state, action) => {
      const { key, error } = action.payload;
      state.errors[key] = error;
    },
  },
});

// Simple notification slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [] as any[],
    unreadCount: 0,
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.push(action.payload);
      state.unreadCount += 1;
    },
    removeNotification: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
  },
});

// Simple inventory slice for basic store functionality
const inventoryDataSlice = createSlice({
  name: 'inventoryData',
  initialState: {
    productTypes: [],
    productGroups: [],
    productCategories: [],
    productMaster: [],
    uom: [],
    referenceData: {},
    search: {},
    selectedItems: {},
  } as any,
  reducers: {
    setProductTypes: (state, action) => {
      state.productTypes = action.payload;
    },
    setProductGroups: (state, action) => {
      state.productGroups = action.payload;
    },
  },
});

// Export basic actions
export const {
  setProductTypes: setBasicProductTypes,
  setProductGroups: setBasicProductGroups,
} = inventoryDataSlice.actions;

// Simple cache slice
const cacheSlice = createSlice({
  name: 'cache',
  initialState: {
    apiCache: {},
    hitCount: 0,
    missCount: 0,
  } as any,
  reducers: {
    setCacheData: (state, action) => {
      const { key, data } = action.payload;
      state.apiCache[key] = data;
    },
  },
});

// Export actions
export const { setThemeMode, setDensity, toggleSidebar, setLoading, setError } =
  uiSlice.actions;
export const { addNotification, removeNotification } =
  notificationSlice.actions;

// Configure the Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiSlice.reducer,
    vendor: vendorReducer,
    notifications: notificationSlice.reducer,
    inventory: inventoryReducer,
    cache: cacheSlice.reducer,
    // Add the generated reducer as a specific top-level slice
    [inventoryApi.reducerPath]: inventoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: [
          'cache/setCacheData',
          'notifications/addNotification',
          'persist/PERSIST',
          'persist/REHYDRATE',
        ],
        // Ignore these field paths in all actions
        ignoredActionsPaths: [
          'meta.arg',
          'payload.timestamp',
          'payload.action.handler',
        ],
        // Ignore these paths in the state
        ignoredPaths: ['notifications.items', 'cache.apiCache'],
      },
      // Enable thunk middleware for async actions
      thunk: {
        extraArgument: {
          // You can add extra services here like API clients
        },
      },
    })
      // Adding the api middleware enables caching, invalidation, polling, and other features of RTK Query
      .concat(inventoryApi.middleware)
      .concat(listenerMiddleware.middleware)
      .concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production' && {
    // Enhanced DevTools configuration
    name: 'Inventory Management Redux Store',
    trace: true,
    traceLimit: 25,
    actionSanitizer: (action: any) => ({
      ...action,
      // Sanitize sensitive data in DevTools
      payload:
        action.type.includes('auth') && action.payload?.password
          ? { ...action.payload, password: '[REDACTED]' }
          : action.payload,
    }),
    stateSanitizer: (state: any) => ({
      ...state,
      // Hide sensitive data in DevTools
      auth: {
        ...state.auth,
        token: state.auth.token ? '[REDACTED]' : null,
        refreshToken: state.auth.refreshToken ? '[REDACTED]' : null,
      },
    }),
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Run the root saga
sagaMiddleware.run(rootSaga);

// Export store instance
export default store;
