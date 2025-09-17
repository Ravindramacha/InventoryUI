import { z } from "zod";

export const ProductTypeFormSchema = z.object({
  productCode: z.string()
    .min(1, "Product Code is required")
    .max(50, "Product Code cannot exceed 50 characters")
    .regex(/^[A-Za-z0-9-_]+$/, "Product Code can only contain alphanumeric characters, hyphens and underscores"),
  
  productName: z.string()
    .min(1, "Product Name is required")
    .max(100, "Product Name cannot exceed 100 characters"),
  
  productDescription: z.string()
    .optional()
    .nullable()
    .transform(val => val === "" ? null : val),
  
  productCategory: z.string()
    .min(1, "Product Category is required"),
  
  productType: z.string()
    .min(1, "Product Type is required"),
});

export type ProductTypeFormData = z.infer<typeof ProductTypeFormSchema>;
