const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const { authenticateUser } = require('../middleware/auth');

// GET /api/auth/profile - Get Current User Profile (Fast, RLS-Bypassed)
router.get('/profile', authenticateUser, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', req.user.id)
            .single();

        if (error) {
            // If row doesn't exist (PGRST116), Return null instead of error
            if (error.code === 'PGRST116') return res.json(null);
            throw error;
        }
        res.json(data);
    } catch (err) {
        console.error('Error fetching profile via Backend:', err);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// POST /api/auth/signup - Public Signup Endpoint
router.post('/signup', async (req, res) => {
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

// POST /api/auth/login - Login with Email or Username
router.post('/login', async (req, res) => {
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

// POST /api/auth/signup-learner - Public Learner Signup Endpoint (Auto-approved)
router.post('/signup-learner', async (req, res) => {
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

// GET /api/auth/check-username - Check Username Availability
router.get('/check-username', async (req, res) => {
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

module.exports = router;
