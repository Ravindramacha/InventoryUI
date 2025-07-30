
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
 } from '@mui/material';
import { useGetAllProductCategories, useGetAllProductGroups, useProductTypes } from '../api/ApiQueries';
import Autocomplete from '@mui/material/Autocomplete';
import DynamicField, { type Attribute } from './common/DynamicField';
import UOMComponent from './UOMComponent';
import type { UomData } from '../Models/MaterialModel';

interface FormData {
  productId: string;
  productTypeId: string;
  productGroupId: string;
  productCategoryId: string;
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
  number1: string;
  number2: string;  
  number3: string;
  number4: string;
  number5: string;
  dropDown1: string;
  dropDown2: string;
  dropDown3: string;
  dropDown4: string;
  dropDown5: string;
  uomData: UomData[];
  unitOfMeasurement: string;
}

const ApplicationFormPage = () => {
 
  const [formData, setFormData] = useState<FormData>({
    productId: '',
    productTypeId: '',
    productGroupId:  '',
    productCategoryId:  '',
    shortDescription:  '',
    longDescription: '',
    attribute1: '',
    attribute2: '',  
    attribute3: '',
    attribute4: '',
    attribute5: '',
    date1: null,
    date2: null,
    date3: null,
    date4: null,
    date5: null,
    number1: '',
    number2: '',
    number3: '',
    number4: '',
    number5: '',
    dropDown1: '',
    dropDown2: '',
    dropDown3: '',
    dropDown4: '',
    dropDown5: '',
    uomData: [],
    unitOfMeasurement:  '',
  });
  const initialTextFields: Attribute[] = [
  {
    id: 1,
    name: "attribute1",
    label: "Attribute 1",
    type: "text",
    value: "",
  }
 ];
 const initialNumberFields: Attribute[] = [
  {
    id: 1,
    name: "Number1",
    label: "Number 1",
    type: "number",
    value: "",
  }
 ];
  const initialDropDownFields: Attribute[] = [
  {
    id: 1,
    name: "DropDown1",
    label: "DropDown 1",
    type: "dropdown",
    value: "",
    options: ["Option 1", "Option 2", "Option 3"],
  }
 ];
 const initialDateFields: Attribute[] = [
  {
    id: 1,
    name: "Date1",
    label: "Date 1",
    type: "date",
    value: null,
  }
 ];

  const [textFields, setTextFields] = useState<Attribute[]>(initialTextFields);
  const [numberFields, setNumberFields] = useState<Attribute[]>(initialNumberFields);
  const [dropDownFields, setDropDownFields] = useState<Attribute[]>(initialDropDownFields);
  const [dateFields, setDateFields] = useState<Attribute[]>(initialDateFields);

  const handleChange = (event: ChangeEvent<HTMLInputElement>)  => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

   const { data: productTypes = [] } = useProductTypes();
   const { data: productGroups = [] } = useGetAllProductGroups();
   const { data: productCategories = [] } = useGetAllProductCategories();


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Convert dynamic fields to structured values
  const dynamicTextFields = Object.fromEntries(
    textFields.map((field, i) => [`attribute${i + 1}`, field.value])
  );

  const dynamicNumberFields = Object.fromEntries(
    numberFields.map((field, i) => [`number${i + 1}`, field.value])
  );

  const dynamicDropDownFields = Object.fromEntries(
    dropDownFields.map((field, i) => [`dropDown${i + 1}`, field.value])
  );

  const dynamicDateFields = Object.fromEntries(
    dateFields.map((field, i) => [`date${i + 1}`, field.value])
  );

  const finalFormData = {
    ...formData,
    ...dynamicTextFields,
    ...dynamicNumberFields,
    ...dynamicDropDownFields,
    ...dynamicDateFields,
  };

  console.log("Submitted Data:", finalFormData);

  alert("Form submitted! Check the console for full data.");
};

  return (
    <>
    <Typography variant="h5" gutterBottom>
         Material Master
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Product ID"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                required
                //error
                //defaultValue="Hello World"
               // helperText="Enter value"
              />
            </Grid>
             <Grid size={{xs:12, sm:12, md:6, lg:3}}>
               <Autocomplete
                disablePortal
                options={productTypes}
                getOptionLabel={(option) => `${option.productTypeDesc} (${option.productTypeCode})` || ''}
                isOptionEqualToValue={(option, value) => option.productTypeId === value.productTypeId}
                onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    productTypeId: newValue?.productTypeId?.toString() || '',
                  }));
                }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Product Type" fullWidth required/>}
              />
            </Grid>
             <Grid size={{xs:12, sm:12, md:6, lg:3}}>
               <Autocomplete
                disablePortal
                options={productGroups}
                getOptionLabel={(option) => `${option.productGroupDesc} (${option.productGroupCode})` || ''}
                isOptionEqualToValue={(option, value) => option.productGroupId === value.productGroupId}
                 onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    productGroupId: newValue?.productGroupId?.toString() || '',
                  }));
                }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Product Group" fullWidth required/>}
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
               <Autocomplete
                disablePortal
                options={productCategories}
                getOptionLabel={(option) => `${option.productCategoryDesc} (${option.productCategoryCode})` || ''}
                isOptionEqualToValue={(option, value) => option.productCategoryId === value.productCategoryId}
                 onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    productCategoryId: newValue?.productCategoryId?.toString() || '',
                  }));
                }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Product Category" fullWidth required/>}
              />
            </Grid>
             <Grid size={{xs:12, sm:12, md:6, lg:6}}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Short Description"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:6}}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Long Description"
                name="longDescription"
                value={formData.longDescription}
                onChange={handleChange}
                required
              />
            </Grid>
             
            <Grid size={{xs:12, sm:12, md:6, lg:5}}>
              <DynamicField
               attributes={textFields}
               maxFields={5}
               onChange={(updated) => setTextFields(updated)}
              />
          </Grid>
          <Grid size={{xs:12, sm:12, md:6, lg:5}}>
            <DynamicField
              attributes={dateFields}
              maxFields={5}
              onChange={(updated) => setDateFields(updated)}
             />
           </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:5}}>
            <DynamicField
               attributes={numberFields}
               maxFields={5}
               onChange={(updated) => setNumberFields(updated)}
              />
           </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:5}}>
            <DynamicField
               attributes={dropDownFields}
               maxFields={5}
               onChange={(updated) => setDropDownFields(updated)}
              />
           </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Unit of Measurement"
                name="unitOfMeasurement"
                value={formData.unitOfMeasurement}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={12}> 
              <UOMComponent 
                initialRows={[{ id: Date.now(), uom: "", quantity: "", primaryQty: "", length: 0, width: 0, height: 0, netWeight: 0, grossWeight: 0, volume: 0 , lengthUom: "", weightUom: "", volumeUom: "" }]}
                maxRows={5}
                onChange={(rows) => {
                setFormData((prev) => ({
                  ...prev,
                  uomData: rows,
                }));
              }}
                />
            </Grid>
            <Grid size={12}>
              <Button variant="contained" color="primary" type="submit" >
                Submit 
              </Button>
            </Grid>
          </Grid>
        </form></>
  );
};

export default ApplicationFormPage;
