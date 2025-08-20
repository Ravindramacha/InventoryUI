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
import { useGetAllProductMasterForm } from "../../api/ApiQueries";
import type { ReadProductMasterForm } from "../../Models/MaterialModel";
import ApplicationFormPage from "../ApplicationForm";
import ProductMasterView from "../ProductMasterView";
import ProductDetails from "../ProductDetails";


type Mode = "add" | "edit" | "view";

interface CrudTableProps {
  onEdit?: (data: ReadProductMasterForm) => void;
}

type Order = 'asc' | 'desc';

const CrudTable: React.FC<CrudTableProps> = ({ onEdit }) => {
  const { data: productMasterForm = [] } = useGetAllProductMasterForm();

  const [rows, setRows] = useState<ReadProductMasterForm[]>([]);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof ReadProductMasterForm>('productId');

  useEffect(() => {
  if (Array.isArray(productMasterForm)) {
    setRows(productMasterForm);
  } else {
    console.warn("Unexpected data:", productMasterForm);
    setRows([]); // fallback
  }
}, [productMasterForm]);

  const handleRequestSort = (property: keyof ReadProductMasterForm) => {
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
  const [selectedRow, setSelectedRow] = useState<ReadProductMasterForm | null>(null);

  const [drawerViewOpen, setDrawerViewOpen] = useState(false);

  // const handleOpenViewDrawer = (mode: Mode, row: ReadProductMasterForm | null = null) => {
  //   setDrawerMode(mode);
  //   setSelectedRow(row);
  //   setDrawerViewOpen(true);
  // };


  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleOpenDrawer = (mode: Mode, row: ReadProductMasterForm | null = null) => {
    setDrawerMode(mode);
    setSelectedRow(row);
    setDrawerOpen(true);
  };

  // const handleDelete = (id: number) => {
  //   setRows((prev) => prev.filter((r) => r.productMasterId !== id));
  //   if (drawerMode === "add" && selectedRow) {

  //   } else if (drawerMode === "edit") {

  //   }
  //   setDrawerOpen(false);
  // };

  // const handleSubmit = (formData: ReadProductMasterForm) => {
  //   if (drawerMode === "add") {
  //     setRows((prev) => [...prev, { ...formData, id: formData.productMasterId }]);
  //   } else if (drawerMode === "edit") {
  //     setRows((prev) => prev.map((r) => (r.productMasterId === formData.productMasterId ? formData : r)));
  //   }
  //   setDrawerOpen(false);
  // };

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
        row.productId.toLowerCase().includes(searchTerm) ||
        row.productType.productTypeDesc.toLowerCase().includes(searchTerm) ||
        row.productType.productTypeCode.toLowerCase().includes(searchTerm) ||
        row.productGroup.productGroupDesc.toLowerCase().includes(searchTerm) ||
        row.productGroup.productGroupCode.toLowerCase().includes(searchTerm) ||
        row.productCategory.productCategoryDesc.toLowerCase().includes(searchTerm) ||
        row.productCategory.productCategoryCode.toLowerCase().includes(searchTerm) ||
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
                        cursor: 'pointer'
                      }
                    }}
                  >
                    <TableCell sx={{ py: 1 }}>{row.productId}</TableCell>
                    <TableCell sx={{ py: 1 }}>{row.productType.productTypeDesc}</TableCell>
                    <TableCell sx={{ py: 1 }}>{row.productGroup.productGroupDesc}</TableCell>
                    <TableCell sx={{ py: 1 }}>{row.productCategory.productCategoryDesc}</TableCell>
                 
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
          <ProductDetails 
            product={selectedRow}
            onBack={() => setSelectedRow(null)}
            onEdit={(product) => onEdit ? onEdit(product) : handleOpenDrawer("edit", product)}
          />
        </Box>
      )}
      
      {drawerOpen && (
        <Box sx={{ backgroundColor: 'white', p: 2, borderRadius: 1 }}>
          <ApplicationFormPage 
            onCancel={() => setDrawerOpen(false)} 
            initialData={drawerMode === "edit" && selectedRow ? {
              productId: selectedRow.productId,
              productTypeId: selectedRow.productTypeId,
              productGroupId: selectedRow.productGroupId,
              productCategoryId: selectedRow.productCategoryId,
              salesStatusId: selectedRow.salesStatusId,
              languageId: selectedRow.languageId,
              shortDescription: selectedRow.shortDescription,
              longDescription: selectedRow.longDescription,
              attribute1: selectedRow.attribute1,
              attribute2: selectedRow.attribute2,
              attribute3: selectedRow.attribute3,
              attribute4: selectedRow.attribute4,
              attribute5: selectedRow.attribute5,
              date1: selectedRow.date1,
              date2: selectedRow.date2,
              date3: selectedRow.date3,
              date4: selectedRow.date4,
              date5: selectedRow.date5,
              number1: selectedRow.number1,
              number2: selectedRow.number2,
              number3: selectedRow.number3,
              number4: selectedRow.number4,
              number5: selectedRow.number5,
              dropDown1: selectedRow.dropDown1,
              dropDown2: selectedRow.dropDown2,
              dropDown3: selectedRow.dropDown3,
              dropDown4: selectedRow.dropDown4,
              dropDown5: selectedRow.dropDown5,
              productMasterUomDto: selectedRow.productMasterUomDto,
              unitOfMeasurement: selectedRow.unitOfMeasurement,
              manufacturerId: selectedRow.manufacturerId,
              manufacturerPartNumber: selectedRow.manufacturerPartNumber,
              notes: selectedRow.notes
            } : null}
            mode={drawerMode === "edit" ? "edit" : "add"}
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

// interface CrudFormProps {
//   mode: Mode;
//   data: ReadProductMasterForm | null;
//   onSubmit: (data: ReadProductMasterForm) => void;
//   onCancel: () => void;
// }

// const CrudForm: React.FC<CrudFormProps> = ({ mode, data, onSubmit, onCancel }) => {
//   const [formData, setFormData] = useState<ReadProductMasterForm>({
//     id: data?.id || 0,
//     name: data?.name || "",
//     email: data?.email || "",
//   });

//   const readOnly = mode === "view";

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   return (
//     <Box display="flex" flexDirection="column" gap={2}>
//       <TextField
//         label="Name"
//         name="name"
//         value={formData.name}
//         onChange={handleChange}
//         disabled={readOnly}
//         fullWidth
//       />
//       <TextField
//         label="Email"
//         name="email"
//         value={formData.email}
//         onChange={handleChange}
//         disabled={readOnly}
//         fullWidth
//       />
//       <Box display="flex" justifyContent="flex-end" gap={1}>
//         <Button onClick={onCancel}>Cancel</Button>
//         {mode !== "view" && (
//           <Button
//             variant="contained"
//             onClick={() => onSubmit({ ...formData })}
//           >
//             {mode === "edit" ? "Update" : "Create"}
//           </Button>
//         )}
//       </Box>
//     </Box>
//);
//};

export default CrudTable;
