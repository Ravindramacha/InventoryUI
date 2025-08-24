import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import  type { ReadProductMasterForm } from '../../../Models/MaterialModel';

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
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack, onEdit }) => {
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
        <Typography variant="body1">
          {value || '-'}
        </Typography>
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
          borderColor: 'divider'
        }}
      >
        <Typography variant="h6">
          Product Details
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => onEdit(product)}
            size="small"
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            onClick={onBack}
            size="small"
          >
            Back
          </Button>
        </Box>
      </Box>

      {/* Tabs and Content */}
      <Box component={Paper} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
            {renderDetailRow('Product Master ID', product.productMasterId)}
            {renderDetailRow('Product Type', product.productType.productTypeDesc)}
            {renderDetailRow('Product Group', product.productGroup.productGroupDesc)}
            {renderDetailRow('Product Category', product.productCategory.productCategoryDesc)}
          </TabPanel>
          
          <TabPanel value={activeTab} index={1}>
            <Typography variant="body2" color="text.secondary">
              Transaction history will be displayed here
            </Typography>
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
