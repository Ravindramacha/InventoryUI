import React, { useState, useEffect } from "react";
import {
  Stack,
  TextField,
  IconButton,
  Autocomplete,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import type { UomData, UomModel } from "../../Models/MaterialModel";



interface UOMComponentProps {
  initialRows?: UomData[];
  maxRows?: number;
  onChange?: (rows: UomData[]) => void;
  uomOptions: UomModel[]
}

const UOMComponent: React.FC<UOMComponentProps> = ({
  initialRows = [{ id: Date.now(), uom: null, quantity: "", primaryQty: "", length: null, width: null, height: null, netWeight: null, grossWeight: null, volume: null , lengthUom: "", weightUom: "", volumeUom: "" }],
  maxRows = 5,
  onChange,
  uomOptions,
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
            [field]: value,
          }
        : row 
    );
    setRows(updated);
  };

  const handleAddRow = (index: number) => {
    if (rows.length < maxRows) {
      const newRow: UomData = {
        id: Date.now(),
        uom: null,
        quantity: "",
        primaryQty: "",
        length: null,
        width: null, 
        height: null,
        lengthUom: "",
        netWeight: null,
        grossWeight: null,
        weightUom: "",
        volume: null,
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
              <Stack spacing={2} key={row.id}>
                <Grid container spacing={2}>
                  <Grid size={{xs:12, sm:6, md:3, lg:3}}>
                    <Autocomplete
                      fullWidth
                      disablePortal
                      options={uomOptions}
                      getOptionLabel={(option) => `${option.uomDesc} (${option.uomCode})` || ''}
                      isOptionEqualToValue={(option, value) => option.uomId === value.uomId}
                      onChange={(_, newValue) => handleChange(row.id, "uom", newValue?.uomId?.toString() || "")}
                      size="small"
                      renderInput={(params) => <TextField {...params} label="UOM" required size="small"/>}
                    />
                  </Grid>
                  <Grid size={{xs:12, sm:6, md:3, lg:3}}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Qty"
                      value={row.quantity}
                      onChange={(e) => handleChange(row.id, "quantity", e.target.value)}
                    />
                  </Grid>
                  <Grid size={{xs:12, sm:6, md:3, lg:3}}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Primary Qty"
                      value={row.primaryQty}
                      onChange={(e) => handleChange(row.id, "primaryQty", e.target.value)}
                    />
                  </Grid>
                  <Grid size={{xs:12, sm:6, md:3, lg:3}}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Length"
                      value={row.length}
                      onChange={(e) => handleChange(row.id, "length", e.target.value)}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid size={{xs:12, sm:6, md:3, lg:3}}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Width"
                      value={row.width}
                      onChange={(e) => handleChange(row.id, "width", e.target.value)}
                    />
                  </Grid>
                  <Grid size={{xs:12, sm:6, md:3, lg:3}}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Height"
                      value={row.height}
                      onChange={(e) => handleChange(row.id, "height", e.target.value)}
                    />
                  </Grid>
                  <Grid size={{xs:12, sm:6, md:3, lg:3}}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Length UOM"
                      value={row.lengthUom}
                      onChange={(e) => handleChange(row.id, "lengthUom", e.target.value)}
                    />
                  </Grid>
                  <Grid size={{xs:12, sm:6, md:3, lg:3}}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Net Weight"
                      value={row.netWeight}
                      onChange={(e) => handleChange(row.id, "netWeight", e.target.value)}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid size={{xs:12, sm:6, md:3, lg:3}}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Gross Weight"
                      value={row.grossWeight}
                      onChange={(e) => handleChange(row.id, "grossWeight", e.target.value)}
                    />
                  </Grid>
                  <Grid size={{xs:12, sm:6, md:3, lg:3}}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Weight UOM"
                      value={row.weightUom}
                      onChange={(e) => handleChange(row.id, "weightUom", e.target.value)}
                    />
                  </Grid>
                  <Grid size={{xs:12, sm:6, md:3, lg:3}}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Volume"
                      value={row.volume}
                      onChange={(e) => handleChange(row.id, "volume", e.target.value)}
                    />
                  </Grid>
                  <Grid size={{xs:12, sm:6, md:3, lg:3}}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Volume UOM"
                      value={row.volumeUom}
                      onChange={(e) => handleChange(row.id, "volumeUom", e.target.value)}
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
              {/* </Stack> */}
              </Grid>
              </Grid>
              </Stack>
            ))}
          </Stack>

  );
};

export default UOMComponent;
