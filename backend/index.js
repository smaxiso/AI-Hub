const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Shared middleware
const { authenticateUser, requireRole } = require('./middleware/auth');

// ─── Route Mounts ───

// Auth (profile, signup, login, check-username)
app.use('/api/auth', require('./routes/auth'));

// Tools (CRUD, check-duplicate, isNew flag)
app.use('/api/tools', require('./routes/tools'));

// Community (suggestions — requires auth)
app.use('/api/community', authenticateUser, require('./routes/community'));

// Admin — User Management (owner only)
app.use('/api/admin/users', authenticateUser, requireRole(['owner']), require('./routes/admin'));

// Learning Platform (modules, quizzes, progress, completions)
app.use('/api/learning', require('./routes/learning'));

// Gamification (badges, streaks — requires auth)
app.use('/api/gamification', authenticateUser, require('./routes/gamification'));

// Analytics (owner only)
app.use('/api/admin/analytics', authenticateUser, requireRole(['owner']), require('./routes/analytics'));

// Certifications (public listing + authenticated actions)
app.use('/api/certifications', require('./routes/certifications'));

// ─── Utility Endpoints ───

// Health Check Endpoint (for uptime monitoring/cron jobs)
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// DEBUG: Check Active Policies
app.get('/api/debug/policies', async (req, res) => {
    try {
        const { supabase } = require('./supabaseClient');
        const { data, error } = await supabase
            .from('pg_policies')
            .select('*')
            .eq('tablename', 'profiles');

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message, hint: "Make sure you have access to pg_policies" });
    }
});

// Health check (alternate path)
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Conditionally start server for local dev or Render
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

// Export for Vercel
module.exports = app;
