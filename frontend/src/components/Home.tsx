import { useEffect, useState } from 'react';
import { 
    Typography, Card, CardContent, CardActionArea, 
    CircularProgress, Box, Stack, Button,
    Dialog, DialogTitle, DialogContent, TextField, DialogActions
} from '@mui/material';
import client from '../api/client';
import { useNavigate } from 'react-router-dom';

interface Topic {
    ID: number;
    name: string;
    description: string;
}

const Home = () => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    
    const navigate = useNavigate();

    const fetchTopics = async () => {
        try {
            const response = await client.get('/topics');
            setTopics(response.data);
        } catch (error) {
            console.error("Failed to fetch topics:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const adminFlag = localStorage.getItem('isAdmin');
        setIsAdmin(adminFlag === 'true');
        fetchTopics();
    }, []);

    const handleCreateTopic = async () => {
        try {
            await client.post('/topics', { name, description: desc });
            setOpen(false);
            setName('');
            setDesc('');
            fetchTopics(); // Refresh list
        } catch (error) {
            alert("Failed to create topic. Ensure you are an admin.");
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Discussion Topics
                </Typography>
                
                {/* Only show this button if isAdmin is true */}
                {isAdmin && (
                    <Button variant="contained" onClick={() => setOpen(true)}>
                        New Topic
                    </Button>
                )}
            </Box>

            <Stack direction="row" useFlexGap flexWrap="wrap" spacing={3}>
                {topics.map((topic) => (
                    <Box key={topic.ID} sx={{ flexGrow: 1, minWidth: '300px', maxWidth: '400px' }}>
                        <Card elevation={2} sx={{ height: '100%' }}>
                            <CardActionArea onClick={() => navigate(`/topics/${topic.ID}`)} sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h5" component="div" color="primary">
                                        {topic.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {topic.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Box>
                ))}
            </Stack>
            
            {topics.length === 0 && (
                <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
                    No topics found.
                </Typography>
            )}

            {/* CREATE TOPIC DIALOG */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Create New Topic</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus margin="dense" label="Topic Name" fullWidth
                        value={name} onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="dense" label="Description" fullWidth multiline rows={2}
                        value={desc} onChange={(e) => setDesc(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateTopic} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Home;