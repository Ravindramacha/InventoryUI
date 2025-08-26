import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Tabs,
  Tab,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import type { ReadProductMasterForm } from '../../../Models/MaterialModel';

interface ProductDetailsProps {
  product: ReadProductMasterForm;
  onBack: () => void;
  onEdit: (product: ReadProductMasterForm) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onBack,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderDetailRow = (label: string, value: any) => (
    <Box sx={{ display: 'flex', py: 1 }}>
      <Box sx={{ flex: '0 0 33%' }}>
        <Typography variant="subtitle1" color="text.secondary">
          {label}:
        </Typography>
      </Box>
      <Box sx={{ flex: '1 1 auto' }}>
        <Typography variant="body1">{value || '-'}</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'white',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6">Product Details</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => onEdit(product)}
            size="small"
          >
            Edit
          </Button>
          <Button variant="outlined" onClick={onBack} size="small">
            Back
          </Button>
        </Box>
      </Box>

      {/* Tabs and Content */}
      <Box
        component={Paper}
        sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab label="Overview" />
          <Tab label="Transactions" />
          <Tab label="History" />
        </Tabs>

        <Box sx={{ flex: 1, overflowY: 'auto', px: 3 }}>
          <TabPanel value={activeTab} index={0}>
            {renderDetailRow('Product ID', product.productId)}
            {renderDetailRow(
              'Product Type',
              product.productType.productTypeDesc
            )}
            {renderDetailRow(
              'Product Group',
              product.productGroup.productGroupDesc
            )}
            {renderDetailRow(
              'Product Category',
              product.productCategory.productCategoryDesc
            )}
            {renderDetailRow('Language', product.languageId)}
            {renderDetailRow('Status', product.salesStatusId)}
            {renderDetailRow('Unit of Measurement', product.unitOfMeasurement)}
            {renderDetailRow('Short Description', product.shortDescription)}
            {renderDetailRow('Long Description', product.longDescription)}
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              UOM Details
            </Typography>
            {product.productMasterUomDto &&
            product.productMasterUomDto.length > 0 ? (
              product.productMasterUomDto.map((uom, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  {renderDetailRow('UOM', uom.uom)}
                  {renderDetailRow('Quantity', uom.quantity)}
                  {renderDetailRow('Price', uom.quantity)}
                  {renderDetailRow('Currency', uom.primaryQty)}
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No UOM details available.
              </Typography>
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Uom
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Quantity
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Primary Qty
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Length
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Width
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Height
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Length Uom
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Net Weight
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Gross Weight
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Weight Uom
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Volume
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Volume Uom
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {product.productMasterUomDto.map((row) => (
                    <TableRow
                      key={row.uomDataId}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f1f1fa',
                          cursor: 'pointer',
                        },
                      }}
                    >
                      <TableCell sx={{ py: 1 }}>{row.uom}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.quantity}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.primaryQty}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.length}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.width}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.height}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.lengthUom}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.netWeight}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.grossWeight}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.weightUom}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.volume}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.volumeUom}</TableCell>
                    </TableRow>
                  ))}
                  {product.productMasterUomDto.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        align="center"
                        sx={{
                          py: 2,
                        }}
                      >
                        No data found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Typography variant="body2" color="text.secondary">
              Product history will be displayed here
            </Typography>
          </TabPanel>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductDetails;
