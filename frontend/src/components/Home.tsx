import { useEffect, useState } from 'react';
import { 
    Typography, 
    Card, 
    CardContent, 
    CardActionArea, 
    CircularProgress, 
    Box 
} from '@mui/material';
import Grid from '@mui/material/Grid2'; // Use the new Grid2 component
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
    const navigate = useNavigate();

    useEffect(() => {
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

        fetchTopics();
    }, []);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                Discussion Topics
            </Typography>

            <Grid container spacing={3}>
                {topics.map((topic) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={topic.ID}>
                        <Card elevation={2}>
                            <CardActionArea onClick={() => navigate(`/topics/${topic.ID}`)}>
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
                    </Grid>
                ))}
            </Grid>
            
            {topics.length === 0 && (
                <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
                    No topics found. (Use curl to create one!)
                </Typography>
            )}
        </Box>
    );
};

export default Home;