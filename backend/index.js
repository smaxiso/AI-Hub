const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['https://aihubx.web.app', 'http://localhost:5173']
}));
app.use(express.json());

// Shared middleware
const { authenticateUser, requireRole } = require('./middleware/auth');

// ─── Route Mounts ───

// Rate limit auth routes (audit S8)
const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    message: { error: 'Too many requests, please try again later', retryAfter: 60 }
});

// Auth (profile, signup, login, check-username)
app.use('/api/auth', authLimiter, require('./routes/auth'));

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

// ponytail: debug endpoint removed — leaked DB policy metadata unauthenticated (audit S4)

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
