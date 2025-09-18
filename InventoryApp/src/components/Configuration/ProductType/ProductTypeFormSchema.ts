import { z } from "zod";

export const ProductTypeFormSchema = z.object({
  productCode: z.string()
    .min(1, "Product Code is required")
    .max(50, "Product Code cannot exceed 50 characters")
    .regex(/^[A-Za-z0-9-_]+$/, "Product Code can only contain alphanumeric characters, hyphens and underscores"),
  
  productDescription: z.string()
    .optional()
    .nullable()
    .transform(val => val === "" ? null : val)
});

export type ProductTypeFormData = z.infer<typeof ProductTypeFormSchema>;
