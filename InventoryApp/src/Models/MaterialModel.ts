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

export interface SalesStatusModel {
  salesStatusId: number;
  salesStatusCode: string;
  salesStatusDesc: string;
  createdOn: string;     // You can use Date type if you parse it
  createdBy: number;
  modifiedOn: string;
  modifiedBy: number;
}


export interface UomModel {
  uomId: number;
  uomCode: string;
  uomDesc: string;
  uomDimId: number; // Assuming this is the dimension ID
  createdOn: string;     // You can use Date type if you parse it
  createdBy: number;
  modifiedOn: string;
  modifiedBy: number;
}
export interface UomDimensionModel {
  uomDimId: number;
  uomDimCode: string;
  uomDimDesc: string;
  uoms: UomModel[];
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
  uom: number | undefined | null;
  quantity: string;
  primaryQty: string;
  length?: number | undefined | null;
  width?: number | undefined | null;
  height?: number | undefined | null;
  lengthUom: string;
  netWeight?: number | undefined | null;
  grossWeight?: number | undefined | null; 
  weightUom: string;
  volume?: number | undefined | null;
  volumeUom?: string;
}
export interface PostProductMasterForm {
  productId: string;
  productTypeId: number | undefined | null;
  productGroupId: number | undefined | null;
  productCategoryId: number | undefined | null;
  salesStatusId: number | undefined | null;
  languageId: number | undefined | null;
  shortDescription: string;
  longDescription: string;
  attribute1: string;
  attribute2: string;  
  attribute3: string;
  attribute4: string;
  attribute5: string;
  date1: Date | null;
  date2: Date | null;   
  date3: Date | null;
  date4: Date | null;
  date5: Date | null;
  number1: number | undefined | null;
  number2: number | undefined | null;
  number3: number | undefined | null;
  number4: number | undefined | null;
  number5: number | undefined | null;
  dropDown1: string;
  dropDown2: string;
  dropDown3: string;
  dropDown4: string;
  dropDown5: string;
  productMasterUomDto: UomData[];
  unitOfMeasurement: number | undefined | null;
  manufacturerPartNumber: string;
  manufacturerId: number | undefined | null;
  notes: string;
}

export interface ReadProductMasterForm {
  productMasterId: number;
  productId: string;
  productTypeId: number | undefined | null;
  productGroupId: number | undefined | null;
  productCategoryId: number | undefined | null;
  salesStatusId: number | undefined | null;
  languageId: number | undefined | null;
  shortDescription: string;
  longDescription: string;
  attribute1: string;
  attribute2: string;  
  attribute3: string;
  attribute4: string;
  attribute5: string;
  date1: Date | null;
  date2: Date | null;   
  date3: Date | null;
  date4: Date | null;
  date5: Date | null;
  number1: number | undefined | null;
  number2: number | undefined | null;
  number3: number | undefined | null;
  number4: number | undefined | null;
  number5: number | undefined | null;
  dropDown1: string;
  dropDown2: string;
  dropDown3: string;
  dropDown4: string;
  dropDown5: string;
  productMasterUomDto: UomData[];
  unitOfMeasurement: number | undefined | null;
  manufacturerPartNumber: string;
  manufacturerId: number | undefined | null;
  notes: string;
  productType : ProductTypeModel;
  productGroup : ProductGroupModel;
  productCategory : ProductCategoryModel;
}