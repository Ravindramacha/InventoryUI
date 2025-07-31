import React, { useEffect, useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, IconButton, Typography, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Select, MenuItem, FormControl, InputLabel,Grid,
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

    if (!productTypeCode || !productTypeDesc ) return;

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.productTypeId === editingProduct.productTypeId ? { ...p, productTypeCode,productTypeDesc} : p
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
          queryClient.invalidateQueries(["productTypes"]);
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
      <Typography variant="h4" gutterBottom>
        Product Type
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{xs:0, sm:0, md:9, lg:9}}>

        </Grid>

        <Grid size={{xs:12, sm:12, md:3, lg:3}}>
          <Button variant="contained" onClick={() => handleOpen()} sx={{ mb: 2 }} startIcon={<AddIcon />}>
            Add
          </Button>
        </Grid>
      </Grid>

      <Box mt={2}>
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
          sx={{ width: 300 }}
        />
      </Box>
      
        <TableContainer component={Paper}>
          <Table stickyHeader >
            <TableHead>
              <TableRow>
                  <TableCell>
                  Product Type Code
                  {/* <IconButton size="small" onClick={e => handleFilterIconClick(e, 'productTypeCode')}>
                    <FilterListIcon fontSize="small" />
                  </IconButton> */}
                </TableCell>
                <TableCell>
                  Product Type Description
                  {/* <IconButton size="small" onClick={e => handleFilterIconClick(e, 'productTypeDesc')}>
                    <FilterListIcon fontSize="small" />
                  </IconButton> */}
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.map((productType) => (
                <TableRow key={productType.productTypeId}>
                  <TableCell>{productType.productTypeCode}</TableCell>
                  <TableCell>{productType.productTypeDesc}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(productType)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
      </Box>
      {/* Rows per page dropdown */}
      <Box display="flex" justifyContent="flex-end" alignItems="center" mt={2}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
          <Select
            labelId="rows-per-page-label"
            value={rowsPerPage}
            label="Rows per page"
            onChange={e => {
              setRowsPerPage(Number(e.target.value));
              setPage(0);
            }}
          >
            {[5, 10, 25, 50].map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Pagination controls */}
        <Box ml={2}>
          <Button
            size="small"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>
          <Button
            size="small"
            disabled={(page + 1) * rowsPerPage >= filteredProducts.length}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </Box>
        <Box ml={2}>
          <Typography variant="body2">
            Page {page + 1} of {Math.max(1, Math.ceil(filteredProducts.length / rowsPerPage))}
          </Typography>
        </Box>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProduct ? 'Edit' : 'Add'} Product</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            name="productTypeCode"
            label="Product Type Code"
            value={formValues.productTypeCode}
            onChange={handleChange}
            required
          />
          <TextField
            name="productTypeDesc"
            label="Product Type Description"
            value={formValues.productTypeDesc}
            onChange={handleChange}
            required
            />
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingProduct ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </>
  );
}
