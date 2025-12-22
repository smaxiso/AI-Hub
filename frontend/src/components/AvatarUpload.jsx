import React, { useState, useRef } from 'react';
import {
    Box, Button, Typography, Avatar, CircularProgress,
    Paper, IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { supabase } from '../supabaseClient';

const AvatarUpload = ({ currentAvatar, userId, onUploadSuccess, onUploadError }) => {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState(currentAvatar);
    const fileInputRef = useRef(null);

    const uploadAvatar = async (file) => {
        try {
            setUploading(true);

            // Validate file
            if (!file.type.startsWith('image/')) {
                throw new Error('Please upload an image file');
            }

            if (file.size > 1 * 1024 * 1024) { // 1MB limit
                throw new Error('Image size must be less than 1MB');
            }

            // Create unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update profile
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', userId);

            if (updateError) throw updateError;

            setPreview(publicUrl);
            onUploadSuccess?.(publicUrl);
        } catch (err) {
            console.error('Upload error:', err);
            onUploadError?.(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            uploadAvatar(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            uploadAvatar(e.target.files[0]);
        }
    };

    const handleRemove = async () => {
        try {
            setUploading(true);
            const { error } = await supabase
                .from('profiles')
                .update({ avatar_url: null })
                .eq('id', userId);

            if (error) throw error;

            setPreview(null);
            onUploadSuccess?.(null);
        } catch (err) {
            onUploadError?.(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Avatar
                src={preview}
                sx={{ width: 120, height: 120, bgcolor: 'primary.main', fontSize: '3rem' }}
            >
                {!preview && 'U'}
            </Avatar>

            <Paper
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                sx={{
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: dragActive ? '2px dashed #1976d2' : '2px dashed #ccc',
                    bgcolor: dragActive ? 'action.hover' : 'background.paper',
                    transition: 'all 0.2s',
                    width: '100%',
                    maxWidth: 400
                }}
                onClick={() => fileInputRef.current?.click()}
            >
                {uploading ? (
                    <CircularProgress size={40} />
                ) : (
                    <>
                        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                        <Typography variant="body1" gutterBottom>
                            Drag & drop your photo here
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            or click to browse
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            PNG, JPG up to 1MB
                        </Typography>
                    </>
                )}
            </Paper>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />

            {preview && (
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={handleRemove}
                    disabled={uploading}
                >
                    Remove Photo
                </Button>
            )}
        </Box>
    );
};

export default AvatarUpload;
