import { z } from "zod";

export const TaxInformationSchema = z.object({
  id: z.number(),
  countryId: z.number().optional().nullable(),
  category: z.string().optional().nullable(),
  name: z.string().min(1, "Name is required"),
  taxNumber: z.string().optional().nullable(),
});

export const BankSchema = z.object({
  id: z.number(),
  bankName: z.string().min(1, "Bank Name is required"),
  accountNumber: z.string().min(1, "Account Number is required"),
  routingNumber: z.string().optional().nullable(),
  accountName: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  primary: z.boolean(),
});

export const VendorFormSchema = z.object({
  vendorId: z.number().default(0),
  companyName1: z.string().min(1, "Company Name 1 is required"),
  companyName2: z.string().min(1, "Company Name 2 is required"),
  dba: z.string().optional().nullable(),
  keyWord: z.string().min(1, "Keyword is required"),

  houseNumber: z.string().min(1, "House Number is required"),
  streetName: z.string().min(1, "Street Name is required"),
  buildingName: z.string().optional().nullable(),
  landmark: z.string().optional().nullable(),
  countryId: z.number().nullable(),
  stateId: z.number().nullable(),
  zipCode: z.string().min(1, "Zip Code is required"),
  digiPin: z.string().optional().nullable(),
  mapsUrl: z.string().url("Invalid URL").optional().or(z.literal("")),

  languageId: z.number().nullable(),

  phoneNumber1: z.string().min(1, "Phone Number 1 is required"),
  phoneNumber2: z.string().optional().nullable(),
  phoneNumber3: z.string().optional().nullable(),
  fax: z.string().optional().nullable(),

  email1: z.string().email("Invalid email"),
  email2: z.string().email("Invalid email").optional().or(z.literal("")),
  email3: z.string().email("Invalid email").optional().or(z.literal("")),
  comments: z.string().optional().nullable(),

  salesStatusId: z.number().nullable(),
  paymentId: z.number().optional().nullable(),

  taxInformationDto: z.array(TaxInformationSchema).min(1, "Add at least 1 tax record"),
  bankDetailDto: z.array(BankSchema).min(1, "Add at least 1 bank record"),
});

export type VendorFormType = z.infer<typeof VendorFormSchema>;
