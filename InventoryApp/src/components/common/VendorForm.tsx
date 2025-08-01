
import {useState } from 'react';
import type {ChangeEvent, FormEvent } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Autocomplete,
 } from '@mui/material';
import { Snackbar, CircularProgress, Backdrop } from '@mui/material';
import type { BankModel, TaxInformationModel, VendorModel } from '../../Models/VendorModel';
import TaxInformation from './TaxInformation';
import BankData from './BankData';
import { useLanguages, usePostVendorForm, useSalesStatus } from '../../api/ApiQueries';


const VendorForm = () => {
  const countryList = [
  { id: 1, name: 'United States' },
  { id: 2, name: 'Canada' },
  { id: 3, name: 'India' },
];

const stateList = [
  { id: 1, countryId: 1, name: 'California' },
  { id: 2, countryId: 1, name: 'Texas' },
  { id: 3, countryId: 2, name: 'Ontario' },
  { id: 4, countryId: 3, name: 'Maharashtra' },
  // add more states with countryId mappings
];

  const [formData, setFormData] = useState<VendorModel>({
    companyName1: '',
    companyName2: '',
    dba: '',
    keyword: '',
    houseNumber: '',
    streetName: '',
    buildingName: '',
    landmark: '',
    countryId: null,
    stateId: null,
    zipCode: '',
    digiPin: '',
    mapsUrl: '',
    languageId: null,
    phoneNumber1: '',
    phoneNumber2: '',
    phoneNumber3: '',
    fax: '',
    email1: '',
    email2: '',
    email3: '',
    comments: '',
    salesStatusId: null,
    taxInformation: [],
    bankDetails: [],
    paymentId: null,
 });

 const initialTaxInformationRows = [
  {
     id: Date.now(),
    countryId: null,
    category: '',
    name: '',
    taxNumber: '',
   }
 ];

 
 const initialBankRows = [
  {
     id: Date.now(),
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountName: '',
    phoneNumber: '',
    primary: false,
  
   }
 ];
 const [taxInformationRows, setTaxInformationRows] = useState<TaxInformationModel[]>(initialTaxInformationRows);

 const [bankRows, setBankRows] = useState<BankModel[]>(initialBankRows);


  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [backdropOpen, setBackdropOpen] = useState(false);

   const { data: salesStatuses = [] } = useSalesStatus();
   const { data: languages = [] } = useLanguages();

const filteredStates = stateList.filter(
  (state) => state.countryId === formData.countryId
);
  const {mutate}= usePostVendorForm();
 const resetForm = () => {
    setFormData({
    companyName1: '',
    companyName2: '',
    dba: '',
    keyword: '',
    houseNumber: '',
    streetName: '',
    buildingName: '',
    landmark: '',
    countryId: null,
    stateId: null,
    zipCode: '',
    digiPin: '',
    mapsUrl: '',
    languageId: null,
    phoneNumber1: '',
    phoneNumber2: '',
    phoneNumber3: '',
    fax: '',
    email1: '',
    email2: '',
    email3: '',
    comments: '',
    salesStatusId: null,
    taxInformation: [],
    bankDetails: [],
    paymentId: null,
    
    });
  
  };


const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setBackdropOpen(true); // show backdrop

  const finalFormData = {
    ...formData,
    taxInformation: taxInformationRows,
    bankDetails: bankRows,
  };
 
  mutate(finalFormData, {
    onSuccess: () => {
      setSnackbarMessage('Vendor submitted successfully!');
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
const handleChange = (event: ChangeEvent<HTMLInputElement>)  => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
        <Typography variant="h5" gutterBottom>
         Vendor
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
             <Grid size={{xs:12}}>
              <Box component="section">
                <Typography variant="body1" gutterBottom>
                  Name
                </Typography>
              </Box>
             </Grid>
            
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Company Name 1"
                name="companyName1"
                value={formData.companyName1}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Company Name 2"
                name="companyName2"
                value={formData.companyName2}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="DBA (Doing Business AS)"
                name="dba"
                value={formData.dba}
                onChange={handleChange}
              />
            </Grid>
             <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Keyword"
                name="keyword"
                value={formData.keyword}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{xs:12}}>
              <Box component="section">
                <Typography variant="body1" gutterBottom>
                  Address
                </Typography>
              </Box>
             </Grid>
             <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="House Number"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleChange}
                required
              />
            </Grid>
             <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Street Name"
                name="streetName"
                value={formData.streetName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Building Name"
                name="buildingName"
                value={formData.buildingName}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Landmark"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
              />
            </Grid>
             <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <Autocomplete
                disablePortal
                options={countryList}
                value={countryList.find(c => c.id === formData.countryId) || null}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    countryId: newValue?.id || null,
                    stateId: null, // Reset state when country changes
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Country" required fullWidth />
                )}
            />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <Autocomplete
                disablePortal
                options={filteredStates}
                value={filteredStates.find(s => s.id === formData.stateId) || null}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    stateId: newValue?.id || null,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="State" required fullWidth />
                )}
                disabled={!formData.countryId}
              />
            </Grid>
             <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Zip Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Digi Pin"
                name="digiPin"
                value={formData.digiPin}
                onChange={handleChange}
              />
            </Grid>
              <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Maps URL"
                name="mapsUrl"
                value={formData.mapsUrl}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{xs:12}}>
              <Box component="section">
                <Typography variant="body1" gutterBottom>
                  Communication
                </Typography>
              </Box>
             </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
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
                renderInput={(params) => <TextField {...params} label="Language" fullWidth required/>}
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Phone Number 1"
                name="phoneNumber1"
                value={formData.phoneNumber1}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Phone Number 2"
                name="phoneNumber2"
                value={formData.phoneNumber2}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Phone Number 3"
                name="phoneNumber3"
                value={formData.phoneNumber3}
                onChange={handleChange}
                required
              />
            </Grid>
             <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Fax"
                name="fax"
                value={formData.fax}
                onChange={handleChange}
              />
            </Grid>
             <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Email 1"
                name="email1"
                value={formData.email1}
                onChange={handleChange}
                required
              />
            </Grid>
             <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Email 2"
                name="email2"
                value={formData.email2}
                onChange={handleChange}
              />
            </Grid>
             <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Email 3"
                name="email3"
                value={formData.email3}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{xs:12}}>
              <Box component="section">
                <Typography variant="body1" gutterBottom>
                  Tax Information
                </Typography>
              </Box>
             </Grid>
              <Grid size={12}> 
              <TaxInformation 
                initialRows={taxInformationRows}
                maxRows={5}
                onChange={(rows) => {
                  setTaxInformationRows(rows); // update local state
                }}
                />
                </Grid>

                <Grid size={{xs:12}}>
              <Box component="section">
                <Typography variant="body1" gutterBottom>
                  Bank Details
                </Typography>
              </Box>
             </Grid>
              <Grid size={12}> 
              <BankData 
                initialRows={bankRows}
                maxRows={5}
                onChange={(rows) => {
                  setBankRows(rows); // update local state
                }}
                />
                </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Comments"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
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
                      renderInput={(params) => <TextField {...params} label="Status" fullWidth required/>}
                  />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Payment Terms"
                name="paymentId"
                value={formData.paymentId}
                onChange={handleChange}
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
            {/* <Alert variant='filled' onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert> */}
          </Snackbar>               
        </form></>
  );
};

export default VendorForm;
