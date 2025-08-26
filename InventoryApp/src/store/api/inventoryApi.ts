import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  ProductTypeModel,
  ProductGroupModel,
  ProductCategoryModel,
  ReadProductMasterForm,
  UomModel,
  UomDimensionModel,
  LanguageModel,
  SalesStatusModel,
  PostProductType,
  PostProductMasterForm,
} from '../../Models/MaterialModel';

// Define a service using a base URL and expected endpoints
export const inventoryApi = createApi({
  reducerPath: 'inventoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      // Add auth token if available
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'Language',
    'SalesStatus',
    'UomDimension',
    'Uom',
    'ProductType',
    'ProductGroup',
    'ProductCategory',
    'ProductMaster',
  ],
  endpoints: (builder) => ({
    // Languages
    getLanguages: builder.query<LanguageModel[], void>({
      query: () => 'languages',
      providesTags: ['Language'],
    }),

    // Sales Statuses
    getSalesStatuses: builder.query<SalesStatusModel[], void>({
      query: () => 'sales-statuses',
      providesTags: ['SalesStatus'],
    }),

    // UOM Dimensions
    getUomDimensions: builder.query<UomDimensionModel[], void>({
      query: () => 'uom-dimensions',
      providesTags: ['UomDimension'],
    }),

    // UOMs by Dimension
    getUomsByDimension: builder.query<UomModel[], number>({
      query: (dimensionId) => `uom-dimensions/${dimensionId}/uoms`,
      providesTags: ['Uom'],
    }),

    // Product Types
    getProductTypes: builder.query<ProductTypeModel[], void>({
      query: () => 'product-types',
      providesTags: ['ProductType'],
    }),

    createProductType: builder.mutation<ProductTypeModel, PostProductType>({
      query: (productType) => ({
        url: 'product-types',
        method: 'POST',
        body: productType,
      }),
      invalidatesTags: ['ProductType'],
    }),

    updateProductType: builder.mutation<
      ProductTypeModel,
      { id: number; productType: Partial<ProductTypeModel> }
    >({
      query: ({ id, productType }) => ({
        url: `product-types/${id}`,
        method: 'PUT',
        body: productType,
      }),
      invalidatesTags: ['ProductType'],
    }),

    deleteProductType: builder.mutation<void, number>({
      query: (id) => ({
        url: `product-types/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProductType'],
    }),

    // Product Groups
    getProductGroups: builder.query<ProductGroupModel[], void>({
      query: () => 'product-groups',
      providesTags: ['ProductGroup'],
    }),

    createProductGroup: builder.mutation<
      ProductGroupModel,
      Partial<ProductGroupModel>
    >({
      query: (productGroup) => ({
        url: 'product-groups',
        method: 'POST',
        body: productGroup,
      }),
      invalidatesTags: ['ProductGroup'],
    }),

    updateProductGroup: builder.mutation<
      ProductGroupModel,
      { id: number; productGroup: Partial<ProductGroupModel> }
    >({
      query: ({ id, productGroup }) => ({
        url: `product-groups/${id}`,
        method: 'PUT',
        body: productGroup,
      }),
      invalidatesTags: ['ProductGroup'],
    }),

    deleteProductGroup: builder.mutation<void, number>({
      query: (id) => ({
        url: `product-groups/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProductGroup'],
    }),

    // Product Categories
    getProductCategories: builder.query<ProductCategoryModel[], void>({
      query: () => 'product-categories',
      providesTags: ['ProductCategory'],
    }),

    createProductCategory: builder.mutation<
      ProductCategoryModel,
      Partial<ProductCategoryModel>
    >({
      query: (productCategory) => ({
        url: 'product-categories',
        method: 'POST',
        body: productCategory,
      }),
      invalidatesTags: ['ProductCategory'],
    }),

    updateProductCategory: builder.mutation<
      ProductCategoryModel,
      { id: number; productCategory: Partial<ProductCategoryModel> }
    >({
      query: ({ id, productCategory }) => ({
        url: `product-categories/${id}`,
        method: 'PUT',
        body: productCategory,
      }),
      invalidatesTags: ['ProductCategory'],
    }),

    deleteProductCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `product-categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProductCategory'],
    }),

    // Product Master
    getProductMasterById: builder.query<ReadProductMasterForm, number>({
      query: (id) => `product-master/${id}`,
      providesTags: ['ProductMaster'],
    }),

    createProductMaster: builder.mutation<
      ReadProductMasterForm,
      PostProductMasterForm
    >({
      query: (productMaster) => ({
        url: 'product-master',
        method: 'POST',
        body: productMaster,
      }),
      invalidatesTags: ['ProductMaster'],
    }),

    updateProductMaster: builder.mutation<
      ReadProductMasterForm,
      { id: number; productMaster: Partial<PostProductMasterForm> }
    >({
      query: ({ id, productMaster }) => ({
        url: `product-master/${id}`,
        method: 'PUT',
        body: productMaster,
      }),
      invalidatesTags: ['ProductMaster'],
    }),

    deleteProductMaster: builder.mutation<void, number>({
      query: (id) => ({
        url: `product-master/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProductMaster'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetLanguagesQuery,
  useGetSalesStatusesQuery,
  useGetUomDimensionsQuery,
  useGetUomsByDimensionQuery,
  useGetProductTypesQuery,
  useCreateProductTypeMutation,
  useUpdateProductTypeMutation,
  useDeleteProductTypeMutation,
  useGetProductGroupsQuery,
  useCreateProductGroupMutation,
  useUpdateProductGroupMutation,
  useDeleteProductGroupMutation,
  useGetProductCategoriesQuery,
  useCreateProductCategoryMutation,
  useUpdateProductCategoryMutation,
  useDeleteProductCategoryMutation,
  useGetProductMasterByIdQuery,
  useCreateProductMasterMutation,
  useUpdateProductMasterMutation,
  useDeleteProductMasterMutation,
} = inventoryApi;
