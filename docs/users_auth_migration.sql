-- ============================================================
-- Migration: add password-reset columns to users
-- Run this against BOTH local XAMPP MySQL and Railway MySQL
-- (Railway does not auto-apply schema changes — run manually).
-- NOTE: Railway's MySQL rejected "ADD COLUMN IF NOT EXISTS" with a
-- syntax error — check SHOW COLUMNS FROM users first and only run
-- the ADD COLUMN for whichever of these is actually missing.
-- ============================================================

ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) DEFAULT NULL;
ALTER TABLE users ADD COLUMN reset_token_expires TIMESTAMP NULL DEFAULT NULL;

-- ============================================================
-- Create your one admin account (edit values then run).
-- Password must be a bcrypt hash — easiest is to register once
-- via POST /api/auth/register, then delete that route if you
-- don't want open registration afterward.
-- ============================================================
