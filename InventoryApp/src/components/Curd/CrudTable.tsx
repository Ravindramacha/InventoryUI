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
  Drawer,
  Typography,
} from "@mui/material";
import { Add, Delete, Edit, Visibility } from "@mui/icons-material";
import { useGetAllProductMasterForm } from "../../api/ApiQueries";
import type { ReadProductMasterForm } from "../../Models/MaterialModel";
import ApplicationFormPage from "../ApplicationForm";


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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenDrawer = (mode: Mode, row: ReadProductMasterForm | null = null) => {
    setDrawerMode(mode);
    setSelectedRow(row);
    setDrawerOpen(true);
  };

  const handleDelete = (id: number) => {
    setRows((prev) => prev.filter((r) => r.productMasterId !== id));
  };

  const handleSubmit = (formData: ReadProductMasterForm) => {
    if (drawerMode === "add") {
      setRows((prev) => [...prev, { ...formData, id: formData.productMasterId }]);
    } else if (drawerMode === "edit") {
      setRows((prev) => prev.map((r) => (r.productMasterId === formData.productMasterId ? formData : r)));
    }
    setDrawerOpen(false);
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Id</TableCell>
              <TableCell>Product Type</TableCell>
              <TableCell>Product Group</TableCell>
              <TableCell>Product Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => (
              <TableRow key={row.productMasterId}>
                <TableCell>{row.productId}</TableCell>
                <TableCell>{row.productType.productTypeDesc}</TableCell>
                <TableCell>{row.productGroup.productGroupDesc}</TableCell>
                <TableCell>{row.productCategory.productCategoryDesc}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDrawer("view", row)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDrawer("edit", row)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(row.productMasterId)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {paginatedRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
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
