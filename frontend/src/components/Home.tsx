import { useEffect, useState } from 'react';
import { 
    Typography, Card, CardContent, CardActionArea, 
    CircularProgress, Box, Stack 
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
                    No topics found. (Use curl to create one!)
                </Typography>
            )}
        </Box>
    );
};

export default Home;