// src/components/Vendor/BankDataV2.tsx
import React from "react";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { Stack, TextField, IconButton, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import type { VendorFormType } from "./VendorFormSchema";

// Helper function to validate and filter numeric input
const handleNumericInput = (
  e: React.ChangeEvent<HTMLInputElement>, 
  allowedChars: RegExp, 
  fieldName: string,
  index: number,
  setError: any
) => {
  const value = e.target.value;
  
  if (value && !allowedChars.test(value)) {
    // Set a manual error for immediate feedback
    setError(`bankDetailDto.${index}.${fieldName}`, {
      type: "manual",
      message: "Invalid characters detected"
    });
    
    // Remove the last character that was invalid
    e.target.value = value.slice(0, -1);
  }
};

interface Props {
  maxRows?: number;
}

const BankDataV2: React.FC<Props> = ({ maxRows = 5 }) => {
  const { control, formState, setError } = useFormContext<VendorFormType>();
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
                inputProps={{ 
                  pattern: "[0-9]+",
                  title: "Account Number must contain only digits"
                }}
                onChange={(e) => {
                  field.onChange(e);
                  handleNumericInput(
                    e as React.ChangeEvent<HTMLInputElement>, 
                    /^[0-9]*$/, 
                    "accountNumber",
                    index,
                    setError
                  );
                }}
                onBlur={() => {
                  // Validate on blur for better UX
                  const value = field.value;
                  if (value && !/^[0-9]+$/.test(value)) {
                    setError(`bankDetailDto.${index}.accountNumber`, {
                      type: "manual",
                      message: "Account Number must contain only digits"
                    });
                  }
                }}
              />
            )}
          />
        </Grid>
        <Grid size={{xs:12, sm:4}}>
          <Controller
            name={`bankDetailDto.${index}.routingNumber`}
            control={control}
            render={({ field }) => (
              <TextField 
                {...field} 
                size="small" 
                label="Routing Number" 
                fullWidth
                error={!!errors?.bankDetailDto?.[index]?.routingNumber}
                helperText={errors?.bankDetailDto?.[index]?.routingNumber?.message as any}
                inputProps={{ 
                  pattern: "[0-9]*",
                  title: "Routing Number must contain only digits"
                }}
                onChange={(e) => {
                  field.onChange(e);
                  handleNumericInput(
                    e as React.ChangeEvent<HTMLInputElement>, 
                    /^[0-9]*$/,
                    "routingNumber",
                    index,
                    setError
                  );
                }}
                onBlur={() => {
                  // Validate on blur for better UX
                  const value = field.value;
                  if (value && !/^[0-9]*$/.test(value)) {
                    setError(`bankDetailDto.${index}.routingNumber`, {
                      type: "manual",
                      message: "Routing Number must contain only digits"
                    });
                  }
                }}
              />
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
            render={({ field }) => (
              <TextField 
                {...field} 
                size="small" 
                label="Phone Number" 
                fullWidth
                error={!!errors?.bankDetailDto?.[index]?.phoneNumber}
                helperText={errors?.bankDetailDto?.[index]?.phoneNumber?.message as any}
                inputProps={{ 
                  pattern: "[0-9+\\-()\s]*",
                  title: "Phone Number must contain only digits and symbols like +, -, (, )"
                }}
                onChange={(e) => {
                  field.onChange(e);
                  handleNumericInput(
                    e as React.ChangeEvent<HTMLInputElement>, 
                    /^[0-9+\-()\s]*$/,
                    "phoneNumber",
                    index,
                    setError
                  );
                }}
                onBlur={() => {
                  // Validate on blur for better UX
                  const value = field.value;
                  if (value && !/^[0-9+\-()\s]*$/.test(value)) {
                    setError(`bankDetailDto.${index}.phoneNumber`, {
                      type: "manual",
                      message: "Phone Number must contain only digits and symbols like +, -, (, )"
                    });
                  }
                }}
              />
            )}
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
