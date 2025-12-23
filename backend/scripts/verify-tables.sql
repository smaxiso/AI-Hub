SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('learning_streaks', 'achievements', 'user_achievements');
