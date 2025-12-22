import React, { useState, useRef } from 'react';
import {
    Box, Button, Avatar, Typography, CircularProgress,
    Snackbar, Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { supabase } from '../supabaseClient';

const AvatarUpload = ({ currentAvatarUrl, userId, onUploadComplete }) => {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
    const fileInputRef = useRef(null);

    const showNotification = (message, severity = 'info') => {
        setNotification({ open: true, message, severity });
    };

    const handleFileSelect = async (file) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showNotification('Please upload an image file', 'error');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            showNotification('File size must be less than 2MB', 'error');
            return;
        }

        setUploading(true);

        try {
            // Create unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Upload to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update profile with new avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', userId);

            if (updateError) throw updateError;

            showNotification('Avatar updated successfully!', 'success');
            if (onUploadComplete) {
                onUploadComplete(publicUrl);
            }
        } catch (err) {
            console.error('Upload error:', err);
            showNotification(err.message || 'Failed to upload avatar', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 3
                }}
            >
                <Avatar
                    src={currentAvatarUrl}
                    sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}
                >
                    {!currentAvatarUrl && 'U'}
                </Avatar>

                <Box
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    sx={{
                        border: '2px dashed',
                        borderColor: dragOver ? 'primary.main' : 'grey.300',
                        borderRadius: 2,
                        p: 3,
                        textAlign: 'center',
                        bgcolor: dragOver ? 'action.hover' : 'transparent',
                        transition: 'all 0.3s',
                        cursor: 'pointer',
                        width: '100%',
                        maxWidth: 300
                    }}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {uploading ? (
                        <CircularProgress size={24} />
                    ) : (
                        <>
                            <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                Drag & drop or click to upload
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                PNG, JPG (max 2MB)
                            </Typography>
                        </>
                    )}
                </Box>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    style={{ display: 'none' }}
                />
            </Box>

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setNotification({ ...notification, open: false })}
                    severity={notification.severity}
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AvatarUpload;
