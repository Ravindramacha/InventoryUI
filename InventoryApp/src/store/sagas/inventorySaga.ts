import { call, put, takeEvery, takeLatest, all, fork, select } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { 
  fetchLanguagesStart,
  fetchLanguagesSuccess,
  fetchLanguagesFailure,
  fetchSalesStatusesStart,
  fetchSalesStatusesSuccess,
  fetchSalesStatusesFailure,
  fetchUomDimensionsStart,
  fetchUomDimensionsSuccess,
  fetchUomDimensionsFailure,
  fetchProductTypesStart,
  fetchProductTypesSuccess,
  fetchProductTypesFailure,
  fetchProductGroupsStart,
  fetchProductGroupsSuccess,
  fetchProductGroupsFailure,
  fetchProductCategoriesStart,
  fetchProductCategoriesSuccess,
  fetchProductCategoriesFailure,
  createProductTypeStart,
  createProductTypeSuccess,
  createProductTypeFailure,
  updateProductTypeStart,
  updateProductTypeSuccess,
  updateProductTypeFailure,
  deleteProductTypeStart,
  deleteProductTypeSuccess,
  deleteProductTypeFailure,
  fetchProductMasterStart,
  fetchProductMasterSuccess,
  fetchProductMasterFailure,
  createProductMasterStart,
  createProductMasterSuccess,
  createProductMasterFailure,
  updateProductMasterStart,
  updateProductMasterSuccess,
  updateProductMasterFailure,
  setComplexData,
  setLoadingState,
  setErrorState,
} from '../slices/inventorySlice';
import type { 
  LanguageModel, 
  SalesStatusModel, 
  UomDimensionModel,
  ProductTypeModel,
  ProductGroupModel,
  ProductCategoryModel,
  ReadProductMasterForm,
  PostProductType,
  PostProductMasterForm
} from '../../Models/MaterialModel';
import type { RootState } from '../index';

// API service layer
class InventoryApiService {
  static async fetchLanguages(): Promise<LanguageModel[]> {
    const response = await fetch('/api/languages');
    if (!response.ok) throw new Error('Failed to fetch languages');
    return response.json();
  }

  static async fetchSalesStatuses(): Promise<SalesStatusModel[]> {
    const response = await fetch('/api/sales-statuses');
    if (!response.ok) throw new Error('Failed to fetch sales statuses');
    return response.json();
  }

  static async fetchUomDimensions(): Promise<UomDimensionModel[]> {
    const response = await fetch('/api/uom-dimensions');
    if (!response.ok) throw new Error('Failed to fetch UOM dimensions');
    return response.json();
  }

  static async fetchProductTypes(): Promise<ProductTypeModel[]> {
    const response = await fetch('/api/product-types');
    if (!response.ok) throw new Error('Failed to fetch product types');
    return response.json();
  }

  static async createProductType(productType: PostProductType): Promise<ProductTypeModel> {
    const response = await fetch('/api/product-types', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productType),
    });
    if (!response.ok) throw new Error('Failed to create product type');
    return response.json();
  }

  static async updateProductType(id: number, productType: Partial<ProductTypeModel>): Promise<ProductTypeModel> {
    const response = await fetch(`/api/product-types/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productType),
    });
    if (!response.ok) throw new Error('Failed to update product type');
    return response.json();
  }

  static async deleteProductType(id: number): Promise<void> {
    const response = await fetch(`/api/product-types/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete product type');
  }

  static async fetchProductGroups(): Promise<ProductGroupModel[]> {
    const response = await fetch('/api/product-groups');
    if (!response.ok) throw new Error('Failed to fetch product groups');
    return response.json();
  }

  static async fetchProductCategories(): Promise<ProductCategoryModel[]> {
    const response = await fetch('/api/product-categories');
    if (!response.ok) throw new Error('Failed to fetch product categories');
    return response.json();
  }

  static async fetchProductMaster(id: number): Promise<ReadProductMasterForm> {
    const response = await fetch(`/api/product-master/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product master');
    return response.json();
  }

  static async createProductMaster(productMaster: PostProductMasterForm): Promise<ReadProductMasterForm> {
    const response = await fetch('/api/product-master', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productMaster),
    });
    if (!response.ok) throw new Error('Failed to create product master');
    return response.json();
  }

  static async updateProductMaster(id: number, productMaster: Partial<PostProductMasterForm>): Promise<ReadProductMasterForm> {
    const response = await fetch(`/api/product-master/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productMaster),
    });
    if (!response.ok) throw new Error('Failed to update product master');
    return response.json();
  }
}

// Saga workers
export function* fetchLanguagesSaga() {
  try {
    yield put(setLoadingState({ key: 'languages', loading: true }));
    const languages: LanguageModel[] = yield call(InventoryApiService.fetchLanguages);
    yield put(fetchLanguagesSuccess(languages));
    yield put(setComplexData({ 
      key: 'languages', 
      data: languages,
      metadata: {
        fetchedAt: new Date().toISOString(),
        count: languages.length
      }
    }));
  } catch (error: any) {
    yield put(fetchLanguagesFailure(error.message));
    yield put(setErrorState({ key: 'languages', error: error.message }));
  } finally {
    yield put(setLoadingState({ key: 'languages', loading: false }));
  }
}

function* fetchSalesStatusesSaga() {
  try {
    yield put(setLoadingState({ key: 'salesStatuses', loading: true }));
    const salesStatuses: SalesStatusModel[] = yield call(InventoryApiService.fetchSalesStatuses);
    yield put(fetchSalesStatusesSuccess(salesStatuses));
    yield put(setComplexData({ 
      key: 'salesStatuses', 
      data: salesStatuses,
      metadata: {
        fetchedAt: new Date().toISOString(),
        count: salesStatuses.length
      }
    }));
  } catch (error: any) {
    yield put(fetchSalesStatusesFailure(error.message));
    yield put(setErrorState({ key: 'salesStatuses', error: error.message }));
  } finally {
    yield put(setLoadingState({ key: 'salesStatuses', loading: false }));
  }
}

function* fetchUomDimensionsSaga() {
  try {
    yield put(setLoadingState({ key: 'uomDimensions', loading: true }));
    const uomDimensions: UomDimensionModel[] = yield call(InventoryApiService.fetchUomDimensions);
    yield put(fetchUomDimensionsSuccess(uomDimensions));
    yield put(setComplexData({ 
      key: 'uomDimensions', 
      data: uomDimensions,
      metadata: {
        fetchedAt: new Date().toISOString(),
        count: uomDimensions.length
      }
    }));
  } catch (error: any) {
    yield put(fetchUomDimensionsFailure(error.message));
    yield put(setErrorState({ key: 'uomDimensions', error: error.message }));
  } finally {
    yield put(setLoadingState({ key: 'uomDimensions', loading: false }));
  }
}

export function* fetchProductTypesSaga() {
  try {
    yield put(setLoadingState({ key: 'productTypes', loading: true }));
    const productTypes: ProductTypeModel[] = yield call(InventoryApiService.fetchProductTypes);
    yield put(fetchProductTypesSuccess(productTypes));
    yield put(setComplexData({ 
      key: 'productTypes', 
      data: productTypes,
      metadata: {
        fetchedAt: new Date().toISOString(),
        count: productTypes.length
      }
    }));
  } catch (error: any) {
    yield put(fetchProductTypesFailure(error.message));
    yield put(setErrorState({ key: 'productTypes', error: error.message }));
  } finally {
    yield put(setLoadingState({ key: 'productTypes', loading: false }));
  }
}

function* createProductTypeSaga(action: PayloadAction<PostProductType>) {
  try {
    yield put(setLoadingState({ key: 'createProductType', loading: true }));
    const newProductType: ProductTypeModel = yield call(InventoryApiService.createProductType, action.payload);
    yield put(createProductTypeSuccess(newProductType));
    
    // Refresh the product types list
    yield put(fetchProductTypesStart());
  } catch (error: any) {
    yield put(createProductTypeFailure(error.message));
    yield put(setErrorState({ key: 'createProductType', error: error.message }));
  } finally {
    yield put(setLoadingState({ key: 'createProductType', loading: false }));
  }
}

function* updateProductTypeSaga(action: PayloadAction<{ id: number; productType: Partial<ProductTypeModel> }>) {
  try {
    yield put(setLoadingState({ key: 'updateProductType', loading: true }));
    const updatedProductType: ProductTypeModel = yield call(
      InventoryApiService.updateProductType, 
      action.payload.id, 
      action.payload.productType
    );
    yield put(updateProductTypeSuccess(updatedProductType));
    
    // Refresh the product types list
    yield put(fetchProductTypesStart());
  } catch (error: any) {
    yield put(updateProductTypeFailure(error.message));
    yield put(setErrorState({ key: 'updateProductType', error: error.message }));
  } finally {
    yield put(setLoadingState({ key: 'updateProductType', loading: false }));
  }
}

function* deleteProductTypeSaga(action: PayloadAction<number>) {
  try {
    yield put(setLoadingState({ key: 'deleteProductType', loading: true }));
    yield call(InventoryApiService.deleteProductType, action.payload);
    yield put(deleteProductTypeSuccess(action.payload));
    
    // Refresh the product types list
    yield put(fetchProductTypesStart());
  } catch (error: any) {
    yield put(deleteProductTypeFailure(error.message));
    yield put(setErrorState({ key: 'deleteProductType', error: error.message }));
  } finally {
    yield put(setLoadingState({ key: 'deleteProductType', loading: false }));
  }
}

function* fetchProductGroupsSaga() {
  try {
    yield put(setLoadingState({ key: 'productGroups', loading: true }));
    const productGroups: ProductGroupModel[] = yield call(InventoryApiService.fetchProductGroups);
    yield put(fetchProductGroupsSuccess(productGroups));
    yield put(setComplexData({ 
      key: 'productGroups', 
      data: productGroups,
      metadata: {
        fetchedAt: new Date().toISOString(),
        count: productGroups.length
      }
    }));
  } catch (error: any) {
    yield put(fetchProductGroupsFailure(error.message));
    yield put(setErrorState({ key: 'productGroups', error: error.message }));
  } finally {
    yield put(setLoadingState({ key: 'productGroups', loading: false }));
  }
}

function* fetchProductCategoriesSaga() {
  try {
    yield put(setLoadingState({ key: 'productCategories', loading: true }));
    const productCategories: ProductCategoryModel[] = yield call(InventoryApiService.fetchProductCategories);
    yield put(fetchProductCategoriesSuccess(productCategories));
    yield put(setComplexData({ 
      key: 'productCategories', 
      data: productCategories,
      metadata: {
        fetchedAt: new Date().toISOString(),
        count: productCategories.length
      }
    }));
  } catch (error: any) {
    yield put(fetchProductCategoriesFailure(error.message));
    yield put(setErrorState({ key: 'productCategories', error: error.message }));
  } finally {
    yield put(setLoadingState({ key: 'productCategories', loading: false }));
  }
}

function* fetchProductMasterSaga(action: PayloadAction<number>) {
  try {
    yield put(setLoadingState({ key: 'productMaster', loading: true }));
    const productMaster: ReadProductMasterForm = yield call(InventoryApiService.fetchProductMaster, action.payload);
    yield put(fetchProductMasterSuccess(productMaster));
    yield put(setComplexData({ 
      key: `productMaster_${action.payload}`, 
      data: productMaster,
      metadata: {
        fetchedAt: new Date().toISOString(),
        id: action.payload
      }
    }));
  } catch (error: any) {
    yield put(fetchProductMasterFailure(error.message));
    yield put(setErrorState({ key: 'productMaster', error: error.message }));
  } finally {
    yield put(setLoadingState({ key: 'productMaster', loading: false }));
  }
}

function* createProductMasterSaga(action: PayloadAction<PostProductMasterForm>) {
  try {
    yield put(setLoadingState({ key: 'createProductMaster', loading: true }));
    const newProductMaster: ReadProductMasterForm = yield call(InventoryApiService.createProductMaster, action.payload);
    yield put(createProductMasterSuccess(newProductMaster));
  } catch (error: any) {
    yield put(createProductMasterFailure(error.message));
    yield put(setErrorState({ key: 'createProductMaster', error: error.message }));
  } finally {
    yield put(setLoadingState({ key: 'createProductMaster', loading: false }));
  }
}

function* updateProductMasterSaga(action: PayloadAction<{ id: number; productMaster: Partial<PostProductMasterForm> }>) {
  try {
    yield put(setLoadingState({ key: 'updateProductMaster', loading: true }));
    const updatedProductMaster: ReadProductMasterForm = yield call(
      InventoryApiService.updateProductMaster, 
      action.payload.id, 
      action.payload.productMaster
    );
    yield put(updateProductMasterSuccess(updatedProductMaster));
  } catch (error: any) {
    yield put(updateProductMasterFailure(error.message));
    yield put(setErrorState({ key: 'updateProductMaster', error: error.message }));
  } finally {
    yield put(setLoadingState({ key: 'updateProductMaster', loading: false }));
  }
}

// Complex data processing saga
function* processComplexDataSaga() {
  try {
    const state: RootState = yield select();
    const { complexData } = state.inventory;
    
    // Process and derive complex data relationships
    const processedData = {
      summary: {
        totalProductTypes: complexData.productTypes?.data?.length || 0,
        totalProductGroups: complexData.productGroups?.data?.length || 0,
        totalProductCategories: complexData.productCategories?.data?.length || 0,
        lastUpdated: new Date().toISOString(),
      },
      relationships: {
        // Add logic to process relationships between different data types
      },
      statistics: {
        // Add statistical calculations
      }
    };
    
    yield put(setComplexData({
      key: 'processedSummary',
      data: processedData,
      metadata: {
        processedAt: new Date().toISOString(),
        version: '1.0'
      }
    }));
  } catch (error: any) {
    yield put(setErrorState({ key: 'processComplexData', error: error.message }));
  }
}

// Watcher sagas
function* watchFetchLanguages() {
  yield takeEvery(fetchLanguagesStart.type, fetchLanguagesSaga);
}

function* watchFetchSalesStatuses() {
  yield takeEvery(fetchSalesStatusesStart.type, fetchSalesStatusesSaga);
}

function* watchFetchUomDimensions() {
  yield takeEvery(fetchUomDimensionsStart.type, fetchUomDimensionsSaga);
}

function* watchFetchProductTypes() {
  yield takeEvery(fetchProductTypesStart.type, fetchProductTypesSaga);
}

function* watchCreateProductType() {
  yield takeEvery(createProductTypeStart.type, createProductTypeSaga);
}

function* watchUpdateProductType() {
  yield takeEvery(updateProductTypeStart.type, updateProductTypeSaga);
}

function* watchDeleteProductType() {
  yield takeEvery(deleteProductTypeStart.type, deleteProductTypeSaga);
}

function* watchFetchProductGroups() {
  yield takeEvery(fetchProductGroupsStart.type, fetchProductGroupsSaga);
}

function* watchFetchProductCategories() {
  yield takeEvery(fetchProductCategoriesStart.type, fetchProductCategoriesSaga);
}

function* watchFetchProductMaster() {
  yield takeEvery(fetchProductMasterStart.type, fetchProductMasterSaga);
}

function* watchCreateProductMaster() {
  yield takeEvery(createProductMasterStart.type, createProductMasterSaga);
}

function* watchUpdateProductMaster() {
  yield takeEvery(updateProductMasterStart.type, updateProductMasterSaga);
}

function* watchProcessComplexData() {
  yield takeLatest('inventory/processComplexData', processComplexDataSaga);
}

// Main inventory saga
export function* inventorySaga() {
  yield all([
    fork(watchFetchLanguages),
    fork(watchFetchSalesStatuses),
    fork(watchFetchUomDimensions),
    fork(watchFetchProductTypes),
    fork(watchCreateProductType),
    fork(watchUpdateProductType),
    fork(watchDeleteProductType),
    fork(watchFetchProductGroups),
    fork(watchFetchProductCategories),
    fork(watchFetchProductMaster),
    fork(watchCreateProductMaster),
    fork(watchUpdateProductMaster),
    fork(watchProcessComplexData),
  ]);
}
