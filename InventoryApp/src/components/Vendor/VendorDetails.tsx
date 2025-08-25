import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Button,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { countryList, stateList, type ReadVendorFormModel } from '../../Models/VendorModel';

interface VendorDetailsProps {
  vendor: ReadVendorFormModel ;
  onBack: () => void;
  onEdit: (product: ReadVendorFormModel) => void;
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

const VendorDetails: React.FC<VendorDetailsProps> = ({ vendor, onBack, onEdit }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderDetailRow = (label: string, value: any) => (
    <Box sx={{ display: 'flex', py: 1 }}>
      <Box sx={{ flex: '0 0 14%' }}>
        <Typography variant="subtitle1" color="body1">
          {label}
        </Typography>
      </Box>
      <Box sx={{ flex: '1 1 auto' }}>
        <Typography variant="subtitle1" color='textPrimary'>
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
          Vendor Details
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => onEdit(vendor)}
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
          <Tab label="Address" />
          <Tab label="Commuincation" />
          <Tab label="View Details" />
        </Tabs>

        <Box sx={{ flex: 1, overflowY: 'auto', px: 3 }}>
          <TabPanel value={activeTab} index={0}>
            <Typography variant="body2" color="text.secondary">
            {renderDetailRow('Company Name 1', vendor.companyName1)}
            {renderDetailRow('Company Name 2', vendor.companyName2)}
            {renderDetailRow('DBA (Doing Business As)', vendor.dba)}
            {renderDetailRow('Keyword', vendor.keyword)}
           </Typography>
          </TabPanel>
          
          <TabPanel value={activeTab} index={1}>
            <Typography variant="body2" color="text.secondary">
              {renderDetailRow('House Number', vendor.houseNumber)}
              {renderDetailRow('Street Name', vendor.streetName)}
              {renderDetailRow('Building Name', vendor.buildingName)}
              {renderDetailRow('Landmark', vendor.landmark)}
              {renderDetailRow('Country', countryList.find(c => c.id === vendor.countryId)?.name || '-')}
              {renderDetailRow('State', stateList.find(c => c.id === vendor.stateId)?.name || '-')}
              {renderDetailRow('Zip Code', vendor.zipCode)}
              {renderDetailRow('Digi Pin', vendor.digiPin)}
              {renderDetailRow('Maps URL', vendor.mapsUrl)}
            </Typography>
          </TabPanel>
          
          <TabPanel value={activeTab} index={2}>
            <Typography variant="body2" color="text.secondary">
              {renderDetailRow('Language', vendor.languageId)}
              {renderDetailRow('Phone Number 1', vendor.phoneNumber1)}
              {renderDetailRow('Phone Number 2', vendor.phoneNumber2)}
              {renderDetailRow('Phone Number 3', vendor.phoneNumber3)}
              {renderDetailRow('Fax', vendor.fax)}
              {renderDetailRow('Email 1', vendor.email1)}
              {renderDetailRow('Email 2', vendor.email2)}
              {renderDetailRow('Email 3', vendor.email3)}
            </Typography>
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <Typography variant="body2" color="text.secondary">
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Box component="section">
                    <Typography variant="subtitle1" gutterBottom color="textPrimary">
                      Name
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                 <Typography variant="subtitle1" color="text.Secondary">
                   Company Name 1
                  </Typography>
                  <Typography variant="subtitle1" color="body2">
                    {vendor.companyName1}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                 <Typography variant="subtitle1" color="text.Secondary">
                   Company Name 2
                  </Typography>
                  <Typography variant="subtitle1" color="body2">
                    {vendor.companyName2}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                 <Typography variant="subtitle1" color="text.Secondary">
                   DBA (Doing Business As)
                  </Typography>
                  <Typography variant="subtitle1" color="body2">
                    {vendor.dba ?? '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                 <Typography variant="subtitle1" color="text.Secondary">
                  Keyword
                  </Typography>
                  <Typography variant="subtitle1" color="body2">
                    {vendor.keyword ?? '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box component="section">
                    <Typography variant="subtitle1" gutterBottom color="textPrimary">
                      Address
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                 <Typography variant="subtitle1" color="text.Secondary">
                  House Number
                  </Typography>
                  <Typography variant="subtitle1" color="body2">
                    {vendor.houseNumber ?? '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                 <Typography variant="subtitle1" color="text.Secondary">
                  Street Name
                  </Typography>
                  <Typography variant="subtitle1" color="body2">
                    {vendor.streetName ?? '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                 <Typography variant="subtitle1" color="text.Secondary">
                  Building Name
                  </Typography>
                  <Typography variant="subtitle1" color="body2">
                    {vendor.buildingName ?? '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                 <Typography variant="subtitle1" color="text.Secondary">
                  Landmark
                  </Typography>
                  <Typography variant="subtitle1" color="body2">
                    {vendor.landmark ?? '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                 <Typography variant="subtitle1" color="text.Secondary">
                  Country
                  </Typography>
                  <Typography variant="subtitle1" color="body2">
                    {countryList.find(c => c.id === vendor.countryId)?.name || '-'}
                  </Typography>
                  </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                 <Typography variant="subtitle1" color="text.Secondary">
                  State
                  </Typography>
                  <Typography variant="subtitle1" color="body2">
                    {stateList.find(c => c.id === vendor.stateId)?.name || '-'}
                  </Typography>
                  </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                 <Typography variant="subtitle1" color="text.Secondary">
                  Zip Code
                  </Typography>
                  <Typography variant="subtitle1" color="body2">
                    {vendor.zipCode ?? '-'}
                  </Typography>
                  </Grid>
              </Grid>
            </Typography>
          </TabPanel>
        </Box>
      </Box>
    </Box>
  );
};

export default VendorDetails;
