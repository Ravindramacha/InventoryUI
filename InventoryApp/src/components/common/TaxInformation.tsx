import React, { useState, useEffect } from "react";
import {
  Stack,
  TextField,
  IconButton,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import type { TaxInformationModel } from "../../Models/VendorModel";



interface TaxInformationProps {
  initialRows?: TaxInformationModel[];
  maxRows?: number;
  onChange?: (rows: TaxInformationModel[]) => void;
}

const TaxInformation: React.FC<TaxInformationProps> = ({
  
  initialRows = [{ id: Date.now(),countryId: null, category: "", name: "", taxNumber: ""}],
  maxRows = 5,
  onChange,
}) => {
const countryList = [
  { id: 1, name: 'United States' },
  { id: 2, name: 'Canada' },
  { id: 3, name: 'India' },
];
  const [rows, setRows] = useState<TaxInformationModel[]>(initialRows);

  useEffect(() => {
    onChange?.(rows);
  }, [rows, onChange]);

  const handleChange = (
    id: number,
    field: keyof TaxInformationModel,
    value: string
  ) => {
    const updated = rows.map((row) =>
      row.id === id
        ? {
            ...row,
            [field]: value,
          }
        : row 
    );
    setRows(updated);
  };

  const handleAddRow = (index: number) => {
    if (rows.length < maxRows) {
      const newRow: TaxInformationModel = {
        id: Date.now(),
        countryId: null,
        category: "",
        name: "",
        taxNumber: "",
      };
      const updated = [
        ...rows.slice(0, index + 1),
        newRow,
        ...rows.slice(index + 1),
      ];
      setRows(updated);
    }
  };

  const handleDeleteRow = (id: number) => {
    if (rows.length === 1) return;
    const updated = rows.filter((row) => row.id !== id);
    setRows(updated);
  };

  return (
    <Stack spacing={2}>
            {rows.map((row, index) => (
              <Stack
                direction="row"
                spacing={1}
                key={row.id}
                alignItems="center"
              >
                <Autocomplete
                   disablePortal
                   options={countryList}
                   //value={countryList.find(c => c.id === else.target) || null}
                   getOptionLabel={(option) => option.name}
                   isOptionEqualToValue={(option, value) => option.id === value.id}
                   onChange={(_, newValue) =>
                              handleChange(row.id, "countryId", String(newValue?.id || ''))
                            }
                   size="small"
                   sx={{ width: 200 }}
                   renderInput={(params) => <TextField {...params} label="Country" size="small" required />}
                    />
                <TextField
                  size="small"
                  label="Category"
                  value={row.category}
                  onChange={(e) => handleChange(row.id, "category", e.target.value)}
                  sx={{ width: 200 }}
                />
                <TextField
                  size="small"
                  label="Name"
                  value={row.name}
                  onChange={(e) => handleChange(row.id, "name", e.target.value)}
                  sx={{ width: 200 }}
                />
                <TextField
                  size="small"
                  label="Tax Number"
                  value={row.taxNumber}
                  onChange={(e) => handleChange(row.id, "taxNumber", e.target.value)}
                  sx={{ width: 200 }}
                />
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleAddRow(index)}
                  disabled={rows.length >= maxRows}
                  sx={{ 
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: 'primary.main',
                    mr: 1
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
                    borderColor: 'error.main'
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton> 
              </Stack>
            ))}
          </Stack>

  );
};

export default TaxInformation;
