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

// POST /api/tools - Create new tool (Admin only)
app.post('/api/tools', authenticateUser, requireRole(['owner', 'admin']), async (req, res) => {
    const { id, name, url, category, description, tags, pricing, icon, use_cases, added_date } = req.body;

    // Auto-generate ID if not provided (simple slugify)
    const toolId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const addedDate = added_date || new Date().toISOString().split('T')[0];

    try {
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

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
