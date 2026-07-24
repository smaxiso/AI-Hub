const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const { authenticateUser, requireRole } = require('../middleware/auth');
const { isToolNew, pick, parsePagination } = require('../middleware/helpers');

// GET /api/tools - Fetch all tools with dynamic isNew flag (paginated)
router.get('/', async (req, res) => {
    try {
        const { from, to, page, pageSize } = parsePagination(req);

        const { data, error, count } = await supabase
            .from('tools')
            .select('id, name, url, category, categories, description, tags, pricing, icon, use_cases, added_date, created_at', { count: 'exact' })
            .order('added_date', { ascending: false })
            .range(from, to);

        if (error) throw error;

        // Enhance data with dynamic isNew flag and categories array; exclude embedding from response
        const enhancedTools = data.map(({ embedding, ...tool }) => ({
            ...tool,
            isNew: isToolNew(tool.added_date, tool.created_at),
            categories: tool.categories || (tool.category ? [tool.category] : [])
        }));

        res.json({
            data: enhancedTools,
            page,
            pageSize,
            total: count,
            totalPages: Math.ceil((count || 0) / pageSize)
        });
    } catch (err) {
        console.error('Error fetching tools:', err);
        res.status(500).json({ error: 'Failed to fetch tools' });
    }
});

// GET /api/tools/check-duplicate - Check if tool URL already exists
router.get('/check-duplicate', async (req, res) => {
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

// GET /api/tools/:id/related - Semantic Vector Search for similar tools
router.get('/:id/related', async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase.rpc('match_related_tools', {
            target_tool_id: id,
            match_threshold: 0.6, // Return tools with >60% similarity
            match_count: 4        // Return top 4 tools
        });

        if (error) throw error;

        res.json(data || []);
    } catch (err) {
        console.error('Error fetching related tools:', err);
        res.status(500).json({ error: 'Failed to fetch related tools' });
    }
});

// POST /api/tools - Create new tool (Admin only)

router.post('/', authenticateUser, requireRole(['owner', 'admin']), async (req, res) => {
    const { id, name, url, category, categories, description, tags, pricing, icon, use_cases, added_date } = req.body;

    // Auto-generate ID if not provided (simple slugify)
    const toolId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const addedDate = added_date || new Date().toISOString().split('T')[0];
    // Default categories to [category] if not provided
    const toolCategories = categories || (category ? [category] : []);

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
                id: toolId, name, url, category, categories: toolCategories, description, tags, pricing, icon, use_cases, added_date: addedDate
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
router.put('/:id', authenticateUser, requireRole(['owner', 'admin']), async (req, res) => {
    const { id } = req.params;
    const TOOL_UPDATE_FIELDS = ['name', 'url', 'category', 'categories', 'description', 'tags', 'pricing', 'icon', 'use_cases'];
    const updates = pick(req.body, TOOL_UPDATE_FIELDS);

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
    }

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
router.delete('/:id', authenticateUser, requireRole(['owner', 'admin']), async (req, res) => {
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

module.exports = router;
