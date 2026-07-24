const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const { authenticateUser, requireRole } = require('../middleware/auth');
const { checkLevelAccess, pick, parsePagination } = require('../middleware/helpers');
const { awardCertificationsForUser } = require('../middleware/certifications');

// 1. GET /api/learning/modules - List modules (optionally by level, paginated)
router.get('/modules', async (req, res) => {
    try {
        const { level } = req.query;
        const { from, to, page, pageSize } = parsePagination(req);

        let query = supabase
            .from('learning_modules')
            .select('*', { count: 'exact' })
            .eq('is_published', true)
            .order('order_index', { ascending: true })
            .range(from, to);

        if (level) {
            query = query.eq('level', level);
        }

        const { data, error, count } = await query;

        if (error) throw error;
        res.json({
            data,
            page,
            pageSize,
            total: count,
            totalPages: Math.ceil((count || 0) / pageSize)
        });
    } catch (err) {
        console.error('Error fetching modules:', err);
        res.status(500).json({ error: 'Failed to fetch modules' });
    }
});

// 1b. GET /api/learning/level-status - Get which levels are unlocked for the user
router.get('/level-status', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const LEVEL_ORDER = ['beginner', 'intermediate', 'advanced', 'expert'];

        // Get all published modules grouped by level
        const { data: allModules, error: modErr } = await supabase
            .from('learning_modules')
            .select('id, level')
            .eq('is_published', true);

        if (modErr) throw modErr;

        // Get user completions
        const { data: completions, error: compErr } = await supabase
            .from('module_completions')
            .select('module_id')
            .eq('user_id', userId);

        if (compErr) throw compErr;

        const completedIds = new Set((completions || []).map(c => c.module_id));

        // Build per-level stats
        const levelStats = {};
        for (const level of LEVEL_ORDER) {
            const levelModules = (allModules || []).filter(m => m.level === level);
            const completedCount = levelModules.filter(m => completedIds.has(m.id)).length;
            levelStats[level] = { total: levelModules.length, completed: completedCount };
        }

        // Determine unlock status
        const status = {};
        for (let i = 0; i < LEVEL_ORDER.length; i++) {
            const level = LEVEL_ORDER[i];
            if (i === 0) {
                status[level] = { unlocked: true, ...levelStats[level] };
            } else {
                const prev = LEVEL_ORDER[i - 1];
                // ponytail: empty level = done (audit C7 fix — prevents permanent lockout)
                const prevDone = levelStats[prev].total === 0 || levelStats[prev].completed >= levelStats[prev].total;
                status[level] = { unlocked: prevDone, ...levelStats[level] };
            }
        }

        res.json(status);
    } catch (err) {
        console.error('Error fetching level status:', err);
        res.status(500).json({ error: 'Failed to fetch level status' });
    }
});

// 2. GET /api/learning/modules/:id - Get module details (level-gated)
router.get('/modules/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('learning_modules')
            .select('*')
            .eq('id', id)
            .eq('is_published', true)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Module not found' });

        // Level gating: check if user has access to this level
        const authHeader = req.headers.authorization;
        if (authHeader && data.level !== 'beginner') {
            try {
                const token = authHeader.replace('Bearer ', '');
                const { data: { user } } = await supabase.auth.getUser(token);
                if (user) {
                    const access = await checkLevelAccess(user.id, data.level);
                    if (!access.allowed) {
                        return res.status(403).json({ error: access.message, locked: true });
                    }
                }
            } catch (authErr) {
                // Auth check failed, but module content is public — allow read
            }
        }

        res.json(data);
    } catch (err) {
        console.error('Error fetching module:', err);
        res.status(500).json({ error: 'Failed to fetch module' });
    }
});

// 3. POST /api/learning/modules - Create module (Admin only)
router.post('/modules', authenticateUser, requireRole(['owner', 'admin']), async (req, res) => {
    try {
        const MODULE_FIELDS = ['title', 'description', 'level', 'order_index', 'learning_objectives', 'tool_ids', 'prerequisites', 'estimated_duration_minutes', 'is_published'];
        const moduleData = pick(req.body, MODULE_FIELDS);

        const { data, error } = await supabase
            .from('learning_modules')
            .insert([moduleData])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        console.error('Error creating module:', err);
        res.status(500).json({ error: 'Failed to create module' });
    }
});

// 4. GET /api/learning/quiz/:moduleId - Get random quiz questions (level-gated)
router.get('/quiz/:moduleId', authenticateUser, async (req, res) => {
    try {
        const { moduleId } = req.params;
        const count = parseInt(req.query.count) || 10;

        // Level gating: look up the module's level and check access
        const { data: mod } = await supabase.from('learning_modules').select('level').eq('id', moduleId).single();
        if (mod && mod.level !== 'beginner') {
            const access = await checkLevelAccess(req.user.id, mod.level);
            if (!access.allowed) return res.status(403).json({ error: access.message, locked: true });
        }

        // Get all active questions for the module
        const { data: allQuestions, error } = await supabase
            .from('quiz_questions')
            .select('id, question_text, options, difficulty, topic_tag')
            .eq('module_id', moduleId)
            .eq('is_active', true);

        if (error) throw error;

        // Randomly select questions (Fisher-Yates shuffle)
        const shuffled = [...allQuestions];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        const selected = shuffled.slice(0, Math.min(count, allQuestions.length));

        // Strip is_correct from options — client gets { text, id } only
        const sanitized = selected.map(q => ({
            ...q,
            options: q.options.map((opt, idx) => ({ text: opt.text, id: idx }))
        }));

        res.json(sanitized);
    } catch (err) {
        console.error('Error fetching quiz:', err);
        res.status(500).json({ error: 'Failed to fetch quiz' });
    }
});

// 5. POST /api/learning/quiz/:moduleId/submit - Submit quiz and get score (level-gated)
router.post('/quiz/:moduleId/submit', authenticateUser, async (req, res) => {
    try {
        const { moduleId } = req.params;
        const { answers } = req.body; // [{question_id, selected_option}]
        const userId = req.user.id;

        // Input validation (audit C1)
        if (!Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ error: 'answers must be a non-empty array' });
        }

        // Level gating
        const { data: mod } = await supabase.from('learning_modules').select('level').eq('id', moduleId).single();
        if (mod && mod.level !== 'beginner') {
            const access = await checkLevelAccess(userId, mod.level);
            if (!access.allowed) return res.status(403).json({ error: access.message, locked: true });
        }

        // Get correct answers
        const questionIds = answers.map(a => a.question_id);
        const { data: questions, error: questionsError } = await supabase
            .from('quiz_questions')
            .select('id, options, explanation, topic_tag')
            .in('id', questionIds);

        if (questionsError) throw questionsError;

        // Score the quiz — match by option index, guard null (audit C2, C3)
        let correctCount = 0;
        const detailedResults = answers.map(answer => {
            const question = questions.find(q => q.id === answer.question_id);
            if (!question) return null;

            const correctIndex = question.options.findIndex(opt => opt.is_correct);
            const correctOption = correctIndex >= 0 ? question.options[correctIndex] : null;
            const isCorrect = correctOption ? answer.selected_option === correctIndex : false;

            if (isCorrect) correctCount++;

            return {
                question_id: answer.question_id,
                selected_option: answer.selected_option,
                correct_option: correctIndex,
                is_correct: isCorrect,
                explanation: question.explanation || '',
                topic_tag: question.topic_tag
            };
        }).filter(Boolean);

        const score = Math.round((correctCount / detailedResults.length) * 100);
        const passed = score >= 90; // 90% passing threshold

        // Get failed topics for recommendations
        const failedTopics = detailedResults
            .filter(r => !r.is_correct)
            .map(r => r.topic_tag)
            .filter((v, i, a) => a.indexOf(v) === i); // unique

        // Save quiz attempt
        const { error: attemptError } = await supabase
            .from('quiz_attempts')
            .insert([{
                user_id: userId,
                module_id: moduleId,
                score,
                total_questions: answers.length,
                correct_answers: correctCount,
                answers: detailedResults,
                passed,
                completed_at: new Date().toISOString()
            }]);

        if (attemptError) console.error('Error saving quiz attempt:', attemptError);

        // --- If Passed, Mark Module as Complete ---
        if (passed) {
            // Check if already completed (UNIQUE constraint is the ultimate guard)
            const { data: existingCompletion } = await supabase
                .from('module_completions')
                .select('id')
                .eq('user_id', userId)
                .eq('module_id', moduleId)
                .single();

            if (!existingCompletion) {
                // Record Completion
                const { error: compErr } = await supabase
                    .from('module_completions')
                    .insert([{
                        user_id: userId,
                        module_id: moduleId,
                        completion_type: 'quiz',
                        quiz_score: score,
                        time_spent_minutes: 15
                    }]);

                // 23505 = already exists (race condition) — fine
                if (!compErr || compErr.code === '23505') {
                    // Atomic points increment (audit C4 fix)
                    await supabase.rpc('increment_points', { p_user_id: userId, p_points: 50 });

                    // Update completed_modules array
                    const { data: userProg } = await supabase
                        .from('user_progress')
                        .select('completed_modules')
                        .eq('user_id', userId)
                        .single();

                    if (userProg && !userProg.completed_modules?.includes(moduleId)) {
                        await supabase
                            .from('user_progress')
                            .update({ completed_modules: [...(userProg.completed_modules || []), moduleId] })
                            .eq('user_id', userId);
                    }
                }
            }
        }

        // --- AUTO-CHECK CERTIFICATIONS (consolidated helper) ---
        let newCertification = null;
        if (passed) {
            const awarded = await awardCertificationsForUser(supabase, userId);
            if (awarded.length > 0) {
                newCertification = awarded[0];
            }
        }

        res.json({
            score,
            passed,
            correct_count: correctCount,
            total_questions: answers.length,
            failed_topics: passed ? [] : failedTopics,
            detailed_results: detailedResults,
            new_certification: newCertification
        });
    } catch (err) {
        console.error('Error submitting quiz:', err);
        res.status(500).json({ error: 'Failed to submit quiz' });
    }
});

// 6. GET /api/learning/progress - Get user progress
router.get('/progress', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get or create user progress
        let { data: progress, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code === 'PGRST116') {
            // No progress found, create initial record
            const { data: newProgress, error: createError } = await supabase
                .from('user_progress')
                .insert([{
                    user_id: userId,
                    current_level: 'beginner',
                    completed_modules: [],
                    total_points: 0
                }])
                .select()
                .single();

            if (createError) throw createError;
            progress = newProgress;
        } else if (error) {
            throw error;
        }

        // Get module completions
        const { data: completions, error: completionsError } = await supabase
            .from('module_completions')
            .select('*')
            .eq('user_id', userId);

        if (completionsError) throw completionsError;

        res.json({
            ...progress,
            completions
        });
    } catch (err) {
        console.error('Error fetching progress:', err);
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
});

// 7. POST /api/learning/complete/:moduleId - Mark module as complete (reading-only; quiz completions go through quiz-submit)
router.post('/complete/:moduleId', authenticateUser, async (req, res) => {
    try {
        const { moduleId } = req.params;
        const { completion_type, time_spent_minutes } = pick(req.body, ['completion_type', 'time_spent_minutes']);
        const userId = req.user.id;

        // Quiz completions must go through the graded quiz-submit path (audit S2)
        if (completion_type === 'quiz') {
            return res.status(400).json({ error: 'Quiz completions must be submitted via /quiz/:moduleId/submit' });
        }

        // Insert completion — UNIQUE constraint prevents duplicates
        const { data: completion, error: completionError } = await supabase
            .from('module_completions')
            .insert([{
                user_id: userId,
                module_id: moduleId,
                completion_type: completion_type || 'reading',
                time_spent_minutes: time_spent_minutes || 0
            }])
            .select()
            .single();

        if (completionError) {
            // UNIQUE violation = already completed
            if (completionError.code === '23505') {
                return res.status(400).json({ error: 'Module already completed' });
            }
            throw completionError;
        }

        // Fixed points for reading completions (not client-supplied)
        const points = 25;

        // Update user progress
        const { data: progress } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (progress) {
            const updatedModules = [...(progress.completed_modules || []), moduleId];
            await supabase
                .from('user_progress')
                .update({
                    completed_modules: updatedModules,
                    total_points: progress.total_points + points
                })
                .eq('user_id', userId);

            // Gamification: 'First Step' badge
            if (updatedModules.length === 1) {
                const { data: achievement } = await supabase.from('achievements').select('id').eq('name', 'First Step').single();
                if (achievement) {
                    await supabase.from('user_achievements').insert([{ user_id: userId, achievement_id: achievement.id }]);
                }
            }
        }

        res.status(201).json(completion);
    } catch (err) {
        console.error('Error completing module:', err);
        res.status(500).json({ error: 'Failed to complete module' });
    }
});

module.exports = router;
