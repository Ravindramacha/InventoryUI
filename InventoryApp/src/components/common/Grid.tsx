import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Tooltip,
  Chip,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// Import statements for icons we're actually using

// Define types for the Grid component
export interface ColumnDef<T> {
  field: keyof T;
  headerName: string;
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  headerAlign?: 'left' | 'center' | 'right';
  align?: 'left' | 'center' | 'right';
  headerStyle?: React.CSSProperties;
  cellStyle?: React.CSSProperties;
  renderCell?: (row: T) => React.ReactNode;
  valueGetter?: (row: T) => any;
  hide?: boolean;
}

export interface GridProps<T> {
  columns: ColumnDef<T>[];
  rows: T[];
  getRowId: (row: T) => string | number;
  title?: string;
  onRowClick?: (row: T) => void;
  onRowDoubleClick?: (row: T) => void;
  initialSortField?: keyof T;
  initialSortDirection?: 'asc' | 'desc';
  disablePagination?: boolean;
  hideSearch?: boolean;
  searchFields?: (keyof T)[];
  actionButton?: {
    text: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  size?: 'small' | 'medium';
  selectable?: boolean;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  toolbarActions?: {
    icon: React.ReactNode;
    tooltip: string;
    onClick: () => void;
  }[];
  density?: 'compact' | 'standard' | 'comfortable';
  emptyMessage?: string;
  height?: number | string;
  searchPlaceholder?: string;
  tableProps?: React.ComponentProps<typeof Table>;
  containerProps?: React.ComponentProps<typeof TableContainer>;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  // Handle null or undefined values
  if (b[orderBy] == null) return -1;
  if (a[orderBy] == null) return 1;
  
  // Compare values
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator<T>(
  order: 'asc' | 'desc',
  orderBy: keyof T
): (a: T, b: T) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function Grid<T extends Record<string, any>>(props: GridProps<T>): React.ReactElement {
  const {
    columns,
    rows,
    getRowId,
    title,
    onRowClick,
    onRowDoubleClick,
    disablePagination = false,
    hideSearch = false,
    initialSortField,
    initialSortDirection = 'asc',
    size = 'small',
    height,
    actionButton,
    searchPlaceholder = 'Search',
    searchFields,
    tableProps,
    containerProps,
    defaultPageSize = 10,
    pageSizeOptions = [5, 10, 25, 50, 100],
    selectable = false,
    onSelectionChange,
    toolbarActions = [],
    density = 'standard',
    emptyMessage = 'No data available'
  } = props;

  // State for sorting
  const [orderBy, setOrderBy] = useState<keyof T | undefined>(initialSortField);
  const [order, setOrder] = useState<'asc' | 'desc'>(initialSortDirection);
  
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPageSize);
  
  // State for search
  const [searchText, setSearchText] = useState('');
  const [filteredRows, setFilteredRows] = useState<T[]>(rows);
  
  // State for column menu
  const [columnMenuAnchor, setColumnMenuAnchor] = useState<null | HTMLElement>(null);
  
  // State for visible columns
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof T>>(
    new Set(columns.filter(col => !col.hide).map(col => col.field))
  );
  
  // State for selection
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  
  // State for active filters
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  // Handle sorting
  const handleRequestSort = (property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handle pagination
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredRows(rows);
    } else {
      const lowerCaseSearch = searchText.toLowerCase();
      const fieldsToSearch = searchFields || columns.map(col => col.field);
      
      setFilteredRows(
        rows.filter(row => {
          return fieldsToSearch.some(field => {
            const value = row[field];
            if (value == null) return false;
            return String(value).toLowerCase().includes(lowerCaseSearch);
          });
        })
      );
    }
    setPage(0);
  }, [searchText, rows, columns, searchFields]);

  // Instead of using a separate effect for sorting, we'll sort in the render phase
  // This avoids the infinite loop caused by updating filteredRows in multiple effects

  // Sort the filtered rows if needed
  const sortedRows = orderBy
    ? [...filteredRows].sort(getComparator(order, orderBy))
    : filteredRows;
    
  // Get the current page of rows
  const currentPageRows = disablePagination
    ? sortedRows
    : sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Handle row selection
  const handleRowSelect = (id: string | number) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }
    setSelectedRows(newSelectedRows);
    
    if (onSelectionChange) {
      onSelectionChange(Array.from(newSelectedRows));
    }
  };
  
  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(rows.map(row => getRowId(row))));
    }
    setSelectAll(!selectAll);
    
    if (onSelectionChange) {
      onSelectionChange(selectAll ? [] : rows.map(row => getRowId(row)));
    }
  };
  
  // Handle column visibility toggle
  const handleColumnVisibilityChange = (field: keyof T) => {
    const newVisibleColumns = new Set(visibleColumns);
    if (newVisibleColumns.has(field)) {
      newVisibleColumns.delete(field);
    } else {
      newVisibleColumns.add(field);
    }
    setVisibleColumns(newVisibleColumns);
  };
  
  // Get visible columns
  const displayColumns = columns.filter(
    col => visibleColumns.has(col.field)
  );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Header section with title, search, and action button */}
      <Box p={2} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {title && (
          <Typography variant="h6" component="div" sx={{ fontWeight: 'medium' }}>
            {title}
            {selectedRows.size > 0 && (
              <Chip 
                size="small" 
                label={`${selectedRows.size} selected`} 
                sx={{ ml: 2, bgcolor: 'primary.main', color: 'white' }} 
              />
            )}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Search field */}
          {!hideSearch && searchFields && searchFields.length > 0 && (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: '200px' }}
            />
          )}
          
          {/* Toolbar actions */}
          {toolbarActions.map((action, index) => (
            <Tooltip key={index} title={action.tooltip}>
              <IconButton size="small" onClick={action.onClick}>
                {action.icon}
              </IconButton>
            </Tooltip>
          ))}
          
          {/* Column visibility menu */}
          <Tooltip title="Column settings">
            <IconButton 
              size="small" 
              onClick={(e) => setColumnMenuAnchor(e.currentTarget)}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          {/* Action button */}
          {actionButton && (
            <Button
              variant="contained"
              size="small"
              startIcon={actionButton.icon || <AddIcon />}
              onClick={actionButton.onClick}
              sx={{ borderRadius: '8px', textTransform: 'none' }}
            >
              {actionButton.text}
            </Button>
          )}
        </Box>
      </Box>
      
      {/* Column menu */}
      <Menu
        anchorEl={columnMenuAnchor}
        open={Boolean(columnMenuAnchor)}
        onClose={() => setColumnMenuAnchor(null)}
      >
        <MenuItem disabled>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Show/Hide Columns
          </Typography>
        </MenuItem>
        <Divider />
        {columns.map((column) => (
          <MenuItem 
            key={String(column.field)}
            onClick={() => handleColumnVisibilityChange(column.field)}
            dense
          >
            <FormControlLabel
              control={
                <Checkbox 
                  checked={visibleColumns.has(column.field)} 
                  size="small" 
                />
              }
              label={column.headerName}
              sx={{ m: 0 }}
            />
          </MenuItem>
        ))}
      </Menu>
      
      {/* Active filters display */}
      {Object.keys(activeFilters).length > 0 && (
        <Box sx={{ px: 2, py: 1, display: 'flex', gap: 1, flexWrap: 'wrap', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
          {Object.entries(activeFilters).map(([field, value]) => (
            <Chip
              key={field}
              size="small"
              label={`${field}: ${value}`}
              onDelete={() => {
                const newFilters = { ...activeFilters };
                delete newFilters[field];
                setActiveFilters(newFilters);
              }}
            />
          ))}
          <Chip
            size="small"
            label="Clear all filters"
            onDelete={() => setActiveFilters({})}
            color="primary"
          />
        </Box>
      )}
      
      {/* Table section */}
      <TableContainer 
        sx={{ height, maxHeight: height, ...containerProps?.sx }}
        {...containerProps}
      >
        <Table 
          stickyHeader 
          size={size}
          padding={density === 'compact' ? 'none' : density === 'comfortable' ? 'normal' : 'normal'}
          {...tableProps}
        >
          <TableHead>
            <TableRow>
              {/* Selection checkbox in header */}
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedRows.size > 0 && selectedRows.size < rows.length}
                    checked={rows.length > 0 && selectedRows.size === rows.length}
                    onChange={handleSelectAll}
                    size="small"
                  />
                </TableCell>
              )}
              
              {/* Column headers */}
              {displayColumns.map((column) => (
                <TableCell 
                  key={String(column.field)}
                  sx={{ 
                    py: 1.5, 
                    fontWeight: 600, 
                    width: column.width,
                    textAlign: column.headerAlign || 'left',
                    ...column.headerStyle
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {column.sortable !== false ? (
                      <TableSortLabel
                        active={orderBy === column.field}
                        direction={orderBy === column.field ? order : 'asc'}
                        onClick={() => handleRequestSort(column.field)}
                      >
                        {column.headerName}
                      </TableSortLabel>
                    ) : (
                      column.headerName
                    )}
                    
                    {column.filterable && (
                      <IconButton size="small" sx={{ ml: 1 }}>
                        <FilterListIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageRows.length > 0 ? (
              currentPageRows.map((row) => (
                <TableRow
                  hover
                  key={getRowId(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onDoubleClick={onRowDoubleClick ? () => onRowDoubleClick(row) : undefined}
                  sx={{ 
                    cursor: (onRowClick || onRowDoubleClick) ? 'pointer' : 'default',
                    backgroundColor: selectedRows.has(getRowId(row)) ? 'rgba(25, 118, 210, 0.08)' : 'inherit'
                  }}
                >
                  {/* Selection checkbox */}
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRows.has(getRowId(row))}
                        onChange={() => handleRowSelect(getRowId(row))}
                        onClick={(e) => e.stopPropagation()}
                        size="small"
                      />
                    </TableCell>
                  )}
                  
                  {/* Data cells */}
                  {displayColumns.map((column) => (
                    <TableCell 
                      key={`${getRowId(row)}-${String(column.field)}`}
                      sx={{ 
                        py: 1,
                        textAlign: column.align || 'left',
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        maxWidth: column.width || 'auto',
                        ...column.cellStyle
                      }}
                    >
                      {column.renderCell 
                        ? column.renderCell(row)
                        : column.valueGetter 
                          ? column.valueGetter(row)
                          : row[column.field] != null ? String(row[column.field]) : ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={displayColumns.length + (selectable ? 1 : 0)} 
                  sx={{ textAlign: 'center', py: 6 }}
                >
                  <Typography variant="body1" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination section */}
      {!disablePagination && (
        <TablePagination
          rowsPerPageOptions={pageSizeOptions}
          component="div"
          count={sortedRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}
        />
      )}
    </Paper>
  );
}

export default Grid;
