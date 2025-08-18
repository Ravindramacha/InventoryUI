import React, { useEffect, useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, IconButton, Typography, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Select, MenuItem, FormControl, InputLabel, 
  TablePagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import type { PostProductType, ProductTypeModel } from '../../Models/MaterialModel';
import { usePostProductType, useProductTypes } from '../../api/ApiQueries';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import type { AlertColor } from '@mui/material/Alert';
import { useQueryClient } from '@tanstack/react-query';

export default function Products() {

  const queryClient = useQueryClient();
  const { data: productTypes = [] } = useProductTypes();
  const [products, setProducts] = useState<ProductTypeModel[]>([]);
  const { mutate } = usePostProductType();
  useEffect(() => {
    setProducts(productTypes);
  }, [productTypes]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductTypeModel | null>(null);
  const { addNotification } = useNotification();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const [formValues, setFormValues] = useState({
    productTypeCode: '',
    productTypeDesc: ''
  });

  const handleOpen = (productType?: ProductTypeModel) => {
    setEditingProduct(productType || null);
    setFormValues({
      productTypeCode: productType?.productTypeCode || '',
      productTypeDesc: productType?.productTypeDesc.toString() || ''
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
      setProducts((prev) =>
        prev.map((p) =>
          p.productTypeId === editingProduct.productTypeId ? { ...p, productTypeCode, productTypeDesc } : p
        )
      );
    } else {
      const newProduct: PostProductType = {
        productTypeCode: productTypeCode,
        productTypeDesc: productTypeDesc,
        TranscationById: 1, // Assuming a static user ID for now

      };
      mutate(newProduct, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["productTypes"] });
          setSnackbarMessage('Product type added successfully');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          handleClose();
          addNotification('Product type added successfully', 'success')
        },
        onError: (error) => {
          addNotification(`Error adding product type: ${error.message}`, 'error');
        },
      });
    }


  };

  // const handleDelete = (id: number) => {
  //   //setProducts((prev) => prev.filter((p) => p.id !== id));
  // };

  // const [productTypeCodeFilter, setproductTypeCodeFilter] = useState('');
  // const [productTypeDescFilter, setproductTypeDescFilter] = useState('');

  const [globalSearch, setGlobalSearch] = useState('');
  // Popover state
  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const [filterType, setFilterType] = useState<'productTypeCode' | 'productTypeDesc' | null>(null);

  // const handleFilterIconClick = (event: React.MouseEvent<HTMLElement>, type: 'productTypeCode' | 'productTypeDesc') => {
  //   setAnchorEl(event.currentTarget);
  //   setFilterType(type);
  // };

  // const handleFilterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   if (filterType === 'productTypeCode') setproductTypeCodeFilter(value);
  //   if (filterType === 'productTypeDesc') setproductTypeDescFilter(value);
  // };

  // const handleFilterPopoverClose = () => {
  //   setAnchorEl(null);
  //   setFilterType(null);
  // };

  // Apply column filters
  const filteredProducts = products.filter((productType) => {
    const searchText = globalSearch.toLowerCase();
    const productTypeCodeMatch = productType.productTypeCode.toLowerCase().includes(searchText);
    const productTypeDescMatch = productType.productTypeDesc.toLowerCase().includes(searchText);
    return productTypeCodeMatch || productTypeDescMatch;
  });
const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  // Pagination logic for table rows
  const paginatedProducts = filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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

      <Box p={2}>
        <Typography variant="h5" gutterBottom>
          Product Type
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              setPage(0); // reset to first page on search
            }}
            sx={{ width: 250 }}
          />
          <Button 
            variant="contained" 
            onClick={() => handleOpen()}
            size="small"
            sx={{
              borderRadius: '8px',
              minWidth: '100px',
            }} 
            startIcon={<AddIcon />}
          >
            Add
          </Button>
        </Box>
          </Box>

          <TableContainer component={Paper}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ py: 1.5, fontWeight: 600 }}>
                    Product Type Code
                  </TableCell>
                  <TableCell sx={{ py: 1.5, fontWeight: 600 }}>
                    Product Type Description
                  </TableCell>
                  <TableCell sx={{ py: 1.5, fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProducts.map((productType) => (
                  <TableRow key={productType.productTypeId}>
                    <TableCell sx={{ py: 1 }}>{productType.productTypeCode}</TableCell>
                    <TableCell sx={{ py: 1 }}>{productType.productTypeDesc}</TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <IconButton size="small" onClick={() => handleOpen(productType)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={paginatedProducts.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
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
          <DialogTitle>{editingProduct ? 'Edit' : 'Add'} Product</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
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
            <Button onClick={handleClose} size="small">Cancel</Button>
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
