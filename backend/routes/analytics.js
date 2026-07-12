const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// Note: authenticateUser + requireRole(['owner']) are applied at mount level in index.js

// GET /api/admin/analytics - Platform analytics (Owner only)
router.get('/', async (req, res) => {
    try {
        // Run all queries in parallel
        const [
            toolsRes, profilesRes, modulesRes, completionsRes,
            quizAttemptsRes, certsEarnedRes, streaksRes, progressRes,
            suggestionsRes, achievementsEarnedRes
        ] = await Promise.all([
            supabase.from('tools').select('id, category, created_at', { count: 'exact' }),
            supabase.from('profiles').select('id, role, created_at', { count: 'exact' }),
            supabase.from('learning_modules').select('id, title, level, is_published', { count: 'exact' }).eq('is_published', true),
            supabase.from('module_completions').select('id, module_id, quiz_score, created_at, completion_type'),
            supabase.from('quiz_attempts').select('id, module_id, score, passed, completed_at'),
            supabase.from('user_certifications').select('id, certification_id, earned_at, score_average'),
            supabase.from('learning_streaks').select('user_id, current_streak, longest_streak'),
            supabase.from('user_progress').select('user_id, total_points, completed_modules, current_level'),
            supabase.from('community_suggestions').select('id, status, created_at', { count: 'exact' }),
            supabase.from('user_achievements').select('id, achievement_id, earned_at')
        ]);

        const tools = toolsRes.data || [];
        const profiles = profilesRes.data || [];
        const modules = modulesRes.data || [];
        const completions = completionsRes.data || [];
        const quizAttempts = quizAttemptsRes.data || [];
        const certsEarned = certsEarnedRes.data || [];
        const streaks = streaksRes.data || [];
        const progress = progressRes.data || [];
        const suggestions = suggestionsRes.data || [];
        const achievementsEarned = achievementsEarnedRes.data || [];

        // --- Overview Stats ---
        const overview = {
            total_tools: tools.length,
            total_users: profiles.length,
            total_modules: modules.length,
            total_completions: completions.length,
            total_quiz_attempts: quizAttempts.length,
            total_certifications_earned: certsEarned.length,
            total_badges_earned: achievementsEarned.length,
            total_suggestions: suggestions.length
        };

        // --- User Breakdown ---
        const usersByRole = {};
        profiles.forEach(p => { usersByRole[p.role] = (usersByRole[p.role] || 0) + 1; });

        // --- Tool Category Distribution ---
        const toolsByCategory = {};
        tools.forEach(t => { toolsByCategory[t.category] = (toolsByCategory[t.category] || 0) + 1; });

        // --- Module Completion Stats ---
        const completionsByLevel = { beginner: 0, intermediate: 0, advanced: 0, expert: 0 };
        const moduleMap = {};
        modules.forEach(m => { moduleMap[m.id] = m; });
        completions.forEach(c => {
            const mod = moduleMap[c.module_id];
            if (mod) completionsByLevel[mod.level] = (completionsByLevel[mod.level] || 0) + 1;
        });

        // --- Popular Modules (most completions) ---
        const moduleCompletionCount = {};
        completions.forEach(c => { moduleCompletionCount[c.module_id] = (moduleCompletionCount[c.module_id] || 0) + 1; });
        const popularModules = Object.entries(moduleCompletionCount)
            .map(([id, count]) => ({ id, title: moduleMap[id]?.title || 'Unknown', level: moduleMap[id]?.level || '', count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // --- Quiz Performance ---
        const passedQuizzes = quizAttempts.filter(q => q.passed).length;
        const avgQuizScore = quizAttempts.length > 0
            ? Math.round(quizAttempts.reduce((sum, q) => sum + (q.score || 0), 0) / quizAttempts.length)
            : 0;
        const quizStats = {
            total_attempts: quizAttempts.length,
            passed: passedQuizzes,
            failed: quizAttempts.length - passedQuizzes,
            pass_rate: quizAttempts.length > 0 ? Math.round((passedQuizzes / quizAttempts.length) * 100) : 0,
            avg_score: avgQuizScore
        };

        // --- Learner Progress Distribution ---
        const levelDistribution = { beginner: 0, intermediate: 0, advanced: 0, expert: 0 };
        progress.forEach(p => { if (p.current_level) levelDistribution[p.current_level] = (levelDistribution[p.current_level] || 0) + 1; });

        // --- Streak Stats ---
        const activeStreaks = streaks.filter(s => s.current_streak > 0).length;
        const maxStreak = streaks.reduce((max, s) => Math.max(max, s.longest_streak || 0), 0);
        const avgStreak = streaks.length > 0
            ? Math.round((streaks.reduce((sum, s) => sum + (s.current_streak || 0), 0) / streaks.length) * 10) / 10
            : 0;

        // --- Points Leaderboard (top 10) ---
        const leaderboard = progress
            .filter(p => p.total_points > 0)
            .sort((a, b) => b.total_points - a.total_points)
            .slice(0, 10)
            .map(p => ({ user_id: p.user_id, total_points: p.total_points, modules_completed: (p.completed_modules || []).length, level: p.current_level }));

        // --- Signup Trend (last 30 days) ---
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const signupTrend = {};
        profiles.forEach(p => {
            if (p.created_at && new Date(p.created_at) >= thirtyDaysAgo) {
                const day = p.created_at.split('T')[0];
                signupTrend[day] = (signupTrend[day] || 0) + 1;
            }
        });

        // --- Completion Trend (last 30 days) ---
        const completionTrend = {};
        completions.forEach(c => {
            if (c.created_at && new Date(c.created_at) >= thirtyDaysAgo) {
                const day = c.created_at.split('T')[0];
                completionTrend[day] = (completionTrend[day] || 0) + 1;
            }
        });

        res.json({
            overview,
            users_by_role: usersByRole,
            tools_by_category: toolsByCategory,
            completions_by_level: completionsByLevel,
            popular_modules: popularModules,
            quiz_stats: quizStats,
            level_distribution: levelDistribution,
            streak_stats: { active_streaks: activeStreaks, max_streak: maxStreak, avg_streak: avgStreak },
            leaderboard,
            signup_trend: signupTrend,
            completion_trend: completionTrend
        });
    } catch (err) {
        console.error('Error fetching analytics:', err);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

module.exports = router;
