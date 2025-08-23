import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { store } from './index';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import { useAppSelector } from './hooks';

// Enhanced QueryClient with Redux integration
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      // Cache queries for 5 minutes by default
      staleTime: 5 * 60 * 1000,
      // Retry failed requests 3 times with exponential backoff
      retry: (failureCount) => {
        if (failureCount < 3) {
          return true;
        }
        return false;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Enable background refetching
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Theme provider that integrates with Redux UI state
const ThemedApp: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Safe access to Redux state with fallback values
  const uiState = useAppSelector((state) => state.ui || {});
  const themeMode = (uiState as any)?.theme?.mode || 'light';
  const primaryColor = (uiState as any)?.theme?.primaryColor || '#1976d2';
  
  const theme = React.useMemo(() => createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: primaryColor,
      },
    },
    components: {
      // Enhanced Material-UI component defaults for large-scale apps
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          size: 'small',
        },
      },
    },
  }), [themeMode, primaryColor]);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

// Enhanced App Provider that includes all necessary providers
interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  const [queryClient] = React.useState(() => createQueryClient());
  
  React.useEffect(() => {
    // Cleanup function to clear caches on unmount
    return () => {
      queryClient.clear();
    };
  }, [queryClient]);
  
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemedApp>
            <AuthProvider>
              <NotificationProvider>
                {children}
              </NotificationProvider>
            </AuthProvider>
          </ThemedApp>
        </BrowserRouter>
      </QueryClientProvider>
    </ReduxProvider>
  );
};

// Utility hook for accessing all app context
export const useAppContext = () => {
  // Note: This is a simplified version, expand as needed
  return {
    // Add any global context values you want to expose
  };
};

// Error boundary for the entire app
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
    
    // You can log the error to an error reporting service here
    // Example: errorReportingService.captureException(error, { extra: errorInfo });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h1>Oops! Something went wrong</h1>
          <p>We apologize for the inconvenience. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.5rem 1rem',
              marginTop: '1rem',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '2rem', textAlign: 'left' }}>
              <summary>Error Details (Development Only)</summary>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '1rem', 
                marginTop: '1rem',
                borderRadius: '4px',
                overflow: 'auto'
              }}>
                {this.state.error?.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Main App wrapper with all providers and error boundary
export const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppErrorBoundary>
      <AppProviders>
        {children}
      </AppProviders>
    </AppErrorBoundary>
  );
};

export default AppProviders;
