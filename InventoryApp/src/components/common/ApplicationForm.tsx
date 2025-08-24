
import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid
} from '@mui/material';
import { useGetAllProductCategories, useGetAllProductGroups, useGetUomsByDimensionId, useLanguages, usePostProductMasterForm, useProductTypes, usePutProductMasterForm, useSalesStatus, useUomDimension } from '../../api/ApiQueries';
import Autocomplete from '@mui/material/Autocomplete';
import DynamicField, { type Attribute } from './DynamicField';
import UOMComponent from './UOMComponent';
import type { PostProductMasterForm, UomData } from '../../Models/MaterialModel';
import { Snackbar, Alert, CircularProgress, Backdrop } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';

interface ApplicationFormPageProps {
  onCancel: () => void;
  initialData?: PostProductMasterForm | null;
  mode?: 'add' | 'edit';
  productMasterId?: number;
}

const ApplicationForm: React.FC<ApplicationFormPageProps> = ({ 
  onCancel, 
  initialData = null,
  mode = 'add',
  productMasterId = 0
}) => {
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
const initialProductMasterForm: PostProductMasterForm = {
    productId: '',
    productTypeId: null,
    productGroupId:  null,
    productCategoryId:  null,
    salesStatusId: null,
    languageId: null,
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
    productMasterUomDto: initialUOMRows,
    unitOfMeasurement:  null,
    manufacturerId:null,
    manufacturerPartNumber: '',
    notes: '',
}
  const [uomRows, setUomRows] = useState<UomData[]>(initialData?.productMasterUomDto && initialData.productMasterUomDto.length > 0 ? initialData.productMasterUomDto : initialUOMRows);
  const [formData, setFormData] = useState<PostProductMasterForm>(initialData || initialProductMasterForm);
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
  const initialTextFields: Attribute[] = [
  {
    id: 1,
    name: "attribute1",
    label: "Attribute 1",
    type: "text",
    value: "",
  }
 ];
if (mode === "edit" && initialData) {
  // --- Text Attributes ---
  const textAttrs = ["attribute1", "attribute2", "attribute3", "attribute4", "attribute5"] as const;
  textAttrs.forEach((attr, index) => {
    const value = initialData[attr];
    if (value && value.trim() !== "") {
      if (index === 0) {
        // attribute1 already exists in initialTextFields[0]
        initialTextFields[0].value = value;
      } else {
        initialTextFields.push({
          id: index + 1,
          name: attr,
          label: `Attribute ${index + 1}`,
          type: "text",
          value,
        });
      }
    }
  });

  // --- Number Attributes ---
  const numberAttrs = ["number1", "number2", "number3", "number4", "number5"] as const;
  numberAttrs.forEach((attr, index) => {
    const value = initialData[attr];
    if (value !== null && value !== undefined) {
      if (index === 0) {
        initialNumberFields[0].value = value;
      } else {
        initialNumberFields.push({
          id: index + 1,
          name: attr,
          label: `Number ${index + 1}`,
          type: "number",
          value,
        });
      }
    }
  });

  // --- Dropdown Attributes ---
  const dropDownAttrs = ["dropDown1", "dropDown2", "dropDown3", "dropDown4", "dropDown5"] as const;
  dropDownAttrs.forEach((attr, index) => {
    const value = initialData[attr];
    if (value && value.trim() !== "") {
      if (index === 0) {
        initialDropDownFields[0].value = value;
      } else {
        initialDropDownFields.push({
          id: index + 1,
          name: attr,
          label: `DropDown ${index + 1}`,
          type: "dropdown",
          value,
          options: ["Option 1", "Option 2", "Option 3"], // you can customize this per attr
        });
      }
    }
  });

  // --- Date Attributes ---
const dateAttrs = ["date1", "date2", "date3", "date4", "date5"] as const;
dateAttrs.forEach((attr, index) => {
  const value = initialData[attr];
  if (value) {
    const parsedValue = dayjs(value); // normalize backend Date to Dayjs
    if (index === 0) {
      initialDateFields[0].value = parsedValue;
    } else {
      initialDateFields.push({
        id: index + 1,
        name: attr,
        label: `Date ${index + 1}`,
        type: "date",
        value: parsedValue,
      });
    }
  }
});
}

  const queryClient = useQueryClient();
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
  const {mutate: updateMutate}= usePutProductMasterForm();

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
      productTypeId: null,
      productGroupId: null,
      productCategoryId: null,
      salesStatusId: null,
      languageId: null,
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

  if(mode === "edit" && productMasterId){
    // --- Edit Mode ---
    updateMutate({id: productMasterId, data: finalFormData}, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["readProductMasterForm"] });
        setSnackbarMessage('Product Master Form updated successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        resetForm();
        onCancel();
      },
      onError: (error) => {
        setSnackbarMessage(`Failed to update: ${error.message}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      },
      onSettled: () => {
        setTimeout(() => {
          setLoading(false);
          setBackdropOpen(false); // hide after 2s
        }, 5000);
      },
    });
  } 
  else {
    // --- Add Mode ---
    mutate(finalFormData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["readProductMasterForm"] });
        setSnackbarMessage('Product Master Form submitted successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        resetForm();
        onCancel();
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
        }, 5000);
      },
    });
  }
};


  return (
    <Box sx={{ maxWidth: '100%', width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            {mode === 'add' ? 'Add Product Master' : 'Edit Product Master'}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={onCancel}
            size="small"
            sx={{ 
              borderRadius: '8px',
              minWidth: '100px'
            }}
          >
            Back
          </Button>
        </Box>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={2}>
             <Grid size={{xs:12}}>
              <Box component="section">
                <Typography variant="body1" gutterBottom>
                  General Data
                </Typography>
              </Box>
             </Grid>
            
            <Grid size={{xs:12, sm:12, md:6, lg:4}}>
              <TextField
                fullWidth
                size="small"
                label="Product Id"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                required
              />
            </Grid>
             <Grid size={{xs:12, sm:12, md:6, lg:4}}>
               <Autocomplete
                disablePortal
                options={productTypes}
                value={
                  productTypes.find(p => p.productTypeId === formData.productTypeId) || null
                }
                getOptionLabel={(option) => `${option.productTypeDesc} (${option.productTypeCode})` || ''}
                isOptionEqualToValue={(option, value) => option.productTypeId === value.productTypeId}
                onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    productTypeId: newValue?.productTypeId || null,
                  }));
                }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Product Type" size="small" fullWidth required/>}
              />
            </Grid>
             <Grid size={{xs:12, sm:12, md:6, lg:4}}>
               <Autocomplete
                disablePortal
                options={productGroups}
                value={
                  productGroups.find(p => p.productGroupId === formData.productGroupId) || null
                }
                getOptionLabel={(option) => `${option.productGroupDesc} (${option.productGroupCode})` || ''}
                isOptionEqualToValue={(option, value) => option.productGroupId === value.productGroupId}
                
                 onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    productGroupId: newValue?.productGroupId,
                  }));
                }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Product Group" size="small" fullWidth required/>}
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:4}}>
               <Autocomplete
                disablePortal
                options={productCategories}
                value={
                  productCategories.find(p => p.productCategoryId === formData.productCategoryId) || null
                }
                getOptionLabel={(option) => `${option.productCategoryDesc} (${option.productCategoryCode})` || ''}
                isOptionEqualToValue={(option, value) => option.productCategoryId === value.productCategoryId}
                 onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    productCategoryId: newValue?.productCategoryId,
                  }));
                }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Product Category" size="small" fullWidth required/>}
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:4}}>
               <Autocomplete
                disablePortal
                options={languages}
                value={
                  languages.find(p => p.languageId === formData.languageId) || null
                }
                getOptionLabel={(option) => `${option.languageDesc} (${option.languageCode})` || ''}
                isOptionEqualToValue={(option, value) => option.languageId === value.languageId}
                 onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    languageId: newValue?.languageId,
                  }));
                }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Language" size="small" fullWidth required/>}
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:4}}>
               <Autocomplete
                disablePortal
                options={salesStatuses}
                 value={
                  salesStatuses.find(p => p.salesStatusId === formData.salesStatusId) || null
                }
                getOptionLabel={(option) => `${option.salesStatusDesc} (${option.salesStatusCode})` || ''}
                isOptionEqualToValue={(option, value) => option.salesStatusId === value.salesStatusId}
                 onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    salesStatusId: newValue?.salesStatusId,
                  }));
                }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Status" size="small" fullWidth required/>}
              />
            </Grid>
             <Grid size={{xs:12, sm:12, md:6, lg:4}}>
               <Autocomplete
                disablePortal
                options={uomDimensions}
                value={
                  uomDimensions.find(p => p.uomDimId === formData.unitOfMeasurement) || null
                }
                getOptionLabel={(option) => `${option.uomDimDesc} (${option.uomDimCode})` || ''}
                isOptionEqualToValue={(option, value) => option.uomDimId === value.uomDimId}
                 onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    unitOfMeasurement: newValue?.uomDimId
                  }));
                }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Unit of Measurement" size="small" fullWidth required/>}
              />
            </Grid>
             <Grid size={{xs:12, sm:12, md:6, lg:4}}>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={2}
                label="Short Description"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:4}}>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={2}
                label="Long Description"
                name="longDescription"
                value={formData.longDescription}
                onChange={handleChange}
                required
              />
            </Grid>
             <Grid></Grid>
            <Grid container spacing={2}>
              <Grid size={{xs:12, sm:6, md:6}} >
                <DynamicField
                  attributes={textFields}
                  maxFields={5}
                  onChange={(updated) => setTextFields(updated)}
                />
              </Grid>
               <Grid  size={{xs:12, sm:6, md:6}}>
                <DynamicField
                  attributes={dateFields}
                  maxFields={5}
                  onChange={(updated) => setDateFields(updated)}
                />
              </Grid>
              <Grid  size={{xs:12, sm:6, md:6}}>
                <DynamicField
                  attributes={numberFields}
                  maxFields={5}
                  onChange={(updated) => setNumberFields(updated)}
                />
              </Grid>
              <Grid size={{xs:12, sm:6, md:6}}>
                <DynamicField
                  attributes={dropDownFields}
                  maxFields={5}
                  onChange={(updated) => setDropDownFields(updated)}
                />
           </Grid>
            <Grid></Grid>
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
            
             <Grid size={{xs:12, sm:12, md:6, lg:4}}>
               <Autocomplete
                disablePortal
                options={salesStatuses}
                value={
                  salesStatuses.find(p => p.salesStatusId === formData.manufacturerId) || null
                }
                getOptionLabel={(option) => `${option.salesStatusDesc} (${option.salesStatusCode})` || ''}
                isOptionEqualToValue={(option, value) => option.salesStatusId === value.salesStatusId}
                 onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    manufacturerId: newValue?.salesStatusId,
                  }));
                }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Manuafcturer" size="small" fullWidth required/>}
              />
            </Grid>
            <Grid size={{xs:12, sm:6, md:4}} >
              <TextField
                fullWidth
                size="small"
                label="Manufacturer Part Number"
                name="manufacturerPartNumber"
                value={formData.manufacturerPartNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:4}}>
              <TextField
                fullWidth
                size="small"
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={12}>
              <Button 
                variant="contained" 
                color="primary" 
                type="submit" 
                disabled={loading}
                size="small"
                sx={{ 
                  marginLeft: '10px',
                  borderRadius: '8px',
                  minWidth: '100px'
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : mode === 'add' ? 'Submit' : 'Update'}
              </Button>
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={resetForm} 
                disabled={loading} 
                size="small"
                sx={{ 
                  marginLeft: '10px',
                  borderRadius: '8px',
                  minWidth: '100px'
                }}
              >
                Reset
              </Button>
            </Grid>
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
        </form>
    </Box>
  );
};

export default ApplicationForm;
