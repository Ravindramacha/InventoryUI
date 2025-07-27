
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

interface FormData {
  productId: string;
  productTypeId: string;
  productGroupId: string;
  productCategoryId: string;
  shortDescription: string;
  longDescription: string;
  unitOfMeasurement: string;
  email: string;
  age: string;
  birthDate: Date | null;
  gender: string;
  languageId: string;
  newsletter: boolean;
  resume: File | null;
  experienceLevel: number;
}

const ApplicationFormPage = () => {
 
  const [formData, setFormData] = useState<FormData>({
    productId: '',
    productTypeId: '',
    productGroupId:  '',
    productCategoryId:  '',
    shortDescription:  '',
    longDescription: '',
    unitOfMeasurement:  '',
    email: '',
    age: '',
    birthDate: null,
    gender: '',
    languageId: '',
    newsletter: false,
    resume: null,
    experienceLevel: 0,
  });
  const initialTextFields: Attribute[] = [
  {
    id: 1,
    name: "Attribute1",
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
    console.log(formData);
    alert('Form submitted! Check console for data.');
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
              />
            </Grid>
             <Grid size={{xs:12, sm:12, md:6, lg:3}}>
               <Autocomplete
                disablePortal
                options={productTypes}
                getOptionLabel={(option) => `${option.productTypeDesc} (${option.productTypeCode})` || ''}
                isOptionEqualToValue={(option, value) => option.productTypeId === value.productTypeId}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Product Type" fullWidth />}
              />
            </Grid>
             <Grid size={{xs:12, sm:12, md:6, lg:3}}>
               <Autocomplete
                disablePortal
                options={productGroups}
                getOptionLabel={(option) => `${option.productGroupDesc} (${option.productGroupCode})` || ''}
                isOptionEqualToValue={(option, value) => option.productGroupId === value.productGroupId}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Product Group" fullWidth />}
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
               <Autocomplete
                disablePortal
                options={productCategories}
                getOptionLabel={(option) => `${option.productCategoryDesc} (${option.productCategoryCode})` || ''}
                isOptionEqualToValue={(option, value) => option.productCategoryId === value.productCategoryId}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Product Category" fullWidth />}
              />
            </Grid>
          
             {/* <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Unit of Measurement"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                required
              />
            </Grid> */}
              <Grid size={{xs:12, sm:12, md:6, lg:6}}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Long Description"
                name="productId"
                value={formData.longDescription}
                onChange={handleChange}
                required
              />
            </Grid>
              <Grid size={{xs:12, sm:12, md:6, lg:6}}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Short Description"
                name="productId"
                value={formData.shortDescription}
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
            <Grid size={12}>
              <Button variant="contained" color="primary" type="submit">
                Submit 
              </Button>
            </Grid>
          </Grid>
        </form></>
  );
};

export default ApplicationFormPage;
