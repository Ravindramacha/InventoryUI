export interface VendorModel {
  companyName1: string;
  companyName2: string;
  dba: string;
  keyword: string;
  houseNumber: string;
  streetName: string;
  buildingName: string;
  landmark: string;
  countryId: number | undefined | null;
  stateId: number | undefined | null;
  zipCode: string;
  digiPin: string;
  mapsUrl: string;
  languageId: number | undefined | null;
  phoneNumber1: string;
  phoneNumber2: string;
  phoneNumber3: string;
  fax: string;
  email1: string;
  email2: string;
  email3: string;
  comments: string;
  salesStatusId: number | undefined | null;
  taxInformations: TaxInformationModel[];
  bankDetails: BankModel[];
  paymentId: number | undefined | null;
}

export interface TaxInformationModel {
  id: number;
  taxInformationId?: number | undefined;
  countryId: number | undefined | null;
  category: string;
  name: string;
  taxNumber: string;
}

export interface BankModel {
  id: number;
  bankId?: number | undefined;
  bankName: string;
  accountNumber?: string | null;
  routingNumber?: string | null;
  accountName?: string | null;
  phoneNumber?: string | null;
  primary: boolean;
}

export interface ReadVendorFormModel {
  vendorId: number;
  companyName1: string;
  companyName2: string;
  dba: string;
  keyWord: string;
  houseNumber: string;
  streetName: string;
  buildingName: string;
  landmark: string;
  countryId: number | undefined | null;
  stateId: number | undefined | null;
  zipCode: string;
  digiPin: string;
  mapsUrl: string;
  languageId: number | undefined | null;
  phoneNumber1: string;
  phoneNumber2: string;
  phoneNumber3: string;
  fax: string;
  email1: string;
  email2: string;
  email3: string;
  comments: string;
  salesStatusId: number | undefined | null;
  taxInformationDto: TaxInformationDto[];
  bankDetailDto: BankDetailDto[];
  paymentId: number | undefined | null;
}

export interface TaxInformationDto extends TaxInformationModel {
  taxInformationId?: number | undefined;
}
export interface BankDetailDto extends BankModel {
  bankId?: number | undefined;
}
export const countryList = [
  { id: 1, name: 'United States' },
  { id: 2, name: 'Canada' },
  { id: 3, name: 'India' },
];

export const stateList = [
  { id: 1, countryId: 1, name: 'California' },
  { id: 2, countryId: 1, name: 'Texas' },
  { id: 3, countryId: 2, name: 'Ontario' },
  { id: 4, countryId: 3, name: 'Maharashtra' },
  // add more states with countryId mappings
];
