import { z } from "zod";

export const TaxInformationSchema = z.object({
  id: z.number(),
  countryId: z.number().optional().nullable(),
  category: z.string().optional().nullable(),
  name: z.string().min(1, "Name is required"),
  taxNumber: z.string()
    .regex(/^[0-9a-zA-Z\-]*$/, "Tax Number must contain only alphanumeric characters and hyphens")
    .optional()
    .nullable(),
});

export const BankSchema = z.object({
  id: z.number(),
  bankName: z.string().min(1, "Bank Name is required"),
  accountNumber: z.string()
    .min(1, "Account Number is required")
    .regex(/^[0-9]+$/, "Account Number must contain only digits"),
  routingNumber: z.string()
    .regex(/^[0-9]*$/, "Routing Number must contain only digits")
    .optional()
    .nullable(),
  accountName: z.string().optional().nullable(),
  phoneNumber: z.string()
    .regex(/^[0-9+\-()\s]*$/, "Phone Number must contain only digits and symbols like +, -, (, )")
    .optional()
    .nullable(),
  primary: z.boolean(),
});

export const VendorFormSchema = z.object({
  vendorId: z.number().default(0),
  companyName1: z.string().min(1, "Company Name 1 is required"),
  companyName2: z.string().min(1, "Company Name 2 is required"),
  dba: z.string().optional().nullable(),
  keyWord: z.string().min(1, "Keyword is required"),

  houseNumber: z.string()
    .min(1, "House Number is required")
    .regex(/^[0-9a-zA-Z\-/\s]+$/, "House Number can contain only alphanumeric characters, hyphens, and slashes"),
  streetName: z.string().min(1, "Street Name is required"),
  buildingName: z.string().optional().nullable(),
  landmark: z.string().optional().nullable(),
  countryId: z.number().nullable(),
  stateId: z.number().nullable(),
  zipCode: z.string()
    .min(1, "Zip Code is required")
    .regex(/^[0-9-\s]+$/, "Zip Code must contain only digits, hyphens, and spaces"),
  digiPin: z.string()
    .regex(/^[0-9]*$/, "Digi Pin must contain only digits")
    .optional()
    .nullable(),
  mapsUrl: z.string().url("Invalid URL").optional().or(z.literal("")),

  languageId: z.number().nullable(),

  phoneNumber1: z.string()
    .min(1, "Phone Number 1 is required")
    .regex(/^[0-9+\-()\s]+$/, "Phone Number must contain only digits and symbols like +, -, (, )"),
  phoneNumber2: z.string()
    .regex(/^[0-9+\-()\s]*$/, "Phone Number must contain only digits and symbols like +, -, (, )")
    .optional()
    .nullable(),
  phoneNumber3: z.string()
    .regex(/^[0-9+\-()\s]*$/, "Phone Number must contain only digits and symbols like +, -, (, )")
    .optional()
    .nullable(),
  fax: z.string()
    .regex(/^[0-9+\-()\s]*$/, "Fax number must contain only digits and symbols like +, -, (, )")
    .optional()
    .nullable(),

  email1: z.string().email("Invalid email"),
  email2: z.string().email("Invalid email").optional().or(z.literal("")),
  email3: z.string().email("Invalid email").optional().or(z.literal("")),
  comments: z.string().optional().nullable(),

  salesStatusId: z.number().nullable(),
  paymentId: z.string().optional().nullable(),

  taxInformationDto: z.array(TaxInformationSchema).min(1, "Add at least 1 tax record"),
  bankDetailDto: z.array(BankSchema).min(1, "Add at least 1 bank record"),
});

export type VendorFormType = z.infer<typeof VendorFormSchema>;
