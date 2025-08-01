import React, { useState } from "react";
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

// Define row data type
interface User {
  id: number;
  name: string;
  email: string;
}

type Mode = "add" | "edit" | "view";

const initialRows: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Alice Brown", email: "alice@example.com" },
  { id: 4, name: "Bob White", email: "bob@example.com" },
  { id: 5, name: "Sara Lee", email: "sara@example.com" },
  { id: 6, name: "Tom Green", email: "tom@example.com" },
];

const CrudTable: React.FC = () => {
  const [rows, setRows] = useState<User[]>(initialRows);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<Mode>("add");
  const [selectedRow, setSelectedRow] = useState<User | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenDrawer = (mode: Mode, row: User | null = null) => {
    setDrawerMode(mode);
    setSelectedRow(row);
    setDrawerOpen(true);
  };

  const handleDelete = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSubmit = (formData: User) => {
    if (drawerMode === "add") {
      setRows((prev) => [...prev, { ...formData, id: Date.now() }]);
    } else if (drawerMode === "edit") {
      setRows((prev) => prev.map((r) => (r.id === formData.id ? formData : r)));
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
    r.name.toLowerCase().includes(search.toLowerCase())
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
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDrawer("view", row)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDrawer("edit", row)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(row.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {paginatedRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
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
    <Typography variant="h6" gutterBottom>
      {drawerMode === "add"
        ? "Add New User"
        : drawerMode === "edit"
        ? "Edit User"
        : "View User"}
    </Typography>
    <CrudForm
      mode={drawerMode}
      data={selectedRow}
      onSubmit={handleSubmit}
      onCancel={() => setDrawerOpen(false)}
    />
  </Box>
</Drawer>


    </Box>
  );
};

interface CrudFormProps {
  mode: Mode;
  data: User | null;
  onSubmit: (data: User) => void;
  onCancel: () => void;
}

const CrudForm: React.FC<CrudFormProps> = ({ mode, data, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<User>({
    id: data?.id || 0,
    name: data?.name || "",
    email: data?.email || "",
  });

  const readOnly = mode === "view";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        disabled={readOnly}
        fullWidth
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        disabled={readOnly}
        fullWidth
      />
      <Box display="flex" justifyContent="flex-end" gap={1}>
        <Button onClick={onCancel}>Cancel</Button>
        {mode !== "view" && (
          <Button
            variant="contained"
            onClick={() => onSubmit({ ...formData })}
          >
            {mode === "edit" ? "Update" : "Create"}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CrudTable;
