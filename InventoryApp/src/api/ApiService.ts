import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type {
  LanguageModel,
  PostProductMasterForm,
  PostProductType,
  ProductCategoryModel,
  ProductGroupModel,
  ProductTypeModel,
  ReadProductMasterForm,
  SalesStatusModel,
  UomDimensionModel,
  UomModel,
} from '../Models/MaterialModel';
import type { VendorModel } from '../Models/VendorModel';

// Base API configuration
const BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// API Service Class
export class ApiService {
  // Languages API
  static async getAllLanguages(): Promise<LanguageModel[]> {
    const response: AxiosResponse<LanguageModel[]> = await api.get(
      '/Languages/GetAllLanguages'
    );
    return response.data;
  }

  // Sales Status API
  static async getAllSalesStatuses(): Promise<SalesStatusModel[]> {
    const response: AxiosResponse<SalesStatusModel[]> = await api.get(
      '/SalesStatuses/GetAllSalesStatuses'
    );
    return response.data;
  }

  // UOM Dimensions API
  static async getAllUomDimensions(): Promise<UomDimensionModel[]> {
    const response: AxiosResponse<UomDimensionModel[]> = await api.get(
      '/UomDimensions/GetAllUomDimensions'
    );
    return response.data;
  }

  static async getUomsByDimensionId(dimensionId: number): Promise<UomModel[]> {
    const response: AxiosResponse<UomModel[]> = await api.get(
      `/Uoms/GetUomByDimentionId/${dimensionId}`
    );
    return response.data;
  }

  // Product Types API
  static async getAllProductTypes(): Promise<ProductTypeModel[]> {
    const response: AxiosResponse<ProductTypeModel[]> = await api.get(
      '/ProductTypes/GetAllProductTypes'
    );
    return response.data;
  }

  static async createProductType(
    productType: PostProductType
  ): Promise<ProductTypeModel> {
    const response: AxiosResponse<ProductTypeModel> = await api.post(
      '/ProductTypes/AddProductType',
      productType
    );
    return response.data;
  }

  static async updateProductType(
    id: number,
    productType: Partial<ProductTypeModel>
  ): Promise<ProductTypeModel> {
    const response: AxiosResponse<ProductTypeModel> = await api.put(
      `/ProductTypes/UpdateProductType/${id}`,
      productType
    );
    return response.data;
  }

  static async deleteProductType(id: number): Promise<void> {
    await api.delete(`/ProductTypes/DeleteProductType/${id}`);
  }

  // Product Groups API
  static async getAllProductGroups(): Promise<ProductGroupModel[]> {
    const response: AxiosResponse<ProductGroupModel[]> = await api.get(
      '/ProductGroups/GetAllProductGroups'
    );
    return response.data;
  }

  static async createProductGroup(
    productGroup: Partial<ProductGroupModel>
  ): Promise<ProductGroupModel> {
    const response: AxiosResponse<ProductGroupModel> = await api.post(
      '/ProductGroups/AddProductGroup',
      productGroup
    );
    return response.data;
  }

  static async updateProductGroup(
    id: number,
    productGroup: Partial<ProductGroupModel>
  ): Promise<ProductGroupModel> {
    const response: AxiosResponse<ProductGroupModel> = await api.put(
      `/ProductGroups/UpdateProductGroup/${id}`,
      productGroup
    );
    return response.data;
  }

  static async deleteProductGroup(id: number): Promise<void> {
    await api.delete(`/ProductGroups/DeleteProductGroup/${id}`);
  }

  // Product Categories API
  static async getAllProductCategories(): Promise<ProductCategoryModel[]> {
    const response: AxiosResponse<ProductCategoryModel[]> = await api.get(
      '/ProductCategories/GetAllProductCategories'
    );
    return response.data;
  }

  static async createProductCategory(
    productCategory: Partial<ProductCategoryModel>
  ): Promise<ProductCategoryModel> {
    const response: AxiosResponse<ProductCategoryModel> = await api.post(
      '/ProductCategories/AddProductCategory',
      productCategory
    );
    return response.data;
  }

  static async updateProductCategory(
    id: number,
    productCategory: Partial<ProductCategoryModel>
  ): Promise<ProductCategoryModel> {
    const response: AxiosResponse<ProductCategoryModel> = await api.put(
      `/ProductCategories/UpdateProductCategory/${id}`,
      productCategory
    );
    return response.data;
  }

  static async deleteProductCategory(id: number): Promise<void> {
    await api.delete(`/ProductCategories/DeleteProductCategory/${id}`);
  }

  // Product Master API
  static async getAllProductMasterForms(): Promise<ReadProductMasterForm[]> {
    const response: AxiosResponse<ReadProductMasterForm[]> = await api.get(
      '/ProductMasterForms/GetAllProductMasterForm'
    );
    return response.data;
  }

  static async getProductMasterFormById(
    id: number
  ): Promise<ReadProductMasterForm> {
    const response: AxiosResponse<ReadProductMasterForm> = await api.get(
      `/ProductMasterForms/GetProductMasterForm/${id}`
    );
    return response.data;
  }

  static async createProductMasterForm(
    productMaster: PostProductMasterForm
  ): Promise<ReadProductMasterForm> {
    const response: AxiosResponse<ReadProductMasterForm> = await api.post(
      '/ProductMasterForms/AddProductMasterForm',
      productMaster
    );
    return response.data;
  }

  static async updateProductMasterForm(
    id: number,
    productMaster: Partial<PostProductMasterForm>
  ): Promise<ReadProductMasterForm> {
    const response: AxiosResponse<ReadProductMasterForm> = await api.put(
      `/ProductMasterForms/UpdateProductMasterForm/${id}`,
      productMaster
    );
    return response.data;
  }

  static async deleteProductMasterForm(id: number): Promise<void> {
    await api.delete(`/ProductMasterForms/DeleteProductMasterForm/${id}`);
  }

  // Vendor API
  static async getAllVendors(): Promise<VendorModel[]> {
    const response: AxiosResponse<VendorModel[]> = await api.get(
      '/VendorForms/GetAllVendors'
    );
    return response.data;
  }

  static async getVendorById(id: number): Promise<VendorModel> {
    const response: AxiosResponse<VendorModel> = await api.get(
      `/VendorForms/GetVendor/${id}`
    );
    return response.data;
  }

  static async createVendor(vendor: VendorModel): Promise<VendorModel> {
    const response: AxiosResponse<VendorModel> = await api.post(
      '/VendorForms/AddVendorForm',
      vendor
    );
    return response.data;
  }

  static async updateVendor(
    id: number,
    vendor: Partial<VendorModel>
  ): Promise<VendorModel> {
    const response: AxiosResponse<VendorModel> = await api.put(
      `/VendorForms/UpdateVendor/${id}`,
      vendor
    );
    return response.data;
  }

  static async deleteVendor(id: number): Promise<void> {
    await api.delete(`/VendorForms/DeleteVendor/${id}`);
  }
}

export default ApiService;
