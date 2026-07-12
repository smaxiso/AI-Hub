# TheAIHubX - Database Schema Documentation

This document serves as the central blueprint for the Supabase PostgreSQL database schema.

## Core Tables

### `profiles`
Tracks user accounts and Role-Based Access Control (RBAC).
- `id` (UUID, PK) - Maps to `auth.users(id)`
- `email` (TEXT)
- `full_name` (TEXT)
- `username` (TEXT)
- `role` (TEXT) - `owner`, `admin`, or `pending`. Default is `pending`.
- `created_at` / `updated_at` (TIMESTAMPTZ)
- **RLS**: Row Level Security enabled. Handled via backend middleware RBAC logic.

### `tools`
Primary registry of AI tools populated by the ingestion pipeline.
- `id` (TEXT, PK) - URL-safe slug
- `name` (TEXT)
- `url` (TEXT)
- `category` (TEXT)
- `icon` (TEXT)
- `description` (TEXT)
- `tags` (TEXT[])
- `pricing` (TEXT)
- `use_cases` (TEXT[])
- `added_date` (DATE)
- `embedding` (VECTOR(768)) - pgvector semantic embedding (Gemini text-embedding-004)
- `created_at` (TIMESTAMPTZ)
- **RLS**: N/A (Public read typically enforced at API level)

### `pipeline_runs`
Audit log for the automated weekly scraper pipeline.
- `id` (UUID, PK)
- `started_at` / `completed_at` (TIMESTAMPTZ)
- `status` (TEXT) - `running`, `completed`, `failed`
- Metrics: `total_scraped`, `total_classified`, `total_inserted`, `total_updated`, `total_skipped`, `total_errors` (INTEGER)
- `report` (JSONB)
- `error_message` (TEXT)
- **RLS**: `service_role` has full access, `owner` role can SELECT.

### `community_suggestions`
User-submitted tools and feedback.
- `id` (UUID, PK)
- `user_id` (UUID, FK profiles)
- `type` (VARCHAR) - `tool`, `quiz_question`, `feedback`
- `content` (JSONB)
- `status` (VARCHAR) - `pending`, `approved`, `rejected`
- **RLS**: Users can insert and select their own. `owner` role can read/update all.

---

## Learning Platform Tables

### `learning_modules`
Curriculum definitions.
- `id` (UUID, PK)
- `level` (TEXT) - `beginner`, `intermediate`, `advanced`, `expert`
- `order_index` (INTEGER)
- `title`, `description` (TEXT)
- `learning_objectives` (TEXT[])
- `tool_ids`, `prerequisites` (UUID[])
- `estimated_duration_minutes` (INTEGER)
- `is_published` (BOOLEAN)
- **RLS**: Public can view if `is_published = true`. Admins can manage all.

### `quiz_questions`
Questions pool for module assessments.
- `id` (UUID, PK)
- `module_id` (UUID, FK learning_modules)
- `question_text` (TEXT)
- `options` (JSONB) - array of `{text, is_correct}`
- `explanation`, `difficulty`, `topic_tag` (TEXT)
- `is_active` (BOOLEAN)
- **RLS**: Accessible through API only (Admins can manage via SQL policy).

### `user_progress`
High-level user learning state.
- `id` (UUID, PK)
- `user_id` (UUID, FK profiles, UNIQUE)
- `current_level` (TEXT)
- `completed_modules` (UUID[])
- `total_points` (INTEGER)
- **RLS**: Users can INSERT/SELECT/UPDATE their own.

### `module_completions`
Granular tracking per module.
- `id` (UUID, PK)
- `user_id` (UUID, FK profiles)
- `module_id` (UUID, FK learning_modules)
- `completion_type` (TEXT)
- `quiz_score`, `quiz_attempts`, `time_spent_minutes` (INTEGER)
- `failed_topics` (TEXT[])
- **RLS**: Users can INSERT/SELECT their own.

### `quiz_attempts`
Analytics table for individual quiz runs.
- `id` (UUID, PK)
- `user_id` (UUID), `module_id` (UUID)
- `score`, `total_questions`, `correct_answers` (INTEGER)
- `answers` (JSONB)
- `passed` (BOOLEAN)
- **RLS**: Users can INSERT/SELECT their own.

---

## Gamification & Certifications

### `achievements` & `user_achievements`
Badges earned by completing certain actions.
- `achievements`: Defines badges (`icon_key`, `requirement_type`, `points`). Admins manage, public reads.
- `user_achievements`: Maps `user_id` to `achievement_id`. Users view their own.

### `learning_streaks`
Daily activity tracking.
- `user_id` (UUID, FK profiles, UNIQUE)
- `current_streak`, `longest_streak` (INTEGER)
- `last_activity_date` (DATE)
- **RLS**: Users can view and update their own.

### `certifications` & `user_certifications`
Level-based milestone certificates.
- `certifications`: Defines certificates (`level`, `requirements` JSONB, `points_awarded`). Public read, service write.
- `user_certifications`: Maps `user_id` to `certification_id` with `certificate_number` and `score_average`. Users view their own, service write.
