// @ts-ignore
import { describe, it, expect } from 'vitest';
// @ts-ignore
import { renderHook, waitFor } from '@testing-library/react';
import { useProductTypes, usePostProductType } from '../ApiQueries';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { server } from '../../test/setup';
// @ts-ignore
import { http, HttpResponse } from 'msw';

// Create a wrapper with the QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('API Queries', () => {
  describe('useProductTypes', () => {
    it('should fetch product types successfully', async () => {
      // Mock data
      const mockProductTypes = [
        { productTypeId: 1, productTypeCode: 'RAW', productTypeDesc: 'Raw Material', isActive: true },
        { productTypeId: 2, productTypeCode: 'FG', productTypeDesc: 'Finished Goods', isActive: true },
      ];

      // Setup the mock handler
      server.use(
        http.get('/api/product-types', () => {
          return HttpResponse.json(mockProductTypes);
        })
      );

      // Render the hook
      const { result } = renderHook(() => useProductTypes(), {
        wrapper: createWrapper(),
      });

      // Wait for the query to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check the data
      expect(result.current.data).toEqual(mockProductTypes);
    });

    it('should handle errors', async () => {
      // Setup the mock handler to return an error
      server.use(
        http.get('/api/product-types', () => {
          return HttpResponse.json(
            { message: 'Internal Server Error' }, 
            { status: 500 }
          );
        })
      );

      // Render the hook
      const { result } = renderHook(() => useProductTypes(), {
        wrapper: createWrapper(),
      });

      // Wait for the query to complete
      await waitFor(() => expect(result.current.isError).toBe(true));

      // Check the error
      expect(result.current.error).toBeDefined();
    });
  });

  describe('usePostProductType', () => {
    it('should post a new product type successfully', async () => {
      // Mock data
      const newProductType = {
        productTypeCode: 'NEW',
        productTypeDesc: 'New Type',
        TranscationById: 1, // Adding the required field
        isActive: true,
      };

      const mockResponse = {
        ...newProductType,
        productTypeId: 123,
      };

      // Setup the mock handler
      server.use(
        http.post('/api/product-types', () => {
          return HttpResponse.json(mockResponse, { status: 201 });
        })
      );

      // Render the hook
      const { result } = renderHook(() => usePostProductType(), {
        wrapper: createWrapper(),
      });

      // Wait for the hook to be ready
      await waitFor(() => expect(result.current.mutate).toBeDefined());

      // Call the mutation
      result.current.mutate(newProductType);

      // Wait for the mutation to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check the data
      expect(result.current.data).toEqual(mockResponse);
    });
  });
});
