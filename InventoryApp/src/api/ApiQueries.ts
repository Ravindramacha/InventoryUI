import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { LanguageModel, ProductTypeModel } from "../Models/MaterialModel";

// ✅ Hook with retry + enabled as parameters
export function useLanguages(
  retry: number = 1,
  enabled: boolean = true
) {
  return useQuery<LanguageModel[], Error>({
    queryKey: ["languages"],
    queryFn: async () => {
      const response = await axios.get<LanguageModel[]>("/api/Languages/GetAllLanguages", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Cache-Control": "no-cache", 
        },
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry,      // 👈 dynamic retry
    enabled,    // 👈 only fetch if enabled === true
  });
}

export function useProductTypes(
  retry: number = 1,
  enabled: boolean = true
) {
  return useQuery<ProductTypeModel[], Error>({
    queryKey: ["productTypes"],
    queryFn: async () => {
      const response = await axios.get<ProductTypeModel[]>("/api/ProductTypes/GetAllProductTypes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Cache-Control": "no-cache", 
        },
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry,      // 👈 dynamic retry
    enabled,    // 👈 only fetch if enabled === true
  });
}
