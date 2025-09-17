import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Autocomplete,
  Alert,
  Snackbar,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  countryList,
  stateList,
  type TaxInformationDto,
} from "../../Models/VendorModel";
//import TaxInformation from "../Vendor/TaxInformation";
//import BankData from "../Vendor/BankData";
import {
  useLanguages,
  usePostVendorForm,
  usePutVendorForm,
  useSalesStatus,
} from "../../api/ApiQueries";
import { useQueryClient } from "@tanstack/react-query";
import {
  useForm,
  FormProvider,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  VendorFormSchema,
  type VendorFormType,
} from "./VendorFormSchema";
import TaxInformationV2 from "./TaxInformationV2";
import BankDataV2 from "./BankDataV2";

interface VendorFormPageProps {
  onCancel?: () => void;
  initialData?: VendorFormType | null;
  mode?: "add" | "edit";
  vendorId?: number;
}

const VendorFormV2: React.FC<VendorFormPageProps> = ({
  onCancel,
  initialData = null,
  mode = "add",
  vendorId = 0,
}) => {
  const queryClient = useQueryClient();
  
  // Helper function to validate and filter numeric input
  const handleNumericInput = (
    e: React.ChangeEvent<HTMLInputElement>, 
    allowedChars: RegExp, 
    fieldName: string,
    setError: any
  ) => {
    const value = e.target.value;
    
    if (value && !allowedChars.test(value)) {
      // Instead of modifying the input directly, let React-Hook-Form handle it
      // Set a manual error for immediate feedback
      setError(fieldName, {
        type: "manual",
        message: "Invalid characters detected"
      });
      
      // Remove the last character that was invalid
      e.target.value = value.slice(0, -1);
    }
  };

  const initialTaxInformationRows: TaxInformationDto[] = [
    { id: Date.now(), countryId: null, category: "", name: "", taxNumber: "" },
  ];

  const initialBankRows = [
    {
      id: Date.now(),
      bankName: "",
      accountNumber: "",
      primary: false,
      routingNumber: "",
      accountName: "",
      phoneNumber: "",
    }
  ];
 
  // Fix the defaultValues issue by using a type assertion
  const defaultValues = (initialData ? initialData : {
    vendorId: 0,
    companyName1: "",
    companyName2: "",
    dba: "",
    keyWord: "",
    houseNumber: "",
    streetName: "",
    buildingName: "",
    landmark: "",
    countryId: null,
    stateId: null,
    zipCode: "",
    digiPin: "",
    mapsUrl: "",
    languageId: null,
    phoneNumber1: "",
    phoneNumber2: "",
    phoneNumber3: "",
    fax: "",
    email1: "",
    email2: "",
    email3: "",
    comments: "",
    salesStatusId: null,
    paymentId: null,
    taxInformationDto: initialTaxInformationRows,
    bankDetailDto: initialBankRows
  }) as VendorFormType;

  const methods = useForm<VendorFormType>({
    resolver: zodResolver(VendorFormSchema) as any,
    defaultValues,
    mode: "onTouched",
  });

  const { control, handleSubmit, reset, watch, formState, setError } = methods;
  const { errors, isSubmitting } = formState;

  const selectedCountryId = watch("countryId");
  const filteredStates = stateList.filter((s) => s.countryId === selectedCountryId);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [backdropOpen, setBackdropOpen] = useState(false);

  const { data: salesStatuses = [] } = useSalesStatus();
  const { data: languages = [] } = useLanguages();

  const { mutate: updateMutate } = usePutVendorForm();
  const { mutate } = usePostVendorForm();

  // Helper function to validate all numeric fields
  const validateNumericFields = (data: VendorFormType) => {
    let hasError = false;

    // Validate zip code
    if (data.zipCode && !/^[0-9-\s]+$/.test(data.zipCode)) {
      setError("zipCode", {
        type: "manual",
        message: "Zip Code must contain only digits, hyphens, and spaces"
      });
      hasError = true;
    }

    // Validate digi pin
    if (data.digiPin && !/^[0-9]*$/.test(data.digiPin)) {
      setError("digiPin", {
        type: "manual",
        message: "Digi Pin must contain only digits"
      });
      hasError = true;
    }

    // Validate phone numbers
    if (data.phoneNumber1 && !/^[0-9+\-()\s]+$/.test(data.phoneNumber1)) {
      setError("phoneNumber1", {
        type: "manual",
        message: "Phone Number must contain only digits and symbols like +, -, (, )"
      });
      hasError = true;
    }

    // Validate bank account details
    data.bankDetailDto.forEach((bank, index) => {
      if (bank.accountNumber && !/^[0-9]+$/.test(bank.accountNumber)) {
        setError(`bankDetailDto.${index}.accountNumber`, {
          type: "manual",
          message: "Account Number must contain only digits"
        });
        hasError = true;
      }
      
      if (bank.routingNumber && !/^[0-9]*$/.test(bank.routingNumber)) {
        setError(`bankDetailDto.${index}.routingNumber`, {
          type: "manual",
          message: "Routing Number must contain only digits"
        });
        hasError = true;
      }
    });

    // Validate tax information
    data.taxInformationDto.forEach((tax, index) => {
      if (tax.taxNumber && !/^[0-9a-zA-Z\-]*$/.test(tax.taxNumber)) {
        setError(`taxInformationDto.${index}.taxNumber`, {
          type: "manual",
          message: "Tax Number must contain only alphanumeric characters and hyphens"
        });
        hasError = true;
      }
    });

    return !hasError; // Return true if all validations pass
  };

  const onSubmit = (data: VendorFormType) => {
    // Run additional validations before submitting
    if (!validateNumericFields(data)) {
      setSnackbarMessage("Please correct validation errors before submitting");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    
    setBackdropOpen(true);
    // Ensure all string fields are not null/undefined
    const submitData = {
      ...data,
      dba: data.dba ?? "",
      buildingName: data.buildingName ?? "",
      landmark: data.landmark ?? "",
      comments: data.comments ?? "",
      companyName1: data.companyName1 ?? "",
      companyName2: data.companyName2 ?? "",
      keyWord: data.keyWord ?? "",
      houseNumber: data.houseNumber ?? "",
      streetName: data.streetName ?? "",
      zipCode: data.zipCode ?? "",
      digiPin: data.digiPin ?? "",
      mapsUrl: data.mapsUrl ?? "",
      phoneNumber1: data.phoneNumber1 ?? "",
      phoneNumber2: data.phoneNumber2 ?? "",
      phoneNumber3: data.phoneNumber3 ?? "",
      paymentId: data.paymentId ?? null,
      fax: data.fax ?? "",
      email1: data.email1 ?? "",
      email2: data.email2 ?? "",
      email3: data.email3 ?? "",
      taxInformationDto: (data.taxInformationDto || []).map(row => ({
        ...row,
        countryId: row.countryId ?? 0,
        category: row.category ?? "",
        taxNumber: row.taxNumber ?? "",
        name: row.name ?? "",
      })),
      bankDetailsDto : (data.bankDetailDto || []).map(row => ({
        ...row,
        bankName: row.bankName ?? "",
        accountNumber: row.accountNumber ?? "", 
        routingNumber: row.routingNumber ?? "",
        accountName: row.accountName ?? "",
        phoneNumber: row.phoneNumber ?? "",
        primary: row.primary ?? false,
      })),
      // Add other fields as needed
    };
    if (mode === "edit" && vendorId) {
      updateMutate(
        { id: vendorId, data: submitData },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["GetVendorFormById", vendorId] });
            setSnackbarMessage("Vendor Form updated successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            if (onCancel) onCancel();
          },
          onError: (error: any) => {
            setSnackbarMessage(`Failed to update: ${error?.message ?? "Unknown error"}`);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
          },
          onSettled: () => setBackdropOpen(false),
        }
      );
    } else {
      mutate(submitData, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["readVendorForm"] });
          setSnackbarMessage("Vendor submitted successfully!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          reset(defaultValues);
          if (onCancel) onCancel();
        },
        onError: (error: any) => {
          setSnackbarMessage(`Failed to submit: ${error?.message ?? "Unknown error"}`);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        },
        onSettled: () => setBackdropOpen(false),
      });
    }
  };

  return (
    <Box sx={{ maxWidth: "100%", width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">
          {mode === "add" ? "Add Vendor" : "Edit Vendor"}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={onCancel}
          size="small"
          sx={{ borderRadius: "8px", minWidth: "100px" }}
        >
          Back
        </Button>
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* ---------------- NAME ---------------- */}
            <Grid size={{ xs:12}}>
              <Typography variant="body1" gutterBottom>
                Name
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Controller
                name="companyName1"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Company Name 1"
                    error={!!errors.companyName1}
                    helperText={errors.companyName1?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Controller
                name="companyName2"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Company Name 2"
                    error={!!errors.companyName2}
                    helperText={errors.companyName2?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Controller
                name="dba"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="DBA (Doing Business As)"
                    error={!!errors.dba}
                    helperText={errors.dba?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Controller
                name="keyWord"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Keyword"
                    error={!!errors.keyWord}
                    helperText={errors.keyWord?.message}
                  />
                )}
              />
            </Grid>

            {/* ---------------- ADDRESS ---------------- */}
            <Grid size={{ xs: 12}}>
              <Typography variant="body1" gutterBottom>
                Address
              </Typography>
            </Grid>
             <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Controller
                name="houseNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="House Number"
                    error={!!errors.houseNumber}
                    helperText={errors.houseNumber?.message}
                    inputProps={{ 
                      pattern: "[0-9a-zA-Z\\-/\s]+",
                      title: "House Number can contain only alphanumeric characters, hyphens, and slashes"
                    }}
                  />
                )}
              />
            </Grid>
             <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Controller
                name="streetName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Street Name"
                    error={!!errors.streetName}
                    helperText={errors.streetName?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Controller
                name="buildingName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Building Name"
                    error={!!errors.buildingName}
                    helperText={errors.buildingName?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Controller
                name="landmark"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="landmark"
                    error={!!errors.landmark}
                    helperText={errors.landmark?.message}
                  />
                )}
              />
            </Grid>
              {/* Country */}
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Controller
                name="countryId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={countryList}
                    value={
                      countryList.find((c) => c.id === field.value) || null
                    }
                    getOptionLabel={(option) => option.name}
                    onChange={(_, newValue) =>
                      field.onChange(newValue ? newValue.id : null)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Country"
                        size="small"
                        error={!!errors.countryId}
                        helperText={errors.countryId?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            {/* State */}
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Controller
                name="stateId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={filteredStates}
                    value={
                      filteredStates.find((s) => s.id === field.value) || null
                    }
                    getOptionLabel={(option) => option.name}
                    onChange={(_, newValue) =>
                      field.onChange(newValue ? newValue.id : null)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="State"
                        size="small"
                        error={!!errors.stateId}
                        helperText={errors.stateId?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
             <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Controller
                name="zipCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Zip Code"
                    error={!!errors.zipCode}
                    helperText={errors.zipCode?.message}
                    inputProps={{ 
                      pattern: "[0-9-\\s]+",
                      title: "Zip Code must contain only digits, hyphens, and spaces"
                    }}
                    onChange={(e) => {
                      field.onChange(e);
                      handleNumericInput(
                        e as React.ChangeEvent<HTMLInputElement>, 
                        /^[0-9\-\s]*$/, 
                        "zipCode",
                        setError
                      );
                    }}
                    onBlur={() => {
                      // Validate on blur as well for better UX
                      const value = field.value;
                      if (value && !/^[0-9\-\s]+$/.test(value)) {
                        setError("zipCode", {
                          type: "manual",
                          message: "Zip Code must contain only digits, hyphens, and spaces"
                        });
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Controller
                name="digiPin"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Digi Pin"
                    error={!!errors.digiPin}
                    helperText={errors.digiPin?.message}
                    inputProps={{ 
                      pattern: "[0-9]*",
                      title: "Digi Pin must contain only digits"
                    }}
                    onChange={(e) => {
                      field.onChange(e);
                      handleNumericInput(
                        e as React.ChangeEvent<HTMLInputElement>, 
                        /^[0-9]*$/,
                        "digiPin",
                        setError
                      );
                    }}
                    onBlur={() => {
                      // Validate on blur for better UX
                      const value = field.value;
                      if (value && !/^[0-9]*$/.test(value)) {
                        setError("digiPin", {
                          type: "manual",
                          message: "Digi Pin must contain only digits"
                        });
                      }
                    }}
                  />
                )}
              />
            </Grid>
             <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Controller
                name="mapsUrl"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Maps URL"
                    error={!!errors.mapsUrl}
                    helperText={errors.mapsUrl?.message}
                  />
                )}
              />
            </Grid>
            {/* ---------------- COMMUNICATION ---------------- */}
            <Grid size={{ xs: 12}}>
              <Typography variant="body1" gutterBottom>
                Communication
              </Typography>
            </Grid>

            {/* Language */}
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Controller
                name="languageId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={languages}
                    value={
                      languages.find((l) => l.languageId === field.value) || null
                    }
                    getOptionLabel={(option) =>
                      `${option.languageDesc} (${option.languageCode})`
                    }
                    onChange={(_, newValue) =>
                      field.onChange(newValue ? newValue.languageId : null)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Language"
                        size="small"
                        error={!!errors.languageId}
                        helperText={errors.languageId?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Controller
                name="phoneNumber1"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Phone Number 1"
                    error={!!errors.phoneNumber1}
                    helperText={errors.phoneNumber1?.message}
                    inputProps={{ 
                      pattern: "[0-9+\\-()\s]+",
                      title: "Phone Number must contain only digits and symbols like +, -, (, )"
                    }}
                    onChange={(e) => {
                      field.onChange(e);
                      handleNumericInput(
                        e as React.ChangeEvent<HTMLInputElement>, 
                        /^[0-9+\-()\s]*$/,
                        "phoneNumber1",
                        setError
                      );
                    }}
                    onBlur={() => {
                      // Validate on blur for better UX
                      const value = field.value;
                      if (value && !/^[0-9+\-()\s]+$/.test(value)) {
                        setError("phoneNumber1", {
                          type: "manual",
                          message: "Phone Number must contain only digits and symbols like +, -, (, )"
                        });
                      }
                    }}
                  />
                )}
              />
            </Grid>
             <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Controller
                name="phoneNumber2"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Phone Number 2"
                    error={!!errors.phoneNumber2}
                    helperText={errors.phoneNumber2?.message}
                    inputProps={{ 
                      pattern: "[0-9+\\-()\s]*",
                      title: "Phone Number must contain only digits and symbols like +, -, (, )"
                    }}
                    onChange={(e) => {
                      field.onChange(e);
                      handleNumericInput(
                        e as React.ChangeEvent<HTMLInputElement>, 
                        /^[0-9+\-()\s]*$/,
                        "phoneNumber2",
                        setError
                      );
                    }}
                  />
                )}
              />
            </Grid>
             <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Controller
                name="phoneNumber3"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Phone Number 3"
                    error={!!errors.phoneNumber3}
                    helperText={errors.phoneNumber3?.message}
                    inputProps={{ 
                      pattern: "[0-9+\\-()\s]*",
                      title: "Phone Number must contain only digits and symbols like +, -, (, )"
                    }}
                    onChange={(e) => {
                      field.onChange(e);
                      handleNumericInput(
                        e as React.ChangeEvent<HTMLInputElement>, 
                        /^[0-9+\-()\s]*$/, 
                        "phoneNumber3",
                        setError
                      );
                    }}
                  />
                )}
              />
            </Grid>
             <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Controller
                name="fax"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Fax"
                    error={!!errors.fax}
                    helperText={errors.fax?.message}
                    inputProps={{ 
                      pattern: "[0-9+\\-()\s]*",
                      title: "Fax number must contain only digits and symbols like +, -, (, )"
                    }}
                    onChange={(e) => {
                      field.onChange(e);
                      handleNumericInput(
                        e as React.ChangeEvent<HTMLInputElement>, 
                        /^[0-9+\-()\s]*$/, 
                        "fax",
                        setError
                      );
                    }}
                  />
                )}
              />
            </Grid>
             <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Controller
                name="email1"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Email 1"
                    error={!!errors.email1}
                    helperText={errors.email1?.message}
                  />
                )}
              />
            </Grid>
             <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
             <Controller
                name="email2"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Email 2"
                    error={!!errors.email2}
                    helperText={errors.email2?.message}
                  />
                )}
              />
            </Grid>
             <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
             <Controller
                name="email3"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Email 3"
                    error={!!errors.email3}
                    helperText={errors.email3?.message}
                  />
                )}
              />
            </Grid>
           

            {/* ---------------- TAX & BANK ---------------- */}
            <Grid size={{ xs: 12}}>
              <Typography variant="body1" gutterBottom>
                Tax Information
              </Typography>
              <TaxInformationV2 maxRows={5} />
              {/* <TaxInformation
                initialRows={watch("taxInformationDto")}
                maxRows={5}
                onChange={(rows) => setValue("taxInformationDto", rows)}
              /> */}
            </Grid>

            <Grid size={{ xs: 12}}>
              <Typography variant="body1" gutterBottom>
                Bank Details
              </Typography>
              <BankDataV2 maxRows={5} />
              {/* <BankData
                initialRows={watch("bankDetailDto")}
                maxRows={5}
                onChange={(rows) => setValue("bankDetailDto", rows)}
              /> */}
            </Grid>

            {/* ---------------- MISC ---------------- */}
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Controller
                name="comments"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Comments"
                    error={!!errors.comments}
                    helperText={errors.comments?.message}
                  />
                )}
              />
            </Grid>

            {/* Sales Status */}
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Controller
                name="salesStatusId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={salesStatuses}
                    value={
                      salesStatuses.find((s) => s.salesStatusId === field.value) ||
                      null
                    }
                    getOptionLabel={(option) =>
                      `${option.salesStatusDesc} (${option.salesStatusCode})`
                    }
                    onChange={(_, newValue) =>
                      field.onChange(newValue ? newValue.salesStatusId : null)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Status"
                        size="small"
                        error={!!errors.salesStatusId}
                        helperText={errors.salesStatusId?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            {/* Payment Terms */}
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <Controller
                name="paymentId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Payment Terms"
                    error={!!errors.paymentId}
                    helperText={errors.paymentId?.message}
                  />
                )}
              />
            </Grid>

            {/* ---------------- BUTTONS ---------------- */}
            <Grid size={{ xs: 12 }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
                size="small"
                sx={{ borderRadius: "8px", minWidth: "100px" }}
              >
                {isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : mode === "add" ? (
                  "Submit"
                ) : (
                  "Update"
                )}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => reset(defaultValues)}
                disabled={isSubmitting}
                size="small"
                sx={{ ml: 2, borderRadius: "8px", minWidth: "100px" }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>

          {/* Backdrop Loader */}
          <Backdrop
            open={backdropOpen}
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          >
            <CircularProgress color="inherit" />
          </Backdrop>

          {/* Snackbar */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              variant="filled"
              onClose={() => setSnackbarOpen(false)}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </form>
      </FormProvider>
    </Box>
  );
};

export default VendorFormV2;
