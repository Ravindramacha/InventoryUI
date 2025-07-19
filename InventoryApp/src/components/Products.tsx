import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, IconButton, Typography, Box, Grid
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { addNotification } = useNotification();
  const [paginationModel, setPaginationModel] = useState({
  pageSize: 5,
  page: 0,
});


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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchTerm(e.target.value);
};

const filteredProducts = products.filter((product) =>
  product.name?.toLowerCase().includes(searchTerm.toLowerCase())
);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'price', headerName: 'Price (₹)', width: 150 },
    { field: 'quantity', headerName: 'Qty', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleOpen(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={6} lg={6}>

        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <TextField
            fullWidth
            label="Search by name"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={3}>
          <Button variant="contained" onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Add Product
      </Button>
        </Grid>
      </Grid>
      
      <Box mt={2} sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredProducts}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25, 50]}
          autoHeight
        />
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
