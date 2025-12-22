const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper: Calculate if tool is new (Added within last 30 days)
const isToolNew = (dateString) => {
    if (!dateString) return false;
    const addedDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - addedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
};

// Auth Middleware
const authenticateUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Missing authorization token' });

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) throw new Error('Invalid token');

        // Fetch User Profile & Role
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        // Attach user and role to request
        req.user = {
            ...user,
            role: profile?.role || 'pending', // Default to 'pending' if no profile
            profile
        };

        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Start Middleware for specific roles
const requireRole = (allowedRoles) => (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
};

// API Routes

// Health Check Endpoint (for uptime monitoring/cron jobs)
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// Public Signup Endpoint
app.post('/api/auth/signup', async (req, res) => {
    const { email, password, full_name, username } = req.body;

    let authId = null;

    try {
        // 1. Create Auth User
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name, username } // Store username in metadata too
        });

        if (authError) throw authError;
        authId = authData.user.id;

        // 2. Create Profile
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([{
                id: authId,
                email,
                full_name,
                username,
                role: 'pending'
            }]);

        if (profileError) {
            // Check for Unique Violation (Postgres Error Code 23505)
            if (profileError.code === '23505') {
                throw new Error('Username already taken');
            }
            throw profileError;
        }

        res.status(201).json({ message: 'User created successfully', user: authData.user });
    } catch (err) {
        console.error('Signup Error:', err);

        // Cleanup: Delete auth user if profile creation failed (and we created the user)
        if (authId) {
            await supabase.auth.admin.deleteUser(authId);
        }

        res.status(400).json({ error: err.message });
    }
});

// Login with Email or Username
app.post('/api/auth/login', async (req, res) => {
    const { identifier, password } = req.body;

    try {
        let email = identifier;

        // Check if identifier is username (doesn't contain @)
        if (!identifier.includes('@')) {
            const { data: profiles, error: profileError } = await supabase
                .from('profiles')
                .select('email')
                .eq('username', identifier);

            if (profileError || !profiles || profiles.length === 0) {
                return res.status(400).json({ error: 'Invalid username or password' });
            }

            email = profiles[0].email;
        }

        // Sign in with email
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        res.json({ user: data.user, session: data.session });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Public Learner Signup Endpoint (Auto-approved)
app.post('/api/auth/signup-learner', async (req, res) => {
    const { email, password, full_name, username } = req.body;

    let authId = null;

    try {
        // 1. Create Auth User
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name, username }
        });

        if (authError) throw authError;
        authId = authData.user.id;

        // 2. Create Profile with 'learner' role (auto-approved)
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([{
                id: authId,
                email,
                full_name,
                username,
                role: 'learner' // Auto-approved for public users
            }]);

        if (profileError) {
            if (profileError.code === '23505') {
                throw new Error('Username already taken');
            }
            throw profileError;
        }

        // 3. Auto-login: Create session for the user
        const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (sessionError) {
            // Still return success even if auto-login fails
            return res.status(201).json({
                message: 'Account created successfully! Please log in.',
                user: authData.user
            });
        }

        res.status(201).json({
            message: 'Account created and logged in successfully!',
            user: sessionData.user,
            session: sessionData.session
        });
    } catch (err) {
        console.error('Learner Signup Error:', err);

        // Cleanup: Delete auth user if profile creation failed
        if (authId) {
            await supabase.auth.admin.deleteUser(authId);
        }

        res.status(400).json({ error: err.message });
    }
});


// Check Username Availability
app.get('/api/auth/check-username', async (req, res) => {
    const { username } = req.query;
    if (!username) return res.status(400).json({ error: 'Username required' });

    try {
        const { count, error } = await supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .eq('username', username);

        if (error) throw error;

        res.json({ available: count === 0 });
    } catch (err) {
        console.error('Check Username Error:', err);
        res.status(500).json({ error: 'Failed to check username' });
    }
});

// GET /api/tools - Fetch all tools with dynamic isNew flag
app.get('/api/tools', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('tools')
            .select('*')
            .order('added_date', { ascending: false });

        if (error) throw error;

        // Enhance data with dynamic isNew flag
        const enhancedTools = data.map(tool => ({
            ...tool,
            isNew: isToolNew(tool.added_date)
        }));

        res.json(enhancedTools);
    } catch (err) {
        console.error('Error fetching tools:', err);
        res.status(500).json({ error: 'Failed to fetch tools' });
    }
});

// GET /api/tools/check-duplicate - Check if tool URL already exists
app.get('/api/tools/check-duplicate', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        const { data, error } = await supabase
            .from('tools')
            .select('id, name, category, added_date, url')
            .eq('url', url)
            .maybeSingle();

        if (error) throw error;

        if (data) {
            // Tool exists
            res.json({
                exists: true,
                tool: data
            });
        } else {
            // Tool does not exist
            res.json({ exists: false });
        }
    } catch (err) {
        console.error('Error checking duplicate:', err);
        res.status(500).json({ error: 'Failed to check for duplicates' });
    }
});

// POST /api/tools - Create new tool (Admin only)
app.post('/api/tools', authenticateUser, requireRole(['owner', 'admin']), async (req, res) => {
    const { id, name, url, category, description, tags, pricing, icon, use_cases, added_date } = req.body;

    // Auto-generate ID if not provided (simple slugify)
    const toolId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const addedDate = added_date || new Date().toISOString().split('T')[0];

    try {
        // Check for duplicate URL
        const { data: existing } = await supabase
            .from('tools')
            .select('id, name, url')
            .eq('url', url)
            .maybeSingle();

        if (existing) {
            return res.status(409).json({
                error: 'Duplicate tool',
                message: `A tool with this URL already exists: ${existing.name}`,
                existingTool: existing
            });
        }

        const { data, error } = await supabase
            .from('tools')
            .insert([{
                id: toolId, name, url, category, description, tags, pricing, icon, use_cases, added_date: addedDate
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        console.error('Error creating tool:', err);
        res.status(500).json({ error: 'Failed to create tool' });
    }
});

// PUT /api/tools/:id - Update tool (Admin only)
app.put('/api/tools/:id', authenticateUser, requireRole(['owner', 'admin']), async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const { data, error } = await supabase
            .from('tools')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Error updating tool:', err);
        res.status(500).json({ error: 'Failed to update tool' });
    }
});

// DELETE /api/tools/:id - Delete tool (Admin only)
app.delete('/api/tools/:id', authenticateUser, requireRole(['owner', 'admin']), async (req, res) => {
    const { id } = req.params;

    try {
        const { error } = await supabase
            .from('tools')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting tool:', err);
        res.status(500).json({ error: 'Failed to delete tool' });
    }
});

// --- User Management Endpoints (Owner Only) ---

// GET /api/admin/users - List all users/profiles
app.get('/api/admin/users', authenticateUser, requireRole(['owner']), async (req, res) => {
    try {
        // Fetch profiles
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// PUT /api/admin/users/:id/role - Update user role (Approve/Reject)
app.put('/api/admin/users/:id/role', authenticateUser, requireRole(['owner']), async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!['owner', 'admin', 'pending'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    try {
        const { data, error } = await supabase
            .from('profiles')
            .update({ role })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('Error updating user role:', err);
        res.status(500).json({ error: 'Failed to update user role' });
    }
});

// DELETE /api/admin/users/:id - Reject/Delete user (Owner Only)
app.delete('/api/admin/users/:id', authenticateUser, requireRole(['owner']), async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Delete from Supabase Auth (This usually cascades if set up, but we'll do both to be sure)
        const { error: authError } = await supabase.auth.admin.deleteUser(id);
        if (authError) throw authError;

        // 2. Delete from profiles (If not cascaded)
        const { error: profileError } = await supabase
            .from('profiles')
            .delete()
            .eq('id', id);

        if (profileError) {
            console.warn('Profile delete warning (might have cascaded):', profileError);
        }

        res.status(204).send();
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// ============================================
// LEARNING PLATFORM API ENDPOINTS
// ============================================

// 1. GET /api/learning/modules - List modules (optionally by level)
app.get('/api/learning/modules', async (req, res) => {
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

// 2. GET /api/learning/modules/:id - Get module details
app.get('/api/learning/modules/:id', async (req, res) => {
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

        res.json(data);
    } catch (err) {
        console.error('Error fetching module:', err);
        res.status(500).json({ error: 'Failed to fetch module' });
    }
});

// 3. POST /api/learning/modules - Create module (Admin only)
app.post('/api/learning/modules', authenticateUser, requireRole(['owner', 'admin']), async (req, res) => {
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

// 4. GET /api/learning/quiz/:moduleId - Get random quiz questions
app.get('/api/learning/quiz/:moduleId', authenticateUser, async (req, res) => {
    try {
        const { moduleId } = req.params;
        const count = parseInt(req.query.count) || 10;

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

// 5. POST /api/learning/quiz/:moduleId/submit - Submit quiz and get score
app.post('/api/learning/quiz/:moduleId/submit', authenticateUser, async (req, res) => {
    try {
        const { moduleId } = req.params;
        const { answers } = req.body; // [{question_id, selected_option}]
        const userId = req.user.id;

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

        res.json({
            score,
            passed,
            correct_count: correctCount,
            total_questions: answers.length,
            failed_topics: passed ? [] : failedTopics,
            detailed_results: detailedResults
        });
    } catch (err) {
        console.error('Error submitting quiz:', err);
        res.status(500).json({ error: 'Failed to submit quiz' });
    }
});

// 6. GET /api/learning/progress - Get user progress
app.get('/api/learning/progress', authenticateUser, async (req, res) => {
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
app.post('/api/learning/complete/:moduleId', authenticateUser, async (req, res) => {
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
        }

        res.status(201).json(completion);
    } catch (err) {
        console.error('Error completing module:', err);
        res.status(500).json({ error: 'Failed to complete module' });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
