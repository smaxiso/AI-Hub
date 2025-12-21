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

// API Routes

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

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
