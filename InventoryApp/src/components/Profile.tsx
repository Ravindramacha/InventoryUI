import { Edit } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Typography,
  Divider,
  Button,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

type UserProfile = {
  avatarUrl?: string;
  name: string;
  email: string;
  dob: string;
  phone?: string;
  address?: string;
  occupation?: string;
  gender?: string;
};

const userData: UserProfile = {
  avatarUrl: '/static/images/avatar/1.jpg', // optional
  name: 'Sanjana Adepu',
  email: 'sanjana@example.com',
  dob: '2002-06-15',
  phone: '+91-9876543210',
  address: 'IIT Hyderabad, Kandi, Telangana',
  occupation: 'UI/UX Designer',
  gender: 'Female',
};

export default function Profile() {
  const navigate = useNavigate();

  return (
      <Grid container spacing={4}>
        {/* Avatar */}
        <Grid size={{xs:12, md:4}} sx={{ textAlign: 'center' }}>
          <Avatar
            alt={userData.name}
            src={userData.avatarUrl}
            sx={{ width: '20vw', height: '20vw', mx: 'auto' }}
          />
          <Typography variant="h6" mt={2}>
            {userData.name}
          </Typography>
        </Grid>

        {/* Info fields */}
        <Grid size={{xs:12, md:8}}>
          <Box>
            <InfoField label="Email" value={userData.email} />
            <InfoField label="Date of Birth" value={userData.dob} />
            <InfoField label="Phone" value={userData.phone} />
            <InfoField label="Address" value={userData.address} />
            <InfoField label="Occupation" value={userData.occupation} />
            <InfoField label="Gender" value={userData.gender} />
            {/* Update button */}
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              startIcon={<Edit />}
              onClick={() => navigate('/profile/update')}
            >
              Edit
            </Button>
          </Box>
        </Grid>
      </Grid>
  );
}

// Reusable info field component
function InfoField({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <Box mb={2}>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
      <Divider sx={{ mt: 1 }} />
    </Box>
  );
}
