import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loginAttempts: number;
  lastLoginTime: string | null;
  sessionExpiry: string | null;
  refreshToken: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loginAttempts: 0,
  lastLoginTime: null,
  sessionExpiry: null,
  refreshToken: localStorage.getItem('refreshToken'),
};

// Async thunks
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // This would normally call your API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
          },
        });
      } catch (error) {
        // Even if logout fails on server, we still clear local state
        console.error('Server logout failed:', error);
      }
    }
  }
);

export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const refreshToken = state.auth.refreshToken;
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (!response.ok) {
        throw new Error('Token refresh failed');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Token refresh failed');
    }
  }
);

// Slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string; refreshToken?: string }>) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.lastLoginTime = new Date().toISOString();
      state.sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
      
      if (refreshToken) {
        state.refreshToken = refreshToken;
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      localStorage.setItem('token', token);
      state.loginAttempts = 0;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.lastLoginTime = null;
      state.sessionExpiry = null;
      state.refreshToken = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
    incrementLoginAttempts: (state) => {
      state.loginAttempts += 1;
    },
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setSessionExpiry: (state, action: PayloadAction<string>) => {
      state.sessionExpiry = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.fulfilled, (state, action) => {
        const { user, token, refreshToken } = action.payload;
        authSlice.caseReducers.setCredentials(state, {
          type: 'auth/setCredentials',
          payload: { user, token, refreshToken },
        });
      })
      .addCase(loginAsync.rejected, (state) => {
        state.loginAttempts += 1;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        authSlice.caseReducers.clearCredentials(state);
      })
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        const { token, refreshToken } = action.payload;
        state.token = token;
        if (refreshToken) {
          state.refreshToken = refreshToken;
          localStorage.setItem('refreshToken', refreshToken);
        }
        localStorage.setItem('token', token);
        state.sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      })
      .addCase(refreshTokenAsync.rejected, (state) => {
        authSlice.caseReducers.clearCredentials(state);
      });
  },
});

// Actions
export const {
  setCredentials,
  clearCredentials,
  incrementLoginAttempts,
  resetLoginAttempts,
  updateUserProfile,
  setSessionExpiry,
} = authSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectLoginAttempts = (state: RootState) => state.auth.loginAttempts;
export const selectSessionExpiry = (state: RootState) => state.auth.sessionExpiry;
export const selectIsSessionExpired = (state: RootState) => {
  const expiry = state.auth.sessionExpiry;
  return expiry ? new Date(expiry) < new Date() : false;
};

// Default export
export default authSlice.reducer;
