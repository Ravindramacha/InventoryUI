import React, { useState } from 'react';
import { Button, TextField, Avatar,Grid } from '@mui/material';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

// UserProfile type should match Profile.tsx
export type UserProfile = {
  avatarUrl?: string;
  name: string;
  email: string;
  dob: string;
  phone?: string;
  address?: string;
  occupation?: string;
  gender?: string;
};

// Dummy initial data, replace with props or context as needed
const initialProfile: UserProfile = {
  avatarUrl: '/static/images/avatar/1.jpg',
  name: 'Sanjana Adepu',
  email: 'sanjana@example.com',
  dob: '2002-06-15',
  phone: '+91-9876543210',
  address: 'IIT Hyderabad, Kandi, Telangana',
  occupation: 'UI/UX Designer',
  gender: 'Female',
};

export default function ProfileUpdate() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  // Handle avatar image upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfile(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
      <Grid container spacing={4}>
        <Grid size={{xs:12, md:4}} sx={{ textAlign: 'center' }}>
          <Avatar
            alt={profile.name}
            src={profile.avatarUrl}
            sx={{ width: '20vw', height: '20vw', mx: 'auto' }}
          />
          <Button
            variant="outlined"
            component="label"
            sx={{ mt: 2 }}
          >
            Change Picture
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </Button>
        </Grid>
        <Grid size={{xs:12, md:8}}>
          <TextField label="Name" name="name" value={profile.name} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Email" name="email" value={profile.email} onChange={handleChange} fullWidth margin="normal" />
          <TextField
            fullWidth
            label="Date of Birth"
            name="dob"
            type="date"
            margin="normal"
            slotProps={{
                inputLabel: {
                shrink: true
                }
            }}
            value={profile.dob} 
            onChange={handleChange}
            />
          <TextField
            fullWidth
            label="Mobile Number"
            name="phone"
            type="tel"
            margin="normal"
            slotProps={{
                inputLabel: {
                shrink: true,
                },
                input: {
                inputProps: {
                    maxLength: 10,
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                },
                },
            }}
            value={profile.phone}
            onChange={handleChange}
            />
          <TextField label="Address" name="address" value={profile.address} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Occupation" name="occupation" value={profile.occupation} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Gender" name="gender" value={profile.gender} onChange={handleChange} fullWidth margin="normal" />
        </Grid>
        <Grid size={12} sx={{ textAlign: 'center', mt: 2 }}>
          <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          onClick={() => {
            navigate('/profile');
            addNotification('Profile updated successfully!', 'success');
            }}
            >
                Update
            </Button>
        </Grid>
      </Grid>
  );
}
