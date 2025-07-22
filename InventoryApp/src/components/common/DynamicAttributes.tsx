import React, { useState } from "react";
import {
  TextField,
  Stack,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ConfirmDialog from "./ConfirmDialog";

interface Attribute {
  id: number;
  name: string;
  label: string;
  value: string;
}

interface DynamicAttributesProps {
  maxFields?: number;
  onChange: (fields: Attribute[]) => void;
}

const DynamicAttributes: React.FC<DynamicAttributesProps> = ({
  maxFields = 5,
  onChange,
}) => {
  const [attributes, setAttributes] = useState<Attribute[]>([
    { id: 1, name: "Attribute1", label: "Attribute 1", value: "" },
  ]);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    fieldId: null as number | null,
  });

  const updateParent = (updated: Attribute[]) => {
    setAttributes(updated);
    onChange(updated);
  };

  const handleAddField = (index: number) => {
    if (attributes.length < maxFields) {
      const nextIndex = attributes.length + 1;
      const newField: Attribute = {
        id: Date.now(),
        name: `Attribute${nextIndex}`,
        label: `Attribute ${nextIndex}`,
        value: "",
      };
      const updated = [
        ...attributes.slice(0, index + 1),
        newField,
        ...attributes.slice(index + 1),
      ];
      updateParent(updated);
    }
  };

  const handleRequestDelete = (id: number) => {
    setConfirmDialog({ open: true, fieldId: id });
  };

  const handleConfirmDelete = () => {
    if (confirmDialog.fieldId !== null) {
      const updated = attributes
        .filter((attr) => attr.id !== confirmDialog.fieldId)
        .map((attr, idx) => ({
          ...attr,
          name: `Attribute${idx + 1}`,
          label: `Attribute ${idx + 1}`,
        }));
      updateParent(updated);
    }
    setConfirmDialog({ open: false, fieldId: null });
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ open: false, fieldId: null });
  };

  const handleFieldChange = (id: number, newValue: string) => {
    const updated = attributes.map((attr) =>
      attr.id === id ? { ...attr, value: newValue } : attr
    );
    updateParent(updated);
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
            <TextField
              label={attr.label}
              value={attr.value}
              onChange={(e) => handleFieldChange(attr.id, e.target.value)}
              fullWidth
            />
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

      {/* Reusable Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title="Delete Attribute"
        message="Are you sure you want to delete this attribute?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default DynamicAttributes;
