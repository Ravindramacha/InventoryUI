
import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
 } from '@mui/material';
import { useGetAllProductCategories, useGetAllProductGroups, useGetUomsByDimensionId, useLanguages, usePostProductMasterForm, useProductTypes, useSalesStatus, useUomDimension } from '../api/ApiQueries';
import Autocomplete from '@mui/material/Autocomplete';
import DynamicField, { type Attribute } from './common/DynamicField';
import UOMComponent from './UOMComponent';
import type { PostProductMasterForm, UomData } from '../Models/MaterialModel';
import { Snackbar, Alert, CircularProgress, Backdrop } from '@mui/material';


const ApplicationFormPage = () => {
   const initialUOMRows = [
  {
    id: Date.now(),
    uom: null,
    quantity: "",
    primaryQty: "",
    length: null,
    width: null,
    height: null,
    netWeight: null,
    grossWeight: null,
    volume: null,
    lengthUom: "",
    weightUom: "",
    volumeUom: ""
  }
];
   const [uomRows, setUomRows] = useState<UomData[]>(initialUOMRows);
  const [formData, setFormData] = useState<PostProductMasterForm>({
    productId: '',
    productTypeId: '',
    productGroupId:  '',
    productCategoryId:  '',
    salesStatusId: '',
    languageId: '',
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
    number1: null,
    number2: null,
    number3: null,
    number4: null,
    number5: null,
    dropDown1: '',
    dropDown2: '',
    dropDown3: '',
    dropDown4: '',
    dropDown5: '',
    productMasterUomDto: uomRows,
    unitOfMeasurement:  null,
    manufacturerId:null,
    manufacturerPartNumber: '',
    notes: '',
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
    value: null,
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
 
 
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [backdropOpen, setBackdropOpen] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      productMasterUomDto: uomRows,
    }));
  }, [uomRows]);
  const {mutate}= usePostProductMasterForm();

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
   const { data: salesStatuses = [] } = useSalesStatus();
   const { data: languages = [] } = useLanguages();
   const { data: uomDimensions = [] } = useUomDimension();
   const { data: uomsByDimension = [] } = useGetUomsByDimensionId(formData.unitOfMeasurement)
 const resetForm = () => {
    setFormData({
      productId: '',
      productTypeId: '',
      productGroupId: '',
      productCategoryId: '',
      salesStatusId: '',
      languageId: '',
      shortDescription: '',
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
      number1: null,
      number2: null,
      number3: null,
      number4: null,
      number5: null,
      dropDown1: '',
      dropDown2: '',
      dropDown3: '',
      dropDown4: '',
      dropDown5: '',
      productMasterUomDto: [],
      unitOfMeasurement: null,
      manufacturerId: null,
      manufacturerPartNumber: '',
      notes: '',
    });
    setTextFields(initialTextFields);
    setNumberFields(initialNumberFields);
    setDateFields(initialDateFields);
    setDropDownFields(initialDropDownFields);
    setUomRows([
      {
        id: Date.now(),
        uom: null,
        quantity: "",
        primaryQty: "",
        length: null,
        width: null,
        height: null,
        netWeight: null,
        grossWeight: null,
        volume: null,
        lengthUom: "",
        weightUom: "",
        volumeUom: ""
      }
    ]);
  };


const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setBackdropOpen(true); // show backdrop

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
    productMasterUomDto: uomRows,
  };

 

  mutate(finalFormData, {
    onSuccess: () => {
      setSnackbarMessage('Product Master Form submitted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      resetForm();
    },
    onError: (error) => {
      setSnackbarMessage(`Failed to submit: ${error.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    },
    onSettled: () => {
      setTimeout(() => {
        setLoading(false);
        setBackdropOpen(false); // hide after 2s
      }, 2000);
    },
  });
};


  return (
    <>
        <Typography variant="h5" gutterBottom>
         Product Master
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
             <Grid size={{xs:12}}>
              <Box component="section">
                <Typography variant="h6" gutterBottom>
                  General Data
                </Typography>
              </Box>
             </Grid>
            
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Product Id"
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
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
               <Autocomplete
                disablePortal
                options={languages}
                getOptionLabel={(option) => `${option.languageDesc} (${option.languageCode})` || ''}
                isOptionEqualToValue={(option, value) => option.languageId === value.languageId}
                 onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    languageId: newValue?.languageId?.toString() || '',
                  }));
                }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Language" fullWidth required/>}
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
               <Autocomplete
                disablePortal
                options={salesStatuses}
                getOptionLabel={(option) => `${option.salesStatusDesc} (${option.salesStatusCode})` || ''}
                isOptionEqualToValue={(option, value) => option.salesStatusId === value.salesStatusId}
                 onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    salesStatusId: newValue?.salesStatusId?.toString() || '',
                  }));
                }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Status" fullWidth required/>}
              />
            </Grid>
             <Grid size={{xs:12, sm:12, md:6, lg:3}}>
               <Autocomplete
                disablePortal
                options={uomDimensions}
                getOptionLabel={(option) => `${option.uomDimDesc} (${option.uomDimCode})` || ''}
                isOptionEqualToValue={(option, value) => option.uomDimId === value.uomDimId}
                 onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    unitOfMeasurement: newValue?.uomDimId
                  }));
                }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Unit of Measurement" fullWidth required/>}
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
           
            <Grid size={12}> 
              <UOMComponent 
                initialRows={uomRows}
                maxRows={5}
                onChange={(rows) => {
                  setUomRows(rows); // update local state
                }}
                uomOptions={uomsByDimension}
                />
            </Grid>
             <Grid size={{xs:12, sm:12, md:6, lg:3}}>
               <Autocomplete
                disablePortal
                options={salesStatuses}
                getOptionLabel={(option) => `${option.salesStatusDesc} (${option.salesStatusCode})` || ''}
                isOptionEqualToValue={(option, value) => option.salesStatusId === value.salesStatusId}
                 onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    salesStatusId: newValue?.salesStatusId?.toString() || '',
                  }));
                }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Manuafcturer" fullWidth required/>}
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Manufacturer Part Number"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                required
                
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:6}}>
              <TextField
                fullWidth
                // multiline
                // rows={4}
                label="Notes"
                name="longDescription"
                value={formData.longDescription}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={12}>
              <Button variant="contained" color="primary" type="submit" disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
              </Button>
              <Button variant="outlined" color="secondary" onClick={resetForm} disabled={loading} style={{ marginLeft: '10px' }}>
                Reset </Button>
            </Grid>
          </Grid>
          <Backdrop
            open={backdropOpen}
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}

            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert variant='filled' onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>               
        </form></>
  );
};

export default ApplicationFormPage;
