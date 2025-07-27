import React, { useState, useEffect } from "react";
import {
  Stack,
  IconButton,
  TextField,
  Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ConfirmDialog from "./ConfirmDialog";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

type FieldType = "text" | "number" | "dropdown" | "date";

export interface Attribute {
  id: number;
  name: string;
  label: string;
  type: FieldType;
  value: string | Dayjs | null;
  options?: string[]; // For dropdowns only
}

interface DynamicFieldProps {
  attributes: Attribute[]; // <-- Passed in
  maxFields?: number;
  onChange: (fields: Attribute[]) => void;
}

const DynamicField: React.FC<DynamicFieldProps> = ({
  attributes: initialAttributes,
  maxFields = 5,
  onChange,
}) => {
  const [attributes, setAttributes] = useState<Attribute[]>(initialAttributes);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    fieldId: null as number | null,
  });

  // Keep local state in sync with prop
  useEffect(() => {
    setAttributes(initialAttributes);
  }, [initialAttributes]);

  const updateParent = (updated: Attribute[]) => {
    setAttributes(updated);
    onChange?.(updated);
  };

 const handleAddField = (index: number) => {
  if (attributes.length < maxFields) {
    const baseName = attributes[0].name.replace(/\s*\d+$/, "") || "Attribute";
    const baseLabel = attributes[0].label.replace(/\s*\d+$/, "") || "Attribute";

    const newField: Attribute = {
      id: Date.now(),
      name: `${baseName} ${attributes.length + 1}`,
      label: `${baseLabel} ${attributes.length + 1}`,
      type: attributes[0].type,
      value: attributes[0].type === "date" ? null : "",
      options: attributes[0].options || [],
    };

    const updated = [
      ...attributes.slice(0, index + 1),
      newField,
      ...attributes.slice(index + 1),
    ];

    // Reindex all fields after adding
    const reindexed = updated.map((attr, idx) => ({
      ...attr,
      name: `${baseName} ${idx + 1}`,
      label: `${baseLabel} ${idx + 1}`,
    }));

    updateParent(reindexed);
  }
};


  const handleRequestDelete = (id: number) => {
    setConfirmDialog({ open: true, fieldId: id });
  };

const handleConfirmDelete = () => {
  if (confirmDialog.fieldId !== null) {
    const baseName = attributes[0].name.replace(/\s*\d+$/, "") || "Attribute";
    const baseLabel = attributes[0].label.replace(/\s*\d+$/, "") || "Attribute";

    const filtered = attributes.filter(
      (attr) => attr.id !== confirmDialog.fieldId
    );

    const reindexed = filtered.map((attr, idx) => ({
      ...attr,
      name: `${baseName} ${idx + 1}`,
      label: `${baseLabel} ${idx + 1}`,
    }));

    updateParent(reindexed);
  }

  setConfirmDialog({ open: false, fieldId: null });
};

  const handleCancelDelete = () => {
    setConfirmDialog({ open: false, fieldId: null });
  };

  const handleFieldChange = (id: number, newValue: string | Dayjs | null) => {
    const updated = attributes.map((attr) =>
      attr.id === id ? { ...attr, value: newValue } : attr
    );
    updateParent(updated);
  };

  const renderFieldInput = (attr: Attribute) => {
    switch (attr.type) {
      case "text":
        return (
          <TextField
            label={attr.label}
            value={attr.value}
            onChange={(e) => handleFieldChange(attr.id, e.target.value)}
            fullWidth
          />
        );
      case "number":
        return (
          <TextField
            label={attr.label}
            type="number"
            value={attr.value}
            onChange={(e) => handleFieldChange(attr.id, e.target.value)}
            fullWidth
          />
        );
      case "dropdown":
        return (
          <Autocomplete
            options={attr.options || []}
            value={attr.value as string || ""}
            onChange={(e, newValue) =>
              handleFieldChange(attr.id, newValue || "")
            }
            renderInput={(params) => (
              <TextField {...params} label={attr.label} fullWidth />
            )}
            fullWidth
            disableClearable
          />
        );
    case "date":
        return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                   label={attr.label}
                   value={attr.value as Dayjs | null}
                   onChange={(newValue) => handleFieldChange(attr.id, newValue)}
                   slotProps={{ textField: { fullWidth: true } }}
                   />
            </LocalizationProvider>
        
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Stack spacing={2}>
        {attributes.map((attr, index) => (
          <Stack
            direction="row"
            spacing={1}
            key={attr.id}
            alignItems="center"
          >
            {renderFieldInput(attr)}

            <IconButton
              color="primary"
              onClick={() => handleAddField(index)}
              disabled={attributes.length >= maxFields}
            >
              <AddIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => handleRequestDelete(attr.id)}
              disabled={attributes.length === 1}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        ))}
      </Stack>

      <ConfirmDialog
        open={confirmDialog.open}
        title="Delete confirmation"
        message="Are you sure you want to delete this field?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default DynamicField;
