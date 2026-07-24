const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const { authenticateUser } = require('../middleware/auth');
const { awardCertificationsForUser } = require('../middleware/certifications');

// 10. GET /api/certifications - List all certifications (public, with user status if logged in)
router.get('/', async (req, res) => {
    try {
        const { data: certs, error } = await supabase
            .from('certifications')
            .select('*')
            .order('points_awarded');

        if (error) throw error;

        // If user is authenticated, attach earned status
        const authHeader = req.headers.authorization;
        let userCerts = [];
        if (authHeader) {
            try {
                const token = authHeader.replace('Bearer ', '');
                const { data: { user } } = await supabase.auth.getUser(token);
                if (user) {
                    const { data } = await supabase
                        .from('user_certifications')
                        .select('certification_id, earned_at, score_average, certificate_number')
                        .eq('user_id', user.id);
                    userCerts = data || [];
                }
            } catch (_) { /* not logged in, that's fine */ }
        }

        const result = certs.map(cert => {
            const earned = userCerts.find(uc => uc.certification_id === cert.id);
            return { ...cert, earned: !!earned, earned_at: earned?.earned_at || null, score_average: earned?.score_average || null, certificate_number: earned?.certificate_number || null };
        });

        res.json(result);
    } catch (err) {
        console.error('Error fetching certifications:', err);
        res.status(500).json({ error: 'Failed to fetch certifications' });
    }
});

// 11. GET /api/certifications/mine - Get user's earned certifications
router.get('/mine', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await supabase
            .from('user_certifications')
            .select(`
                earned_at, score_average, certificate_number,
                certifications (id, name, description, level, icon_key, points_awarded)
            `)
            .eq('user_id', userId)
            .order('earned_at', { ascending: false });

        if (error) throw error;

        const result = (data || []).map(uc => ({
            ...uc.certifications,
            earned_at: uc.earned_at,
            score_average: uc.score_average,
            certificate_number: uc.certificate_number
        }));

        res.json(result);
    } catch (err) {
        console.error('Error fetching user certifications:', err);
        res.status(500).json({ error: 'Failed to fetch certifications' });
    }
});

// 12. GET /api/certifications/verify/:certNumber - Public certificate verification
router.get('/verify/:certNumber', async (req, res) => {
    try {
        const { certNumber } = req.params;

        // Look up the user_certification by certificate_number
        const { data: uc, error } = await supabase
            .from('user_certifications')
            .select(`
                user_id, earned_at, score_average, certificate_number,
                certifications (id, name, description, level, icon_key, points_awarded, requirements)
            `)
            .eq('certificate_number', certNumber)
            .single();

        if (error || !uc) {
            return res.status(404).json({ error: 'Certificate not found', valid: false });
        }

        // Get the holder's name from profiles
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, username')
            .eq('id', uc.user_id)
            .single();

        res.json({
            valid: true,
            certificate_number: uc.certificate_number,
            holder_name: profile?.full_name || profile?.username || 'Anonymous Learner',
            earned_at: uc.earned_at,
            score_average: uc.score_average,
            certification: {
                name: uc.certifications.name,
                description: uc.certifications.description,
                level: uc.certifications.level,
                points_awarded: uc.certifications.points_awarded
            }
        });
    } catch (err) {
        console.error('Error verifying certificate:', err);
        res.status(500).json({ error: 'Verification failed', valid: false });
    }
});

// 13. POST /api/certifications/check - Check and auto-award eligible certifications
router.post('/check', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const awarded = await awardCertificationsForUser(supabase, userId);
        res.json({ awarded });
    } catch (err) {
        console.error('Error checking certifications:', err);
        res.status(500).json({ error: 'Failed to check certifications' });
    }
});

module.exports = router;
