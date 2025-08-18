import { useState, type FC, type ChangeEvent } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  TextField,
  Typography,
  Button,
  TableSortLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { Delete, Edit, Visibility, Close } from "@mui/icons-material";

type Order = 'asc' | 'desc';

type Data = {
  id: number;
  name: string;
  email: string;
  age: number;
};

interface DataTableProps {
  rows: Data[];
}

const columns = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "age", label: "Age" },
];

type DrawerContent = { type: "view" | "edit"; data: Data } | null;

const DataTable: FC<DataTableProps> = ({ rows }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<DrawerContent>(null);
  const [rowData, setRowData] = useState<Data[]>(rows);
  const [formData, setFormData] = useState<Data | null>(null);

  // Sorting state
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>('name'); // Default sort by "name"

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(0); // Reset page to 0 on new search
  };

  // Sort comparator
  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
  ): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  // Stable sort that preserves original order for equal items
  function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const orderCmp = comparator(a[0], b[0]);
      if (orderCmp !== 0) return orderCmp;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  }

  const filteredRows = rowData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Sorted and filtered rows
  const sortedRows = stableSort(filteredRows, getComparator(order, orderBy));

  const handleRequestSort = (property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleDelete = (id: number) => {
    setRowData((prev) => prev.filter((r) => r.id !== id));
  };

  const handleOpenDrawer = (type: "view" | "edit", data: Data) => {
    setDrawerContent({ type, data });
    setFormData(data);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setFormData(null);
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value
    });
  };

  const handleSave = () => {
    if (!formData) return;
    setRowData(prev => prev.map(row => 
      row.id === formData.id ? formData : row
    ));
    handleCloseDrawer();
  };

  return (
      <Box sx={{ p: 2, bgcolor: "background.paper", borderRadius: 3, boxShadow: 4 }}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Search..."
          value={search}
          onChange={handleSearchChange}
          sx={{ mb: 2, maxWidth: 360 }}
        />
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  sortDirection={orderBy === col.id ? order : false}
                  sx={{ fontWeight: 600, py: 1.5 }}
                >
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={orderBy === col.id ? order : 'asc'}
                    onClick={() => handleRequestSort(col.id as keyof Data)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              {/* <TableCell align="right" sx={{ fontWeight: 600, py: 1.5 }}>
                Actions
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={(event) => {
                    // Prevent row click if clicking on action buttons
                    if (!(event.target as HTMLElement).closest('.action-buttons')) {
                      handleOpenDrawer("edit", row);
                    }
                  }}
                  sx={{ 
                    '&:hover': {
                      backgroundColor: '#f1f1fa',
                      cursor: 'pointer'
                    }
                  }}
                >
                  <TableCell sx={{ py: 1 }}>{row.name}</TableCell>
                  <TableCell sx={{ py: 1 }}>{row.email}</TableCell>
                  <TableCell sx={{ py: 1 }}>{row.age}</TableCell>
                  {/* <TableCell align="right" sx={{ py: 1 }} className="action-buttons">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDrawer("view", row)}
                      aria-label="view"
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => handleOpenDrawer("edit", row)}
                      aria-label="edit"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(row.id)}
                      aria-label="delete"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell> */}
                </TableRow>
              ))}
            {sortedRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 2 }}>
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={sortedRows.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => setRowsPerPage(Number(e.target.value))}
          rowsPerPageOptions={[5, 10, 25]}
          size="small"
        />
        
      </TableContainer>
      <Dialog
        open={drawerOpen}
        onClose={handleCloseDrawer}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 2,
          }
        }}
      >
        {drawerContent && (
          <>
            <DialogTitle sx={{ p: 0, mb: 0 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">
                  {drawerContent.type === "view" ? "View Details" : "Edit Row"}
                </Typography>
                <IconButton onClick={handleCloseDrawer} size="small">
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
              {drawerContent.type === "view" ? (
                <Box sx={{ display: "grid", gap: 2 }}>
                  <Typography><strong>Name:</strong> {drawerContent.data.name}</Typography>
                  <Typography><strong>Email:</strong> {drawerContent.data.email}</Typography>
                  <Typography><strong>Age:</strong> {drawerContent.data.age}</Typography>
                </Box>
              ) : (
                <Box component="form" sx={{ display: "grid", gap: 2 }}>
                  <span></span>
                  <TextField
                    label="Name"
                    name="name"
                    value={formData?.name || ''}
                    onChange={handleFormChange}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Email"
                    name="email"
                    value={formData?.email || ''}
                    onChange={handleFormChange}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Age"
                    name="age"
                    type="number"
                    value={formData?.age || ''}
                    onChange={handleFormChange}
                    fullWidth
                    size="small"
                  />
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 0, mt: 2 }}>
              <Button onClick={handleCloseDrawer} variant="outlined" size="small">
                Cancel
              </Button>
              {drawerContent.type === "edit" && (
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleSave}
                  size="small"
                >
                  Save
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default DataTable;
