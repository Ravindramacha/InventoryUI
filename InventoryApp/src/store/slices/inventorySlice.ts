import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { 
  ProductTypeModel, 
  ProductGroupModel, 
  ProductCategoryModel,
  ReadProductMasterForm,
  UomModel,
  UomDimensionModel,
  LanguageModel,
  SalesStatusModel
} from '../../Models/MaterialModel';

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
}

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
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch');
    }
  }
);

export const createProductType = createAsyncThunk(
  'inventory/createProductType',
  async (productType: Omit<ProductTypeModel, 'productTypeId'>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/products/types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productType),
      });
      if (!response.ok) throw new Error('Failed to create product type');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create');
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
        item => item.productTypeId === action.payload.productTypeId
      );
      if (index !== -1) {
        state.productTypes.items[index] = action.payload;
      }
    },
    removeProductType: (state, action: PayloadAction<number>) => {
      state.productTypes.items = state.productTypes.items.filter(
        item => item.productTypeId !== action.payload
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
        item => item.productGroupId === action.payload.productGroupId
      );
      if (index !== -1) {
        state.productGroups.items[index] = action.payload;
      }
    },
    removeProductGroup: (state, action: PayloadAction<number>) => {
      state.productGroups.items = state.productGroups.items.filter(
        item => item.productGroupId !== action.payload
      );
    },
    
    // Product Categories
    setProductCategories: (state, action: PayloadAction<ProductCategoryModel[]>) => {
      state.productCategories.items = action.payload;
      state.productCategories.lastFetch = new Date().toISOString();
    },
    addProductCategory: (state, action: PayloadAction<ProductCategoryModel>) => {
      state.productCategories.items.push(action.payload);
    },
    updateProductCategory: (state, action: PayloadAction<ProductCategoryModel>) => {
      const index = state.productCategories.items.findIndex(
        item => item.productCategoryId === action.payload.productCategoryId
      );
      if (index !== -1) {
        state.productCategories.items[index] = action.payload;
      }
    },
    removeProductCategory: (state, action: PayloadAction<number>) => {
      state.productCategories.items = state.productCategories.items.filter(
        item => item.productCategoryId !== action.payload
      );
    },
    
    // Product Master
    setProductMaster: (state, action: PayloadAction<ReadProductMasterForm[]>) => {
      state.productMaster.items = action.payload;
      state.productMaster.lastFetch = new Date().toISOString();
    },
    addProductMaster: (state, action: PayloadAction<ReadProductMasterForm>) => {
      state.productMaster.items.push(action.payload);
    },
    updateProductMaster: (state, action: PayloadAction<ReadProductMasterForm>) => {
      const index = state.productMaster.items.findIndex(
        item => item.productMasterId === action.payload.productMasterId
      );
      if (index !== -1) {
        state.productMaster.items[index] = action.payload;
      }
    },
    removeProductMaster: (state, action: PayloadAction<number>) => {
      state.productMaster.items = state.productMaster.items.filter(
        item => item.productMasterId !== action.payload
      );
    },
    setCurrentProductMaster: (state, action: PayloadAction<ReadProductMasterForm | null>) => {
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
    setSearch: (state, action: PayloadAction<{ category: keyof InventoryState['search']; value: string }>) => {
      const { category, value } = action.payload;
      state.search[category] = value;
    },
    clearSearch: (state, action: PayloadAction<keyof InventoryState['search']>) => {
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
    setSelectedItem: (state, action: PayloadAction<{ 
      category: keyof InventoryState['selectedItems']; 
      item: any 
    }>) => {
      const { category, item } = action.payload;
      state.selectedItems[category] = item;
    },
    clearSelectedItem: (state, action: PayloadAction<keyof InventoryState['selectedItems']>) => {
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
  },
  extraReducers: (builder) => {
    // Product Types
    builder
      .addCase(fetchProductTypes.pending, (state) => {
        state.productTypes.loading = true;
        state.productTypes.error = null;
      })
      .addCase(fetchProductTypes.fulfilled, (state, action) => {
        state.productTypes.loading = false;
        state.productTypes.items = action.payload;
        state.productTypes.lastFetch = new Date().toISOString();
      })
      .addCase(fetchProductTypes.rejected, (state, action) => {
        state.productTypes.loading = false;
        state.productTypes.error = action.payload as string;
      })
      .addCase(createProductType.pending, (state) => {
        state.productTypes.loading = true;
        state.productTypes.error = null;
      })
      .addCase(createProductType.fulfilled, (state, action) => {
        state.productTypes.loading = false;
        state.productTypes.items.push(action.payload);
      })
      .addCase(createProductType.rejected, (state, action) => {
        state.productTypes.loading = false;
        state.productTypes.error = action.payload as string;
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
} = inventorySlice.actions;

// Selectors (commented out to avoid circular dependencies)
// export const selectProductTypes = (state: RootState) => state.inventory.productTypes;
// ... other selectors commented out

// Default export
export default inventorySlice.reducer;
