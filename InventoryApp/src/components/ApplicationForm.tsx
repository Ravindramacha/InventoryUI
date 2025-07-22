
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import {
 // Box,
  TextField,
  MenuItem,
  FormControl,
 // FormLabel,
//  RadioGroup,
 // FormControlLabel,
 // Radio,
//  Checkbox,
 // Switch,
  Button,
  Typography,
  Slider,
 // Paper,
//  Slider,
  Grid,
  InputLabel,
  Select,} from '@mui/material';
import { useLanguages, useProductTypes } from '../api/ApiQueries';
import type { SelectChangeEvent } from '@mui/material/Select';
import  DynamicAttributes   from "../components/common/DynamicAttributes";
import DynamicDateFields from "../components/common/DynamicDateFields";
interface FormData {
  productId: string;
  email: string;
  age: string;
  birthDate: Date | null;
  gender: string;
  languageId: string;
  productTypeId: string;
  newsletter: boolean;
  resume: File | null;
  experienceLevel: number;
}

const ApplicationFormPage = () => {
 
    const [attributes, setAttributes] = useState([]);
 
  const [formData, setFormData] = useState<FormData>({
    productId: '',
    email: '',
    age: '',
    birthDate: null,
    gender: '',
    languageId: '',
    productTypeId: '',
    newsletter: false,
    resume: null,
    experienceLevel: 0,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>)  => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
   const handleDropDownChange = (event:  SelectChangeEvent)  => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
   const { data: languages } = useLanguages(); 
   const { data: productTypes } = useProductTypes();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();   
    console.log(formData);
    alert('Form submitted! Check console for data.');
  };

  return (
    <>
    <Typography variant="h5" gutterBottom>
         Material Master
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Product ID"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Product Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    label="Product Type"
                    name="productTypeId"
                    value={formData.productTypeId}
                    onChange={handleDropDownChange}
                  >
                     {productTypes?.map((productType) => (
                  <MenuItem key={productType.productTypeCode} value={productType.productTypeId}>
                    {productType.productTypeDesc}
                  </MenuItem>
                ))}
                  </Select>
                </FormControl>
            
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Language</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    label="Language"
                    name="languageId"
                    value={formData.languageId}
                    onChange={handleDropDownChange}
                  >
                     {languages?.map((lang) => (
                  <MenuItem key={lang.languageCode} value={lang.languageId}>
                    {lang.languageDesc}
                  </MenuItem>
                ))}
                  </Select>
                </FormControl>
            
            </Grid>
             <Grid size={{xs:12, sm:12, md:6, lg:3}}></Grid>
              <Grid size={{xs:12, sm:12, md:6, lg:5}}>
               <DynamicAttributes
              maxFields={5}
              onChange={setAttributes}
            />
          </Grid>
          <Grid size={{xs:12, sm:12, md:6, lg:5}}>
            <DynamicDateFields
              maxFields={5}
              onChange={(fields) => {
                console.log("Date Fields:", fields);
              }}
             />
           </Grid>
             {/* Confirmation Dialog */}
     
            {/* <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                fullWidth
                label="Birth Date"
                name="birthDate"
                type="date"
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                value={formData.birthDate || '00-00-0000'} 
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{xs:12, sm:12, md:6, lg:3}}>
              <TextField
                fullWidth
                label="Birth Date"
                name="birthDate"
                type="date"
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                value={formData.birthDate || '00-00-0000'}
                onChange={handleChange}
              />
            </Grid> 

            <Grid size={{xs:12}}>
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

            <Grid size={12}>
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

            <Grid size={12}>
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

            <Grid size={12}>
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

            <Grid size={12}>
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

            <Grid size={12}>
              <Typography gutterBottom>Experience Level (0-10)</Typography>
              <Slider
                value={formData.experienceLevel}
                onChange={(newValue) =>
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
            </Grid>  */}

            <Grid size={12}>
              <Button variant="contained" color="primary" type="submit">
                Submit 
              </Button>
            </Grid>
          </Grid>
        </form></>
  );
};

export default ApplicationFormPage;
