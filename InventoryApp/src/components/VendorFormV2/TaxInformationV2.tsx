// src/components/Vendor/TaxInformationV2.tsx
import React from "react";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { TextField, Autocomplete, IconButton, Stack } from "@mui/material";
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
    setError(`taxInformationDto.${index}.${fieldName}`, {
      type: "manual",
      message: "Invalid characters detected"
    });
    
    // Remove the last character that was invalid
    e.target.value = value.slice(0, -1);
  }
};

// If you already export countryList from Models/VendorModel you can import it instead.
// For demo/compatibility I'll put a small list here — swap with your countryList import if present.
const countryList = [
  { id: 1, name: "United States" },
  { id: 2, name: "Canada" },
  { id: 3, name: "India" },
];

interface Props {
  maxRows?: number;
}

const TaxInformationV2: React.FC<Props> = ({ maxRows = 5 }) => {
  const { control, formState, setError } = useFormContext<VendorFormType>();
  const { errors } = formState;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "taxInformationDto",
  });

  return (
    <Stack spacing={2}>
      {fields.map((row, index) => (
        <Grid container spacing={2} key={row.id}>
          <Grid size={{xs:12, sm:4}}>
            <Controller
              name={`taxInformationDto.${index}.countryId`}
              control={control}
              render={({ field }) => {
                const selected = countryList.find((c) => c.id === field.value) ?? null;
                return (
                  <Autocomplete
                    disablePortal
                    options={countryList}
                    value={selected}
                    getOptionLabel={(o) => o.name}
                    onChange={(_, nv) => field.onChange(nv ? nv.id : null)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Country"
                        size="small"
                        error={!!errors?.taxInformationDto?.[index]?.countryId}
                        helperText={errors?.taxInformationDto?.[index]?.countryId?.message as any}
                        fullWidth
                      />
                    )}
                  />
                );
              }}
            />
          </Grid>

          <Grid size={{xs:12, sm:4}}>
            <Controller
              name={`taxInformationDto.${index}.category`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Category"
                  size="small"
                  fullWidth
                  error={!!errors?.taxInformationDto?.[index]?.category}
                  helperText={errors?.taxInformationDto?.[index]?.category?.message as any}
                />
              )}
            />
          </Grid>

          <Grid size={{xs:12, sm:4}}>
            <Controller
              name={`taxInformationDto.${index}.name`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  size="small"
                  fullWidth
                  error={!!errors?.taxInformationDto?.[index]?.name}
                  helperText={errors?.taxInformationDto?.[index]?.name?.message as any}
                />
              )}
            />
          </Grid>

          <Grid size={{xs:12, sm:4}}>
            <Controller
              name={`taxInformationDto.${index}.taxNumber`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tax Number"
                  size="small"
                  fullWidth
                  error={!!errors?.taxInformationDto?.[index]?.taxNumber}
                  helperText={errors?.taxInformationDto?.[index]?.taxNumber?.message as any}
                  inputProps={{ 
                    pattern: "[0-9a-zA-Z\\-]*",
                    title: "Tax Number must contain only alphanumeric characters and hyphens"
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    handleNumericInput(
                      e as React.ChangeEvent<HTMLInputElement>, 
                      /^[0-9a-zA-Z\-]*$/,
                      "taxNumber",
                      index,
                      setError
                    );
                  }}
                  onBlur={() => {
                    // Validate on blur for better UX
                    const value = field.value;
                    if (value && !/^[0-9a-zA-Z\-]*$/.test(value)) {
                      setError(`taxInformationDto.${index}.taxNumber`, {
                        type: "manual",
                        message: "Tax Number must contain only alphanumeric characters and hyphens"
                      });
                    }
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={{xs:12, sm:4}}>
            <IconButton
              size="small"
              color="primary"
              onClick={() =>
                fields.length < maxRows &&
                append({ id: Date.now(), countryId: null, category: "", name: "", taxNumber: "" })
              }
              disabled={fields.length >= maxRows}
              sx={{
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "primary.main",
                mr: 1,
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
          </Grid>
        </Grid>
      ))}
    </Stack>
  );
};

export default TaxInformationV2;
