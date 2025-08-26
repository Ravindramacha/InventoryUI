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
  Grid,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import {
  countryList,
  stateList,
  type ReadVendorFormModel,
} from '../../Models/VendorModel';

interface VendorDetailsProps {
  vendor: ReadVendorFormModel;
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
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const VendorDetails: React.FC<VendorDetailsProps> = ({
  vendor,
  onBack,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  console.log('vendor', vendor);
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderDetailRow = (label: string, value: any) => (
    <Box sx={{ display: 'flex', py: 1 }}>
      <Box sx={{ flex: '0 0 17%' }}>
        <Typography variant="caption" color="textSecondary">
          {label}
        </Typography>
      </Box>
      <Box sx={{ flex: '1 1 auto' }}>
        <Typography variant="body2" color="textPrimary">
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
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6">Vendor Details</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => onEdit(vendor)}
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
          <Tab label="Tax Information" />
          <Tab label="Bank Details" />
          <Tab label="Design view V2" />
        </Tabs>

        <Box sx={{ flex: 1, overflowY: 'auto', px: 3 }}>
          <TabPanel value={activeTab} index={0}>
            <Typography variant="body2" color="textPrimary" fontWeight="bold">
              Name
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {renderDetailRow('Company Name 1', vendor.companyName1)}
              {renderDetailRow('Company Name 2', vendor.companyName2)}
              {renderDetailRow('DBA (Doing Business As)', vendor.dba)}
              {renderDetailRow('Keyword', vendor.keyWord)}
            </Typography>
            <Box sx={{ my: 2 }} />
            <Typography variant="body2" color="textPrimary" fontWeight="bold">
              Address
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {renderDetailRow('House Number', vendor.houseNumber)}
              {renderDetailRow('Street Name', vendor.streetName)}
              {renderDetailRow('Building Name', vendor.buildingName)}
              {renderDetailRow('Landmark', vendor.landmark)}
              {renderDetailRow(
                'Country',
                countryList.find((c) => c.id === vendor.countryId)?.name || '-'
              )}
              {renderDetailRow(
                'State',
                stateList.find((c) => c.id === vendor.stateId)?.name || '-'
              )}
              {renderDetailRow('Zip Code', vendor.zipCode)}
              {renderDetailRow('Digi Pin', vendor.digiPin)}
              {renderDetailRow('Maps URL', vendor.mapsUrl)}
            </Typography>
            <Box sx={{ my: 2 }} />
            <Typography variant="body2" color="textPrimary" fontWeight="bold">
              Communication
            </Typography>
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
            <Box sx={{ my: 3 }} />
            <Typography variant="body2" color="textPrimary" fontWeight="bold">
              Tax Information
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Country
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Category
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Tax Number
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(vendor.taxInformationDto ?? []).map((row) => (
                    <TableRow
                      key={row.taxInformationId}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f1f1fa',
                          cursor: 'pointer',
                        },
                      }}
                    >
                      <TableCell sx={{ py: 1 }}>{row.countryId}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.category}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.name}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.taxNumber}</TableCell>
                    </TableRow>
                  ))}

                  {(!vendor.taxInformationDto ||
                    vendor.taxInformationDto.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
                        No data found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ my: 3 }} />
            <Typography variant="body2" color="textPrimary" fontWeight="bold">
              Bank Details
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Bank Name
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Account Number
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Routing Number
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Account Name
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Phone Number
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(vendor.bankDetailDto ?? []).map((row) => (
                    <TableRow
                      key={row.bankId}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f1f1fa',
                          cursor: 'pointer',
                        },
                      }}
                    >
                      <TableCell sx={{ py: 1 }}>{row.bankName}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.accountNumber}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.routingNumber}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.accountName}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.phoneNumber}</TableCell>
                    </TableRow>
                  ))}

                  {(!vendor.bankDetailDto ||
                    vendor.bankDetailDto.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
                        No data found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="body2" color="text.secondary">
              {renderDetailRow('Comments', vendor.comments)}
              {renderDetailRow('Status', vendor.salesStatusId)}
              {renderDetailRow('Payment Terms', vendor.paymentId)}
            </Typography>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Country
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Category
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Tax Number
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(vendor.taxInformationDto ?? []).map((row) => (
                    <TableRow
                      key={row.taxInformationId}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f1f1fa',
                          cursor: 'pointer',
                        },
                      }}
                    >
                      <TableCell sx={{ py: 1 }}>{row.countryId}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.category}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.name}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.taxNumber}</TableCell>
                    </TableRow>
                  ))}

                  {(!vendor.taxInformationDto ||
                    vendor.taxInformationDto.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
                        No data found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Bank Name
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Account Number
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Routing Number
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Account Name
                    </TableCell>
                    <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                      Phone Number
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(vendor.bankDetailDto ?? []).map((row) => (
                    <TableRow
                      key={row.bankId}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f1f1fa',
                          cursor: 'pointer',
                        },
                      }}
                    >
                      <TableCell sx={{ py: 1 }}>{row.bankName}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.accountNumber}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.routingNumber}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.accountName}</TableCell>
                      <TableCell sx={{ py: 1 }}>{row.phoneNumber}</TableCell>
                    </TableRow>
                  ))}

                  {(!vendor.bankDetailDto ||
                    vendor.bankDetailDto.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
                        No data found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Box component="section">
                  <Typography
                    variant="body2"
                    color="textPrimary"
                    fontWeight="bold"
                  >
                    Name
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Company Name 1
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {vendor.companyName1}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Company Name 2
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {vendor.companyName2}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  DBA (Doing Business As)
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {vendor.dba}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Keyword
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {vendor.keyWord}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box component="section">
                  <Typography
                    variant="body2"
                    color="textPrimary"
                    fontWeight="bold"
                  >
                    Address
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  House Number
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {vendor.houseNumber}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Street Name
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {vendor.streetName}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Building Name
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {vendor.buildingName}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Landmark
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {vendor.landmark}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}></Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}></Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Country
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {countryList.find((c) => c.id === vendor.countryId)?.name ||
                    '-'}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  State
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {stateList.find((c) => c.id === vendor.stateId)?.name || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Zip Code
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {vendor.zipCode}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Digi Pin
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {vendor.digiPin}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Maps URL
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {vendor.mapsUrl}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box component="section">
                  <Typography
                    variant="body2"
                    color="textPrimary"
                    fontWeight="bold"
                  >
                    Communication
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Language
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {vendor.languageId}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Phone Number 1
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {vendor.phoneNumber1}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Phone Number 2
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {vendor.phoneNumber2}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Phone Number 3
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {vendor.phoneNumber3}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}></Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}></Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Fax
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {vendor.fax}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Email 1
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {vendor.email1}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Email 2
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {vendor.email2}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Email 3
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {vendor.email3}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box component="section">
                  <Typography
                    variant="body2"
                    color="textPrimary"
                    fontWeight="bold"
                  >
                    Tax Information
                  </Typography>
                </Box>
              </Grid>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                        Country
                      </TableCell>
                      <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                        Category
                      </TableCell>
                      <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                        Name
                      </TableCell>
                      <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                        Tax Number
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(vendor.taxInformationDto ?? []).map((row) => (
                      <TableRow
                        key={row.taxInformationId}
                        sx={{
                          '&:hover': {
                            backgroundColor: '#f1f1fa',
                            cursor: 'pointer',
                          },
                        }}
                      >
                        <TableCell sx={{ py: 1 }}>
                          {countryList.find((c) => c.id === row.countryId)
                            ?.name || '-'}
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>{row.category}</TableCell>
                        <TableCell sx={{ py: 1 }}>{row.name}</TableCell>
                        <TableCell sx={{ py: 1 }}>{row.taxNumber}</TableCell>
                      </TableRow>
                    ))}

                    {(!vendor.taxInformationDto ||
                      vendor.taxInformationDto.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
                          No data found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Grid size={{ xs: 12 }}>
                <Box component="section">
                  <Typography
                    variant="body2"
                    color="textPrimary"
                    fontWeight="bold"
                  >
                    Bank Details
                  </Typography>
                </Box>
              </Grid>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                        Bank Name
                      </TableCell>
                      <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                        Account Number
                      </TableCell>
                      <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                        Routing Number
                      </TableCell>
                      <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                        Account Name
                      </TableCell>
                      <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                        Phone Number
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(vendor.bankDetailDto ?? []).map((row) => (
                      <TableRow
                        key={row.bankId}
                        sx={{
                          '&:hover': {
                            backgroundColor: '#f1f1fa',
                            cursor: 'pointer',
                          },
                        }}
                      >
                        <TableCell sx={{ py: 1 }}>{row.bankName}</TableCell>
                        <TableCell sx={{ py: 1 }}>
                          {row.accountNumber}
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          {row.routingNumber}
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>{row.accountName}</TableCell>
                        <TableCell sx={{ py: 1 }}>{row.phoneNumber}</TableCell>
                      </TableRow>
                    ))}

                    {(!vendor.bankDetailDto ||
                      vendor.bankDetailDto.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
                          No data found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Comments
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {vendor.comments}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Status
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {vendor.stateId}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Payment Terms
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {vendor.paymentId}
                </Typography>
              </Grid>
            </Grid>
          </TabPanel>
        </Box>
      </Box>
    </Box>
  );
};

export default VendorDetails;
