import React, { useState, useEffect } from "react";
import {
  Stack,
  TextField,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import type { BankModel } from "../../Models/VendorModel";
import Checkbox from '@mui/material/Checkbox';


interface BankDataProps {
  initialRows?: BankModel[];
  maxRows?: number;
  onChange?: (rows: BankModel[]) => void;
}

const BankData: React.FC<BankDataProps> = ({
  initialRows = [{ id: Date.now(), bankName: "", accountNumber: "", routingNumber: "", accountName: "" ,phoneNumber: "", primary: false }],
  maxRows = 5,
  onChange,
}) => {
  const [rows, setRows] = useState<BankModel[]>(initialRows);

  useEffect(() => {
    onChange?.(rows);
  }, [rows, onChange]);

  const handleChange = (
    id: number,
    field: keyof BankModel,
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
      const newRow: BankModel = {
        id: Date.now(), 
        bankName: "",
        accountNumber: "",
        routingNumber: "",
        accountName: "",
        phoneNumber: "",
        primary: false,
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
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

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
                  label="Bank Name"
                  value={row.bankName}
                  onChange={(e) => handleChange(row.id, "bankName", e.target.value)}
                  fullWidth 
                />
                <TextField
                  label="Account Number"
                  value={row.accountNumber}
                  onChange={(e) => handleChange(row.id, "accountNumber", e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Routing Number"
                  value={row.routingNumber}
                  onChange={(e) => handleChange(row.id, "routingNumber", e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Account Name"
                  value={row.accountName}
                  onChange={(e) => handleChange(row.id, "accountName", e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Phone Number"  
                  value={row.phoneNumber}
                  onChange={(e) => handleChange(row.id, "phoneNumber", e.target.value
                  )}
                  fullWidth
                />
                <Checkbox {...label} 
                  checked={row.primary}
                  onChange={(e) => handleChange(row.id, "primary", e.target.checked.toString())}
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

export default BankData;
