-- ========================================================
-- EMERGENCY UNLOCK SCRIPT
-- ========================================================
-- This script terminates ALL other connections to the database.
-- This clears any "Hanging Queries" or "Locks" that are stuck.

SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE pid <> pg_backend_pid()
  AND datname = current_database();

-- OPTIONAL: Verify the table is readable immediately after
SELECT count(*) as "Profile Count" FROM profiles;
