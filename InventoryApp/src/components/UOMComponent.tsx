import React, { useState, useEffect } from "react";
import {
  Stack,
  TextField,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import type { UomData } from "../Models/MaterialModel";



interface UOMComponentProps {
  initialRows?: UomData[];
  maxRows?: number;
  onChange?: (rows: UomData[]) => void;
}

const UOMComponent: React.FC<UOMComponentProps> = ({
  initialRows = [{ id: Date.now(), uom: "", quantity: "", primaryQty: "", length: 0, width: 0, height: 0, netWeight: 0, grossWeight: 0, volume: 0 , lengthUom: "", weightUom: "", volumeUom: "" }],
  maxRows = 5,
  onChange,
}) => {
  const [rows, setRows] = useState<UomData[]>(initialRows);

  useEffect(() => {
    onChange?.(rows);
  }, [rows, onChange]);

  const handleChange = (
    id: number,
    field: keyof UomData,
    value: string
  ) => {
    const updated = rows.map((row) =>
      row.id === id
        ? {
            ...row,
            [field]: field === "uom" ? value : Number(value),
          }
        : row
    );
    setRows(updated);
  };

  const handleAddRow = (index: number) => {
    if (rows.length < maxRows) {
      const newRow: UomData = {
        id: Date.now(),
        uom: "",
        quantity: "",
        primaryQty: "",
        length: 0,
        width: 0, 
        height: 0,
        lengthUom: "",
        netWeight: 0,
        grossWeight: 0,
        weightUom: "",
        volume: 0,
        volumeUom: "",
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
                label="UOM"
                value={row.uom}
                onChange={(e) => handleChange(row.id, "uom", e.target.value)}
                />
                 <TextField
                label="Qty"
                value={row.quantity}
                onChange={(e) => handleChange(row.id, "quantity", e.target.value)}
                />
                 <TextField
                label="Primary Qty"
                value={row.primaryQty}
                onChange={(e) => handleChange(row.id, "primaryQty", e.target.value)}
                />
                 <TextField
                label="Length"
                value={row.length}
                onChange={(e) => handleChange(row.id, "length", e.target.value)}
                />
                 <TextField
                label="Width"
                value={row.width}
                onChange={(e) => handleChange(row.id, "width", e.target.value)}
                />
                 <TextField
                label="Height"
                value={row.height}
                onChange={(e) => handleChange(row.id, "height", e.target.value)}
                />
                 <TextField
                label="Length UOM"
                value={row.lengthUom}
                onChange={(e) => handleChange(row.id, "lengthUom", e.target.value)}
                />
                  <TextField
                label="Net Weight"
                value={row.netWeight}
                onChange={(e) => handleChange(row.id, "netWeight", e.target.value)}
                />
                 <TextField
                label="Gross Weight"
                value={row.grossWeight}
                onChange={(e) => handleChange(row.id, "grossWeight", e.target.value)}
                />
               
                 <TextField
                label="weight UOM"
                value={row.weightUom}
                onChange={(e) => handleChange(row.id, "weightUom", e.target.value)}
                />
               <TextField
                  label="Volume"
                  value={row.volume}
                  onChange={(e) =>
                    handleChange(row.id, "volume", e.target.value)
                  }
                />
            <TextField
              label="Volume UOM"
              value={row.volumeUom}
              onChange={(e) =>
                handleChange(row.id, "volumeUom", e.target.value)
              }
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

export default UOMComponent;
