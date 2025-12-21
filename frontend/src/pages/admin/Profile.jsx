
import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, TextField, Button, Avatar, Grid, Container, Alert, IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        full_name: '',
        username: '',
        avatar_url: '',
        email: ''
    });
    const [passwords, setPasswords] = useState({ new: '', confirm: '' });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user) fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) setProfile(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: '', text: '' });

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: profile.full_name,
                    username: profile.username,
                    avatar_url: profile.avatar_url
                })
                .eq('id', user.id);

            if (error) throw error;
            setMsg({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMsg({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            setMsg({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: passwords.new });
            if (error) throw error;
            setMsg({ type: 'success', text: 'Password updated successfully!' });
            setPasswords({ new: '', confirm: '' });
        } catch (err) {
            setMsg({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const uploadAvatar = async (event) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            let { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

            setProfile({ ...profile, avatar_url: data.publicUrl });
        } catch (error) {
            setMsg({ type: 'error', text: error.message });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, pb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={() => navigate('/admin')} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4">My Profile</Typography>
            </Box>

            {msg.text && <Alert severity={msg.type} sx={{ mb: 3 }}>{msg.text}</Alert>}

            <Grid container spacing={4}>
                {/* Profile Info & Avatar */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                            <Avatar
                                src={profile.avatar_url}
                                sx={{ width: 100, height: 100, mb: 2 }}
                            />
                            <Button variant="outlined" component="label" disabled={uploading}>
                                {uploading ? 'Uploading...' : 'Upload Avatar'}
                                <input type="file" hidden accept="image/*" onChange={uploadAvatar} />
                            </Button>
                        </Box>

                        <form onSubmit={handleProfileUpdate}>
                            <TextField
                                label="Email"
                                value={profile.email}
                                fullWidth
                                margin="normal"
                                disabled
                            />
                            <TextField
                                label="Full Name"
                                value={profile.full_name}
                                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Username"
                                value={profile.username}
                                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2 }}
                                disabled={loading}
                            >
                                Save Changes
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                {/* Password Change */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4 }}>
                        <Typography variant="h6" gutterBottom>Change Password</Typography>
                        <form onSubmit={handlePasswordChange}>
                            <TextField
                                label="New Password"
                                type="password"
                                value={passwords.new}
                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Confirm Password"
                                type="password"
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="warning"
                                fullWidth
                                sx={{ mt: 2 }}
                                disabled={loading || !passwords.new}
                            >
                                Update Password
                            </Button>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Profile;
