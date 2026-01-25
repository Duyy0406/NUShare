import { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, Paper } from '@mui/material';
import client, { setAuthToken } from '../api/client';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await client.post('/login', { username, password });
            const { token } = response.data;
            
            localStorage.setItem('token', token);
            setAuthToken(token);
            
            navigate('/');
        } catch (err) {
            console.error(err); 
            setError('Invalid username or password');
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 8 }}>
            <Typography variant="h5" component="h1" gutterBottom textAlign="center">
                Login
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <Box component="form" onSubmit={handleLogin}>
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
                <Button 
                    fullWidth 
                    variant="contained" 
                    type="submit" 
                    sx={{ mt: 2 }}
                >
                    Login
                </Button>
            </Box>
        </Paper>
    );
};

export default Login;