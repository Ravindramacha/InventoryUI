import {
  createSlice,
  createAsyncThunk,
  createAction,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type {
  ProductTypeModel,
  ProductGroupModel,
  ProductCategoryModel,
  ReadProductMasterForm,
  UomModel,
  UomDimensionModel,
  LanguageModel,
  SalesStatusModel,
  PostProductType,
  PostProductMasterForm,
} from '../../Models/MaterialModel';

// Complex Data Structure for Saga Management
export interface ComplexDataItem {
  data: any;
  metadata: {
    fetchedAt?: string;
    processedAt?: string;
    version?: string;
    count?: number;
    id?: number;
    [key: string]: any;
  };
}

export interface ComplexDataState {
  [key: string]: ComplexDataItem;
}

// Types
export interface InventoryState {
  // Product Types
  productTypes: {
    items: ProductTypeModel[];
    loading: boolean;
    error: string | null;
    lastFetch: string | null;
  };

  // Product Groups
  productGroups: {
    items: ProductGroupModel[];
    loading: boolean;
    error: string | null;
    lastFetch: string | null;
  };

  // Product Categories
  productCategories: {
    items: ProductCategoryModel[];
    loading: boolean;
    error: string | null;
    lastFetch: string | null;
  };

  // Product Master
  productMaster: {
    items: ReadProductMasterForm[];
    loading: boolean;
    error: string | null;
    lastFetch: string | null;
    currentItem: ReadProductMasterForm | null;
  };

  // UOM Management
  uom: {
    dimensions: UomDimensionModel[];
    units: UomModel[];
    loading: boolean;
    error: string | null;
    lastFetch: string | null;
  };

  // Reference Data
  referenceData: {
    languages: LanguageModel[];
    salesStatuses: SalesStatusModel[];
    loading: boolean;
    error: string | null;
    lastFetch: string | null;
  };

  // Search and Filters
  search: {
    productTypes: string;
    productGroups: string;
    productCategories: string;
    productMaster: string;
  };

  // Selected Items
  selectedItems: {
    productType: ProductTypeModel | null;
    productGroup: ProductGroupModel | null;
    productCategory: ProductCategoryModel | null;
    productMaster: ReadProductMasterForm | null;
  };

  // Complex Data Management for Saga
  complexData: ComplexDataState;

  // Loading States for Different Operations
  loadingStates: {
    [key: string]: boolean;
  };

  // Error States for Different Operations
  errorStates: {
    [key: string]: string | null;
  };
}

// Saga Action Creators
export const fetchLanguagesStart = createAction(
  'inventory/fetchLanguagesStart'
);
export const fetchLanguagesSuccess = createAction<LanguageModel[]>(
  'inventory/fetchLanguagesSuccess'
);
export const fetchLanguagesFailure = createAction<string>(
  'inventory/fetchLanguagesFailure'
);

export const fetchSalesStatusesStart = createAction(
  'inventory/fetchSalesStatusesStart'
);
export const fetchSalesStatusesSuccess = createAction<SalesStatusModel[]>(
  'inventory/fetchSalesStatusesSuccess'
);
export const fetchSalesStatusesFailure = createAction<string>(
  'inventory/fetchSalesStatusesFailure'
);

export const fetchUomDimensionsStart = createAction(
  'inventory/fetchUomDimensionsStart'
);
export const fetchUomDimensionsSuccess = createAction<UomDimensionModel[]>(
  'inventory/fetchUomDimensionsSuccess'
);
export const fetchUomDimensionsFailure = createAction<string>(
  'inventory/fetchUomDimensionsFailure'
);

export const fetchProductTypesStart = createAction(
  'inventory/fetchProductTypesStart'
);
export const fetchProductTypesSuccess = createAction<ProductTypeModel[]>(
  'inventory/fetchProductTypesSuccess'
);
export const fetchProductTypesFailure = createAction<string>(
  'inventory/fetchProductTypesFailure'
);

export const createProductTypeStart = createAction<PostProductType>(
  'inventory/createProductTypeStart'
);
export const createProductTypeSuccess = createAction<ProductTypeModel>(
  'inventory/createProductTypeSuccess'
);
export const createProductTypeFailure = createAction<string>(
  'inventory/createProductTypeFailure'
);

export const updateProductTypeStart = createAction<{
  id: number;
  productType: Partial<ProductTypeModel>;
}>('inventory/updateProductTypeStart');
export const updateProductTypeSuccess = createAction<ProductTypeModel>(
  'inventory/updateProductTypeSuccess'
);
export const updateProductTypeFailure = createAction<string>(
  'inventory/updateProductTypeFailure'
);

export const deleteProductTypeStart = createAction<number>(
  'inventory/deleteProductTypeStart'
);
export const deleteProductTypeSuccess = createAction<number>(
  'inventory/deleteProductTypeSuccess'
);
export const deleteProductTypeFailure = createAction<string>(
  'inventory/deleteProductTypeFailure'
);

export const fetchProductGroupsStart = createAction(
  'inventory/fetchProductGroupsStart'
);
export const fetchProductGroupsSuccess = createAction<ProductGroupModel[]>(
  'inventory/fetchProductGroupsSuccess'
);
export const fetchProductGroupsFailure = createAction<string>(
  'inventory/fetchProductGroupsFailure'
);

export const fetchProductCategoriesStart = createAction(
  'inventory/fetchProductCategoriesStart'
);
export const fetchProductCategoriesSuccess = createAction<
  ProductCategoryModel[]
>('inventory/fetchProductCategoriesSuccess');
export const fetchProductCategoriesFailure = createAction<string>(
  'inventory/fetchProductCategoriesFailure'
);

export const fetchProductMasterStart = createAction<number>(
  'inventory/fetchProductMasterStart'
);
export const fetchProductMasterSuccess = createAction<ReadProductMasterForm>(
  'inventory/fetchProductMasterSuccess'
);
export const fetchProductMasterFailure = createAction<string>(
  'inventory/fetchProductMasterFailure'
);

export const createProductMasterStart = createAction<PostProductMasterForm>(
  'inventory/createProductMasterStart'
);
export const createProductMasterSuccess = createAction<ReadProductMasterForm>(
  'inventory/createProductMasterSuccess'
);
export const createProductMasterFailure = createAction<string>(
  'inventory/createProductMasterFailure'
);

export const updateProductMasterStart = createAction<{
  id: number;
  productMaster: Partial<PostProductMasterForm>;
}>('inventory/updateProductMasterStart');
export const updateProductMasterSuccess = createAction<ReadProductMasterForm>(
  'inventory/updateProductMasterSuccess'
);
export const updateProductMasterFailure = createAction<string>(
  'inventory/updateProductMasterFailure'
);

// Complex Data Management Actions
export const setComplexData = createAction<{
  key: string;
  data: any;
  metadata: any;
}>('inventory/setComplexData');
export const setLoadingState = createAction<{ key: string; loading: boolean }>(
  'inventory/setLoadingState'
);
export const setErrorState = createAction<{
  key: string;
  error: string | null;
}>('inventory/setErrorState');
export const processComplexData = createAction('inventory/processComplexData');

// Initial state
const initialState: InventoryState = {
  productTypes: {
    items: [],
    loading: false,
    error: null,
    lastFetch: null,
  },
  productGroups: {
    items: [],
    loading: false,
    error: null,
    lastFetch: null,
  },
  productCategories: {
    items: [],
    loading: false,
    error: null,
    lastFetch: null,
  },
  productMaster: {
    items: [],
    loading: false,
    error: null,
    lastFetch: null,
    currentItem: null,
  },
  uom: {
    dimensions: [],
    units: [],
    loading: false,
    error: null,
    lastFetch: null,
  },
  referenceData: {
    languages: [],
    salesStatuses: [],
    loading: false,
    error: null,
    lastFetch: null,
  },
  search: {
    productTypes: '',
    productGroups: '',
    productCategories: '',
    productMaster: '',
  },
  selectedItems: {
    productType: null,
    productGroup: null,
    productCategory: null,
    productMaster: null,
  },
  complexData: {},
  loadingStates: {},
  errorStates: {},
};

// Async thunks would go here - for now I'll create placeholders
export const fetchProductTypes = createAsyncThunk(
  'inventory/fetchProductTypes',
  async (_, { rejectWithValue }) => {
    try {
      // This would call your existing API
      const response = await fetch('/api/products/types');
      if (!response.ok) throw new Error('Failed to fetch product types');
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch'
      );
    }
  }
);

export const createProductType = createAsyncThunk(
  'inventory/createProductType',
  async (
    productType: Omit<ProductTypeModel, 'productTypeId'>,
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch('/api/products/types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productType),
      });
      if (!response.ok) throw new Error('Failed to create product type');
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to create'
      );
    }
  }
);

// Slice
export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    // Product Types
    setProductTypes: (state, action: PayloadAction<ProductTypeModel[]>) => {
      state.productTypes.items = action.payload;
      state.productTypes.lastFetch = new Date().toISOString();
    },
    addProductType: (state, action: PayloadAction<ProductTypeModel>) => {
      state.productTypes.items.push(action.payload);
    },
    updateProductType: (state, action: PayloadAction<ProductTypeModel>) => {
      const index = state.productTypes.items.findIndex(
        (item) => item.productTypeId === action.payload.productTypeId
      );
      if (index !== -1) {
        state.productTypes.items[index] = action.payload;
      }
    },
    removeProductType: (state, action: PayloadAction<number>) => {
      state.productTypes.items = state.productTypes.items.filter(
        (item) => item.productTypeId !== action.payload
      );
    },

    // Product Groups
    setProductGroups: (state, action: PayloadAction<ProductGroupModel[]>) => {
      state.productGroups.items = action.payload;
      state.productGroups.lastFetch = new Date().toISOString();
    },
    addProductGroup: (state, action: PayloadAction<ProductGroupModel>) => {
      state.productGroups.items.push(action.payload);
    },
    updateProductGroup: (state, action: PayloadAction<ProductGroupModel>) => {
      const index = state.productGroups.items.findIndex(
        (item) => item.productGroupId === action.payload.productGroupId
      );
      if (index !== -1) {
        state.productGroups.items[index] = action.payload;
      }
    },
    removeProductGroup: (state, action: PayloadAction<number>) => {
      state.productGroups.items = state.productGroups.items.filter(
        (item) => item.productGroupId !== action.payload
      );
    },

    // Product Categories
    setProductCategories: (
      state,
      action: PayloadAction<ProductCategoryModel[]>
    ) => {
      state.productCategories.items = action.payload;
      state.productCategories.lastFetch = new Date().toISOString();
    },
    addProductCategory: (
      state,
      action: PayloadAction<ProductCategoryModel>
    ) => {
      state.productCategories.items.push(action.payload);
    },
    updateProductCategory: (
      state,
      action: PayloadAction<ProductCategoryModel>
    ) => {
      const index = state.productCategories.items.findIndex(
        (item) => item.productCategoryId === action.payload.productCategoryId
      );
      if (index !== -1) {
        state.productCategories.items[index] = action.payload;
      }
    },
    removeProductCategory: (state, action: PayloadAction<number>) => {
      state.productCategories.items = state.productCategories.items.filter(
        (item) => item.productCategoryId !== action.payload
      );
    },

    // Product Master
    setProductMaster: (
      state,
      action: PayloadAction<ReadProductMasterForm[]>
    ) => {
      state.productMaster.items = action.payload;
      state.productMaster.lastFetch = new Date().toISOString();
    },
    addProductMaster: (state, action: PayloadAction<ReadProductMasterForm>) => {
      state.productMaster.items.push(action.payload);
    },
    updateProductMaster: (
      state,
      action: PayloadAction<ReadProductMasterForm>
    ) => {
      const index = state.productMaster.items.findIndex(
        (item) => item.productMasterId === action.payload.productMasterId
      );
      if (index !== -1) {
        state.productMaster.items[index] = action.payload;
      }
    },
    removeProductMaster: (state, action: PayloadAction<number>) => {
      state.productMaster.items = state.productMaster.items.filter(
        (item) => item.productMasterId !== action.payload
      );
    },
    setCurrentProductMaster: (
      state,
      action: PayloadAction<ReadProductMasterForm | null>
    ) => {
      state.productMaster.currentItem = action.payload;
    },

    // UOM Management
    setUomDimensions: (state, action: PayloadAction<UomDimensionModel[]>) => {
      state.uom.dimensions = action.payload;
      state.uom.lastFetch = new Date().toISOString();
    },
    setUomUnits: (state, action: PayloadAction<UomModel[]>) => {
      state.uom.units = action.payload;
    },

    // Reference Data
    setLanguages: (state, action: PayloadAction<LanguageModel[]>) => {
      state.referenceData.languages = action.payload;
      state.referenceData.lastFetch = new Date().toISOString();
    },
    setSalesStatuses: (state, action: PayloadAction<SalesStatusModel[]>) => {
      state.referenceData.salesStatuses = action.payload;
    },

    // Search
    setSearch: (
      state,
      action: PayloadAction<{
        category: keyof InventoryState['search'];
        value: string;
      }>
    ) => {
      const { category, value } = action.payload;
      state.search[category] = value;
    },
    clearSearch: (
      state,
      action: PayloadAction<keyof InventoryState['search']>
    ) => {
      state.search[action.payload] = '';
    },
    clearAllSearch: (state) => {
      state.search = {
        productTypes: '',
        productGroups: '',
        productCategories: '',
        productMaster: '',
      };
    },

    // Selected Items
    setSelectedItem: (
      state,
      action: PayloadAction<{
        category: keyof InventoryState['selectedItems'];
        item: any;
      }>
    ) => {
      const { category, item } = action.payload;
      state.selectedItems[category] = item;
    },
    clearSelectedItem: (
      state,
      action: PayloadAction<keyof InventoryState['selectedItems']>
    ) => {
      state.selectedItems[action.payload] = null;
    },
    clearAllSelectedItems: (state) => {
      state.selectedItems = {
        productType: null,
        productGroup: null,
        productCategory: null,
        productMaster: null,
      };
    },

    // Complex Data Management
    setComplexDataItem: (
      state,
      action: PayloadAction<{ key: string; data: any; metadata: any }>
    ) => {
      const { key, data, metadata } = action.payload;
      state.complexData[key] = { data, metadata };
    },

    removeComplexDataItem: (state, action: PayloadAction<string>) => {
      delete state.complexData[action.payload];
    },

    updateComplexDataMetadata: (
      state,
      action: PayloadAction<{ key: string; metadata: any }>
    ) => {
      const { key, metadata } = action.payload;
      if (state.complexData[key]) {
        state.complexData[key].metadata = {
          ...state.complexData[key].metadata,
          ...metadata,
        };
      }
    },

    // Loading States Management
    setLoadingStateItem: (
      state,
      action: PayloadAction<{ key: string; loading: boolean }>
    ) => {
      const { key, loading } = action.payload;
      state.loadingStates[key] = loading;
    },

    clearLoadingState: (state, action: PayloadAction<string>) => {
      delete state.loadingStates[action.payload];
    },

    // Error States Management
    setErrorStateItem: (
      state,
      action: PayloadAction<{ key: string; error: string | null }>
    ) => {
      const { key, error } = action.payload;
      state.errorStates[key] = error;
    },

    clearErrorState: (state, action: PayloadAction<string>) => {
      delete state.errorStates[action.payload];
    },

    clearAllErrors: (state) => {
      state.errorStates = {};
    },
  },
  extraReducers: (builder) => {
    // Saga Action Reducers
    builder
      // Languages
      .addCase(fetchLanguagesSuccess, (state, action) => {
        state.referenceData.languages = action.payload;
        state.referenceData.lastFetch = new Date().toISOString();
      })
      .addCase(fetchLanguagesFailure, (state, action) => {
        state.referenceData.error = action.payload;
      })

      // Sales Statuses
      .addCase(fetchSalesStatusesSuccess, (state, action) => {
        state.referenceData.salesStatuses = action.payload;
      })
      .addCase(fetchSalesStatusesFailure, (state, action) => {
        state.referenceData.error = action.payload;
      })

      // UOM Dimensions
      .addCase(fetchUomDimensionsSuccess, (state, action) => {
        state.uom.dimensions = action.payload;
        state.uom.lastFetch = new Date().toISOString();
      })
      .addCase(fetchUomDimensionsFailure, (state, action) => {
        state.uom.error = action.payload;
      })

      // Product Types
      .addCase(fetchProductTypesSuccess, (state, action) => {
        state.productTypes.items = action.payload;
        state.productTypes.lastFetch = new Date().toISOString();
      })
      .addCase(fetchProductTypesFailure, (state, action) => {
        state.productTypes.error = action.payload;
      })
      .addCase(createProductTypeSuccess, (state, action) => {
        state.productTypes.items.push(action.payload);
      })
      .addCase(createProductTypeFailure, (state, action) => {
        state.productTypes.error = action.payload;
      })
      .addCase(updateProductTypeSuccess, (state, action) => {
        const index = state.productTypes.items.findIndex(
          (item) => item.productTypeId === action.payload.productTypeId
        );
        if (index !== -1) {
          state.productTypes.items[index] = action.payload;
        }
      })
      .addCase(updateProductTypeFailure, (state, action) => {
        state.productTypes.error = action.payload;
      })
      .addCase(deleteProductTypeSuccess, (state, action) => {
        state.productTypes.items = state.productTypes.items.filter(
          (item) => item.productTypeId !== action.payload
        );
      })
      .addCase(deleteProductTypeFailure, (state, action) => {
        state.productTypes.error = action.payload;
      })

      // Product Groups
      .addCase(fetchProductGroupsSuccess, (state, action) => {
        state.productGroups.items = action.payload;
        state.productGroups.lastFetch = new Date().toISOString();
      })
      .addCase(fetchProductGroupsFailure, (state, action) => {
        state.productGroups.error = action.payload;
      })

      // Product Categories
      .addCase(fetchProductCategoriesSuccess, (state, action) => {
        state.productCategories.items = action.payload;
        state.productCategories.lastFetch = new Date().toISOString();
      })
      .addCase(fetchProductCategoriesFailure, (state, action) => {
        state.productCategories.error = action.payload;
      })

      // Product Master
      .addCase(fetchProductMasterSuccess, (state, action) => {
        state.productMaster.currentItem = action.payload;
      })
      .addCase(fetchProductMasterFailure, (state, action) => {
        state.productMaster.error = action.payload;
      })
      .addCase(createProductMasterSuccess, (state, action) => {
        state.productMaster.items.push(action.payload);
      })
      .addCase(createProductMasterFailure, (state, action) => {
        state.productMaster.error = action.payload;
      })
      .addCase(updateProductMasterSuccess, (state, action) => {
        const index = state.productMaster.items.findIndex(
          (item) => item.productMasterId === action.payload.productMasterId
        );
        if (index !== -1) {
          state.productMaster.items[index] = action.payload;
        }
        state.productMaster.currentItem = action.payload;
      })
      .addCase(updateProductMasterFailure, (state, action) => {
        state.productMaster.error = action.payload;
      })

      // Complex Data Management
      .addCase(setComplexData, (state, action) => {
        const { key, data, metadata } = action.payload;
        state.complexData[key] = { data, metadata };
      })
      .addCase(setLoadingState, (state, action) => {
        const { key, loading } = action.payload;
        state.loadingStates[key] = loading;
      })
      .addCase(setErrorState, (state, action) => {
        const { key, error } = action.payload;
        state.errorStates[key] = error;
      });
  },
});

// Actions
export const {
  setProductTypes,
  addProductType,
  updateProductType,
  removeProductType,
  setProductGroups,
  addProductGroup,
  updateProductGroup,
  removeProductGroup,
  setProductCategories,
  addProductCategory,
  updateProductCategory,
  removeProductCategory,
  setProductMaster,
  addProductMaster,
  updateProductMaster,
  removeProductMaster,
  setCurrentProductMaster,
  setUomDimensions,
  setUomUnits,
  setLanguages,
  setSalesStatuses,
  setSearch,
  clearSearch,
  clearAllSearch,
  setSelectedItem,
  clearSelectedItem,
  clearAllSelectedItems,
  setComplexDataItem,
  removeComplexDataItem,
  updateComplexDataMetadata,
  setLoadingStateItem,
  clearLoadingState,
  setErrorStateItem,
  clearErrorState,
  clearAllErrors,
} = inventorySlice.actions;

// Selectors (commented out to avoid circular dependencies)
// export const selectProductTypes = (state: RootState) => state.inventory.productTypes;
// ... other selectors commented out

// Default export
export default inventorySlice.reducer;
