/**
 * Register.tsx
 * User registration form
 */
import { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, Paper } from '@mui/material';
import client from '../api/client';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await client.post('/register', { username, password });
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Username might already exist.');
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 8 }}>
            <Typography variant="h5" component="h1" gutterBottom textAlign="center">
                Register
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <Box component="form" onSubmit={handleRegister}>
                <TextField
                    fullWidth
                    label="Username"
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
                    Register
                </Button>
                <Button fullWidth variant="text" onClick={() => navigate('/login')} sx={{ mt: 1 }}>
                    Already have an account? Login
                </Button>
            </Box>
        </Paper>
    );
};

export default Register;