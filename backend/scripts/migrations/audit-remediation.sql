-- Audit Remediation Migration
-- Run this in Supabase SQL Editor BEFORE deploying backend code that uses these features.
-- Safe to run multiple times (IF NOT EXISTS / OR REPLACE).

-- 1. Atomic points increment RPC (avoids read-modify-write race conditions)
CREATE OR REPLACE FUNCTION increment_points(p_user_id UUID, p_points INT)
RETURNS void AS $$
BEGIN
    UPDATE user_progress
    SET total_points = total_points + p_points
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. UNIQUE constraint: one completion per user per module (idempotency)
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_module_completions_user_module'
    ) THEN
        ALTER TABLE module_completions
            ADD CONSTRAINT uq_module_completions_user_module UNIQUE (user_id, module_id);
    END IF;
END $$;

-- 3. UNIQUE constraint: one cert award per user per certification
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_user_certifications_user_cert'
    ) THEN
        ALTER TABLE user_certifications
            ADD CONSTRAINT uq_user_certifications_user_cert UNIQUE (user_id, certification_id);
    END IF;
END $$;

-- 4. UNIQUE constraint: certificate numbers must be globally unique
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_user_certifications_cert_number'
    ) THEN
        ALTER TABLE user_certifications
            ADD CONSTRAINT uq_user_certifications_cert_number UNIQUE (certificate_number);
    END IF;
END $$;
