import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Typography, Card, CardContent, CardActionArea, Button, Box, CircularProgress, Stack, Divider,
    Dialog, DialogTitle, DialogContent, TextField, DialogActions 
} from '@mui/material';
import client from '../api/client';

interface User { username: string; }
interface Post { 
    ID: number; 
    title: string; 
    content: string; 
    user?: User;
    CreatedAt: string;
}
interface Topic { 
    ID: number; 
    name: string; 
    description: string; 
    posts?: Post[]; 
}

const TopicView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [topic, setTopic] = useState<Topic | null>(null);
    const [loading, setLoading] = useState(true);
    
    const [open, setOpen] = useState(false); 
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const fetchTopicData = async () => {
        try {
            const response = await client.get(`/topics/${id}`);
            setTopic(response.data);
        } catch (error) {
            console.error("Failed to load topic", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchTopicData();
    }, [id]);

    const handleCreatePost = async () => {
        if (!title || !content || !id) return;
        
        try {
            await client.post('/posts', {
                title,
                content,
                topic_id: parseInt(id) 
            });
            
            setOpen(false);
            setTitle('');
            setContent('');
            fetchTopicData(); 
        } catch (error) {
            console.error("Failed to create post", error);
            alert("Failed to create post. Are you logged in?");
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (!topic) return <Typography sx={{ mt: 4 }}>Topic not found.</Typography>;

    return (
        <Box sx={{ mt: 4 }}>
            <Button onClick={() => navigate('/')} sx={{ mb: 2 }}>&larr; Back to Topics</Button>
            
            <Typography variant="h3" component="h1" gutterBottom>{topic.name}</Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>{topic.description}</Typography>
            <Divider sx={{ mb: 4 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">Posts</Typography>
                <Button variant="contained" onClick={() => setOpen(true)}>Create Post</Button>
            </Box>

            <Stack spacing={2}>
                {topic.posts && topic.posts.length > 0 ? (
                    topic.posts.map((post) => (
                        <Card key={post.ID} variant="outlined">
                            <CardActionArea onClick={() => navigate(`/posts/${post.ID}`)}>
                                <CardContent>
                                    <Typography variant="h6">{post.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Posted by {post.user?.username || 'Anonymous'} on {new Date(post.CreatedAt).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))
                ) : (
                    <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                        No posts yet. Be the first to create one!
                    </Typography>
                )}
            </Stack>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Create New Post</DialogTitle>
                <DialogContent>
                    <TextField 
                        autoFocus margin="dense" label="Title" fullWidth variant="outlined" 
                        value={title} onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField 
                        margin="dense" label="Content" fullWidth variant="outlined" multiline rows={4}
                        value={content} onChange={(e) => setContent(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreatePost} variant="contained">Post</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TopicView;