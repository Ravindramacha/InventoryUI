import { call, takeEvery, takeLatest, all, fork } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';

// Auth API Service
class AuthApiService {
  static async login(credentials: { username: string; password: string }) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  }

  static async logout() {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Logout failed');
    return response.json();
  }

  static async refreshToken(token: string) {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    if (!response.ok) throw new Error('Token refresh failed');
    return response.json();
  }

  static async register(userData: any) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  }

  static async getUserProfile() {
    const response = await fetch('/api/auth/profile');
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return response.json();
  }
}

// Saga workers
function* loginSaga(action: PayloadAction<{ username: string; password: string }>): Generator<any, void, any> {
  try {
    const result = yield call(AuthApiService.login, action.payload);
    // Put success action here when auth slice is properly set up
    console.log('Login successful:', result);
  } catch (error: any) {
    // Put failure action here when auth slice is properly set up
    console.error('Login failed:', error.message);
  }
}

function* logoutSaga(): Generator<any, void, any> {
  try {
    yield call(AuthApiService.logout);
    // Put success action here when auth slice is properly set up
    console.log('Logout successful');
  } catch (error: any) {
    // Put failure action here when auth slice is properly set up
    console.error('Logout failed:', error.message);
  }
}

function* refreshTokenSaga(action: PayloadAction<string>): Generator<any, void, any> {
  try {
    const result = yield call(AuthApiService.refreshToken, action.payload);
    // Put success action here when auth slice is properly set up
    console.log('Token refresh successful:', result);
  } catch (error: any) {
    // Put failure action here when auth slice is properly set up
    console.error('Token refresh failed:', error.message);
  }
}

function* registerSaga(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const result = yield call(AuthApiService.register, action.payload);
    // Put success action here when auth slice is properly set up
    console.log('Registration successful:', result);
  } catch (error: any) {
    // Put failure action here when auth slice is properly set up
    console.error('Registration failed:', error.message);
  }
}

function* getUserProfileSaga(): Generator<any, void, any> {
  try {
    const profile = yield call(AuthApiService.getUserProfile);
    // Put success action here when auth slice is properly set up
    console.log('Profile fetch successful:', profile);
  } catch (error: any) {
    // Put failure action here when auth slice is properly set up
    console.error('Profile fetch failed:', error.message);
  }
}

// Watcher sagas
function* watchLogin() {
  yield takeLatest('auth/loginStart', loginSaga);
}

function* watchLogout() {
  yield takeEvery('auth/logoutStart', logoutSaga);
}

function* watchRefreshToken() {
  yield takeEvery('auth/refreshTokenStart', refreshTokenSaga);
}

function* watchRegister() {
  yield takeEvery('auth/registerStart', registerSaga);
}

function* watchGetUserProfile() {
  yield takeEvery('auth/getUserProfileStart', getUserProfileSaga);
}

// Main auth saga
export function* authSaga() {
  yield all([
    fork(watchLogin),
    fork(watchLogout),
    fork(watchRefreshToken),
    fork(watchRegister),
    fork(watchGetUserProfile),
  ]);
}
