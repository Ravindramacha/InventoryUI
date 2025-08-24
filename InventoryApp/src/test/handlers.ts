/**
 * Mock Service Worker handlers for API mocking in tests
 * 
 * This file defines mock API handlers that intercept network requests during tests
 * and return predefined mock data instead of making actual API calls.
 */

// @ts-ignore - These imports will work once dependencies are installed
import { http, HttpResponse } from 'msw';

/**
 * Define simplified interfaces for mock data in tests
 * These interfaces are simplified versions of the actual model interfaces
 * with only the properties needed for testing
 */
interface MockProductType {
  productTypeId: number;
  productTypeCode: string;
  productTypeDesc: string;
  createdOn: string;
  createdBy: number;
  modifiedOn: string;
  modifiedBy: number;
  isActive?: boolean; // Additional property for tests
}

interface MockProduct {
  productId: number;
  productCode: string;
  productName: string;
  description: string;
  productTypeId: number;
  isActive: boolean;
}

interface MockVendor {
  vendorId: number;
  vendorCode: string;
  vendorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  isActive: boolean;
}

// Mock product type data
const mockProductTypes: MockProductType[] = [
  { 
    productTypeId: 1, 
    productTypeCode: 'RAW', 
    productTypeDesc: 'Raw Material', 
    isActive: true,
    createdOn: '2025-08-01',
    createdBy: 1,
    modifiedOn: '2025-08-01',
    modifiedBy: 1
  },
  { 
    productTypeId: 2, 
    productTypeCode: 'WIP', 
    productTypeDesc: 'Work in Progress', 
    isActive: true,
    createdOn: '2025-08-01',
    createdBy: 1,
    modifiedOn: '2025-08-01',
    modifiedBy: 1
  },
  { 
    productTypeId: 3, 
    productTypeCode: 'FG', 
    productTypeDesc: 'Finished Goods', 
    isActive: true,
    createdOn: '2025-08-01',
    createdBy: 1,
    modifiedOn: '2025-08-01',
    modifiedBy: 1
  }
];

// Mock product data
const mockProducts: MockProduct[] = [
  {
    productId: 1,
    productCode: 'P001',
    productName: 'Steel Rod',
    description: 'Standard steel rod',
    productTypeId: 1,
    isActive: true
  },
  {
    productId: 2,
    productCode: 'P002',
    productName: 'Aluminum Sheet',
    description: 'Aluminum sheet for manufacturing',
    productTypeId: 1,
    isActive: true
  }
];

// Mock vendor data
const mockVendors: MockVendor[] = [
  {
    vendorId: 1,
    vendorCode: 'V001',
    vendorName: 'ABC Suppliers',
    contactPerson: 'John Doe',
    email: 'john@abcsuppliers.com',
    phone: '123-456-7890',
    isActive: true
  },
  {
    vendorId: 2,
    vendorCode: 'V002',
    vendorName: 'XYZ Manufacturing',
    contactPerson: 'Jane Smith',
    email: 'jane@xyzmanufacturing.com',
    phone: '987-654-3210',
    isActive: true
  }
];

/**
 * Interface for MSW request objects to fix TypeScript errors
 * This provides proper typing for request handlers
 */
interface RequestObject {
  request: Request;
  params: Record<string, string>;
  cookies: Record<string, string>;
}

/**
 * Mock API handlers for intercepting and responding to API requests
 * These handlers cover all the API endpoints used in the application
 */
export const handlers = [
  // Product Types API
  http.get('/api/product-types', () => {
    return HttpResponse.json(mockProductTypes);
  }),

  http.post('/api/product-types', async ({ request }: RequestObject) => {
    const newProductType = await request.json() as Partial<MockProductType>;
    return HttpResponse.json(
      { 
        ...newProductType, 
        productTypeId: Math.floor(Math.random() * 1000),
        createdOn: new Date().toISOString(),
        createdBy: 1,
        modifiedOn: new Date().toISOString(),
        modifiedBy: 1
      } as MockProductType,
      { status: 201 }
    );
  }),

  // Products API
  http.get('/api/products', () => {
    return HttpResponse.json(mockProducts);
  }),

  http.post('/api/products', async ({ request }: RequestObject) => {
    const newProduct = await request.json() as Partial<MockProduct>;
    return HttpResponse.json(
      { ...newProduct, productId: Math.floor(Math.random() * 1000) } as MockProduct,
      { status: 201 }
    );
  }),

  // Vendors API
  http.get('/api/vendors', () => {
    return HttpResponse.json(mockVendors);
  }),

  http.post('/api/vendors', async ({ request }: RequestObject) => {
    const newVendor = await request.json() as Partial<MockVendor>;
    return HttpResponse.json(
      { ...newVendor, vendorId: Math.floor(Math.random() * 1000) } as MockVendor,
      { status: 201 }
    );
  }),

  // Authentication API
  http.post('/api/auth/login', async ({ request }: RequestObject) => {
    const credentials = await request.json() as { username: string; password: string };
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      return HttpResponse.json({
        token: 'mock-jwt-token',
        user: {
          id: 1,
          username: 'admin',
          name: 'Administrator',
          roles: ['admin']
        }
      });
    }
    return HttpResponse.json(
      { message: 'Invalid username or password' },
      { status: 401 }
    );
  })
];

export default handlers;
