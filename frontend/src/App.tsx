import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Login from './components/Login';
import Home from './components/Home';
import TopicView from './components/TopicView';
import PostView from './components/PostView';
import { setAuthToken } from './api/client';
import { useEffect, useState } from 'react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
        if (token) setAuthToken(token);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuthToken('');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    NUShare
                </Typography>
                <Button color="inherit" component={Link} to="/">Home</Button>
                
                {isLoggedIn ? (
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                ) : (
                    <Button color="inherit" component={Link} to="/login">Login</Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            {/* Main Page Content */}
            <Container maxWidth="md">
              <Box sx={{ mt: 2 }}> 
                  <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/topics/:id" element={<TopicView />} />
                      <Route path="/posts/:id" element={<PostView />} />
                  </Routes>
              </Box>
            </Container>
        </BrowserRouter>
    );
}

export default App;