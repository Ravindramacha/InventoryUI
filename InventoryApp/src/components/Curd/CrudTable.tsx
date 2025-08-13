import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  Drawer
} from "@mui/material";
import { Add, Delete, Edit, Visibility } from "@mui/icons-material";
import { useGetAllProductMasterForm } from "../../api/ApiQueries";
import type { ReadProductMasterForm } from "../../Models/MaterialModel";
import ApplicationFormPage from "../ApplicationForm";
import ProductMasterView from "../ProductMasterView";


type Mode = "add" | "edit" | "view";

const CrudTable: React.FC = () => {
  const { data: productMasterForm  = [] } = useGetAllProductMasterForm();  

  const [rows, setRows] = useState<ReadProductMasterForm[]>([]);
  useEffect(() => {
  if (productMasterForm.length > 0) {
    setRows(productMasterForm);
  }
}, [productMasterForm]);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<Mode>("add");
  const [selectedRow, setSelectedRow] = useState<ReadProductMasterForm | null>(null);

  const [drawerViewOpen, setDrawerViewOpen] = useState(false);

  const handleOpenViewDrawer = (mode: Mode, row: ReadProductMasterForm | null = null) => {
    setDrawerMode(mode);
    setSelectedRow(row);
    setDrawerViewOpen(true);
  };


  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenDrawer = (mode: Mode, row: ReadProductMasterForm | null = null) => {
    setDrawerMode(mode);
    setSelectedRow(row);
    setDrawerOpen(true);
  };

  const handleDelete = (id: number) => {
    setRows((prev) => prev.filter((r) => r.productMasterId !== id));
       if (drawerMode === "add" && selectedRow) {
     
    } else if (drawerMode === "edit") {
      
    }
    setDrawerOpen(false);
  };

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

  const filteredRows = rows.filter((r) =>
    r.productId.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Search by name"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDrawer("add")}
        >
          Add New
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small" sx={{ border: '1px solid black' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ py: 1, fontWeight: 'bold', border: '1px solid black' }}>Product Id</TableCell>
              <TableCell sx={{ py: 1, fontWeight: 'bold', border: '1px solid black' }}>Product Type</TableCell>
              <TableCell sx={{ py: 1, fontWeight: 'bold', border: '1px solid black' }}>Product Group</TableCell>
              <TableCell sx={{ py: 1, fontWeight: 'bold', border: '1px solid black' }}>Product Category</TableCell>
              <TableCell sx={{ py: 1, fontWeight: 'bold', border: '1px solid black' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => (
              <TableRow key={row.productMasterId}>
                <TableCell sx={{ py: 1, border: '1px solid black' }}>{row.productId}</TableCell>
                <TableCell sx={{ py: 1, border: '1px solid black' }}>{row.productType.productTypeDesc}</TableCell>
                <TableCell sx={{ py: 1, border: '1px solid black' }}>{row.productGroup.productGroupDesc}</TableCell>
                <TableCell sx={{ py: 1, border: '1px solid black' }}>{row.productCategory.productCategoryDesc}</TableCell>
                <TableCell sx={{ py: 1, border: '1px solid black'  }}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenViewDrawer("view", row)}
                    sx={{ color: 'primary.main' }}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenDrawer("edit", row)}
                    sx={{ color: 'primary.main' }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDelete(row.productMasterId)}
                    sx={{ color: 'error.main' }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
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
                    border: '1px solid black'
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

    <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
            paper: {
            sx: {
                height: '92vh',        // 80% of viewport height
                width: '100%',         // Full width
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
            }
            }
        }}
        >
      <Box p={3} height="100%" overflow="auto">
        <ApplicationFormPage onCancel={() => setDrawerOpen(false)}/>
      </Box>
    </Drawer>
     <Drawer
        anchor="bottom"
        open={drawerViewOpen}
        onClose={() => setDrawerViewOpen(false)}
        slotProps={{
            paper: {
            sx: {
                height: '92vh',        // 80% of viewport height
                width: '100%',         // Full width
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
            }
            }
        }}
        >
      <Box p={3} height="100%" overflow="auto">
        <ProductMasterView />
      
        {/* <ApplicationFormPage onCancel={() => setDrawerOpen(false)}/> */}
      </Box>
    </Drawer>

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
