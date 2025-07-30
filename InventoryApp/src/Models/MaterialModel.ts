// src/models/LanguageModel.ts
export interface LanguageModel {
  languageId: number;
  languageCode: string;
  languageDesc: string;
  createdOn: string;     // You can use Date type if you parse it
  createdBy: number;
  modifiedOn: string;
  modifiedBy: number;
}

export interface ProductTypeModel {
  productTypeId: number;
  productTypeCode: string;
  productTypeDesc: string;
  createdOn: string;     // You can use Date type if you parse it
  createdBy: number;
  modifiedOn: string;
  modifiedBy: number;
}

export interface PostProductType {
  productTypeCode: string;
  productTypeDesc: string;
  TranscationById: number; // Assuming this is the user ID performing the transaction
}

export interface PutProductType {
  productTypeId: number;
  productTypeCode: string;
  productTypeDesc: string;
  TranscationById: number; // Assuming this is the user ID performing the transaction 
}

export interface ProductGroupModel {
  productGroupId: number;
  productGroupCode: string;
  productGroupDesc: string;
  createdOn: string;     // You can use Date type if you parse it
  createdBy: number;
  modifiedOn: string;
  modifiedBy: number;
}

export interface ProductCategoryModel {
  productCategoryId: number;
  productCategoryCode: string;
  productCategoryDesc: string;
  createdOn: string;     // You can use Date type if you parse it
  createdBy: number;
  modifiedOn: string;
  modifiedBy: number;
}
export interface UomData {
  id: number;
  uom: string;
  quantity: string;
  primaryQty: string;
  length: number;
  width: number; 
  height: number;
  lengthUom: string;
  netWeight: number;
  grossWeight: number;
  weightUom: string;
  volume: number;
  volumeUom?: string;
}
