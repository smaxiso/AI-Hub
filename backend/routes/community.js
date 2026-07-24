const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const { requireRole } = require('../middleware/auth');
const { parsePagination } = require('../middleware/helpers');

// Note: authenticateUser is applied at mount level in index.js

// POST /api/community/suggest - Create a new suggestion (any authenticated user)
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

// GET /api/community/suggestions - List suggestions (Owner/Admin only, paginated)
router.get('/suggestions', requireRole(['owner', 'admin']), async (req, res) => {
    try {
        const { from, to, page, pageSize } = parsePagination(req);

        const { data, error, count } = await supabase
            .from('community_suggestions')
            .select('*, profiles(username, full_name)', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        res.json({
            data,
            page,
            pageSize,
            total: count,
            totalPages: Math.ceil((count || 0) / pageSize)
        });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).json({ error: 'Failed to fetch suggestions' });
    }
});

// PUT /api/community/suggestions/:id/status - Update status (Owner/Admin only)
router.put('/suggestions/:id/status', requireRole(['owner', 'admin']), async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

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

// DELETE /api/community/suggestions/:id - Delete suggestion (Owner/Admin only)
router.delete('/suggestions/:id', requireRole(['owner', 'admin']), async (req, res) => {
    try {
        const { id } = req.params;

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
