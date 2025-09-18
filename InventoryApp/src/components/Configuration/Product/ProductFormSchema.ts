import { z } from "zod";

export const ProductFormSchema = z.object({
  productName: z.string()
    .min(1, "Product Name is required")
    .max(100, "Product Name cannot exceed 100 characters"),
  
  productDescription: z.string()
    .min(1, "Product Description is required")
    .max(500, "Product Description cannot exceed 500 characters"),
  
  productCategory: z.string()
    .optional()
    .nullable()
    .transform(val => val === "" ? null : val),
    
  productGroup: z.string()
    .optional()
    .nullable()
    .transform(val => val === "" ? null : val),
  
  price: z.number()
    .min(0, "Price cannot be negative")
    .optional()
    .nullable()
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format").transform(val => val ? parseFloat(val) : null))
});

export type ProductFormData = z.infer<typeof ProductFormSchema>;
