import React, { useEffect, useState } from 'react';
import { Box, Typography, Tooltip, Zoom } from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useAuth } from '../../context/AuthContext';

const StreakCounter = () => {
    const { streak } = useAuth();

    // If streak is null/undefined or 0, don't show
    if (!streak) return null;



    return (
        <Tooltip title="Daily Learning Streak! 🔥" arrow TransitionComponent={Zoom}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'rgba(255, 87, 34, 0.1)',
                    border: '1px solid rgba(255, 87, 34, 0.3)',
                    borderRadius: 4,
                    px: 1,
                    py: 0.2,
                    mr: 1,
                    cursor: 'help'
                }}
            >
                <LocalFireDepartmentIcon sx={{ color: '#ff5722', fontSize: 20, mr: 0.5 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#e64a19' }}>
                    {streak}
                </Typography>
            </Box>
        </Tooltip>
    );
};

export default StreakCounter;
