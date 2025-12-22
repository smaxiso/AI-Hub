import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children, allowedRoles, requireAuth = false }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Not logged in
    if (!user) {
        // Determine redirect path based on route
        const isAdminRoute = location.pathname.startsWith('/admin');
        const redirectTo = isAdminRoute ? '/admin/login' : '/login';
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Check role-based access (if allowedRoles provided)
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    // If requireAuth is true, any authenticated user can access (no role check)
    // This is for learning platform where all logged-in users can learn

    return children;
};

export default ProtectedRoute;
