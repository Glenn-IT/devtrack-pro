-- ============================================================
-- Migration: user roles + activity log attribution
-- Run against BOTH local XAMPP MySQL and Railway MySQL.
-- Check SHOW COLUMNS first — Railway's MySQL does not support
-- "ADD COLUMN IF NOT EXISTS", only run whichever is missing.
-- ============================================================

-- users.role gates admin-only features (Payments, Analytics,
-- Settings/Export, and creating/editing/deleting projects & payments).
-- Existing accounts default to 'admin' so nobody gets locked out.
ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'admin';

-- activities.user_name attributes each logged action to who did it.
ALTER TABLE activities ADD COLUMN user_name VARCHAR(100) DEFAULT NULL;

-- ============================================================
-- Create a limited account (edit values then run), OR register
-- via POST /api/auth/register with { "role": "user" } in the body.
-- Password must be a bcrypt hash — easiest is to register via the
-- API so bcrypt hashing happens automatically.
-- ============================================================
