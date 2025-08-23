import { useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from './enhancedHooks';
import { useCallback, useEffect } from 'react';
import { addNotification } from './index';

// Hook to integrate existing React Query data with Redux
export const useReduxQueryIntegration = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  
  // Sync React Query cache with Redux
  const syncQueryDataToRedux = useCallback((queryKey: string[], data: any) => {
    const [entityType] = queryKey;
    
    // For now, we'll use the notification system to track data sync
    // In the future, you can add specific reducers for each entity type
    dispatch(addNotification({
      id: `sync_${entityType}_${Date.now()}`,
      message: `Synced ${entityType} data to Redux`,
      type: 'info',
      timestamp: new Date().toISOString(),
    }));
    
    // You can extend this switch statement when you add specific reducers
    switch (entityType) {
      case 'productTypes':
      case 'productGroups':
      case 'productCategories':
      case 'languages':
      case 'salesStatuses':
      case 'uomDimensions':
      case 'vendors':
        // These would dispatch to specific reducers when available
        console.log(`Would sync ${entityType} data:`, data);
        break;
      default:
        // For generic data, we can store in a general cache
        console.log(`Caching generic data for ${entityType}:`, data);
    }
  }, [dispatch]);
  
  // Subscribe to React Query cache changes
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'updated' && event.query.state.data) {
        const queryKey = event.query.queryKey as string[];
        syncQueryDataToRedux(queryKey, event.query.state.data);
      }
    });
    
    return unsubscribe;
  }, [queryClient, syncQueryDataToRedux]);
  
  return { syncQueryDataToRedux };
};

// Enhanced hooks that combine React Query with Redux
export const useEnhancedProductTypes = () => {
  const dispatch = useAppDispatch();
  const reduxData = useAppSelector((state) => state.inventory.productTypes);
  const cachedData = useAppSelector((state) => state.cache?.apiCache?.['api_productTypes']);
  
  // Return both React Query and Redux data
  return {
    reduxData,
    cachedData,
    dispatch,
    // Methods to update Redux state directly
    updateReduxState: (data: any[]) => {
      dispatch(addNotification({
        id: `update_product_types_${Date.now()}`,
        message: 'Product types updated',
        type: 'success',
      }));
      // When specific reducers are available, dispatch the actual update
      console.log('Would update product types:', data);
    },
  };
};

export const useEnhancedVendors = () => {
  const dispatch = useAppDispatch();
  const reduxData = useAppSelector((state) => state.vendor?.vendors || []);
  const currentVendor = useAppSelector((state) => state.vendor?.currentVendor);
  const searchFilters = useAppSelector((state) => state.vendor?.search);
  
  return {
    reduxData,
    currentVendor,
    searchFilters,
    dispatch,
    updateReduxState: (data: any[]) => {
      dispatch(addNotification({
        id: `update_vendors_${Date.now()}`,
        message: 'Vendors updated',
        type: 'success',
      }));
      // When specific reducers are available, dispatch the actual update
      console.log('Would update vendors:', data);
    },
  };
};

// Notification integration with existing context
export const useEnhancedNotifications = () => {
  const dispatch = useAppDispatch();
  const reduxNotifications = useAppSelector((state) => state.notifications.items);
  const unreadCount = useAppSelector((state) => state.notifications.unreadCount);
  
  const addReduxNotification = useCallback((
    message: string, 
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    options?: { duration?: number; persistent?: boolean }
  ) => {
    dispatch(addNotification({
      message,
      type,
      ...options,
    }));
  }, [dispatch]);
  
  return {
    notifications: reduxNotifications,
    unreadCount,
    addNotification: addReduxNotification,
  };
};

// Custom hook for form state management with Redux integration
export const useEnhancedFormState = <T extends Record<string, any>>(
  formKey: string,
  initialState: T
) => {
  const dispatch = useAppDispatch();
  const formState = useAppSelector((state) => state.ui.filters[formKey] || initialState);
  
  const updateFormField = useCallback((field: keyof T, value: any) => {
    const newFormState = { ...formState, [field]: value };
    dispatch({ 
      type: 'ui/setFilter', 
      payload: { key: formKey, filter: newFormState } 
    });
  }, [dispatch, formKey, formState]);
  
  const resetForm = useCallback(() => {
    dispatch({ 
      type: 'ui/setFilter', 
      payload: { key: formKey, filter: initialState } 
    });
  }, [dispatch, formKey, initialState]);
  
  return {
    formState,
    updateFormField,
    resetForm,
  };
};

// Optimistic updates helper
export const useOptimisticUpdates = () => {
  const queryClient = useQueryClient();
  
  const performOptimisticUpdate = useCallback(async (
    queryKey: string[],
    updateFunction: (oldData: any) => any
  ) => {
    // Cancel any outgoing refetches
    await queryClient.cancelQueries({ queryKey });
    
    // Snapshot the previous value
    const previousData = queryClient.getQueryData(queryKey);
    
    // Optimistically update to the new value
    queryClient.setQueryData(queryKey, updateFunction);
    
    // Return a context object with the snapshotted value
    return { previousData };
  }, [queryClient]);
  
  const rollbackOptimisticUpdate = useCallback((
    queryKey: string[],
    previousData: any
  ) => {
    queryClient.setQueryData(queryKey, previousData);
  }, [queryClient]);
  
  return {
    performOptimisticUpdate,
    rollbackOptimisticUpdate,
  };
};

// Bulk operations helper
export const useBulkOperations = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  
  const performBulkOperation = useCallback(async (
    operations: Array<{
      type: 'create' | 'update' | 'delete';
      entity: string;
      data: any;
      id?: string | number;
    }>
  ) => {
    const results = [];
    
    for (const operation of operations) {
      try {
        dispatch(addNotification({
          message: `${operation.type}ing ${operation.entity}...`,
          type: 'info',
          duration: 2000,
        }));
        
        // Perform the operation
        // This would integrate with your existing API calls
        const result = await performSingleOperation(operation);
        results.push({ success: true, result, operation });
        
        // Update cache
        queryClient.invalidateQueries({ queryKey: [operation.entity] });
        
      } catch (error) {
        results.push({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Operation failed', 
          operation 
        });
        
        dispatch(addNotification({
          message: `Failed to ${operation.type} ${operation.entity}`,
          type: 'error',
          persistent: true,
        }));
      }
    }
    
    // Summary notification
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;
    
    if (failureCount === 0) {
      dispatch(addNotification({
        message: `Successfully completed ${successCount} operations`,
        type: 'success',
      }));
    } else {
      dispatch(addNotification({
        message: `Completed ${successCount} operations, ${failureCount} failed`,
        type: 'warning',
        persistent: true,
      }));
    }
    
    return results;
  }, [dispatch, queryClient]);
  
  return { performBulkOperation };
};

// Helper function for single operations (you would implement this based on your API)
const performSingleOperation = async (operation: {
  type: 'create' | 'update' | 'delete';
  entity: string;
  data: any;
  id?: string | number;
}) => {
  // This is a placeholder - you would implement actual API calls here
  // based on your existing API structure
  
  const baseUrl = '/api';
  const url = operation.id 
    ? `${baseUrl}/${operation.entity}/${operation.id}`
    : `${baseUrl}/${operation.entity}`;
  
  const method = operation.type === 'create' ? 'POST' : 
                 operation.type === 'update' ? 'PUT' : 'DELETE';
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: operation.type !== 'delete' ? JSON.stringify(operation.data) : undefined,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return operation.type !== 'delete' ? await response.json() : null;
};

// Export all integration utilities
export const ReduxQueryIntegration = {
  useReduxQueryIntegration,
  useEnhancedProductTypes,
  useEnhancedVendors,
  useEnhancedNotifications,
  useEnhancedFormState,
  useOptimisticUpdates,
  useBulkOperations,
};
