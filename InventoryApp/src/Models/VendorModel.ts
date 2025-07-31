export interface VendorModel {
  companyName1: string;
  companyName2: string;
  dba:string;
  keyword:string;
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
  fax:string;
  email1: string;
  email2: string;
  email3: string;
  comments: string;
  salesStatusId: number | undefined | null;
  taxInformation: TaxInformationModel[];
  bankDetails: BankModel[];
  paymentId: number | undefined | null;
}
export interface TaxInformationModel {
    id: number;
    countryId: number | undefined | null;
    category:string;
    name: string;
    taxNumber: string;
}
export interface BankModel {
  id: number;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountName: string;
  phoneNumber: string;
  primary: boolean;
}