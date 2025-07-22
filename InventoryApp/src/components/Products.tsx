import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, IconButton, Typography, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Select, MenuItem, FormControl, InputLabel,Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import Popover from '@mui/material/Popover';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Laptop', price: 50000, quantity: 10 },
    { id: 2, name: 'Phone', price: 20000, quantity: 25 },
  ]);

  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { addNotification } = useNotification();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const [formValues, setFormValues] = useState({
    name: '',
    price: '',
    quantity: '',
  });

  const handleOpen = (product?: Product) => {
    setEditingProduct(product || null);
    setFormValues({
      name: product?.name || '',
      price: product?.price.toString() || '',
      quantity: product?.quantity.toString() || '',
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
    const { name, price, quantity } = formValues;
    const parsedPrice = parseFloat(price);
    const parsedQty = parseInt(quantity);

    if (!name || isNaN(parsedPrice) || isNaN(parsedQty)) return;

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id ? { ...p, name, price: parsedPrice, quantity: parsedQty } : p
        )
      );
    } else {
      const newProduct: Product = {
        id: products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1,
        name,
        price: parsedPrice,
        quantity: parsedQty,
      };
      setProducts((prev) => [...prev, newProduct]);
    }

    handleClose();

    addNotification('Product added successfully', 'success')
  };

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const [nameFilter, setNameFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [qtyFilter, setQtyFilter] = useState('');

  // Popover state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterType, setFilterType] = useState<'name' | 'price' | 'qty' | null>(null);

  const handleFilterIconClick = (event: React.MouseEvent<HTMLElement>, type: 'name' | 'price' | 'qty') => {
    setAnchorEl(event.currentTarget);
    setFilterType(type);
  };

  const handleFilterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (filterType === 'name') setNameFilter(value);
    if (filterType === 'price') setPriceFilter(value);
    if (filterType === 'qty') setQtyFilter(value);
  };

  const handleFilterPopoverClose = () => {
    setAnchorEl(null);
    setFilterType(null);
  };

  // Apply column filters
  const filteredProducts = products.filter((product) => {
    const nameMatch = nameFilter ? product.name.toLowerCase().includes(nameFilter.toLowerCase()) : true;
    const priceMatch = priceFilter ? product.price === Number(priceFilter) : true;
    const qtyMatch = qtyFilter ? product.quantity === Number(qtyFilter) : true;
    return nameMatch && priceMatch && qtyMatch;
  });

  // Pagination logic for table rows
  const paginatedProducts = filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{xs:0, sm:0, md:9, lg:9}}>

        </Grid>

        <Grid size={{xs:12, sm:12, md:3, lg:3}}>
          <Button variant="contained" onClick={() => handleOpen()} sx={{ mb: 2 }} startIcon={<AddIcon />}>
            Add Product
          </Button>
        </Grid>
      </Grid>

      <Box mt={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>
                  Name
                  <IconButton size="small" onClick={e => handleFilterIconClick(e, 'name')}>
                    <FilterListIcon fontSize="small" />
                  </IconButton>
                </TableCell>
                <TableCell>
                  Price (₹)
                  <IconButton size="small" onClick={e => handleFilterIconClick(e, 'price')}>
                    <FilterListIcon fontSize="small" />
                  </IconButton>
                </TableCell>
                <TableCell>
                  Quantity
                  <IconButton size="small" onClick={e => handleFilterIconClick(e, 'qty')}>
                    <FilterListIcon fontSize="small" />
                  </IconButton>
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(product)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(product.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Filter popover */}
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleFilterPopoverClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Box p={2}>
            <TextField
              label={
                filterType === 'name'
                  ? 'Filter Name'
                  : filterType === 'price'
                  ? 'Filter Price'
                  : 'Filter Quantity'
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
        </Popover>
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingProduct ? 'Edit' : 'Add'} Product</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            name="name"
            label="Name"
            value={formValues.name}
            onChange={handleChange}
            required
          />
          <TextField
            name="price"
            label="Price"
            type="number"
            value={formValues.price}
            onChange={handleChange}
            required
          />
          <TextField
            name="quantity"
            label="Quantity"
            type="number"
            value={formValues.quantity}
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
  );
}
