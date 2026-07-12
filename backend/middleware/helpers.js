const { supabase } = require('../supabaseClient');

/**
 * A tool is "new" if it was created within the last 14 days.
 * Prefers created_at (auto-set by Supabase) over added_date (manual).
 */
const isToolNew = (addedDate, createdAt) => {
    const ref = createdAt ? new Date(createdAt) : addedDate ? new Date(addedDate) : null;
    if (!ref || isNaN(ref.getTime())) return false;
    const diffDays = Math.ceil((Date.now() - ref.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 14;
};

// Level progression order for the learning platform
const LEVEL_ORDER = ['beginner', 'intermediate', 'advanced', 'expert'];

/**
 * Check if user has completed all modules in the previous level.
 * Returns { allowed: true } or { allowed: false, message: '...' }
 */
async function checkLevelAccess(userId, moduleLevel) {
    const levelIdx = LEVEL_ORDER.indexOf(moduleLevel);
    // Beginner is always accessible
    if (levelIdx <= 0) return { allowed: true };

    const prevLevel = LEVEL_ORDER[levelIdx - 1];

    // Get all published modules in the previous level
    const { data: prevModules, error: modErr } = await supabase
        .from('learning_modules')
        .select('id')
        .eq('level', prevLevel)
        .eq('is_published', true);

    if (modErr) throw modErr;
    if (!prevModules || prevModules.length === 0) return { allowed: true };

    // Get user's completions
    const { data: completions, error: compErr } = await supabase
        .from('module_completions')
        .select('module_id')
        .eq('user_id', userId);

    if (compErr) throw compErr;

    const completedIds = new Set((completions || []).map(c => c.module_id));
    const allDone = prevModules.every(m => completedIds.has(m.id));

    if (!allDone) {
        const completed = prevModules.filter(m => completedIds.has(m.id)).length;
        return {
            allowed: false,
            message: `Complete all ${prevLevel} modules first (${completed}/${prevModules.length} done)`
        };
    }
    return { allowed: true };
}

module.exports = { isToolNew, checkLevelAccess, LEVEL_ORDER };
