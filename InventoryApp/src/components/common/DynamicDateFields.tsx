import React, { useState } from "react";
import {
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Dayjs } from "dayjs";

interface DateField {
  id: number;
  label: string;
  value: Dayjs | null;
}

interface DynamicDateFieldsProps {
  maxFields?: number;
  onChange?: (fields: DateField[]) => void;
}

const DynamicDateFields: React.FC<DynamicDateFieldsProps> = ({
  maxFields = 5,
  onChange,
}) => {
  const [dateFields, setDateFields] = useState<DateField[]>([
    { id: 1, label: "Date 1", value: null },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(null);

  const handleAddField = () => {
    if (dateFields.length < maxFields) {
      const nextIndex = dateFields.length + 1;
      const newField: DateField = {
        id: Date.now(),
        label: `Date ${nextIndex}`,
        value: null,
      };
      setDateFields([...dateFields, newField]);
      onChange?.([...dateFields, newField]);
    }
  };

  const handleRequestDelete = (id: number) => {
    setSelectedFieldId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedFieldId !== null) {
      const updatedFields = dateFields
        .filter((field) => field.id !== selectedFieldId)
        .map((field, index) => ({
          ...field,
          label: `Date ${index + 1}`,
        }));
      setDateFields(updatedFields);
      onChange?.(updatedFields);
    }
    setOpenDialog(false);
    setSelectedFieldId(null);
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setSelectedFieldId(null);
  };

  const handleDateChange = (id: number, newValue: Dayjs | null) => {
    const updatedFields = dateFields.map((field) =>
      field.id === id ? { ...field, value: newValue } : field
    );
    setDateFields(updatedFields);
    onChange?.(updatedFields);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2}>
        {dateFields.map((field) => (
          <Stack
            key={field.id}
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <DatePicker
              label={field.label}
              value={field.value}
              onChange={(newValue) => handleDateChange(field.id, newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <IconButton
              color="primary"
              onClick={handleAddField}
              disabled={dateFields.length >= maxFields}
            >
              <AddIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => handleRequestDelete(field.id)}
              disabled={dateFields.length === 1}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        ))}
      </Stack>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this date field?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default DynamicDateFields;
