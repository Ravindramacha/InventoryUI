import React from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  CircularProgress,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { 
  useForm, 
  FormProvider, 
  Controller 
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ProductFormSchema, 
  type ProductFormData 
} from './ProductFormSchema';

// Helper function to validate and filter numeric input
const handleNumericInput = (
  e: React.ChangeEvent<HTMLInputElement>, 
  fieldName: string,
  setError: any
) => {
  const value = e.target.value;
  
  if (value && !/^\d+(\.\d{0,2})?$/.test(value)) {
    // Set a manual error for immediate feedback
    setError(fieldName, {
      type: "manual",
      message: "Please enter a valid number with up to 2 decimal places"
    });
  }
};

interface ProductFormProps {
  onCancel: () => void;
  onSubmit: (data: ProductFormData) => void;
  initialData?: ProductFormData;
  isSubmitting?: boolean;
}

const initialFormData: ProductFormData = {
  productName: '',
  productDescription: '',
  productCategory: '',
  productGroup: '',
  price: null
};

const ProductForm: React.FC<ProductFormProps> = ({ 
  onCancel, 
  onSubmit, 
  initialData = initialFormData,
  isSubmitting = false
}) => {
  const methods = useForm({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: initialData,
    mode: "onTouched",
  });
  
  const { control, handleSubmit, reset, formState, setError } = methods;
  const { errors } = formState;
  
  // List of product categories (sample data)
  const productCategories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'groceries', label: 'Groceries' }
  ];
  
  // List of product groups (sample data)
  const productGroups = [
    { value: 'consumer', label: 'Consumer Products' },
    { value: 'industrial', label: 'Industrial Products' },
    { value: 'premium', label: 'Premium Products' },
    { value: 'budget', label: 'Budget Products' }
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Add New Product</Typography>
        <Button 
          variant="outlined" 
          onClick={onCancel}
          size="small"
          sx={{ borderRadius: '8px', minWidth: '100px' }}
        >
          Back
        </Button>
      </Box>
      
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid size={{xs:12}} >
              <Typography variant="body1" gutterBottom>
                Product Details
              </Typography>
            </Grid>
            
            {/* Product Name */}
            <Grid size={{ xs: 12, sm: 12, md: 6 }} >
              <Controller
                name="productName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Product Name *"
                    fullWidth
                    size="small"
                    error={!!errors.productName}
                    helperText={errors.productName?.message}
                  />
                )}
              />
            </Grid>
            
            {/* Product Category */}
            <Grid size={{ xs: 12, sm: 12, md: 6 }} >
              <Controller
                name="productCategory"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel id="product-category-label">Product Category</InputLabel>
                    <Select
                      {...field}
                      labelId="product-category-label"
                      label="Product Category"
                      value={field.value || ''}
                      error={!!errors.productCategory}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {productCategories.map((category) => (
                        <MenuItem key={category.value} value={category.value}>
                          {category.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            
            {/* Product Group */}
            <Grid size={{ xs: 12, sm: 12, md: 6 }} >
              <Controller
                name="productGroup"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel id="product-group-label">Product Group</InputLabel>
                    <Select
                      {...field}
                      labelId="product-group-label"
                      label="Product Group"
                      value={field.value || ''}
                      error={!!errors.productGroup}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {productGroups.map((group) => (
                        <MenuItem key={group.value} value={group.value}>
                          {group.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            
            {/* Price */}
            <Grid size={{ xs: 12, sm: 12, md: 6 }} >
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Price"
                    fullWidth
                    size="small"
                    type="text"
                    value={field.value === null ? '' : field.value}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    inputProps={{ 
                      step: "0.01",
                      pattern: "^\\d+(\\.\\d{1,2})?$",
                      title: "Enter a valid price with up to 2 decimal places"
                    }}
                    onChange={(e) => {
                      field.onChange(e);
                      handleNumericInput(
                        e as React.ChangeEvent<HTMLInputElement>, 
                        "price",
                        setError
                      );
                    }}
                  />
                )}
              />
            </Grid>
            
            {/* Product Description */}
            <Grid size={{ xs: 12 }}>
              <Controller
                name="productDescription"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Product Description *"
                    fullWidth
                    size="small"
                    multiline
                    rows={3}
                    error={!!errors.productDescription}
                    helperText={errors.productDescription?.message}
                  />
                )}
              />
            </Grid>
            
            {/* Buttons */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
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
                onClick={() => reset(initialData)}
                disabled={isSubmitting}
                size="small"
                sx={{ ml: 2, borderRadius: '8px', minWidth: '100px' }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Paper>
  );
};

export default ProductForm;
