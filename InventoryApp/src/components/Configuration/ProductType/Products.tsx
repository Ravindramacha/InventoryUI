// Simulated API call for adding a product type
import type { ProductTypeModel } from '../../../Models/MaterialModel';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Skeleton,
  Snackbar,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useProductTypes } from '../../../api/ApiQueries';

async function addProductTypeApi(productType: ProductTypeModel) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Simulate API assigning an ID
  return { ...productType, productTypeId: Math.floor(Math.random() * 100000) };
}
// removed stray closing brace

// --- EDIT FORM COMPONENT ---
type ProductEditFormProps = {
  initialData: ProductTypeModel;
  onCancel: () => void;
  onSubmit: (data: ProductTypeModel) => void;
};
function ProductEditForm({ initialData, onCancel, onSubmit }: ProductEditFormProps) {
  const [form, setForm] = useState({
    productTypeCode: initialData.productTypeCode || '',
    productTypeDesc: initialData.productTypeDesc || '',
  });
  const [submitting, setSubmitting] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      onSubmit({ ...initialData, ...form });
      setSubmitting(false);
    }, 500);
  };
  return (
    <form onSubmit={handleSubmit}>
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '2fr 2fr 2fr' }} gap={2}>
        <TextField
          label="Product Type Code"
          name="productTypeCode"
          value={form.productTypeCode}
          onChange={handleChange}
          required
        />
        <TextField
          label="Product Type Description"
          name="productTypeDesc"
          value={form.productTypeDesc}
          onChange={handleChange}
          required
        />
      </Box>
        <Box display="flex" gap={2} mt={2}>
          <Button type="submit" variant="contained" color="primary" disabled={submitting}>
            {submitting ? <CircularProgress size={20} /> : (typeof initialData.productTypeId === 'undefined' ? 'Add' : 'Update')}
          </Button>
          <Button variant="outlined" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        </Box>
    </form>
  );
}

// --- MAIN COMPONENT ---
export default function Products() {
  const { data: productTypes = [], isLoading } = useProductTypes();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [globalSearch, setGlobalSearch] = useState('');
  const [orderBy, setOrderBy] = useState<keyof ProductTypeModel>('productTypeCode');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedProduct, setSelectedProduct] = useState<ProductTypeModel | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'view' | 'edit' | 'add'>('table');
  const [localProductTypes, setLocalProductTypes] = useState<ProductTypeModel[]>([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>(
    { open: false, message: '', severity: 'success' }
  );
  const [productTab, setProductTab] = useState(0);

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  }
  function getComparator<T>(order: 'asc' | 'desc', orderBy: keyof T): (a: T, b: T) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  // Filter, sort, and paginate
  const filteredProducts = productTypes
    .concat(localProductTypes)
    .filter((productType: ProductTypeModel) => {
      const searchText = globalSearch.toLowerCase();
      return (
        productType.productTypeCode.toLowerCase().includes(searchText) ||
        productType.productTypeDesc.toLowerCase().includes(searchText)
      );
    })
    .sort(getComparator(order, orderBy));
  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handlers
  const handleRequestSort = (property: keyof ProductTypeModel) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleRowClick = (product: ProductTypeModel) => {
    setSelectedProduct(product);
    setViewMode('view');
  };
  const handleEdit = () => setViewMode('edit');
  const handleBackToTable = () => {
    setSelectedProduct(null);
    setViewMode('table');
    setProductTab(0);
  };
  const handleCancelEdit = () => setViewMode('view');
  const handleUpdate = async (data: ProductTypeModel) => {
    setSelectedProduct(data);
    setSnackbar({ open: true, message: 'Product type updated successfully', severity: 'success' });
    setViewMode('view');
  };

  return (
    <Box p={2}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>

      {viewMode === 'table' && (
        <>
          <Typography variant="h5" gutterBottom>
            Product Type
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={globalSearch}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setGlobalSearch(e.target.value);
                setPage(0);
              }}
              sx={{ width: 250 }}
              disabled={isLoading}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setViewMode('add')}
            >
              Add
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ py: 1.5, fontWeight: 600 }}>
                    {isLoading ? (
                      <Skeleton variant="text" width="70%" height={24} />
                    ) : (
                      <TableSortLabel
                        active={orderBy === 'productTypeCode'}
                        direction={orderBy === 'productTypeCode' ? order : 'asc'}
                        onClick={() => handleRequestSort('productTypeCode')}
                        disabled={isLoading}
                      >
                        Product Type Code
                      </TableSortLabel>
                    )}
                  </TableCell>
                  <TableCell sx={{ py: 1.5, fontWeight: 600 }}>
                    {isLoading ? (
                      <Skeleton variant="text" width="70%" height={24} />
                    ) : (
                      <TableSortLabel
                        active={orderBy === 'productTypeDesc'}
                        direction={orderBy === 'productTypeDesc' ? order : 'asc'}
                        onClick={() => handleRequestSort('productTypeDesc')}
                        disabled={isLoading}
                      >
                        Product Type Description
                      </TableSortLabel>
                    )}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading
                  ? Array.from({ length: rowsPerPage }).map((_, idx) => (
                      <TableRow key={`skeleton-${idx}`}>
                        <TableCell><Skeleton variant="rectangular" height={32} /></TableCell>
                        <TableCell><Skeleton variant="rectangular" height={32} /></TableCell>
                      </TableRow>
                    ))
                  : paginatedProducts.map((product: ProductTypeModel) => (
                      <TableRow
                        key={product.productTypeId}
                        hover
                        onClick={() => handleRowClick(product)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>{product.productTypeCode}</TableCell>
                        <TableCell>{product.productTypeDesc}</TableCell>
                      </TableRow>
                    ))}
                {!isLoading && paginatedProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} align="center" sx={{ py: 2 }}>No data found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredProducts.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              disabled={isLoading}
            />
          </TableContainer>
        </>
      )}

      {viewMode === 'add' && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Add Product Type
          </Typography>
          <ProductEditForm
            initialData={{
              productTypeId: 0,
              productTypeCode: '',
              productTypeDesc: '',
              createdOn: '',
              createdBy: 0,
              modifiedOn: '',
              modifiedBy: 0
            }}
            onCancel={() => setViewMode('table')}
            onSubmit={async (data) => {
              try {
                const saved = await addProductTypeApi(data);
                setLocalProductTypes(prev => [...prev, saved]);
                setSnackbar({ open: true, message: 'Product type added successfully', severity: 'success' });
                setViewMode('table');
              } catch (err) {
                setSnackbar({ open: true, message: 'Failed to add product type', severity: 'error' });
              }
            }}
          />
        </Box>
      )}

      {viewMode === 'view' && selectedProduct && (
        <Box>
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Product Details
            </Typography>
            <Button variant="contained" color="primary" onClick={handleEdit} sx={{ mr: 2 }}>
              Edit
            </Button>
            <Button variant="outlined" onClick={handleBackToTable}>
              Back
            </Button>
          </Box>
          <Tabs value={productTab} onChange={(_: React.SyntheticEvent, v: number) => setProductTab(v)} sx={{ mb: 2 }}>
            <Tab label="Overview" />
            {/* Add more tabs here if needed */}
          </Tabs>
          {productTab === 0 && (
            <Box
              display="grid"
              gridTemplateColumns={{ xs: '1fr', sm: '180px 1fr' }}
              gap={2}
              sx={{ maxWidth: 500,  p: 3 }}
            >
              <Typography variant="subtitle1" fontWeight={700} color="text.secondary">
                Code:
              </Typography>
              <Typography variant="body1" color="text.primary">
                {selectedProduct.productTypeCode}
              </Typography>
              <Typography variant="subtitle1" fontWeight={700} color="text.secondary">
                Description:
              </Typography>
              <Typography variant="body1" color="text.primary">
                {selectedProduct.productTypeDesc}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {viewMode === 'edit' && selectedProduct && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Edit Product
          </Typography>
          <ProductEditForm
            initialData={selectedProduct}
            onCancel={handleCancelEdit}
            onSubmit={handleUpdate}
          />
        </Box>
      )}

    </Box>
  );
}


