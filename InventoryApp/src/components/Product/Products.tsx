import React, { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type {
  PostProductType,
  ProductTypeModel,
} from '../../Models/MaterialModel';
import { usePostProductType, useProductTypes } from '../../api/ApiQueries';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import type { AlertColor } from '@mui/material/Alert';
import { useQueryClient } from '@tanstack/react-query';
import CustomDataGrid, { type ColumnDef } from '../common/Grid';

export default function Products() {
  const queryClient = useQueryClient();
  const { data: productTypes = [] } = useProductTypes();
  // Remove the separate products state and use productTypes directly
  const { mutate } = usePostProductType();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductTypeModel | null>(null);
  const { addNotification } = useNotification();
  
  // Grid column definitions
  const columns: ColumnDef<ProductTypeModel>[] = [
    {
      field: 'productTypeCode',
      headerName: 'Product Type Code',
      sortable: true,
      width: '40%',
    },
    {
      field: 'productTypeDesc',
      headerName: 'Product Type Description',
      sortable: true,
      width: '60%',
    },
  ];

  const [formValues, setFormValues] = useState({
    productTypeCode: '',
    productTypeDesc: '',
  });

  const handleOpen = (productType?: ProductTypeModel) => {
    setEditingProduct(productType || null);
    setFormValues({
      productTypeCode: productType?.productTypeCode || '',
      productTypeDesc: productType?.productTypeDesc.toString() || '',
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProduct(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const { productTypeCode, productTypeDesc } = formValues;

    if (!productTypeCode || !productTypeDesc) return;

    if (editingProduct) {
      // Instead of updating local state, we'll call the API to update the server
      // and let the query invalidation refresh the data
      const updateProduct: PostProductType = {
        productTypeCode: productTypeCode,
        productTypeDesc: productTypeDesc,
        TranscationById: 1,
      };
      mutate(updateProduct, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['productTypes'] });
          setSnackbarMessage('Product type updated successfully');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          handleClose();
          addNotification('Product type updated successfully', 'success');
        },
        onError: (error) => {
          addNotification(
            `Error updating product type: ${error.message}`,
            'error'
          );
        },
      });
    } else {
      const newProduct: PostProductType = {
        productTypeCode: productTypeCode,
        productTypeDesc: productTypeDesc,
        TranscationById: 1, // Assuming a static user ID for now
      };
      mutate(newProduct, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['productTypes'] });
          setSnackbarMessage('Product type added successfully');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          handleClose();
          addNotification('Product type added successfully', 'success');
        },
        onError: (error) => {
          addNotification(
            `Error adding product type: ${error.message}`,
            'error'
          );
        },
      });
    }
  };

  // const handleDelete = (id: number) => {
  //   //setProducts((prev) => prev.filter((p) => p.id !== id));
  // };

  // const [productTypeCodeFilter, setproductTypeCodeFilter] = useState('');
  // const [productTypeDescFilter, setproductTypeDescFilter] = useState('');

  // All pagination, sorting, and filtering is now handled by the Grid component

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <MuiAlert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      {/* Using our reusable Grid component */}
      <CustomDataGrid<ProductTypeModel>
        title="Product Type"
        columns={columns}
        rows={productTypes}
        getRowId={(row) => row.productTypeId}
        onRowClick={(row) => handleOpen(row)}
        initialSortField="productTypeCode"
        initialSortDirection="asc"
        searchFields={['productTypeCode', 'productTypeDesc']}
        actionButton={{
          text: 'Add',
          onClick: () => handleOpen(),
          icon: <AddIcon />
        }}
        size="small"
      />
      {/* Filter popover */}
      {/* <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleFilterPopoverClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Box p={2}>
            <TextField
              label={
                filterType === 'productTypeCode'
                  ? 'Filter Product Type Code'
                  : filterType === 'productTypeCode'
                  ? 'Filter Product Type Description' 
                  : ''
              }
              value={
                filterType === 'name'
                  ? nameFilter
                  : filterType === 'price'
                  ? priceFilter
                  : qtyFilter
              }
              onChange={handleFilterInputChange}
              type={filterType === 'name' ? 'text' : 'number'}
              size="small"
              autoFocus
            />
          </Box>
        </Popover> */}
      {/* Rows per page dropdown */}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ p: 1, mb: 0 }}>
          {editingProduct ? 'Edit' : 'Add'} Product
        </DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 0 }}
        >
          <span></span>
          <TextField
            name="productTypeCode"
            label="Product Type Code"
            value={formValues.productTypeCode}
            onChange={handleChange}
            required
            size="small"
          />
          <TextField
            name="productTypeDesc"
            label="Product Type Description"
            value={formValues.productTypeDesc}
            onChange={handleChange}
            required
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} size="small">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            size="small"
            sx={{ borderRadius: '8px', minWidth: '100px' }}
          >
            {editingProduct ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
