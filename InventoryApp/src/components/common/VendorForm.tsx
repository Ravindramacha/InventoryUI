import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Autocomplete,
  Alert,
} from '@mui/material';
import { Snackbar, CircularProgress, Backdrop } from '@mui/material';
import {
  countryList,
  stateList,
  type BankDetailDto,
  type ReadVendorFormModel,
  type TaxInformationDto,
} from '../../Models/VendorModel';
import TaxInformation from '../Vendor/TaxInformation';
import BankData from '../Vendor/BankData';
import {
  useLanguages,
  usePostVendorForm,
  usePutVendorForm,
  useSalesStatus,
} from '../../api/ApiQueries';

interface VendorFormPageProps {
  onCancel: () => void;
  initialData?: ReadVendorFormModel | null;
  mode?: 'add' | 'edit';
  vendorId?: number;
}

const VendorForm: React.FC<VendorFormPageProps> = ({
  onCancel,
  initialData = null,
  mode = 'add',
  vendorId = 0,
}) => {
  const initialTaxInformationRows = [
    {
      id: Date.now(),
      countryId: null,
      category: '',
      name: '',
      taxNumber: '',
    },
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
    },
  ];
  const initialVendorData: ReadVendorFormModel = initialData || {
    vendorId: 0,
    companyName1: '',
    companyName2: '',
    dba: '',
    keyWord: '',
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
    taxInformationDto: initialTaxInformationRows,
    bankDetailDto: initialBankRows,
    paymentId: null,
  };
  const [formData, setFormData] = useState<ReadVendorFormModel>(
    initialData || initialVendorData
  );

  const [taxInformationRows, setTaxInformationRows] = useState<
    TaxInformationDto[]
  >(
    initialData?.taxInformationDto && initialData.taxInformationDto.length > 0
      ? initialData.taxInformationDto
      : initialTaxInformationRows
  );

  const [bankRows, setBankRows] = useState<BankDetailDto[]>(
    initialData?.bankDetailDto && initialData.bankDetailDto.length > 0
      ? initialData.bankDetailDto
      : initialBankRows
  );

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  );
  const [backdropOpen, setBackdropOpen] = useState(false);

  const { data: salesStatuses = [] } = useSalesStatus();
  const { data: languages = [] } = useLanguages();

  const filteredStates = stateList.filter(
    (state) => state.countryId === formData.countryId
  );
  const { mutate: updateMutate } = usePutVendorForm();
  const { mutate } = usePostVendorForm();
  const resetForm = () => {
    setFormData({
      vendorId: 0,
      companyName1: '',
      companyName2: '',
      dba: '',
      keyWord: '',
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
      taxInformationDto: [],
      bankDetailDto: [],
      paymentId: null,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setBackdropOpen(true); // show backdrop

    const finalFormData = {
      ...formData,
      taxInformationDto: taxInformationRows,
      bankDetailDto: bankRows,
    };
    if (mode === 'edit' && vendorId) {
      setLoading(true);
      setBackdropOpen(true); // show backdrop
      // --- Edit Mode ---
      updateMutate(
        { id: vendorId, data: finalFormData },
        {
          onSuccess: () => {
            // queryClient.invalidateQueries({ queryKey: ["readProductMasterForm"] });
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
        }
      );
    } else {
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
    }
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box sx={{ maxWidth: '100%', width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h5">
          {mode === 'add' ? 'Add Vendor' : 'Edit Vendor'}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={onCancel}
          size="small"
          sx={{
            borderRadius: '8px',
            minWidth: '100px',
          }}
        >
          Back
        </Button>
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Box component="section">
              <Typography variant="body1" gutterBottom>
                Name
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Company Name 1"
              name="companyName1"
              value={formData.companyName1}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Company Name 2"
              name="companyName2"
              value={formData.companyName2}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="DBA (Doing Business AS)"
              name="dba"
              value={formData.dba}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Keyword"
              name="keyword"
              value={formData.keyWord}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box component="section">
              <Typography variant="body1" gutterBottom>
                Address
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="House Number"
              name="houseNumber"
              value={formData.houseNumber}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Street Name"
              name="streetName"
              value={formData.streetName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Building Name"
              name="buildingName"
              value={formData.buildingName}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Landmark"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <Autocomplete
              disablePortal
              options={countryList}
              value={
                countryList.find((c) => c.id === formData.countryId) || null
              }
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
                <TextField
                  {...params}
                  label="Country"
                  size="small"
                  required
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <Autocomplete
              disablePortal
              size="small"
              options={filteredStates}
              value={
                filteredStates.find((s) => s.id === formData.stateId) || null
              }
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_, newValue) => {
                setFormData((prev) => ({
                  ...prev,
                  stateId: newValue?.id || null,
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="State"
                  size="small"
                  required
                  fullWidth
                />
              )}
              disabled={!formData.countryId}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Zip Code"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Digi Pin"
              name="digiPin"
              value={formData.digiPin}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Maps URL"
              name="mapsUrl"
              value={formData.mapsUrl}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box component="section">
              <Typography variant="body1" gutterBottom>
                Communication
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <Autocomplete
              disablePortal
              options={languages}
              value={
                languages.find((p) => p.languageId === formData.languageId) ??
                null
              }
              getOptionLabel={(option) =>
                `${option.languageDesc} (${option.languageCode})` || ''
              }
              isOptionEqualToValue={(option, value) =>
                option.languageId === value.languageId
              }
              onChange={(_, newValue) => {
                setFormData((prev) => ({
                  ...prev,
                  languageId: newValue?.languageId,
                }));
              }}
              fullWidth
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Language"
                  size="small"
                  fullWidth
                  required
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Phone Number 1"
              name="phoneNumber1"
              value={formData.phoneNumber1}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Phone Number 2"
              name="phoneNumber2"
              value={formData.phoneNumber2}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Phone Number 3"
              name="phoneNumber3"
              value={formData.phoneNumber3}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Fax"
              name="fax"
              value={formData.fax}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Email 1"
              name="email1"
              value={formData.email1}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Email 2"
              name="email2"
              value={formData.email2}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Email 3"
              name="email3"
              value={formData.email3}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
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

          <Grid size={{ xs: 12 }}>
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
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <Autocomplete
              disablePortal
              options={salesStatuses}
              size="small"
              value={
                salesStatuses.find(
                  (p) => p.salesStatusId === formData.salesStatusId
                ) || null
              }
              getOptionLabel={(option) =>
                `${option.salesStatusDesc} (${option.salesStatusCode})` || ''
              }
              isOptionEqualToValue={(option, value) =>
                option.salesStatusId === value.salesStatusId
              }
              onChange={(_, newValue) => {
                setFormData((prev) => ({
                  ...prev,
                  salesStatusId: newValue?.salesStatusId,
                }));
              }}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Status"
                  size="small"
                  fullWidth
                  required
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Payment Terms"
              name="paymentId"
              value={formData.paymentId}
              onChange={handleChange}
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
                borderRadius: '8px',
                minWidth: '100px',
              }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : mode === 'add' ? (
                'Submit'
              ) : (
                'Update'
              )}
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
                minWidth: '100px',
              }}
            >
              Reset
            </Button>
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
          <Alert
            variant="filled"
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </form>
    </Box>
  );
};

export default VendorForm;
