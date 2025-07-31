import React, { useState, useEffect } from "react";
import {
  Stack,
  TextField,
  IconButton,
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
                <TextField
                  label="Country"
                  value={row.countryId}
                  onChange={(e) => handleChange(row.id, "countryId", e.target.value)}
                 />
                <TextField
                  label="Category"
                  value={row.category}
                  onChange={(e) => handleChange(row.id, "category", e.target.value)}
                />
                <TextField
                  label="Name"
                  value={row.name}
                  onChange={(e) => handleChange(row.id, "name", e.target.value)}
                />
                <TextField
                  label="Tax Number"
                  value={row.taxNumber}
                  onChange={(e) => handleChange(row.id, "taxNumber", e.target.value)}
                />
                <IconButton
                  color="primary"
                  onClick={() => handleAddRow(index)}
                  disabled={rows.length >= maxRows}
                >
                  <AddIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteRow(row.id)}
                  disabled={rows.length === 1}
                >
                  <DeleteIcon />
                </IconButton> 
              </Stack>
            ))}
          </Stack>

  );
};

export default TaxInformation;
