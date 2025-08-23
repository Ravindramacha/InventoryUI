import { call, takeEvery, all, fork } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';

// Vendor API Service
class VendorApiService {
  static async fetchVendors() {
    const response = await fetch('/api/vendors');
    if (!response.ok) throw new Error('Failed to fetch vendors');
    return response.json();
  }

  static async createVendor(vendorData: any) {
    const response = await fetch('/api/vendors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendorData),
    });
    if (!response.ok) throw new Error('Failed to create vendor');
    return response.json();
  }

  static async updateVendor(id: number, vendorData: any) {
    const response = await fetch(`/api/vendors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendorData),
    });
    if (!response.ok) throw new Error('Failed to update vendor');
    return response.json();
  }

  static async deleteVendor(id: number) {
    const response = await fetch(`/api/vendors/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete vendor');
  }

  static async fetchVendorById(id: number) {
    const response = await fetch(`/api/vendors/${id}`);
    if (!response.ok) throw new Error('Failed to fetch vendor');
    return response.json();
  }
}

// Saga workers
function* fetchVendorsSaga(): Generator<any, void, any> {
  try {
    const vendors = yield call(VendorApiService.fetchVendors);
    // Put success action here when vendor slice is properly set up
    console.log('Vendors fetch successful:', vendors);
  } catch (error: any) {
    // Put failure action here when vendor slice is properly set up
    console.error('Vendors fetch failed:', error.message);
  }
}

function* createVendorSaga(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const newVendor = yield call(VendorApiService.createVendor, action.payload);
    // Put success action here when vendor slice is properly set up
    console.log('Vendor creation successful:', newVendor);
  } catch (error: any) {
    // Put failure action here when vendor slice is properly set up
    console.error('Vendor creation failed:', error.message);
  }
}

function* updateVendorSaga(action: PayloadAction<{ id: number; vendorData: any }>): Generator<any, void, any> {
  try {
    const updatedVendor = yield call(
      VendorApiService.updateVendor, 
      action.payload.id, 
      action.payload.vendorData
    );
    // Put success action here when vendor slice is properly set up
    console.log('Vendor update successful:', updatedVendor);
  } catch (error: any) {
    // Put failure action here when vendor slice is properly set up
    console.error('Vendor update failed:', error.message);
  }
}

function* deleteVendorSaga(action: PayloadAction<number>): Generator<any, void, any> {
  try {
    yield call(VendorApiService.deleteVendor, action.payload);
    // Put success action here when vendor slice is properly set up
    console.log('Vendor deletion successful');
  } catch (error: any) {
    // Put failure action here when vendor slice is properly set up
    console.error('Vendor deletion failed:', error.message);
  }
}

function* fetchVendorByIdSaga(action: PayloadAction<number>): Generator<any, void, any> {
  try {
    const vendor = yield call(VendorApiService.fetchVendorById, action.payload);
    // Put success action here when vendor slice is properly set up
    console.log('Vendor fetch by ID successful:', vendor);
  } catch (error: any) {
    // Put failure action here when vendor slice is properly set up
    console.error('Vendor fetch by ID failed:', error.message);
  }
}

// Watcher sagas
function* watchFetchVendors() {
  yield takeEvery('vendor/fetchVendorsStart', fetchVendorsSaga);
}

function* watchCreateVendor() {
  yield takeEvery('vendor/createVendorStart', createVendorSaga);
}

function* watchUpdateVendor() {
  yield takeEvery('vendor/updateVendorStart', updateVendorSaga);
}

function* watchDeleteVendor() {
  yield takeEvery('vendor/deleteVendorStart', deleteVendorSaga);
}

function* watchFetchVendorById() {
  yield takeEvery('vendor/fetchVendorByIdStart', fetchVendorByIdSaga);
}

// Main vendor saga
export function* vendorSaga() {
  yield all([
    fork(watchFetchVendors),
    fork(watchCreateVendor),
    fork(watchUpdateVendor),
    fork(watchDeleteVendor),
    fork(watchFetchVendorById),
  ]);
}
