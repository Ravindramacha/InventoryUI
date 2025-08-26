import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';
import {
  setThemeMode,
  setDensity,
  toggleSidebar,
  setLoading,
  setError,
  addNotification,
  removeNotification,
} from './index';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hook for loading states
export const useLoadingState = (actionType: string) => {
  return useAppSelector((state) => state.ui?.loading?.[actionType] || false);
};

// Custom hook for error states
export const useErrorState = (actionType: string) => {
  return useAppSelector((state) => state.ui?.errors?.[actionType] || null);
};

// Custom hook for notifications
export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications.items);
  const unreadCount = useAppSelector(
    (state) => state.notifications.unreadCount
  );

  const addNotificationHandler = useCallback(
    (notification: any) => {
      const notificationWithId = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        isRead: false,
        ...notification,
      };
      dispatch(addNotification(notificationWithId));
    },
    [dispatch]
  );

  const removeNotificationHandler = useCallback(
    (id: string) => {
      dispatch(removeNotification(id));
    },
    [dispatch]
  );

  return {
    notifications,
    unreadCount,
    addNotification: addNotificationHandler,
    removeNotification: removeNotificationHandler,
  };
};

// Theme management hook
export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);

  const setMode = useCallback(
    (mode: 'light' | 'dark') => {
      dispatch(setThemeMode(mode));
    },
    [dispatch]
  );

  const setDensityMode = useCallback(
    (density: string) => {
      dispatch(setDensity(density));
    },
    [dispatch]
  );

  return {
    theme,
    setMode,
    setDensityMode,
  };
};

// Sidebar management hook
export const useSidebar = () => {
  const dispatch = useAppDispatch();
  const sidebar = useAppSelector((state) => state.ui.sidebar);

  const toggle = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  return {
    sidebar,
    toggle,
  };
};

// Loading and error management
export const useAsyncState = (key: string) => {
  const dispatch = useAppDispatch();
  const isLoading = useLoadingState(key);
  const error = useErrorState(key);

  const setLoadingState = useCallback(
    (loading: boolean) => {
      dispatch(setLoading({ key, loading }));
    },
    [dispatch, key]
  );

  const setErrorState = useCallback(
    (error: any) => {
      dispatch(setError({ key, error }));
    },
    [dispatch, key]
  );

  return {
    isLoading,
    error,
    setLoading: setLoadingState,
    setError: setErrorState,
  };
};

// Inventory state hook
export const useInventory = () => {
  const inventory = useAppSelector((state) => state.inventory);

  return {
    productTypes: inventory.productTypes || [],
    productGroups: inventory.productGroups || [],
    productCategories: inventory.productCategories || [],
    productMaster: inventory.productMaster || [],
    uom: inventory.uom || [],
  };
};

// Performance metrics hook
export const usePerformanceMetrics = () => {
  const cacheMetrics = useAppSelector((state) => ({
    hitCount: state.cache?.hitCount || 0,
    missCount: state.cache?.missCount || 0,
  }));

  const notificationMetrics = useAppSelector((state) => ({
    totalNotifications: state.notifications?.items?.length || 0,
    unreadCount: state.notifications?.unreadCount || 0,
  }));

  const hitRatio = useMemo(() => {
    const total = cacheMetrics.hitCount + cacheMetrics.missCount;
    return total > 0 ? cacheMetrics.hitCount / total : 0;
  }, [cacheMetrics.hitCount, cacheMetrics.missCount]);

  return {
    cache: {
      ...cacheMetrics,
      hitRatio,
    },
    notifications: notificationMetrics,
  };
};
