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
