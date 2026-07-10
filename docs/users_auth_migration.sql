-- ============================================================
-- Migration: add password-reset columns to users
-- Run this against BOTH local XAMPP MySQL and Railway MySQL
-- (Railway does not auto-apply schema changes — run manually
-- via Railway's MySQL "Query" tab or a MySQL client).
-- ============================================================

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP NULL DEFAULT NULL;

-- ============================================================
-- Create your one admin account (edit values then run).
-- Password must be a bcrypt hash — easiest is to register once
-- via POST /api/auth/register, then delete that route if you
-- don't want open registration afterward.
-- ============================================================
