import React, { useEffect, useState } from "react";
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
  TableSortLabel
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useGetAllVendorForm } from "../../api/ApiQueries";
import type { ReadProductMasterForm } from "../../Models/MaterialModel";
import ProductMasterView from "../Configuration/Product/ProductMasterView";
import ProductDetails from "../Configuration/Product/ProductDetails";
import ApplicationForm from "../common/ApplicationForm";
import type { ReadVendorFormModel } from "../../Models/VendorModel";
import VendorForm from "../common/VendorForm";
import VendorDetails from "./VendorDetails";



type Mode = "add" | "edit" | "view";

interface VendorListProps {
  onEdit?: (data: ReadVendorFormModel) => void;
}

type Order = 'asc' | 'desc';

const VendorList: React.FC<VendorListProps> = ({ onEdit }) => {
  const { data: vendorForm = [] } = useGetAllVendorForm ();

  const [rows, setRows] = useState<ReadVendorFormModel[]>([]);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof ReadVendorFormModel>('vendorId');

  useEffect(() => {
  if (Array.isArray(vendorForm)) {
    setRows(vendorForm);
  } else {
    console.warn("Unexpected data:", vendorForm);
    setRows([]); // fallback
  }
}, [vendorForm]);

  const handleRequestSort = (property: keyof ReadVendorFormModel) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
  ): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    let aValue = a[orderBy];
    let bValue = b[orderBy];

    // Handle nested properties for productType, productGroup, and productCategory
    if (orderBy === 'productType' as keyof T) aValue = (a as any).productType.productTypeDesc;
    if (orderBy === 'productGroup' as keyof T) aValue = (a as any).productGroup.productGroupDesc;
    if (orderBy === 'productCategory' as keyof T) aValue = (a as any).productCategory.productCategoryDesc;
    if (orderBy === 'productType' as keyof T) bValue = (b as any).productType.productTypeDesc;
    if (orderBy === 'productGroup' as keyof T) bValue = (b as any).productGroup.productGroupDesc;
    if (orderBy === 'productCategory' as keyof T) bValue = (b as any).productCategory.productCategoryDesc;

    if (bValue < aValue) {
      return -1;
    }
    if (bValue > aValue) {
      return 1;
    }
    return 0;
  }
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<Mode>("add");
  const [selectedRow, setSelectedRow] = useState<ReadVendorFormModel | null>(null);

  const [drawerViewOpen, setDrawerViewOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleOpenDrawer = (mode: Mode, row: ReadVendorFormModel | null = null) => {
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
const filteredRows = Array.isArray(rows)
  ? rows.filter((row) => {
      const searchTerm = search.toLowerCase();
      return (
        row.companyName1.toLowerCase().includes(searchTerm) ||
        row.companyName2.toLowerCase().includes(searchTerm) ||
        row.phoneNumber1.toLowerCase().includes(searchTerm) ||
        row.email1.toLowerCase().includes(searchTerm)
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
    <Box >
      {!drawerOpen && !selectedRow && (
        <>
          <Box display="flex" justifyContent="space-between" sx={{ 
          p: 2,
          mt: 0
        }}>
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
                textTransform: 'none'
              }}
              onClick={() => handleOpenDrawer("add")}
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
                      active={orderBy === 'companyName1'}
                      direction={orderBy === 'companyName1' ? order : 'asc'}
                      onClick={() => handleRequestSort('companyName1')}
                    >
                      Company Name 1
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={orderBy === 'companyName2'}
                      direction={orderBy === 'companyName2' ? order : 'asc'}
                      onClick={() => handleRequestSort('companyName2')}
                    >
                      Company Name 2
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={orderBy === 'phoneNumber1'}
                      direction={orderBy === 'phoneNumber1' ? order : 'asc'}
                      onClick={() => handleRequestSort('phoneNumber1')}
                    >
                      Phone Number 1
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={orderBy === 'email1'}
                      direction={orderBy === 'email1' ? order : 'asc'}
                      onClick={() => handleRequestSort('email1')}
                    >
                      Email 1
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.map((row) => (
                  <TableRow 
                    key={row.vendorId}
                    onClick={() => setSelectedRow(row)}
                    sx={{ 
                      '&:hover': {
                        backgroundColor: '#f1f1fa',
                        cursor: 'pointer'
                      }
                    }}
                  >
                    <TableCell sx={{ py: 1 }}>{row.companyName1}</TableCell>
                    <TableCell sx={{ py: 1 }}>{row.companyName2}</TableCell>
                    <TableCell sx={{ py: 1 }}>{row.phoneNumber1}</TableCell>
                    <TableCell sx={{ py: 1 }}>{row.email1}</TableCell>
                 
                  </TableRow>
                ))}
                {paginatedRows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{
                        py: 2
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
          <VendorDetails 
            vendor={selectedRow}
            onBack={() => setSelectedRow(null)}
            onEdit={(vendor) => onEdit ? onEdit(vendor) : handleOpenDrawer("edit", vendor)}
          />
        </Box>
      )}
      
      {drawerOpen && (
        <Box sx={{ backgroundColor: 'white', p: 2, borderRadius: 1 }}>
          <VendorForm />
          {/* <ApplicationForm
            onCancel={() => setDrawerOpen(false)} 
            initialData={drawerMode === "edit" && selectedRow ? selectedRow : null}
            mode={drawerMode === "edit" ? "edit" : "add"}
            productMasterId={selectedRow ? selectedRow.productMasterId : 0}
          /> */}
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
            zIndex: 1200
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

export default VendorList;
