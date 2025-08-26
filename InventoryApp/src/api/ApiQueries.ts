import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
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
import type { ReadVendorFormModel } from '../Models/VendorModel';

// ✅ Hook with retry + enabled as parameters
export function useLanguages(retry: number = 1, enabled: boolean = true) {
  return useQuery<LanguageModel[], Error>({
    queryKey: ['languages'],
    queryFn: async () => {
      const response = await axios.get<LanguageModel[]>(
        '/api/Languages/GetAllLanguages',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Cache-Control': 'no-cache',
          },
        }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry, // 👈 dynamic retry
    enabled, // 👈 only fetch if enabled === true
  });
}

export function useSalesStatus(retry: number = 1, enabled: boolean = true) {
  return useQuery<SalesStatusModel[], Error>({
    queryKey: ['SalesStatus'],
    queryFn: async () => {
      const response = await axios.get<SalesStatusModel[]>(
        '/api/SalesStatuses/GetAllSalesStatuses',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Cache-Control': 'no-cache',
          },
        }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry, // 👈 dynamic retry
    enabled, // 👈 only fetch if enabled === true
  });
}
export function useUomDimension(retry: number = 1, enabled: boolean = true) {
  return useQuery<UomDimensionModel[], Error>({
    queryKey: ['UomDimension'],
    queryFn: async () => {
      const response = await axios.get<UomDimensionModel[]>(
        '/api/UomDimensions/GetAllUomDimensions',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Cache-Control': 'no-cache',
          },
        }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry, // 👈 dynamic retry
    enabled, // 👈 only fetch if enabled === true
  });
}
export function useGetUomsByDimensionId(dimensionId?: number | null) {
  return useQuery<UomModel[], Error>({
    queryKey: ['UomsByDimension', dimensionId],
    queryFn: async () => {
      if (!dimensionId) return [];
      const response = await axios.get(
        `/api/Uoms/GetUomByDimentionId/${dimensionId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    },
    enabled: !!dimensionId,
  });
}
export function useGetProductFormById(Id?: number | null) {
  return useQuery<PostProductMasterForm, Error>({
    queryKey: ['ReadProductMasterFormById', Id],
    queryFn: async () => {
      if (!Id) return [];
      const response = await axios.get(
        `/api/ProductMasterForms/GetAllProductMasterForm/${Id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    },
    enabled: !!Id,
  });
}

export function useProductTypes(retry: number = 1, enabled: boolean = true) {
  return useQuery<ProductTypeModel[], Error>({
    queryKey: ['productTypes'],
    queryFn: async () => {
      const response = await axios.get<ProductTypeModel[]>(
        '/api/ProductTypes/GetAllProductTypes',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Cache-Control': 'no-cache',
          },
        }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry, // 👈 dynamic retry
    enabled, // 👈 only fetch if enabled === true
  });
}

export function useGetAllProductGroups(
  retry: number = 1,
  enabled: boolean = true
) {
  return useQuery<ProductGroupModel[], Error>({
    queryKey: ['productGroups'],
    queryFn: async () => {
      const response = await axios.get<ProductGroupModel[]>(
        '/api/ProductGroups/GetAllProductGroups',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Cache-Control': 'no-cache',
          },
        }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry, // 👈 dynamic retry
    enabled, // 👈 only fetch if enabled === true
  });
}

export function useGetAllProductCategories(
  retry: number = 1,
  enabled: boolean = true
) {
  return useQuery<ProductCategoryModel[], Error>({
    queryKey: ['productCategories'],
    queryFn: async () => {
      const response = await axios.get<ProductCategoryModel[]>(
        '/api/ProductCategories/GetAllProductCategories',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Cache-Control': 'no-cache',
          },
        }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry, // 👈 dynamic retry
    enabled, // 👈 only fetch if enabled === true
  });
}

export function usePostProductType() {
  return useMutation({
    mutationFn: async (newProductType: PostProductType) => {
      const response = await axios.post(
        '/api/ProductTypes/AddProductType',
        newProductType,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
        }
      );
      return response.data;
    },
  });
}
export function usePostProductMasterForm() {
  return useMutation({
    mutationFn: async (newProductMasterType: PostProductMasterForm) => {
      const response = await axios.post(
        '/api/ProductMasterForms/AddProductMasterForm',
        newProductMasterType,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
        }
      );
      return response.data;
    },
  });
}

export function usePutProductMasterForm() {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: PostProductMasterForm;
    }) => {
      const response = await axios.put(
        `/api/ProductMasterForms/UpdateProductMasterForm/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
        }
      );
      return response.data;
    },
  });
}
export function usePutVendorForm() {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: ReadVendorFormModel;
    }) => {
      const response = await axios.put(
        `/api/VendorForms/UpdateVendorForm/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
        }
      );
      return response.data;
    },
  });
}

export function usePostVendorForm() {
  return useMutation({
    mutationFn: async (newVendorForm: ReadVendorFormModel) => {
      const response = await axios.post(
        '/api/VendorForms/AddVendorForm',
        newVendorForm,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
        }
      );
      return response.data;
    },
  });
}

export function useGetAllProductMasterForm(
  retry: number = 1,
  enabled: boolean = true
) {
  return useQuery<ReadProductMasterForm[], Error>({
    queryKey: ['readProductMasterForm'],
    queryFn: async () => {
      const response = await axios.get<ReadProductMasterForm[]>(
        '/api/ProductMasterForms/GetAllProductMasterForm',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Cache-Control': 'no-cache',
          },
        }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry, // 👈 dynamic retry
    enabled, // 👈 only fetch if enabled === true
  });
}

export function useGetAllVendorForm(
  retry: number = 1,
  enabled: boolean = true
) {
  return useQuery<ReadVendorFormModel[], Error>({
    queryKey: ['readVendorForm'],
    queryFn: async () => {
      const response = await axios.get<ReadVendorFormModel[]>(
        '/api/VendorForms/GetAllVendorForm',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Cache-Control': 'no-cache',
          },
        }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry, // 👈 dynamic retry
    enabled, // 👈 only fetch if enabled === true
  });
}
