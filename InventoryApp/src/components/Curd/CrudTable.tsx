import React, { useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  TableSortLabel,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useGetAllProductMasterForm } from '../../api/ApiQueries';
import type { ReadProductMasterForm } from '../../Models/MaterialModel';
import ProductMasterView from '../Configuration/Product/ProductMasterView';
import ProductDetails from '../Configuration/Product/ProductDetails';
import ApplicationForm from '../common/ApplicationForm';

type Mode = 'add' | 'edit' | 'view';

interface CrudTableProps {
  onEdit?: (data: ReadProductMasterForm) => void;
}

type Order = 'asc' | 'desc';

const CrudTable: React.FC<CrudTableProps> = ({ onEdit }) => {
  const { data: productMasterForm = [] } = useGetAllProductMasterForm();
  
  // Directly use productMasterForm data rather than copying to rows state
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] =
    useState<keyof ReadProductMasterForm>('productId');

  const handleRequestSort = (property: keyof ReadProductMasterForm) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
  ): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    let aValue = a[orderBy];
    let bValue = b[orderBy];

    // Handle nested properties for productType, productGroup, and productCategory
    if (orderBy === ('productType' as keyof T))
      aValue = (a as any).productType.productTypeDesc;
    if (orderBy === ('productGroup' as keyof T))
      aValue = (a as any).productGroup.productGroupDesc;
    if (orderBy === ('productCategory' as keyof T))
      aValue = (a as any).productCategory.productCategoryDesc;
    if (orderBy === ('productType' as keyof T))
      bValue = (b as any).productType.productTypeDesc;
    if (orderBy === ('productGroup' as keyof T))
      bValue = (b as any).productGroup.productGroupDesc;
    if (orderBy === ('productCategory' as keyof T))
      bValue = (b as any).productCategory.productCategoryDesc;

    if (bValue < aValue) {
      return -1;
    }
    if (bValue > aValue) {
      return 1;
    }
    return 0;
  }
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<Mode>('add');
  const [selectedRow, setSelectedRow] = useState<ReadProductMasterForm | null>(
    null
  );

  const [drawerViewOpen, setDrawerViewOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleOpenDrawer = (
    mode: Mode,
    row: ReadProductMasterForm | null = null
  ) => {
    setDrawerMode(mode);
    setSelectedRow(row);
    setDrawerOpen(true);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // First filter - Global search across all relevant fields
  const filteredRows = Array.isArray(productMasterForm)
    ? productMasterForm.filter((row) => {
        const searchTerm = search.toLowerCase();
        return (
          row.productId.toLowerCase().includes(searchTerm) ||
          row.productType.productTypeDesc.toLowerCase().includes(searchTerm) ||
          row.productType.productTypeCode.toLowerCase().includes(searchTerm) ||
          row.productGroup.productGroupDesc
            .toLowerCase()
            .includes(searchTerm) ||
          row.productGroup.productGroupCode
            .toLowerCase()
            .includes(searchTerm) ||
          row.productCategory.productCategoryDesc
            .toLowerCase()
            .includes(searchTerm) ||
          row.productCategory.productCategoryCode
            .toLowerCase()
            .includes(searchTerm) ||
          (row.shortDescription || '').toLowerCase().includes(searchTerm) ||
          (row.longDescription || '').toLowerCase().includes(searchTerm)
        );
      })
    : [];

  // Then sort
  const sortedRows = [...filteredRows].sort(getComparator(order, orderBy));

  // Finally paginate
  const paginatedRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      {!drawerOpen && !selectedRow && (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            sx={{
              p: 2,
              mt: 0,
            }}
          >
            <TextField
              label="Search"
              placeholder="search"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 250 }}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              size="small"
              sx={{
                borderRadius: '10px',
                minWidth: '100px',
                textTransform: 'none',
              }}
              onClick={() => handleOpenDrawer('add')}
            >
              Add New
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={orderBy === 'productId'}
                      direction={orderBy === 'productId' ? order : 'asc'}
                      onClick={() => handleRequestSort('productId')}
                    >
                      Product Id
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={orderBy === 'productType'}
                      direction={orderBy === 'productType' ? order : 'asc'}
                      onClick={() => handleRequestSort('productType')}
                    >
                      Product Type
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={orderBy === 'productGroup'}
                      direction={orderBy === 'productGroup' ? order : 'asc'}
                      onClick={() => handleRequestSort('productGroup')}
                    >
                      Product Group
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={orderBy === 'productCategory'}
                      direction={orderBy === 'productCategory' ? order : 'asc'}
                      onClick={() => handleRequestSort('productCategory')}
                    >
                      Product Category
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.map((row) => (
                  <TableRow
                    key={row.productMasterId}
                    onClick={() => setSelectedRow(row)}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f1f1fa',
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <TableCell sx={{ py: 1 }}>{row.productId}</TableCell>
                    <TableCell sx={{ py: 1 }}>
                      {row.productType.productTypeDesc}
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      {row.productGroup.productGroupDesc}
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      {row.productCategory.productCategoryDesc}
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedRows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{
                        py: 2,
                      }}
                    >
                      No data found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredRows.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </>
      )}

      {selectedRow && !drawerOpen && (
        <Box>
          <ProductDetails
            product={selectedRow}
            onBack={() => setSelectedRow(null)}
            onEdit={(product) =>
              onEdit ? onEdit(product) : handleOpenDrawer('edit', product)
            }
          />
        </Box>
      )}

      {drawerOpen && (
        <Box sx={{ backgroundColor: 'white', p: 2, borderRadius: 1 }}>
          <ApplicationForm
            onCancel={() => setDrawerOpen(false)}
            initialData={
              drawerMode === 'edit' && selectedRow ? selectedRow : null
            }
            mode={drawerMode === 'edit' ? 'edit' : 'add'}
            productMasterId={selectedRow ? selectedRow.productMasterId : 0}
          />
        </Box>
      )}

      {drawerViewOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: '64px', // Height of AppBar
            right: 0,
            bottom: 0,
            width: '100%',
            backgroundColor: 'white',
            boxShadow: 1,
            overflowY: 'auto',
            p: 2,
            zIndex: 1200,
          }}
        >
          <ProductMasterView />
          <Button
            variant="outlined"
            onClick={() => setDrawerViewOpen(false)}
            sx={{ position: 'absolute', top: 16, right: 16 }}
          >
            Close
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CrudTable;
