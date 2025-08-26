import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hook for loading states
export const useLoadingState = (actionType: string) => {
  return useAppSelector((state) => state.ui.loading[actionType] || false);
};

// Custom hook for error states
export const useErrorState = (actionType: string) => {
  return useAppSelector((state) => state.ui.errors[actionType] || null);
};

// Async action status hook
export const useAsyncActionStatus = (actionType: string) => {
  const loading = useLoadingState(actionType);
  const error = useErrorState(actionType);

  return {
    loading,
    error,
    success: !loading && !error,
  };
};
