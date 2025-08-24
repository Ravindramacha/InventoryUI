import React from 'react';
import type { ReactElement } from 'react';
// @ts-ignore
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';

// Import your reducers
import authReducer from '../store/slices/authSlice';
import vendorReducer from '../store/slices/vendorSlice';
import inventoryReducer from '../store/slices/inventorySlice';
import uiReducer from '../store/slices/uiSlice';
import notificationReducer from '../store/slices/notificationSlice';
import cacheReducer from '../store/slices/cacheSlice';

// Create a custom renderer that includes all providers
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    // Create a store with any preloaded state
    store = configureStore({
      reducer: {
        auth: authReducer,
        vendor: vendorReducer,
        inventory: inventoryReducer,
        ui: uiReducer,
        notification: notificationReducer,
        cache: cacheReducer,
      },
      preloadedState,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          thunk: true,
          serializableCheck: false,
        }),
    }),
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    }),
    route = '/',
    ...renderOptions
  } = {}
) {
  // Create default theme
  const theme = createTheme({ palette: { mode: 'light' } });

  // Return an object with the store and all of RTL's query functions
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <AuthProvider>
                <NotificationProvider>
                  {children}
                </NotificationProvider>
              </AuthProvider>
            </ThemeProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    );
  }

  window.history.pushState({}, 'Test page', route);

  return {
    ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
    store,
    queryClient,
  };
}

// re-export everything from RTL
// @ts-ignore - This will work once dependencies are installed
export * from '@testing-library/react';
export { renderWithProviders as render };
