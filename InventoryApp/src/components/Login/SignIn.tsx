import  { useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Paper,
} from "@mui/material";
 import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignIn() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const data = await loginUser({ client_id: email, secret: password  });
        login(data.token);
        navigate("/home");
      } catch (err) {
        console.error("Login failed", err);
        alert("Invalid credentials");
      }
    };
  
  return (
    <Box
      sx={{
        height: "100vh", // full viewport height
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main", width: 56, height: 56 }} alt="Remy Sharp" src="/1.jpg" />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          size="small"
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          size="small"
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" size="small" />}
          label="Remember me"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="small"
          sx={{ 
            mt: 3, 
            mb: 2,
            borderRadius: '8px',
            minWidth: '100px'
          }}
        >
          Sign In
        </Button>          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
