const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const { authenticateUser, requireRole } = require('../middleware/auth');
const { checkLevelAccess } = require('../middleware/helpers');

// 1. GET /api/learning/modules - List modules (optionally by level)
router.get('/modules', async (req, res) => {
    try {
        const { level } = req.query;

        let query = supabase
            .from('learning_modules')
            .select('*')
            .eq('is_published', true)
            .order('order_index', { ascending: true });

        if (level) {
            query = query.eq('level', level);
        }

        const { data, error } = await query;

        if (error) throw error;
        res.json(data);
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
                const prevDone = levelStats[prev].total > 0 && levelStats[prev].completed >= levelStats[prev].total;
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
        const moduleData = req.body;

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

        // Randomly select questions
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Math.min(count, allQuestions.length));

        res.json(selected);
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

        // Score the quiz
        let correctCount = 0;
        const detailedResults = answers.map(answer => {
            const question = questions.find(q => q.id === answer.question_id);
            if (!question) return null;

            const correctOption = question.options.find(opt => opt.is_correct);
            const isCorrect = answer.selected_option === correctOption.text;

            if (isCorrect) correctCount++;

            return {
                question_id: answer.question_id,
                selected_option: answer.selected_option,
                correct_option: correctOption.text,
                is_correct: isCorrect,
                explanation: question.explanation,
                topic_tag: question.topic_tag
            };
        });

        const score = Math.round((correctCount / answers.length) * 100);
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
            // Check if already completed
            const { data: existingCompletion } = await supabase
                .from('module_completions')
                .select('id')
                .eq('user_id', userId)
                .eq('module_id', moduleId)
                .single();

            if (!existingCompletion) {
                // Record Completion
                await supabase
                    .from('module_completions')
                    .insert([{
                        user_id: userId,
                        module_id: moduleId,
                        completion_type: 'quiz',
                        quiz_score: score,
                        time_spent_minutes: 15 // Estimate or track later
                    }]);

                // Update User Progress (Points + List)
                const { data: userProg } = await supabase
                    .from('user_progress')
                    .select('*')
                    .eq('user_id', userId)
                    .single();

                if (userProg) {
                    const alreadyListed = userProg.completed_modules?.includes(moduleId);
                    const updatedModules = alreadyListed
                        ? (userProg.completed_modules || [])
                        : [...(userProg.completed_modules || []), moduleId];

                    const newPoints = userProg.total_points + 50; // 50 pts for Quiz pass

                    await supabase
                        .from('user_progress')
                        .update({
                            completed_modules: updatedModules,
                            total_points: newPoints
                        })
                        .eq('user_id', userId);
                }
            }
        }

        // --- AUTO-CHECK CERTIFICATIONS ---
        let newCertification = null;
        if (passed) {
            try {
                // Get the module's level
                const { data: thisModule } = await supabase
                    .from('learning_modules')
                    .select('level')
                    .eq('id', moduleId)
                    .single();

                if (thisModule) {
                    // Check if there's a certification for this level that user hasn't earned
                    const { data: cert } = await supabase
                        .from('certifications')
                        .select('*')
                        .eq('level', thisModule.level)
                        .single();

                    if (cert) {
                        const { data: alreadyEarned } = await supabase
                            .from('user_certifications')
                            .select('id')
                            .eq('user_id', userId)
                            .eq('certification_id', cert.id)
                            .maybeSingle();

                        if (!alreadyEarned) {
                            // Check if all modules in this level are now completed
                            const { data: levelModules } = await supabase
                                .from('learning_modules')
                                .select('id')
                                .eq('level', thisModule.level)
                                .eq('is_published', true);

                            const { data: userCompletions } = await supabase
                                .from('module_completions')
                                .select('module_id, quiz_score')
                                .eq('user_id', userId);

                            const completedIds = new Set((userCompletions || []).map(c => c.module_id));
                            const allComplete = (levelModules || []).every(m => completedIds.has(m.id));

                            if (allComplete) {
                                const scores = (levelModules || []).map(m => {
                                    const comp = (userCompletions || []).find(c => c.module_id === m.id);
                                    return comp?.quiz_score || 0;
                                });
                                const avgScore = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100;
                                const certNum = `AIHUBX-${thisModule.level.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

                                const { error: certErr } = await supabase
                                    .from('user_certifications')
                                    .insert({ user_id: userId, certification_id: cert.id, score_average: avgScore, certificate_number: certNum });

                                if (!certErr) {
                                    // Add bonus points
                                    const { data: prog } = await supabase.from('user_progress').select('total_points').eq('user_id', userId).single();
                                    if (prog) {
                                        await supabase.from('user_progress').update({ total_points: prog.total_points + cert.points_awarded }).eq('user_id', userId);
                                    }
                                    newCertification = { name: cert.name, level: cert.level, points_awarded: cert.points_awarded, certificate_number: certNum };
                                }
                            }
                        }
                    }
                }
            } catch (certCheckErr) {
                console.error('Certification auto-check error (non-fatal):', certCheckErr.message);
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

// 7. POST /api/learning/complete/:moduleId - Mark module as complete
router.post('/complete/:moduleId', authenticateUser, async (req, res) => {
    try {
        const { moduleId } = req.params;
        const { completion_type, quiz_score, time_spent_minutes } = req.body;
        const userId = req.user.id;

        // Check if already completed
        const { data: existing } = await supabase
            .from('module_completions')
            .select('*')
            .eq('user_id', userId)
            .eq('module_id', moduleId)
            .single();

        if (existing) {
            return res.status(400).json({ error: 'Module already completed' });
        }

        // Insert completion
        const { data: completion, error: completionError } = await supabase
            .from('module_completions')
            .insert([{
                user_id: userId,
                module_id: moduleId,
                completion_type,
                quiz_score,
                time_spent_minutes
            }])
            .select()
            .single();

        if (completionError) throw completionError;

        // Update user progress
        const { data: progress } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (progress) {
            const updatedModules = [...(progress.completed_modules || []), moduleId];
            const points = progress.total_points + (completion_type === 'quiz' ? (quiz_score >= 90 ? 50 : 20) : 25);

            await supabase
                .from('user_progress')
                .update({
                    completed_modules: updatedModules,
                    total_points: points
                })
                .eq('user_id', userId);

            // --- GAMIFICATION CHECK ---
            // Check for 'First Step' (1 module)
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
