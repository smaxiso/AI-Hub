const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const { authenticateUser } = require('../middleware/auth');

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
        const awarded = [];

        // Get all certifications
        const { data: allCerts } = await supabase.from('certifications').select('*');
        if (!allCerts) return res.json({ awarded: [] });

        // Get user's already earned certifications
        const { data: earnedCerts } = await supabase
            .from('user_certifications')
            .select('certification_id')
            .eq('user_id', userId);
        const earnedIds = new Set((earnedCerts || []).map(c => c.certification_id));

        // Get all modules grouped by level
        const { data: allModules } = await supabase
            .from('learning_modules')
            .select('id, level')
            .eq('is_published', true);

        // Get user's completions with scores
        const { data: completions } = await supabase
            .from('module_completions')
            .select('module_id, quiz_score')
            .eq('user_id', userId);

        const completedIds = new Set((completions || []).map(c => c.module_id));

        for (const cert of allCerts) {
            if (earnedIds.has(cert.id)) continue; // already earned

            const level = cert.requirements?.level;
            if (!level) continue;

            // Get modules for this level
            const levelModules = (allModules || []).filter(m => m.level === level);
            const requiredCount = cert.requirements?.modules_required || levelModules.length;

            // Check if all modules in this level are completed
            const completedLevelModules = levelModules.filter(m => completedIds.has(m.id));
            if (completedLevelModules.length < requiredCount) continue;

            // Calculate average score
            const scores = completedLevelModules.map(m => {
                const comp = (completions || []).find(c => c.module_id === m.id);
                return comp?.quiz_score || 0;
            });
            const avgScore = scores.length > 0 ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100 : 0;

            // Generate certificate number: AIHUBX-LEVEL-TIMESTAMP
            const certNum = `AIHUBX-${level.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

            // Award certification
            const { error: insertErr } = await supabase
                .from('user_certifications')
                .insert({
                    user_id: userId,
                    certification_id: cert.id,
                    score_average: avgScore,
                    certificate_number: certNum
                });

            if (!insertErr) {
                // Add bonus points to user progress
                const { data: progress } = await supabase
                    .from('user_progress')
                    .select('total_points')
                    .eq('user_id', userId)
                    .single();

                if (progress) {
                    await supabase
                        .from('user_progress')
                        .update({ total_points: progress.total_points + cert.points_awarded })
                        .eq('user_id', userId);
                }

                awarded.push({
                    name: cert.name,
                    level: cert.level,
                    points_awarded: cert.points_awarded,
                    certificate_number: certNum,
                    score_average: avgScore
                });
            }
        }

        res.json({ awarded });
    } catch (err) {
        console.error('Error checking certifications:', err);
        res.status(500).json({ error: 'Failed to check certifications' });
    }
});

module.exports = router;
