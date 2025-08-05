import  { useState, type FC, type ChangeEvent} from "react";
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
  Drawer,
  Typography,
  Button,
  TableSortLabel
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";

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
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => setDrawerOpen(false);

  return (
    <Box sx={{ p: 2, bgcolor: "background.paper", borderRadius: 3, boxShadow: 4 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search..."
        value={search}
        onChange={handleSearchChange}
        sx={{ mb: 2, maxWidth: 360 }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  sortDirection={orderBy === col.id ? order : false}
                  sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}
                >
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={orderBy === col.id ? order : 'asc'}
                    onClick={() => handleRequestSort(col.id as keyof Data)}
                    sx={{
                      '&.MuiTableSortLabel-root:hover': { color: 'secondary.light' },
                      '&.MuiTableSortLabel-root.Mui-active': { color: 'secondary.main' },
                      '& .MuiTableSortLabel-icon': { color: 'inherit !important' },
                    }}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell align="right" sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    bgcolor: index % 2 === 0 ? 'background.default' : 'action.hover',
                  }}
                >
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDrawer("view", row)}
                      aria-label="view"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleOpenDrawer("edit", row)}
                      aria-label="edit"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(row.id)}
                      aria-label="delete"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {sortedRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
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
        />
      </TableContainer>
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            height: "88vh",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            boxShadow: 3,
            p: 3,
          },
        }}
      >
        {drawerContent && (
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
              <Typography variant="h5" flexGrow={1}>
                {drawerContent.type === "view" ? "View Details" : "Edit Row"}
              </Typography>
              <Button onClick={handleCloseDrawer} variant="outlined" sx={{ ml: 2 }}>
                Close
              </Button>
            </Box>
            {drawerContent.type === "view" ? (
              <Box>
                <Typography>Name: {drawerContent.data.name}</Typography>
                <Typography>Email: {drawerContent.data.email}</Typography>
                <Typography>Age: {drawerContent.data.age}</Typography>
              </Box>
            ) : (
              <Box component="form" sx={{ display: "grid", gap: 2 }}>
                <TextField
                  label="Name"
                  defaultValue={drawerContent.data.name}
                  fullWidth
                />
                <TextField
                  label="Email"
                  defaultValue={drawerContent.data.email}
                  fullWidth
                />
                <TextField
                  label="Age"
                  type="number"
                  defaultValue={drawerContent.data.age}
                  fullWidth
                />
                <Button variant="contained" color="primary">
                  Save
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default DataTable;
