const crypto = require('crypto');

/**
 * Generate a collision-resistant certificate number.
 * Format: AIHUBX-LEVEL-TIMESTAMP-RANDOM
 */
function generateCertNumber(level) {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = crypto.randomUUID().slice(0, 6).toUpperCase();
    return `AIHUBX-${level.toUpperCase()}-${ts}-${rand}`;
}

/**
 * Check eligibility and award certifications for a user.
 * Uses atomic points increment and respects UNIQUE constraints.
 * Returns array of newly awarded certifications.
 */
async function awardCertificationsForUser(supabase, userId) {
    const awarded = [];

    try {
        // Get all certifications
        const { data: allCerts } = await supabase.from('certifications').select('*');
        if (!allCerts || allCerts.length === 0) return awarded;

        // Get user's already earned
        const { data: earnedCerts } = await supabase
            .from('user_certifications')
            .select('certification_id')
            .eq('user_id', userId);
        const earnedIds = new Set((earnedCerts || []).map(c => c.certification_id));

        // Get all published modules
        const { data: allModules } = await supabase
            .from('learning_modules')
            .select('id, level')
            .eq('is_published', true);

        // Get user completions with scores
        const { data: completions } = await supabase
            .from('module_completions')
            .select('module_id, quiz_score')
            .eq('user_id', userId);

        const completedIds = new Set((completions || []).map(c => c.module_id));

        for (const cert of allCerts) {
            if (earnedIds.has(cert.id)) continue;

            const level = cert.requirements?.level;
            if (!level) continue;

            const levelModules = (allModules || []).filter(m => m.level === level);
            const requiredCount = cert.requirements?.modules_required || levelModules.length;

            const completedLevelModules = levelModules.filter(m => completedIds.has(m.id));
            if (completedLevelModules.length < requiredCount) continue;

            // Calculate average score
            const scores = completedLevelModules.map(m => {
                const comp = (completions || []).find(c => c.module_id === m.id);
                return comp?.quiz_score || 0;
            });
            const avgScore = scores.length > 0
                ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100
                : 0;

            const certNum = generateCertNumber(level);

            // Award — UNIQUE constraint prevents duplicates (catches 23505)
            const { error: insertErr } = await supabase
                .from('user_certifications')
                .insert({
                    user_id: userId,
                    certification_id: cert.id,
                    score_average: avgScore,
                    certificate_number: certNum
                });

            if (insertErr) {
                // 23505 = already awarded (race condition) — skip silently
                if (insertErr.code === '23505') continue;
                console.error('Cert award error:', insertErr.message);
                continue;
            }

            // Atomic points increment
            await supabase.rpc('increment_points', { p_user_id: userId, p_points: cert.points_awarded });

            awarded.push({
                name: cert.name,
                level: cert.level,
                points_awarded: cert.points_awarded,
                certificate_number: certNum,
                score_average: avgScore
            });
        }
    } catch (err) {
        console.error('awardCertificationsForUser error:', err.message);
    }

    return awarded;
}

module.exports = { awardCertificationsForUser, generateCertNumber };
