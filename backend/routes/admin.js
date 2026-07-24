const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// Note: authenticateUser + requireRole(['owner']) are applied at mount level in index.js

// GET /api/admin/users - List all users/profiles
router.get('/users', async (req, res) => {
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
router.put('/users/:id/role', async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!['owner', 'admin', 'learner', 'pending'].includes(role)) {
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
router.delete('/users/:id', async (req, res) => {
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

module.exports = router;
