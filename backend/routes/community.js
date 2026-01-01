const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// Middleware to check if user is authenticated is applied globally or can be applied here
// Assuming req.user is populated by auth middleware

// POST /api/community/suggest - Create a new suggestion
router.post('/suggest', async (req, res) => {
    try {
        const { type, content } = req.body;
        const user_id = req.user.id;

        if (!['tool', 'quiz_question', 'feedback'].includes(type)) {
            return res.status(400).json({ error: 'Invalid type' });
        }

        const { data, error } = await supabase
            .from('community_suggestions')
            .insert([{ user_id, type, content }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating suggestion:', error);
        res.status(500).json({ error: 'Failed to submit suggestion' });
    }
});

// GET /api/community/suggestions - List suggestions (Admin only)
router.get('/suggestions', async (req, res) => {
    try {
        // Double check admin role if not done by middleware
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', req.user.id)
            .single();

        if (profile?.role !== 'owner') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const { data, error } = await supabase
            .from('community_suggestions')
            .select('*, profiles(username, full_name)')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).json({ error: 'Failed to fetch suggestions' });
    }
});

// PUT /api/community/suggestions/:id/status - Update status (Admin only)
router.put('/suggestions/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        // Double check admin role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', req.user.id)
            .single();

        if (profile?.role !== 'owner') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const { data, error } = await supabase
            .from('community_suggestions')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json(data);

    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// DELETE /api/community/suggestions/:id - Delete suggestion (Admin only)
router.delete('/suggestions/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Double check admin role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', req.user.id)
            .single();

        if (profile?.role !== 'owner') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const { error } = await supabase
            .from('community_suggestions')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(204).send();

    } catch (error) {
        console.error('Error deleting suggestion:', error);
        res.status(500).json({ error: 'Failed to delete suggestion' });
    }
});

module.exports = router;
