import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Switch,
  Button,
  Typography,
  Paper,
  Slider,
  Grid,
} from '@mui/material';

interface FormData {
  fullName: string;
  email: string;
  age: string;
  birthDate: Date | null;
  gender: string;
  department: string;
  termsAccepted: boolean;
  newsletter: boolean;
  resume: File | null;
  experienceLevel: number;
}

const ApplicationFormPage = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    age: '',
    birthDate: null,
    gender: '',
    department: '',
    termsAccepted: false,
    newsletter: false,
    resume: null,
    experienceLevel: 0,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type, files } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'file'
          ? files?.[0] || null
          : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    alert('Form submitted! Check console for data.');
  };

  return (
    <>
    <Typography variant="h4" gutterBottom>
          Application Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                fullWidth
                label="Birth Date"
                name="birthDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.birthDate || '00-00-0000'} 
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                fullWidth
                label="Birth Date"
                name="birthDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.birthDate || '00-00-0000'}
                onChange={handleChange}
              />
            </Grid> 

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel>Gender</FormLabel>
                <RadioGroup
                  row
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                  <FormControlLabel value="other" control={<Radio />} label="Other" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    name="termsAccepted"
                  />
                }
                label="I accept the terms and conditions"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.newsletter}
                    onChange={handleChange}
                    name="newsletter"
                  />
                }
                label="Subscribe to newsletter"
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="outlined" component="label">
                Upload Resume
                <input
                  hidden
                  type="file"
                  name="resume"
                  accept=".pdf,.docx"
                  onChange={handleChange}
                />
              </Button>
              {formData.resume && (
                <Typography variant="body2" mt={1}>
                  Selected: {formData.resume.name}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography gutterBottom>Experience Level (0-10)</Typography>
              <Slider
                value={formData.experienceLevel}
                onChange={(e, newValue) =>
                  setFormData((prev) => ({
                    ...prev,
                    experienceLevel: typeof newValue === 'number' ? newValue : Number(newValue),
                  }))
                }
                step={1}
                marks
                min={0}
                max={10}
                valueLabelDisplay="auto"
              />
            </Grid> 

            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Submit Application
              </Button>
            </Grid>
          </Grid>
        </form></>
  );
};

export default ApplicationFormPage;
