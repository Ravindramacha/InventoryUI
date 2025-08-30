/**
 * Test file for the inventory reducer and actions
 * 
 * This file tests the inventory slice reducer and its actions to ensure they correctly
 * update the state as expected. We use a createInitialState helper function to reduce
 * duplication in test setup.
 */

// @ts-ignore - Will be resolved when dependencies are installed
import { describe, it, expect } from 'vitest';
import inventoryReducer, { 
  fetchProductTypesStart,
  fetchProductTypesSuccess,
  fetchProductTypesFailure
} from '../inventorySlice';
import type { InventoryState } from '../inventorySlice';

/**
 * Creates a complete initial state for inventory tests with optional overrides
 * 
 * @param overrides - Object with properties to override in the default state
 * @returns A complete InventoryState object
 */
const createInitialState = (overrides = {}): InventoryState => ({
  productTypes: {
    items: [],
    loading: false,
    error: null,
    lastFetch: null
  },
  productGroups: {
    items: [],
    loading: false,
    error: null,
    lastFetch: null
  },
  productCategories: {
    items: [],
    loading: false,
    error: null,
    lastFetch: null
  },
  productMaster: {
    items: [],
    loading: false,
    error: null,
    lastFetch: null,
    currentItem: null
  },
  uom: {
    dimensions: [],
    units: [],
    loading: false,
    error: null,
    lastFetch: null
  },
  referenceData: {
    languages: [],
    salesStatuses: [],
    loading: false,
    error: null,
    lastFetch: null
  },
  search: {
    productTypes: "",
    productGroups: "",
    productCategories: "",
    productMaster: ""
  },
  selectedItems: {
    productType: null,
    productGroup: null,
    productCategory: null,
    productMaster: null
  },
  complexData: {},
  loadingStates: {},
  errorStates: {},
  ...overrides
});

describe('Inventory Slice', () => {
  /**
   * Test that the reducer initializes with the correct default state
   * when no state is provided and an unknown action is dispatched
   */
  it('should handle initial state', () => {
    const state = inventoryReducer(undefined, { type: 'unknown' });
    expect(state.productTypes.loading).toBe(false);
    expect(state.productTypes.error).toBe(null);
    expect(state.productTypes.items).toEqual([]);
  });

  /**
   * Test that the fetchProductTypesStart action correctly updates loading state
   */
  it('should handle fetchProductTypesStart', () => {
    const initialState = createInitialState();

    const newState = inventoryReducer(initialState, fetchProductTypesStart());
    expect(newState.productTypes.loading).toBe(true);
    expect(newState.productTypes.error).toBe(null);
  });

  /**
   * Test that the fetchProductTypesSuccess action correctly updates state
   * with the received product types data
   */
  it('should handle fetchProductTypesSuccess', () => {
    const initialState = createInitialState({
      productTypes: {
        items: [],
        loading: true,
        error: null,
        lastFetch: null
      }
    });

    const mockProductTypes = [
      { 
        productTypeId: 1, 
        productTypeCode: 'RAW', 
        productTypeDesc: 'Raw Material', 
        isActive: true,
        createdBy: 1,
        createdOn: '2025-08-01',
        modifiedBy: 1,
        modifiedOn: '2025-08-01'
      },
      { 
        productTypeId: 2, 
        productTypeCode: 'WIP', 
        productTypeDesc: 'Work in Progress', 
        isActive: true,
        createdBy: 1,
        createdOn: '2025-08-01',
        modifiedBy: 1,
        modifiedOn: '2025-08-01'
      }
    ];

    const newState = inventoryReducer(initialState, fetchProductTypesSuccess(mockProductTypes));
    expect(newState.productTypes.loading).toBe(false);
    expect(newState.productTypes.items).toEqual(mockProductTypes);
    expect(newState.productTypes.error).toBe(null);
  });

  /**
   * Test that the fetchProductTypesFailure action correctly updates state
   * with the error message
   */
  it('should handle fetchProductTypesFailure', () => {
    const initialState = createInitialState({
      productTypes: {
        items: [],
        loading: true,
        error: null,
        lastFetch: null
      }
    });

    const error = 'Failed to fetch product types';
    const newState = inventoryReducer(initialState, fetchProductTypesFailure(error));
    
    expect(newState.productTypes.loading).toBe(false);
    expect(newState.productTypes.error).toBe(error);
  });
  
  /**
   * Additional test helpers for future test expansion
   */
  
  /**
   * Helper function to test an action's effect on state
   * @param initialState - Starting state
   * @param action - Action to dispatch
   * @param expectedChanges - Expected partial state after action
   * @param path - Optional path in state to compare (defaults to whole state)
   */
  function testAction(initialState: InventoryState, action: any, expectedChanges: Partial<any>, path?: string) {
    const newState = inventoryReducer(initialState, action);
    
    if (path) {
      // Compare only a specific part of state
      const pathSegments = path.split('.');
      let actualValue: any = newState;
      let expectedValue: any = expectedChanges;
      
      pathSegments.forEach(segment => {
        if (actualValue) actualValue = actualValue[segment];
      });
      
      expect(actualValue).toEqual(expectedValue);
    } else {
      // Compare full state with expected changes
      expect(newState).toEqual({...initialState, ...expectedChanges});
    }
  }
  
  // Example of using the helper - uncommenting this will make it an actual test
  // it('demonstration of testAction helper', () => {
  //   testAction(
  //     createInitialState(),
  //     fetchProductTypesStart(),
  //     { loading: true },
  //     'productTypes'
  //   );
  // });
});
