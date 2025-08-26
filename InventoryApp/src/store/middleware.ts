import {
  createListenerMiddleware,
  type TypedStartListening,
} from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from './index';
import { setLoading, setError, addNotification } from './index';

// Create the middleware instance
export const listenerMiddleware = createListenerMiddleware();

// Type the listener effects
type AppStartListening = TypedStartListening<RootState, AppDispatch>;
export const startAppListening =
  listenerMiddleware.startListening as AppStartListening;

// Simple loading state management for async actions
startAppListening({
  predicate: (action) => action.type.endsWith('/pending'),
  effect: async (action, listenerApi) => {
    const actionType = action.type.replace('/pending', '');
    listenerApi.dispatch(setLoading({ key: actionType, loading: true }));
    // Clear any previous errors
    listenerApi.dispatch(setError({ key: actionType, error: null }));
  },
});

startAppListening({
  predicate: (action) => action.type.endsWith('/fulfilled'),
  effect: async (action, listenerApi) => {
    const actionType = action.type.replace('/fulfilled', '');
    listenerApi.dispatch(setLoading({ key: actionType, loading: false }));

    // Auto-notification for successful operations
    if (
      action.type.includes('create') ||
      action.type.includes('update') ||
      action.type.includes('delete')
    ) {
      const operationType = action.type.includes('create')
        ? 'created'
        : action.type.includes('update')
          ? 'updated'
          : 'deleted';
      const entityType = actionType.split('/')[0];

      listenerApi.dispatch(
        addNotification({
          id: `success_${Date.now()}`,
          message: `${entityType} ${operationType} successfully`,
          type: 'success',
          timestamp: new Date().toISOString(),
        })
      );
    }
  },
});

startAppListening({
  predicate: (action) => action.type.endsWith('/rejected'),
  effect: async (action, listenerApi) => {
    const actionType = action.type.replace('/rejected', '');
    listenerApi.dispatch(setLoading({ key: actionType, loading: false }));

    const errorMessage = (action.payload as string) || 'An error occurred';
    listenerApi.dispatch(setError({ key: actionType, error: errorMessage }));

    // Auto-notification for errors
    listenerApi.dispatch(
      addNotification({
        id: `error_${Date.now()}`,
        message: errorMessage,
        type: 'error',
        timestamp: new Date().toISOString(),
        isRead: false,
      })
    );
  },
});

// Persistent storage for important data
startAppListening({
  predicate: (action) =>
    action.type.includes('auth/') ||
    action.type.includes('ui/setThemeMode') ||
    action.type.includes('ui/setDensity'),
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState();

    // Persist auth state
    if (action.type.includes('auth/')) {
      try {
        localStorage.setItem(
          'auth_state',
          JSON.stringify({
            token: state.auth?.token,
            refreshToken: state.auth?.refreshToken,
            user: state.auth?.user,
          })
        );
      } catch (error) {
        console.warn('Failed to persist auth state:', error);
      }
    }

    // Persist UI preferences
    if (action.type.includes('ui/')) {
      try {
        localStorage.setItem(
          'ui_preferences',
          JSON.stringify({
            theme: state.ui?.theme,
            layout: state.ui?.layout,
            sidebar: state.ui?.sidebar,
          })
        );
      } catch (error) {
        console.warn('Failed to persist UI preferences:', error);
      }
    }
  },
});

// Performance monitoring (simplified)
let performanceMetrics = {
  actionCount: 0,
  slowActions: [] as Array<{ type: string; timestamp: number }>,
};

startAppListening({
  predicate: () => true, // Listen to all actions
  effect: async (action) => {
    performanceMetrics.actionCount++;

    // Track actions that might be slow
    if (action.type.includes('fetch') || action.type.includes('api')) {
      performanceMetrics.slowActions.push({
        type: action.type,
        timestamp: Date.now(),
      });

      // Keep only last 50 entries
      if (performanceMetrics.slowActions.length > 50) {
        performanceMetrics.slowActions =
          performanceMetrics.slowActions.slice(-50);
      }
    }
  },
});

// Export performance metrics for debugging
export const getPerformanceMetrics = () => ({ ...performanceMetrics });

// Reset performance metrics
export const resetPerformanceMetrics = () => {
  performanceMetrics = {
    actionCount: 0,
    slowActions: [],
  };
};

// Middleware configuration
export const middleware = listenerMiddleware.middleware;
