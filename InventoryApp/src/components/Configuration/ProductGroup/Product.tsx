// Simulated API call for adding a product
async function addProductApi(product: Omit<Product, 'id'>): Promise<Product> {
  // Simulate network delay and success
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Simulate API assigning an ID
  return { ...product, id: Math.floor(Math.random() * 100000) };
}
import React, { useState } from 'react';
import {
  Box, Button, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel, Snackbar, Alert, Skeleton, CircularProgress, Tabs, Tab
} from '@mui/material';
import type { AlertColor } from '@mui/material/Alert';

interface Product {
  id: number;
  name: string;
  description: string;
  category?: string;
  group?: string;
  price?: number;
}

const initialProducts: Product[] = [
  { id: 1, name: 'Laptop', description: 'High-performance laptop', category: 'electronics', group: 'premium', price: 1200 },
  { id: 2, name: 'T-Shirt', description: 'Cotton t-shirt', category: 'clothing', group: 'budget', price: 25 },
  { id: 3, name: 'Coffee Table', description: 'Wooden coffee table', category: 'furniture', group: 'consumer', price: 150 },
];

type Order = 'asc' | 'desc';

export default function Product() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Product>('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'view' | 'edit' | 'add'>('table');
  const [tab, setTab] = useState(0);
  React.useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setProducts(initialProducts);
      } catch (error) {
        setSnackbarMessage('Failed to load products');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleRequestSort = (property: keyof Product) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  function getComparator<T>(order: Order, orderBy: keyof T): (a: T, b: T) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    if (bValue < aValue) return -1;
    if (bValue > aValue) return 1;
    return 0;
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.description.toLowerCase().includes(search.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(search.toLowerCase())) ||
    (product.group && product.group.toLowerCase().includes(search.toLowerCase()))
  ).sort(getComparator<Product>(order, orderBy));

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const renderSkeletonRows = () => Array(rowsPerPage).fill(0).map((_, index) => (
    <TableRow key={`skeleton-${index}`}>
      <TableCell sx={{ py: 1 }}><Skeleton variant="text" width="70%" height={24} animation="wave" /></TableCell>
      <TableCell sx={{ py: 1 }}><Skeleton variant="text" width="90%" height={24} animation="wave" /></TableCell>
      <TableCell sx={{ py: 1 }}><Skeleton variant="text" width="50%" height={24} animation="wave" /></TableCell>
      <TableCell sx={{ py: 1 }}><Skeleton variant="text" width="40%" height={24} animation="wave" /></TableCell>
      <TableCell sx={{ py: 1 }}><Skeleton variant="text" width="30%" height={24} animation="wave" /></TableCell>
      <TableCell sx={{ py: 1 }}><Skeleton variant="text" width="30%" height={24} animation="wave" /></TableCell>
    </TableRow>
  ));

  const handleRowClick = (product: Product) => {
    setSelectedProduct(product);
    setViewMode('view');
  };
  const handleBackToTable = () => {
    setSelectedProduct(null);
    setViewMode('table');
  };
  const handleEdit = () => setViewMode('edit');
  const handleCancelEdit = () => setViewMode('view');
  const handleUpdate = (data: Product) => {
    setTimeout(() => {
      setSnackbarOpen(true);
      setSnackbarMessage('Product updated successfully');
      setSnackbarSeverity('success');
      setSelectedProduct({ ...selectedProduct!, ...data });
      setViewMode('view');
    }, 800);
  };

  return (
    <Box p={2}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>{snackbarMessage}</Alert>
      </Snackbar>
      {viewMode === 'table' && (
        <>
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="h5" sx={{ flexGrow: 1 }} gutterBottom>Products</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 2 }}
              onClick={() => setViewMode('add')}
            >
              Add Product
            </Button>
          </Box>
          <Box mb={2} maxWidth={300}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{ 'aria-label': 'search products' }}
            />
          </Box>
          <TableContainer component={Paper}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ py: 1.5, fontWeight: 600 }}>
                    <TableSortLabel
                      active={orderBy === 'id'}
                      direction={orderBy === 'id' ? order : 'asc'}
                      onClick={() => handleRequestSort('id')}
                    >ID</TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ py: 1.5, fontWeight: 600 }}>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={() => handleRequestSort('name')}
                    >Name</TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ py: 1.5, fontWeight: 600 }}>
                    <TableSortLabel
                      active={orderBy === 'description'}
                      direction={orderBy === 'description' ? order : 'asc'}
                      onClick={() => handleRequestSort('description')}
                    >Description</TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ py: 1.5, fontWeight: 600 }}>
                    <TableSortLabel
                      active={orderBy === 'category'}
                      direction={orderBy === 'category' ? order : 'asc'}
                      onClick={() => handleRequestSort('category')}
                    >Category</TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ py: 1.5, fontWeight: 600 }}>
                    <TableSortLabel
                      active={orderBy === 'group'}
                      direction={orderBy === 'group' ? order : 'asc'}
                      onClick={() => handleRequestSort('group')}
                    >Group</TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ py: 1.5, fontWeight: 600 }}>
                    <TableSortLabel
                      active={orderBy === 'price'}
                      direction={orderBy === 'price' ? order : 'asc'}
                      onClick={() => handleRequestSort('price')}
                    >Price</TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading
                  ? renderSkeletonRows()
                  : paginatedProducts.map(product => (
                      <TableRow
                        key={product.id}
                        hover
                        onClick={() => handleRowClick(product)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.group}</TableCell>
                        <TableCell>{product.price}</TableCell>
                      </TableRow>
                    ))}
                {!isLoading && paginatedProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 2 }}>No data found.</TableCell>
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
            />
          </TableContainer>
        </>
      )}
      {viewMode === 'view' && selectedProduct && (
        <Box>
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Product Details
            </Typography>
            <Button variant="contained" color="primary" onClick={handleEdit} sx={{ mr: 2 }}>Edit</Button>
            <Button variant="outlined" onClick={handleBackToTable}>Back</Button>
          </Box>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label="Overview" />
          </Tabs>
          {tab === 0 && (
            <Box px={2} py={2}>
              <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '180px 1fr' }} rowGap={1.5} columnGap={2} alignItems="center">
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">ID:</Typography>
                <Typography variant="body1">{selectedProduct.id}</Typography>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">Name:</Typography>
                <Typography variant="body1">{selectedProduct.name}</Typography>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">Description:</Typography>
                <Typography variant="body1">{selectedProduct.description}</Typography>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">Category:</Typography>
                <Typography variant="body1">{selectedProduct.category}</Typography>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">Group:</Typography>
                <Typography variant="body1">{selectedProduct.group}</Typography>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">Price:</Typography>
                <Typography variant="body1">{selectedProduct.price}</Typography>
              </Box>
            </Box>
          )}
        </Box>
      )}
      {viewMode === 'edit' && selectedProduct && (
        <Box>
          <Typography variant="h6" gutterBottom>Edit Product</Typography>
          <ProductEditForm
            initialData={selectedProduct}
            onCancel={handleCancelEdit}
            onSubmit={handleUpdate}
          />
        </Box>
      )}
      {viewMode === 'add' && (
        <Box>
          <Typography variant="h6" gutterBottom>Add Product</Typography>
          <ProductEditForm
            onCancel={() => setViewMode('table')}
            onSubmit={async data => {
              setSnackbarOpen(false);
              setSnackbarMessage('');
              setSnackbarSeverity('success');
              try {
                setIsLoading(true);
                const saved = await addProductApi({
                  name: data.name,
                  description: data.description,
                  category: data.category,
                  group: data.group,
                  price: data.price,
                });
                setProducts(prev => [...prev, saved]);
                setSnackbarMessage('Product added successfully');
                setSnackbarSeverity('success');
                setViewMode('table');
              } catch (err) {
                setSnackbarMessage('Failed to add product');
                setSnackbarSeverity('error');
              } finally {
                setIsLoading(false);
                setSnackbarOpen(true);
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
}

type ProductEditFormProps = {
  initialData?: Product;
  onCancel: () => void;
  onSubmit: (data: Product) => void;
};
function ProductEditForm({ initialData, onCancel, onSubmit }: ProductEditFormProps) {
  const [form, setForm] = useState<Product>(initialData || {
    id: 0,
    name: '',
    description: '',
    category: '',
    group: '',
    price: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      onSubmit(form);
      setSubmitting(false);
    }, 500);
  };
  return (
    <form onSubmit={handleSubmit}>
      <Box >
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '2fr 2fr 2fr' }} gap={2}>
          <TextField
            label="Product Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
          <TextField
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
          />
          <TextField
            label="Group"
            name="group"
            value={form.group}
            onChange={handleChange}
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Box>
        <Box display="flex" gap={2} mt={3}>
          <Button type="submit" variant="contained" color="primary" disabled={submitting}>
            {submitting ? <CircularProgress size={20} /> : 'Save'}
          </Button>
          <Button variant="outlined" onClick={onCancel} disabled={submitting}>Cancel</Button>
        </Box>
      </Box>
    </form>
  );
}
