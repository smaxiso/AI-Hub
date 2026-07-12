const { supabase } = require('../supabaseClient');

// Auth Middleware — verifies JWT and attaches user + role to req
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

// Role-based access control middleware
const requireRole = (allowedRoles) => (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
};

module.exports = { authenticateUser, requireRole };
