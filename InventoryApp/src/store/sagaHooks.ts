import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import type { RootState, AppDispatch } from './index';
import {
  // Saga action creators
  fetchLanguagesStart,
  fetchSalesStatusesStart,
  fetchUomDimensionsStart,
  fetchProductTypesStart,
  createProductTypeStart,
  updateProductTypeStart,
  deleteProductTypeStart,
  fetchProductGroupsStart,
  fetchProductCategoriesStart,
  fetchProductMasterStart,
  createProductMasterStart,
  updateProductMasterStart,
  processComplexData,
} from './slices/inventorySlice';

// Define action creators for missing material operations
const fetchMaterialsStart = () => ({ type: 'inventory/fetchMaterialsStart' });
const createMaterialStart = (material: any) => ({
  type: 'inventory/createMaterialStart',
  payload: material,
});
const searchMaterialsStart = (searchParams: any) => ({
  type: 'inventory/searchMaterialsStart',
  payload: searchParams,
});

// Saga hooks for inventory operations
export const useInventorySaga = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useMemo(
    () => ({
      // Reference Data Operations
      fetchLanguages: () => dispatch(fetchLanguagesStart()),
      fetchSalesStatuses: () => dispatch(fetchSalesStatusesStart()),
      fetchUomDimensions: () => dispatch(fetchUomDimensionsStart()),

      // Material Operations (using ProductMaster as Material)
      fetchMaterials: () => dispatch(fetchMaterialsStart()),
      createMaterial: (material: any) =>
        dispatch(createMaterialStart(material)),
      searchMaterials: (searchParams: any) =>
        dispatch(searchMaterialsStart(searchParams)),

      // Product Type Operations
      fetchProductTypes: () => dispatch(fetchProductTypesStart()),
      createProductType: (productType: any) =>
        dispatch(createProductTypeStart(productType)),
      updateProductType: (id: number, productType: any) =>
        dispatch(updateProductTypeStart({ id, productType })),
      deleteProductType: (id: number) => dispatch(deleteProductTypeStart(id)),

      // Product Group Operations
      fetchProductGroups: () => dispatch(fetchProductGroupsStart()),

      // Product Category Operations
      fetchProductCategories: () => dispatch(fetchProductCategoriesStart()),

      // Product Master Operations
      fetchProductMaster: (id: number) => dispatch(fetchProductMasterStart(id)),
      createProductMaster: (productMaster: any) =>
        dispatch(createProductMasterStart(productMaster)),
      updateProductMaster: (id: number, productMaster: any) =>
        dispatch(updateProductMasterStart({ id, productMaster })),

      // Complex Data Processing
      processComplexData: (data: any) => dispatch(processComplexData(data)),
    }),
    [dispatch]
  );
};

// Selector hooks for accessing state
export const useInventoryState = () => {
  return useSelector((state: RootState) => state.inventory);
};

export const useComplexData = () => {
  const complexData = useSelector(
    (state: RootState) => state.inventory.complexData
  );

  return {
    materials: complexData?.materials?.data || [],
    vendors: complexData?.vendors?.data || [],
    searchResults: complexData?.searchResults?.data || [],
    analytics: complexData?.analytics?.data || {},
    metadata: complexData?.metadata?.data || {},
    pagination: complexData?.pagination?.data || {},
    // Add dynamic access to complex data
    ...Object.keys(complexData || {}).reduce((acc, key) => {
      acc[key] = complexData?.[key]?.data || complexData?.[key];
      return acc;
    }, {} as any),
  };
};

export const useLoadingStates = () => {
  const loadingStates = useSelector(
    (state: RootState) => state.inventory.loadingStates
  );

  return {
    isFetching: loadingStates?.fetchMaterials || false,
    isCreating: loadingStates?.createMaterial || false,
    isSearching: loadingStates?.searchMaterials || false,
    isUpdating: loadingStates?.updateMaterial || false,
    isDeleting: loadingStates?.deleteMaterial || false,
    // Add other loading states dynamically
    ...loadingStates,
  };
};

export const useErrorStates = () => {
  const errorStates = useSelector(
    (state: RootState) => state.inventory.errorStates
  );

  return {
    fetchError: errorStates?.fetchMaterials || null,
    createError: errorStates?.createMaterial || null,
    searchError: errorStates?.searchMaterials || null,
    updateError: errorStates?.updateMaterial || null,
    deleteError: errorStates?.deleteMaterial || null,
    // Add other error states dynamically
    ...errorStates,
  };
};

// Specific data selectors
export const useProductTypes = () => {
  return useSelector((state: RootState) => state.inventory.productTypes);
};

export const useProductGroups = () => {
  return useSelector((state: RootState) => state.inventory.productGroups);
};

export const useProductCategories = () => {
  return useSelector((state: RootState) => state.inventory.productCategories);
};

export const useProductMaster = () => {
  return useSelector((state: RootState) => state.inventory.productMaster);
};

export const useReferenceData = () => {
  return useSelector((state: RootState) => state.inventory.referenceData);
};

export const useUomData = () => {
  return useSelector((state: RootState) => state.inventory.uom);
};

// Complex data specific selectors
export const useComplexDataItem = (key: string) => {
  return useSelector((state: RootState) => state.inventory.complexData[key]);
};

export const useLoadingState = (key: string) => {
  return useSelector(
    (state: RootState) => state.inventory.loadingStates[key] || false
  );
};

export const useErrorState = (key: string) => {
  return useSelector(
    (state: RootState) => state.inventory.errorStates[key] || null
  );
};

// Combined hook for a specific operation
export const useInventoryOperation = (operationKey: string) => {
  const complexData = useComplexDataItem(operationKey);
  const loading = useLoadingState(operationKey);
  const error = useErrorState(operationKey);

  return {
    data: complexData?.data,
    metadata: complexData?.metadata,
    loading,
    error,
  };
};

// Auth saga hooks (placeholder for when auth slice is updated)
export const useAuthSaga = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useMemo(
    () => ({
      login: (credentials: { username: string; password: string }) =>
        dispatch({ type: 'auth/loginStart', payload: credentials }),
      logout: () => dispatch({ type: 'auth/logoutStart' }),
      register: (userData: any) =>
        dispatch({ type: 'auth/registerStart', payload: userData }),
      refreshToken: (token: string) =>
        dispatch({ type: 'auth/refreshTokenStart', payload: token }),
      getUserProfile: () => dispatch({ type: 'auth/getUserProfileStart' }),
    }),
    [dispatch]
  );
};

// Vendor saga hooks (placeholder for when vendor slice is updated)
export const useVendorSaga = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useMemo(
    () => ({
      fetchVendors: () => dispatch({ type: 'vendor/fetchVendorsStart' }),
      createVendor: (vendorData: any) =>
        dispatch({ type: 'vendor/createVendorStart', payload: vendorData }),
      updateVendor: (id: number, vendorData: any) =>
        dispatch({
          type: 'vendor/updateVendorStart',
          payload: { id, vendorData },
        }),
      deleteVendor: (id: number) =>
        dispatch({ type: 'vendor/deleteVendorStart', payload: id }),
      fetchVendorById: (id: number) =>
        dispatch({ type: 'vendor/fetchVendorByIdStart', payload: id }),
    }),
    [dispatch]
  );
};
