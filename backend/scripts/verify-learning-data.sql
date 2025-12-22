-- ============================================
-- Verification Script - Check Learning Platform Data
-- Run this to see what currently exists
-- ============================================

-- Check existing modules
SELECT 
    level,
    order_index,
    title,
    is_published,
    created_at
FROM learning_modules
ORDER BY level, order_index;

-- Count modules by level
SELECT 
    level,
    COUNT(*) as module_count
FROM learning_modules
GROUP BY level
ORDER BY 
    CASE level
        WHEN 'beginner' THEN 1
        WHEN 'intermediate' THEN 2
        WHEN 'advanced' THEN 3
        WHEN 'expert' THEN 4
    END;

-- Check quiz questions count per module
SELECT 
    lm.title as module_title,
    COUNT(qq.id) as question_count
FROM learning_modules lm
LEFT JOIN quiz_questions qq ON lm.id = qq.module_id
GROUP BY lm.id, lm.title
ORDER BY lm.order_index;

-- Check for any user progress
SELECT 
    COUNT(*) as users_with_progress
FROM user_progress;

-- Check for any completed modules
SELECT 
    COUNT(*) as total_completions
FROM module_completions;

-- Summary
SELECT 
    (SELECT COUNT(*) FROM learning_modules) as total_modules,
    (SELECT COUNT(*) FROM quiz_questions) as total_questions,
    (SELECT COUNT(*) FROM user_progress) as users_tracked,
    (SELECT COUNT(*) FROM module_completions) as completions,
    (SELECT COUNT(*) FROM quiz_attempts) as quiz_attempts;
