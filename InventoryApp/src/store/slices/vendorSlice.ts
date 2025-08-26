import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { RootState } from '../index';
import type {
  VendorModel,
  TaxInformationModel,
  BankModel,
} from '../../Models/VendorModel';

// Types
export interface VendorState {
  vendors: {
    items: VendorModel[];
    loading: boolean;
    error: string | null;
    lastFetch: string | null;
  };

  currentVendor: {
    data: VendorModel | null;
    loading: boolean;
    error: string | null;
  };

  taxInformation: {
    items: TaxInformationModel[];
    loading: boolean;
    error: string | null;
  };

  bankDetails: {
    items: BankModel[];
    loading: boolean;
    error: string | null;
  };

  // Form state for vendor creation/editing
  form: {
    data: Partial<VendorModel>;
    isDirty: boolean;
    validationErrors: Record<string, string>;
  };

  // Search and filtering
  search: {
    term: string;
    filters: {
      country: number | null;
      state: number | null;
      salesStatus: number | null;
      language: number | null;
    };
  };

  // Selection
  selectedVendor: VendorModel | null;
}

// Initial state
const initialState: VendorState = {
  vendors: {
    items: [],
    loading: false,
    error: null,
    lastFetch: null,
  },
  currentVendor: {
    data: null,
    loading: false,
    error: null,
  },
  taxInformation: {
    items: [],
    loading: false,
    error: null,
  },
  bankDetails: {
    items: [],
    loading: false,
    error: null,
  },
  form: {
    data: {},
    isDirty: false,
    validationErrors: {},
  },
  search: {
    term: '',
    filters: {
      country: null,
      state: null,
      salesStatus: null,
      language: null,
    },
  },
  selectedVendor: null,
};

// Async thunks
export const fetchVendors = createAsyncThunk(
  'vendor/fetchVendors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/vendors');
      if (!response.ok) throw new Error('Failed to fetch vendors');
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch'
      );
    }
  }
);

export const createVendor = createAsyncThunk(
  'vendor/createVendor',
  async (vendor: VendorModel, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendor),
      });
      if (!response.ok) throw new Error('Failed to create vendor');
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to create'
      );
    }
  }
);

export const updateVendor = createAsyncThunk(
  'vendor/updateVendor',
  async (
    { id, vendor }: { id: string; vendor: Partial<VendorModel> },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`/api/vendors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendor),
      });
      if (!response.ok) throw new Error('Failed to update vendor');
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update'
      );
    }
  }
);

export const deleteVendor = createAsyncThunk(
  'vendor/deleteVendor',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/vendors/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete vendor');
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to delete'
      );
    }
  }
);

// Slice
export const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    // Vendor management
    setVendors: (state, action: PayloadAction<VendorModel[]>) => {
      state.vendors.items = action.payload;
      state.vendors.lastFetch = new Date().toISOString();
    },
    addVendor: (state, action: PayloadAction<VendorModel>) => {
      state.vendors.items.push(action.payload);
    },
    updateVendorInList: (state, action: PayloadAction<VendorModel>) => {
      const index = state.vendors.items.findIndex(
        (vendor) => vendor.companyName1 === action.payload.companyName1
      );
      if (index !== -1) {
        state.vendors.items[index] = action.payload;
      }
    },
    removeVendor: (state, action: PayloadAction<string>) => {
      state.vendors.items = state.vendors.items.filter(
        (vendor) => vendor.companyName1 !== action.payload
      );
    },

    // Current vendor
    setCurrentVendor: (state, action: PayloadAction<VendorModel | null>) => {
      state.currentVendor.data = action.payload;
    },
    clearCurrentVendor: (state) => {
      state.currentVendor.data = null;
      state.currentVendor.error = null;
    },

    // Tax information
    setTaxInformation: (
      state,
      action: PayloadAction<TaxInformationModel[]>
    ) => {
      state.taxInformation.items = action.payload;
    },
    addTaxInformation: (state, action: PayloadAction<TaxInformationModel>) => {
      state.taxInformation.items.push(action.payload);
    },
    updateTaxInformation: (
      state,
      action: PayloadAction<TaxInformationModel>
    ) => {
      const index = state.taxInformation.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.taxInformation.items[index] = action.payload;
      }
    },
    removeTaxInformation: (state, action: PayloadAction<number>) => {
      state.taxInformation.items = state.taxInformation.items.filter(
        (item) => item.id !== action.payload
      );
    },

    // Bank details
    setBankDetails: (state, action: PayloadAction<BankModel[]>) => {
      state.bankDetails.items = action.payload;
    },
    addBankDetail: (state, action: PayloadAction<BankModel>) => {
      state.bankDetails.items.push(action.payload);
    },
    updateBankDetail: (state, action: PayloadAction<BankModel>) => {
      const index = state.bankDetails.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.bankDetails.items[index] = action.payload;
      }
    },
    removeBankDetail: (state, action: PayloadAction<number>) => {
      state.bankDetails.items = state.bankDetails.items.filter(
        (item) => item.id !== action.payload
      );
    },
    setPrimaryBank: (state, action: PayloadAction<number>) => {
      // Set all banks to non-primary first
      state.bankDetails.items.forEach((bank) => {
        bank.primary = false;
      });
      // Set the selected bank as primary
      const bank = state.bankDetails.items.find(
        (bank) => bank.id === action.payload
      );
      if (bank) {
        bank.primary = true;
      }
    },

    // Form management
    setFormData: (state, action: PayloadAction<Partial<VendorModel>>) => {
      state.form.data = { ...state.form.data, ...action.payload };
      state.form.isDirty = true;
    },
    resetFormData: (state) => {
      state.form.data = {};
      state.form.isDirty = false;
      state.form.validationErrors = {};
    },
    setFormValidationErrors: (
      state,
      action: PayloadAction<Record<string, string>>
    ) => {
      state.form.validationErrors = action.payload;
    },
    clearFormValidationErrors: (state) => {
      state.form.validationErrors = {};
    },
    setFormField: (
      state,
      action: PayloadAction<{ field: string; value: any }>
    ) => {
      const { field, value } = action.payload;
      state.form.data = { ...state.form.data, [field]: value };
      state.form.isDirty = true;

      // Clear validation error for this field
      if (state.form.validationErrors[field]) {
        delete state.form.validationErrors[field];
      }
    },

    // Search and filtering
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.search.term = action.payload;
    },
    setSearchFilter: (
      state,
      action: PayloadAction<{
        filter: keyof VendorState['search']['filters'];
        value: number | null;
      }>
    ) => {
      const { filter, value } = action.payload;
      state.search.filters[filter] = value;
    },
    clearSearchFilters: (state) => {
      state.search.filters = {
        country: null,
        state: null,
        salesStatus: null,
        language: null,
      };
    },
    clearSearch: (state) => {
      state.search.term = '';
      state.search.filters = {
        country: null,
        state: null,
        salesStatus: null,
        language: null,
      };
    },

    // Selection
    setSelectedVendor: (state, action: PayloadAction<VendorModel | null>) => {
      state.selectedVendor = action.payload;
    },
    clearSelectedVendor: (state) => {
      state.selectedVendor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch vendors
      .addCase(fetchVendors.pending, (state) => {
        state.vendors.loading = true;
        state.vendors.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.vendors.loading = false;
        state.vendors.items = action.payload;
        state.vendors.lastFetch = new Date().toISOString();
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.vendors.loading = false;
        state.vendors.error = action.payload as string;
      })

      // Create vendor
      .addCase(createVendor.pending, (state) => {
        state.vendors.loading = true;
        state.vendors.error = null;
      })
      .addCase(createVendor.fulfilled, (state, action) => {
        state.vendors.loading = false;
        state.vendors.items.push(action.payload);
        state.form.data = {};
        state.form.isDirty = false;
        state.form.validationErrors = {};
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.vendors.loading = false;
        state.vendors.error = action.payload as string;
      })

      // Update vendor
      .addCase(updateVendor.pending, (state) => {
        state.currentVendor.loading = true;
        state.currentVendor.error = null;
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.currentVendor.loading = false;
        state.currentVendor.data = action.payload;

        // Update in vendors list
        const index = state.vendors.items.findIndex(
          (vendor) => vendor.companyName1 === action.payload.companyName1
        );
        if (index !== -1) {
          state.vendors.items[index] = action.payload;
        }
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.currentVendor.loading = false;
        state.currentVendor.error = action.payload as string;
      })

      // Delete vendor
      .addCase(deleteVendor.fulfilled, (state, action) => {
        state.vendors.items = state.vendors.items.filter(
          (vendor) => vendor.companyName1 !== action.payload
        );
        if (state.selectedVendor?.companyName1 === action.payload) {
          state.selectedVendor = null;
        }
        if (state.currentVendor.data?.companyName1 === action.payload) {
          state.currentVendor.data = null;
        }
      });
  },
});

// Actions
export const {
  setVendors,
  addVendor,
  updateVendorInList,
  removeVendor,
  setCurrentVendor,
  clearCurrentVendor,
  setTaxInformation,
  addTaxInformation,
  updateTaxInformation,
  removeTaxInformation,
  setBankDetails,
  addBankDetail,
  updateBankDetail,
  removeBankDetail,
  setPrimaryBank,
  setFormData,
  resetFormData,
  setFormValidationErrors,
  clearFormValidationErrors,
  setFormField,
  setSearchTerm,
  setSearchFilter,
  clearSearchFilters,
  clearSearch,
  setSelectedVendor,
  clearSelectedVendor,
} = vendorSlice.actions;

// Selectors
export const selectVendors = (state: RootState) => state.vendor.vendors;
export const selectCurrentVendor = (state: RootState) =>
  state.vendor.currentVendor;
export const selectTaxInformation = (state: RootState) =>
  state.vendor.taxInformation;
export const selectBankDetails = (state: RootState) => state.vendor.bankDetails;
export const selectVendorForm = (state: RootState) => state.vendor.form;
export const selectVendorSearch = (state: RootState) => state.vendor.search;
export const selectSelectedVendor = (state: RootState) =>
  state.vendor.selectedVendor;

// Complex selectors
export const selectFilteredVendors = (state: RootState) => {
  const { items } = state.vendor.vendors;
  const { term, filters } = state.vendor.search;

  let filtered = items;

  // Filter by search term
  if (term) {
    const searchTerm = term.toLowerCase();
    filtered = filtered.filter(
      (vendor) =>
        vendor.companyName1.toLowerCase().includes(searchTerm) ||
        vendor.companyName2.toLowerCase().includes(searchTerm) ||
        vendor.email1.toLowerCase().includes(searchTerm) ||
        vendor.phoneNumber1.includes(searchTerm)
    );
  }

  // Filter by country
  if (filters.country !== null) {
    filtered = filtered.filter(
      (vendor) => vendor.countryId === filters.country
    );
  }

  // Filter by state
  if (filters.state !== null) {
    filtered = filtered.filter((vendor) => vendor.stateId === filters.state);
  }

  // Filter by sales status
  if (filters.salesStatus !== null) {
    filtered = filtered.filter(
      (vendor) => vendor.salesStatusId === filters.salesStatus
    );
  }

  // Filter by language
  if (filters.language !== null) {
    filtered = filtered.filter(
      (vendor) => vendor.languageId === filters.language
    );
  }

  return filtered;
};

export const selectPrimaryBank = (state: RootState) => {
  return state.vendor.bankDetails.items.find((bank) => bank.primary) || null;
};

export const selectVendorFormIsValid = (state: RootState) => {
  const { data, validationErrors } = state.vendor.form;
  return (
    Object.keys(validationErrors).length === 0 &&
    data.companyName1 &&
    data.email1 &&
    data.phoneNumber1
  );
};

// Default export
export default vendorSlice.reducer;
