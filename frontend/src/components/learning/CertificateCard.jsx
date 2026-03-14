import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Tooltip } from '@mui/material';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedIcon from '@mui/icons-material/Verified';
import { motion } from 'framer-motion';

const LEVEL_COLORS = {
    beginner: { main: '#4CAF50', light: '#E8F5E9', gradient: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)' },
    intermediate: { main: '#2196F3', light: '#E3F2FD', gradient: 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)' },
    advanced: { main: '#FF9800', light: '#FFF3E0', gradient: 'linear-gradient(135deg, #FF9800 0%, #FFA726 100%)' },
    expert: { main: '#9C27B0', light: '#F3E5F5', gradient: 'linear-gradient(135deg, #9C27B0 0%, #AB47BC 100%)' }
};

const CertificateCard = ({ certification, compact = false }) => {
    const colors = LEVEL_COLORS[certification.level] || LEVEL_COLORS.beginner;
    const earned = certification.earned;

    if (compact) {
        return (
            <Tooltip title={earned ? `Earned: ${new Date(certification.earned_at).toLocaleDateString()} • Avg: ${certification.score_average}%` : 'Not yet earned'}>
                <Box
                    sx={{
                        display: 'flex', alignItems: 'center', gap: 1, p: 1.5,
                        borderRadius: 2, bgcolor: earned ? colors.light : 'action.hover',
                        border: `1px solid ${earned ? colors.main : 'transparent'}`,
                        opacity: earned ? 1 : 0.5
                    }}
                >
                    {earned ? <VerifiedIcon sx={{ color: colors.main }} /> : <LockIcon color="disabled" fontSize="small" />}
                    <Typography variant="body2" sx={{ fontWeight: earned ? 600 : 400 }}>
                        {certification.name}
                    </Typography>
                </Box>
            </Tooltip>
        );
    }

    return (
        <motion.div whileHover={earned ? { scale: 1.02 } : {}} transition={{ duration: 0.2 }}>
            <Card
                sx={{
                    position: 'relative', overflow: 'visible',
                    border: earned ? `2px solid ${colors.main}` : '1px solid',
                    borderColor: earned ? colors.main : 'divider',
                    opacity: earned ? 1 : 0.7,
                    transition: 'all 0.3s'
                }}
            >
                {/* Level ribbon */}
                <Box sx={{
                    background: colors.gradient, color: 'white',
                    py: 1.5, px: 2, display: 'flex', alignItems: 'center', gap: 1
                }}>
                    <WorkspacePremiumIcon />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, textTransform: 'capitalize' }}>
                        {certification.level} Level
                    </Typography>
                    {earned && (
                        <Chip label="Earned" size="small" sx={{ ml: 'auto', bgcolor: 'rgba(255,255,255,0.25)', color: 'white', fontWeight: 600 }} />
                    )}
                </Box>

                <CardContent sx={{ pt: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {certification.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {certification.description}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                        <Chip label={`+${certification.points_awarded} pts`} size="small" variant="outlined" color="primary" />
                        <Chip label={`${certification.requirements?.modules_required || 5} modules`} size="small" variant="outlined" />
                        <Chip label={`${certification.requirements?.min_quiz_score || 90}% min score`} size="small" variant="outlined" />
                    </Box>

                    {earned && (
                        <Box sx={{ mt: 2, p: 1.5, borderRadius: 1, bgcolor: colors.light }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                Certificate #{certification.certificate_number}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                Average Score: {certification.score_average}% • Earned {new Date(certification.earned_at).toLocaleDateString()}
                            </Typography>
                        </Box>
                    )}

                    {!earned && (
                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                            <LockIcon fontSize="small" />
                            <Typography variant="caption">
                                Complete all {certification.level} modules to earn this certificate
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default CertificateCard;
