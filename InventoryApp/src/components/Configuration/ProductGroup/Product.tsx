import React, { useState, useEffect } from 'react';
import {
  Box, 
  Button,
  Typography,
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
  Snackbar,
  Alert,
  Skeleton,
  CircularProgress
} from '@mui/material';
import { Add } from '@mui/icons-material';
import type { AlertColor } from '@mui/material/Alert';
import ProductForm from './ProductForm';
import type { ProductFormData } from './ProductFormSchema';

// Define Product interface for our table data
interface Product {
  id: number;
  name: string;
  description: string;
  category?: string;
  group?: string;
  price?: number;
}

// Initial example data
const initialProducts: Product[] = [
  { id: 1, name: 'Laptop', description: 'High-performance laptop', category: 'electronics', group: 'premium', price: 1200 },
  { id: 2, name: 'T-Shirt', description: 'Cotton t-shirt', category: 'clothing', group: 'budget', price: 25 },
  { id: 3, name: 'Coffee Table', description: 'Wooden coffee table', category: 'furniture', group: 'consumer', price: 150 },
];

type Order = 'asc' | 'desc';

export default function Product() {
  // State variables
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Product>('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
  
  // Simulate API call to fetch products
  React.useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setProducts(initialProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setSnackbarMessage('Failed to load products');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Form submission handler
  const handleSubmit = (data: ProductFormData) => {
    setIsSubmitting(true);
    
    // In a real application, you would call an API here
    // For this example, we'll just simulate an API call with a timeout
    setTimeout(() => {
      try {
        // Create a new product with the form data
        const newProduct: Product = {
          id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
          name: data.productName,
          description: data.productDescription,
          category: data.productCategory || undefined,
          group: data.productGroup || undefined,
          price: data.price || undefined
        };
        
        // Add the new product to our list
        setProducts([...products, newProduct]);
        
        // Show success message
        setSnackbarMessage('Product added successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        
        // Close the form
        setShowForm(false);
      } catch (error) {
        // Show error message
        setSnackbarMessage('Failed to add product.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setIsSubmitting(false);
      }
    }, 1000); // Simulated API delay
  };
  
  // Table sorting helpers
  const handleRequestSort = (property: keyof Product) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  function getComparator<T>(
    order: Order,
    orderBy: keyof T
  ): (a: T, b: T) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    
    if (bValue < aValue) {
      return -1;
    }
    if (bValue > aValue) {
      return 1;
    }
    return 0;
  }
  
  // Filter products based on search
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(search.toLowerCase()) || 
    product.description.toLowerCase().includes(search.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(search.toLowerCase())) ||
    (product.group && product.group.toLowerCase().includes(search.toLowerCase()))
  ).sort(getComparator<Product>(order, orderBy));
  
  // Pagination handlers
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Apply pagination
  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  // Skeleton rows for loading state
  const renderSkeletonRows = () => {
    return Array(rowsPerPage)
      .fill(0)
      .map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell sx={{ py: 1 }}>
            <Skeleton variant="text" width="70%" height={24} animation="wave" />
          </TableCell>
          <TableCell sx={{ py: 1 }}>
            <Skeleton variant="text" width="90%" height={24} animation="wave" />
          </TableCell>
          <TableCell sx={{ py: 1 }}>
            <Skeleton variant="text" width="50%" height={24} animation="wave" />
          </TableCell>
          <TableCell sx={{ py: 1 }}>
            <Skeleton variant="text" width="40%" height={24} animation="wave" />
          </TableCell>
          <TableCell sx={{ py: 1 }}>
            <Skeleton variant="text" width="30%" height={24} animation="wave" />
          </TableCell>
        </TableRow>
      ));
  };
  
  // UI rendering
  return (
    <Box>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      
      {!showForm ? (
        // Show product list
        <Box>
          <Box p={2}>
            <Typography variant="h5" gutterBottom>
              Products
            </Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0); // reset to first page on search
                }}
                sx={{ width: 250 }}
                disabled={isLoading}
                InputProps={{
                  endAdornment: isLoading && (
                    <CircularProgress color="inherit" size={20} />
                  ),
                }}
              />
              <Button
                variant="contained"
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Add />}
                size="small"
                sx={{
                  borderRadius: '8px',
                  minWidth: '100px',
                }}
                onClick={() => setShowForm(true)}
                disabled={isLoading}
              >
                Add New
              </Button>
            </Box>
            
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ py: 1.5, fontWeight: 600 }}>
                      {isLoading ? (
                        <Skeleton variant="text" width="70%" height={24} animation="wave" />
                      ) : (
                        <TableSortLabel
                          active={orderBy === 'name'}
                          direction={orderBy === 'name' ? order : 'asc'}
                          onClick={() => handleRequestSort('name')}
                          disabled={isLoading}
                        >
                          Name
                        </TableSortLabel>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 1.5, fontWeight: 600 }}>
                      {isLoading ? (
                        <Skeleton variant="text" width="70%" height={24} animation="wave" />
                      ) : (
                        <TableSortLabel
                          active={orderBy === 'description'}
                          direction={orderBy === 'description' ? order : 'asc'}
                          onClick={() => handleRequestSort('description')}
                          disabled={isLoading}
                        >
                          Description
                        </TableSortLabel>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 1.5, fontWeight: 600 }}>
                      {isLoading ? (
                        <Skeleton variant="text" width="70%" height={24} animation="wave" />
                      ) : (
                        <TableSortLabel
                          active={orderBy === 'category'}
                          direction={orderBy === 'category' ? order : 'asc'}
                          onClick={() => handleRequestSort('category')}
                          disabled={isLoading}
                        >
                          Category
                        </TableSortLabel>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 1.5, fontWeight: 600 }}>
                      {isLoading ? (
                        <Skeleton variant="text" width="70%" height={24} animation="wave" />
                      ) : (
                        <TableSortLabel
                          active={orderBy === 'group'}
                          direction={orderBy === 'group' ? order : 'asc'}
                          onClick={() => handleRequestSort('group')}
                          disabled={isLoading}
                        >
                          Group
                        </TableSortLabel>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 1.5, fontWeight: 600 }}>
                      {isLoading ? (
                        <Skeleton variant="text" width="70%" height={24} animation="wave" />
                      ) : (
                        <TableSortLabel
                          active={orderBy === 'price'}
                          direction={orderBy === 'price' ? order : 'asc'}
                          onClick={() => handleRequestSort('price')}
                          disabled={isLoading}
                        >
                          Price
                        </TableSortLabel>
                      )}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    renderSkeletonRows()
                  ) : (
                    paginatedProducts.map((product) => (
                      <TableRow
                        key={product.id}
                        sx={{
                          '&:hover': {
                            backgroundColor: '#f1f1fa',
                            cursor: 'pointer',
                          },
                        }}
                      >
                        <TableCell sx={{ py: 1 }}>{product.name}</TableCell>
                        <TableCell sx={{ py: 1 }}>{product.description}</TableCell>
                        <TableCell sx={{ py: 1 }}>{product.category || '-'}</TableCell>
                        <TableCell sx={{ py: 1 }}>{product.group || '-'}</TableCell>
                        <TableCell sx={{ py: 1 }}>
                          {product.price ? `$${product.price.toFixed(2)}` : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  {!isLoading && paginatedProducts.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        align="center"
                        sx={{ py: 2 }}
                      >
                        No products found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={isLoading ? 0 : filteredProducts.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                disabled={isLoading}
              />
            </TableContainer>
          </Box>
        </Box>
      ) : (
        // Show add product form
        <Box p={2}>
          <ProductForm
            onCancel={() => setShowForm(false)}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </Box>
      )}
    </Box>
  );
}
