import React, { useState } from 'react';
import {
  Stack,
  TextField,
  IconButton,
  Autocomplete,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import type { TaxInformationModel } from '../../Models/VendorModel';

interface TaxInformationProps {
  initialRows?: TaxInformationModel[];
  maxRows?: number;
  onChange?: (rows: TaxInformationModel[]) => void;
}

const TaxInformation: React.FC<TaxInformationProps> = ({
  initialRows = [
    { id: 1, countryId: null, category: '', name: '', taxNumber: '' },
  ],
  maxRows = 5,
  onChange,
}) => {
  const countryList = [
    { id: 1, name: 'United States' },
    { id: 2, name: 'Canada' },
    { id: 3, name: 'India' },
  ];

  const [rows, setRows] = useState<TaxInformationModel[]>(initialRows);
  // console.log(rows);
  const [nextId, setNextId] = useState(
    initialRows.length > 0 ? Math.max(...initialRows.map(r => r.id)) + 1 : 1
  );

  // Only call onChange when rows actually change due to user interaction
  // Not on every render or when the component receives new props
  const notifyChanges = (updatedRows: TaxInformationModel[]) => {
    setRows(updatedRows);
    onChange?.(updatedRows);
  };

const handleChange = <K extends keyof TaxInformationModel>(
  id: number,
  field: K,
  value: TaxInformationModel[K]
) => {
  const updated = rows.map((row) =>
    row.id === id ? { ...row, [field]: value } : row
  );
  notifyChanges(updated);
};

  const handleAddRow = (index: number) => {
    if (rows.length < maxRows) {
      const newRow: TaxInformationModel = {
        id: nextId, // ✅ number ID
        countryId: null,
        category: '',
        name: '',
        taxNumber: '',
      };
      setNextId((prev) => prev + 1);

      const updated = [
        ...rows.slice(0, index + 1),
        newRow,
        ...rows.slice(index + 1),
      ];
      notifyChanges(updated);
    }
  };

  const handleDeleteRow = (id: number) => {
    if (rows.length === 1) return;
    const updated = rows.filter((row) => row.id !== id);
    notifyChanges(updated);
  };

  return (
    <Stack spacing={2}>
      {rows.map((row, index) => (
        <React.Fragment key={row.id}> {/* ✅ stable numeric key */}
          <Grid container spacing={1} alignItems="center">
            <Grid  size={{ xs: 12, sm: 4}}>
              <Autocomplete
                disablePortal
                options={countryList}
                value={countryList.find((p) => p.id === row.countryId) ?? null}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_, newValue) =>
                    handleChange(row.id, 'countryId', newValue ? newValue.id : null)
                }
                size="small"
                sx={{ width: '100%' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    size="small"
                    required
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4}}>
              <TextField
                size="small"
                label="Category"
                name="category"
                value={row.category}
                onChange={(e) =>
                  handleChange(row.id, 'category', e.target.value)
                }
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4}}>
              <TextField
                size="small"
                label="Name"
                value={row.name}
                onChange={(e) => handleChange(row.id, 'name', e.target.value)}
                sx={{ width: '100%' }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 4}}>
              <TextField
                size="small"
                label="Tax Number"
                value={row.taxNumber}
                onChange={(e) =>
                  handleChange(row.id, 'taxNumber', e.target.value)
                }
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid
             size={{ xs: 12, sm: 4}}
            >
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleAddRow(index)}
                disabled={rows.length >= maxRows}
                sx={{
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: 'primary.main',
                  mr: 1,
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteRow(row.id)}
                disabled={rows.length === 1}
                sx={{
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: 'error.main',
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
        </React.Fragment>
      ))}
    </Stack>
  );
};

export default TaxInformation;
