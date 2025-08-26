import React, { useState, useEffect } from 'react';
import { Stack, TextField, IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { BankModel } from '../../Models/VendorModel';
interface BankDataProps {
  initialRows?: BankModel[];
  maxRows?: number;
  onChange?: (rows: BankModel[]) => void;
}

const BankData: React.FC<BankDataProps> = ({
  initialRows = [
    {
      id: Date.now(),
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      accountName: '',
      phoneNumber: '',
      primary: false,
    },
  ],
  maxRows = 5,
  onChange,
}) => {
  const [rows, setRows] = useState<BankModel[]>(initialRows);

  useEffect(() => {
    onChange?.(rows);
  }, [rows, onChange]);

  const handleChange = (id: number, field: keyof BankModel, value: string) => {
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
        bankName: '',
        accountNumber: '',
        routingNumber: '',
        accountName: '',
        phoneNumber: '',
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

  return (
    <Stack spacing={2}>
      {rows.map((row, index) => (
        <Box
          key={row.id}
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr', // 1 column on mobile
              sm: '1fr 1fr', // 2 columns on tablet
              md: '1fr 1fr 1fr', // 3 columns on desktop
            },
          }}
        >
          <TextField
            size="small"
            label="Bank Name"
            value={row.bankName}
            onChange={(e) => handleChange(row.id, 'bankName', e.target.value)}
            fullWidth
          />
          <TextField
            size="small"
            label="Account Number"
            value={row.accountNumber}
            onChange={(e) =>
              handleChange(row.id, 'accountNumber', e.target.value)
            }
            fullWidth
          />
          <TextField
            size="small"
            label="Routing Number"
            value={row.routingNumber}
            onChange={(e) =>
              handleChange(row.id, 'routingNumber', e.target.value)
            }
            fullWidth
          />
          <TextField
            size="small"
            label="Account Name"
            value={row.accountName}
            onChange={(e) =>
              handleChange(row.id, 'accountName', e.target.value)
            }
            fullWidth
          />
          <TextField
            size="small"
            label="Phone Number"
            value={row.phoneNumber}
            onChange={(e) =>
              handleChange(row.id, 'phoneNumber', e.target.value)
            }
            fullWidth
          />
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Box sx={{ ml: 'auto' }}>
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleAddRow(index)}
                disabled={rows.length >= maxRows}
                sx={{
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: 'primary.main',
                  mr: 1,
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteRow(row.id)}
                disabled={rows.length === 1}
                sx={{
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: 'error.main',
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      ))}
    </Stack>
    //       </Box>
    //     </Stack>
    //   ))}
    // </Stack>
  );
};

export default BankData;
