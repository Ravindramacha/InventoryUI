import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  CircularProgress,
  Paper,
  Snackbar,
  Alert,
  Backdrop
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { usePostProductType } from '../../../api/ApiQueries';
import type { PostProductType } from '../../../Models/MaterialModel';
import { 
  useForm, 
  FormProvider, 
  Controller 
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ProductTypeFormSchema, 
  type ProductTypeFormData 
} from './ProductTypeFormSchema';

// Helper function to validate and filter numeric input
const handleNumericInput = (
  e: React.ChangeEvent<HTMLInputElement>, 
  allowedChars: RegExp, 
  fieldName: string,
  setError: any
) => {
  const value = e.target.value;
  
  if (value && !allowedChars.test(value)) {
    // Set a manual error for immediate feedback
    setError(fieldName, {
      type: "manual",
      message: "Invalid characters detected"
    });
  }
};

const initialFormData: ProductTypeFormData = {
  productCode: '',
  productDescription: ''
};

const AddProductType: React.FC = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [backdropOpen, setBackdropOpen] = useState(false);
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate } = usePostProductType();
  
  const methods = useForm({
    resolver: zodResolver(ProductTypeFormSchema),
    defaultValues: initialFormData,
    mode: "onTouched",
  });
  
  const { control, handleSubmit, reset, formState, setError, getValues } = methods;
  const { errors, isSubmitting } = formState;
  
  // Additional validation function
  const validateAllFields = () => {
    // Check product code for alphanumeric characters only
    const productCode = getValues("productCode");
    if (productCode && !/^[A-Za-z0-9-_]+$/.test(productCode)) {
      setError("productCode", {
        type: "manual",
        message: "Product Code can only contain alphanumeric characters, hyphens and underscores"
      });
      return false;
    }
    
    return true;
  };
  
  // Form submission handler
  const processSubmit = (data: any) => {
    // Perform additional validation
    if (!validateAllFields()) {
      setSnackbarMessage('Please fix validation errors before submitting');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    
    setBackdropOpen(true);
    
    // Prepare the object for API call
    const submitData: PostProductType = {
      productTypeCode: data.productCode,
      productTypeDesc: data.productDescription || '', // Use productDescription for the desc field
      productDescription: data.productDescription || '', // Include this as well to match the interface
      TranscationById: 1 // Assuming a static user ID for now
    };

    // Call the API
    mutate(submitData, {
      onSuccess: () => {
        // Invalidate and refetch product types query to update the list
        queryClient.invalidateQueries({ queryKey: ['productTypes'] });
        
        setSnackbarMessage('Product type added successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        
        // Navigate back to products list after short delay
        setTimeout(() => {
          navigate('/products');
        }, 1500);
      },
      onError: (error: any) => {
        console.error('Failed to add product:', error);
        setSnackbarMessage(`Failed to add product: ${error?.message || 'Unknown error'}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      },
      onSettled: () => {
        setBackdropOpen(false);
      }
    });
  };

  return (
    <Box p={1}>
      <Paper sx={{ p: 3 }}>
        <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Add New Product Type</Typography>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/products')}
            size="small"
            sx={{ borderRadius: '8px', minWidth: '100px' }}
          >
            Back to List
          </Button>
        </Box>
        
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit((data) => processSubmit(data))}>
            <Grid container spacing={2}>
              <Grid size={{xs:12}} >
                <Typography variant="body1" gutterBottom>
                  Product Type Details
                </Typography>
              </Grid>
              
              {/* Product Code */}
              <Grid size={{ xs: 12, sm: 12, md: 6 }} >
                <Controller
                  name="productCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Product Code *"
                      fullWidth
                      size="small"
                      error={!!errors.productCode}
                      helperText={errors.productCode?.message}
                      inputProps={{ 
                        pattern: "[A-Za-z0-9-_]+",
                        title: "Product Code can only contain alphanumeric characters, hyphens and underscores"
                      }}
                      onChange={(e) => {
                        field.onChange(e);
                        handleNumericInput(
                          e as React.ChangeEvent<HTMLInputElement>, 
                          /^[A-Za-z0-9-_]+$/, 
                          "productCode", 
                          setError
                        );
                      }}
                      onBlur={() => {
                        const value = field.value;
                        if (value && !/^[A-Za-z0-9-_]+$/.test(value)) {
                          setError("productCode", {
                            type: "manual",
                            message: "Product Code can only contain alphanumeric characters, hyphens and underscores"
                          });
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              
              {/* Product Description */}
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <Controller
                  name="productDescription"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Product Description"
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                      error={!!errors.productDescription}
                      helperText={errors.productDescription?.message}
                    />
                  )}
                />
              </Grid>
              
              {/* Buttons */}
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 12 }} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                  size="small"
                  sx={{ borderRadius: '8px', minWidth: '100px' }}
                >
                  {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Submit'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => reset(initialFormData)}
                  disabled={isSubmitting}
                  size="small"
                  sx={{ ml: 2, borderRadius: '8px', minWidth: '100px' }}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
            
            {/* Backdrop Loader */}
            <Backdrop
              open={backdropOpen}
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </form>
        </FormProvider>
      </Paper>
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={5000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddProductType;
