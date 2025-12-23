import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import StarIcon from '@mui/icons-material/Star';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SchoolIcon from '@mui/icons-material/School';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

const ICON_MAP = {
    'trophy': EmojiEventsIcon,
    'fire': LocalFireDepartmentIcon,
    'star': StarIcon,
    'rocket': RocketLaunchIcon,
    'graduation': SchoolIcon,
    'sun': WbSunnyIcon,
    'brain': SchoolIcon
};

const Badge = ({ achievement, locked = false }) => {
    const IconComponent = ICON_MAP[achievement.icon_key] || StarIcon;

    return (
        <Tooltip title={
            <Box sx={{ textAlign: 'center', p: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{achievement.name}</Typography>
                <Typography variant="caption" display="block">{achievement.description}</Typography>
                <Typography variant="caption" sx={{ color: 'yellow' }}>+{achievement.points} pts</Typography>
            </Box>
        } arrow>
            <Box
                sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: locked ? 'grey.300' : 'secondary.main',
                    background: locked ? 'grey.300' : 'linear-gradient(135deg, #9c27b0 30%, #ce93d8 90%)',
                    color: 'white',
                    opacity: locked ? 0.5 : 1,
                    filter: locked ? 'grayscale(100%)' : 'none',
                    boxShadow: locked ? 'none' : '0 4px 10px rgba(156, 39, 176, 0.4)',
                    transition: 'transform 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                        transform: 'scale(1.1)'
                    }
                }}
            >
                <IconComponent sx={{ fontSize: 32 }} />
            </Box>
        </Tooltip>
    );
};

export default Badge;
