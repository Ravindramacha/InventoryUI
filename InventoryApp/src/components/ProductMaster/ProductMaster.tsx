
import { useState } from 'react';
import { Box, Button } from '@mui/material';
import ApplicationFormPage from '../common/ApplicationForm';
import CrudTable from '../Curd/CrudTable';
import type { PostProductMasterForm, ReadProductMasterForm } from '../../Models/MaterialModel';

const ProductMaster = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedData, setSelectedData] = useState<PostProductMasterForm | null>(null);
  const [mode, setMode] = useState<'add' | 'edit'>('add');

  const handleAddClick = () => {
    setMode('add');
    setSelectedData(null);
    setShowForm(true);
  };

  const handleEditClick = (data: ReadProductMasterForm) => {
    setMode('edit');
    setSelectedData(data);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedData(null);
  };

  return (
    <Box >
      {!showForm ? (
        <>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAddClick}
            sx={{ mb: 2 }}
          >
            Add Product
          </Button>
          <CrudTable onEdit={handleEditClick} />
        </>
      ) : (
        <ApplicationFormPage 
          onCancel={handleCancel} 
          initialData={selectedData}
          mode={mode}
        />
      )}
    </Box>
  );
};

export default ProductMaster;