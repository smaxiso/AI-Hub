-- Add unique constraint to name for UPSERT support
ALTER TABLE achievements ADD CONSTRAINT achievements_name_key UNIQUE (name);
