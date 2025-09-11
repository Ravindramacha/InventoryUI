// src/components/Vendor/BankDataV2.tsx
import React from "react";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { Stack, TextField, IconButton, Box, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import type { VendorFormType } from "./VendorFormSchema";

interface Props {
  maxRows?: number;
}

const BankDataV2: React.FC<Props> = ({ maxRows = 5 }) => {
  const { control, formState } = useFormContext<VendorFormType>();
  const { errors } = formState;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "bankDetailDto",
  });

  return (
   <Stack spacing={2}>
      {fields.map((row, index) => ( 
         <Grid container spacing={2} key={row.id}>
          <Grid size={{xs:12, sm:4}}>
          <Controller
            name={`bankDetailDto.${index}.bankName`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                size="small"
                label="Bank Name"
                fullWidth
                error={!!errors?.bankDetailDto?.[index]?.bankName}
                helperText={errors?.bankDetailDto?.[index]?.bankName?.message as any}
              />
            )}
          />
        </Grid>
         <Grid size={{xs:12, sm:4}}>
          <Controller
            name={`bankDetailDto.${index}.accountNumber`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                size="small"
                label="Account Number"
                fullWidth
                error={!!errors?.bankDetailDto?.[index]?.accountNumber}
                helperText={errors?.bankDetailDto?.[index]?.accountNumber?.message as any}
              />
            )}
          />
        </Grid>
        <Grid size={{xs:12, sm:4}}>
          <Controller
            name={`bankDetailDto.${index}.routingNumber`}
            control={control}
            render={({ field }) => (
              <TextField {...field} size="small" label="Routing Number" fullWidth />
            )}
          />
          </Grid>
          <Grid size={{xs:12, sm:4}}>

          <Controller
            name={`bankDetailDto.${index}.accountName`}
            control={control}
            render={({ field }) => <TextField {...field} size="small" label="Account Name" fullWidth />}
          />
            </Grid>
            <Grid size={{xs:12, sm:4}}>
          <Controller
            name={`bankDetailDto.${index}.phoneNumber`}
            control={control}
            render={({ field }) => <TextField {...field} size="small" label="Phone Number" fullWidth />}
          />
            </Grid>
          <Box sx={{ display: "flex", alignItems: "center", height: "100%", gap: 1 }}>
            <IconButton
              size="small"
              color="primary"
              onClick={() =>
                fields.length < maxRows &&
                append({
                  id: Date.now(),
                  bankName: "",
                  accountNumber: "",
                  routingNumber: "",
                  accountName: "",
                  phoneNumber: "",
                  primary: false,
                })
              }
              disabled={fields.length >= maxRows}
              sx={{
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "primary.main",
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              color="error"
              onClick={() => fields.length > 1 && remove(index)}
              disabled={fields.length === 1}
              sx={{
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "error.main",
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
       </Grid>
      ))}
  </Stack>
  );
};

export default BankDataV2;
