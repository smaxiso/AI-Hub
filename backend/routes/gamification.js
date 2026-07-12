const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// Note: authenticateUser is applied at mount level in index.js

// 8. GET /api/gamification/progress - Get user badges & streak
router.get('/progress', async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Get Earned Achievements
        const { data: userBadges, error: badgesError } = await supabase
            .from('user_achievements')
            .select(`
                earned_at,
                achievements (id, name, description, icon_key, points)
            `)
            .eq('user_id', userId);

        if (badgesError) throw badgesError;

        // 2. Get Streak
        const { data: streak, error: streakError } = await supabase
            .from('learning_streaks')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (streakError) throw streakError;

        // Flatten badge structure
        const badges = userBadges.map(ub => ({
            ...ub.achievements,
            earned_at: ub.earned_at
        }));

        res.json({
            badges,
            streak: streak || { current_streak: 0, longest_streak: 0, last_activity_date: null }
        });
    } catch (err) {
        console.error('Error fetching gamification progress:', err);
        res.status(500).json({ error: 'Failed to fetch gamification progress' });
    }
});

// 9. POST /api/gamification/streak/check - Update daily streak
router.post('/streak/check', async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Get current streak
        let { data: streak, error: streakError } = await supabase
            .from('learning_streaks')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (streakError) throw streakError;

        if (!streak) {
            // Initialize new streak record
            const { data: newStreak, error: createError } = await supabase
                .from('learning_streaks')
                .insert([{
                    user_id: userId,
                    current_streak: 1,
                    longest_streak: 1,
                    last_activity_date: today
                }])
                .select()
                .single();

            if (createError) throw createError;
            return res.json({ status: 'started', streak: newStreak });
        }

        const lastActive = streak.last_activity_date;

        if (lastActive === today) {
            // Already active today, no change
            return res.json({ status: 'no_change', streak });
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let updates = {};

        if (lastActive === yesterdayStr) {
            // Continued streak
            updates = {
                current_streak: streak.current_streak + 1,
                longest_streak: Math.max(streak.longest_streak, streak.current_streak + 1),
                last_activity_date: today
            };
        } else {
            // Broken streak, reset
            updates = {
                current_streak: 1,
                last_activity_date: today
            };
        }

        const { data: updatedStreak, error: updateError } = await supabase
            .from('learning_streaks')
            .update(updates)
            .eq('user_id', userId)
            .select()
            .single();

        if (updateError) throw updateError;

        res.json({ status: 'updated', streak: updatedStreak });
    } catch (err) {
        console.error('Error updating streak:', err);
        res.status(500).json({ error: 'Failed to update streak' });
    }
});

module.exports = router;
