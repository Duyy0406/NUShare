/**
 * PostView.tsx
 * Displays a single post's full content and its comment section.
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Typography, Box, CircularProgress, Button, Divider, 
    TextField, Paper, Stack 
} from '@mui/material';
import client from '../api/client';

interface Comment {
    ID: number;
    content: string;
    user?: { username: string };
}

interface Post {
    ID: number;
    title: string;
    content: string;
    user?: { username: string };
    CreatedAt: string;
}

const PostView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const [postRes, commentRes] = await Promise.all([
                    client.get(`/posts/${id}`),
                    client.get(`/posts/${id}/comments`)
                ]);
                setPost(postRes.data);
                setComments(commentRes.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleAddComment = async () => {
        if (!newComment.trim() || !id) return;
        try {
            await client.post('/comments', {
                content: newComment,
                post_id: parseInt(id)
            });
            setNewComment('');
            // Refresh comments
            const response = await client.get(`/posts/${id}/comments`);
            setComments(response.data);
        } catch (error) {
            alert("Failed to comment. Please ensure you are logged in.");
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            await client.delete(`/posts/${id}`);
            navigate(-1);
        } catch (error) {
            alert("Failed to delete. You might not be the author.");
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (!post) return <Typography sx={{ mt: 4 }}>Post not found.</Typography>;

    return (
        <Box sx={{ mt: 4 }}>
             <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>&larr; Back</Button>
             
             {/* Post Section */}
              <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h4" component="h1" sx={{ mr: 2 }}>
                        {post.title}
                    </Typography>
                    
                    {/* Delete Button */}
                    <Button 
                        variant="outlined" 
                        color="error" 
                        size="small"
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </Box>

                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                    {post.content}
                </Typography>
                
                <Divider />
                
                <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
                    Posted by {post.user?.username || 'Unknown'} on {new Date(post.CreatedAt).toLocaleString()}
                </Typography>
             </Paper>
             {/* Comments Section */}
             <Typography variant="h5" gutterBottom>Comments</Typography>
             
             <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <TextField 
                    fullWidth size="small" placeholder="Add a comment..." multiline
                    value={newComment} onChange={(e) => setNewComment(e.target.value)}
                />
                <Button variant="contained" onClick={handleAddComment}>Send</Button>
             </Box>

             <Stack spacing={2}>
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <Paper key={comment.ID} variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>{comment.content}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                - {comment.user?.username || 'Anonymous'} 
                            </Typography>
                        </Paper>
                    ))
                ) : (
                    <Typography color="text.secondary">No comments yet.</Typography>
                )}
            </Stack>
        </Box>
    );
};

export default PostView;