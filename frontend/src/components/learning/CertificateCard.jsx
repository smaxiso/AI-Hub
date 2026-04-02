import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Chip, Tooltip, IconButton, Snackbar } from '@mui/material';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedIcon from '@mui/icons-material/Verified';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import IosShareIcon from '@mui/icons-material/IosShare';
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
    const [copied, setCopied] = useState(false);
    const [snackMsg, setSnackMsg] = useState('Verification link copied to clipboard');

    const shareUrl = certification.certificate_number
        ? `${window.location.origin}/certificate/verify/${certification.certificate_number}`
        : '';

    const shareText = `🎓 I just earned the "${certification.name}" certification from TheAIHubX!\n📊 Average Score: ${certification.score_average || '—'}%\n🔗 Verify: ${shareUrl}\n#AI #MachineLearning #Certification #TheAIHubX`;

    const handleCopyLink = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(shareUrl);
        setSnackMsg('Verification link copied to clipboard');
        setCopied(true);
    };

    const handleLinkedIn = (e) => {
        e.stopPropagation();
        const postText = `🎓 I just earned the "${certification.name}" certification from TheAIHubX!\n\n` +
            `📊 Average Score: ${certification.score_average || '—'}%\n` +
            `🔗 Verify my certificate: ${shareUrl}\n\n` +
            `#AI #MachineLearning #Certification #TheAIHubX #LearningJourney`;
        window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(postText)}`, '_blank');
    };

    const handleTwitter = (e) => {
        e.stopPropagation();
        const tweetText = `🎓 Just earned the "${certification.name}" certification from @TheAIHubX!\n\n📊 Score: ${certification.score_average || '—'}%\n\n#AI #MachineLearning #Certification`;
        window.open(`https://x.com/intent/post?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    };

    const handleWhatsApp = (e) => {
        e.stopPropagation();
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    };

    const handleNativeShare = async (e) => {
        e.stopPropagation();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${certification.name} - TheAIHubX Certificate`,
                    text: shareText,
                    url: shareUrl
                });
            } catch (err) {
                // User cancelled or share failed silently
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText);
            setSnackMsg('Share text copied to clipboard');
            setCopied(true);
        }
    };

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
                            <Box sx={{ mb: 1.5 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                    Certificate #{certification.certificate_number}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    Average Score: {certification.score_average}% • Earned {new Date(certification.earned_at).toLocaleDateString()}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center', borderTop: '1px solid', borderColor: 'divider', pt: 1.5 }}>
                                <Tooltip title="Copy link">
                                    <IconButton size="small" onClick={handleCopyLink} sx={{ color: 'text.secondary' }}>
                                        <ContentCopyIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Share on LinkedIn">
                                    <IconButton size="small" onClick={handleLinkedIn} sx={{ color: '#0077B5' }}>
                                        <LinkedInIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Share on X">
                                    <IconButton size="small" onClick={handleTwitter} sx={{ color: '#000' }}>
                                        <XIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Share on WhatsApp">
                                    <IconButton size="small" onClick={handleWhatsApp} sx={{ color: '#25D366' }}>
                                        <WhatsAppIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Share via...">
                                    <IconButton size="small" onClick={handleNativeShare} sx={{ color: 'text.secondary' }}>
                                        <IosShareIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
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
            <Snackbar
                open={copied}
                autoHideDuration={2000}
                onClose={() => setCopied(false)}
                message={snackMsg}
            />
        </motion.div>
    );
};

export default CertificateCard;
