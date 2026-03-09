-- ============================================
-- Charcoal Station - Authentication Tables
-- Run this in your Supabase SQL Editor
-- ============================================

-- ============================================
-- APP USERS TABLE
-- For admin-managed authentication
-- ============================================
CREATE TABLE IF NOT EXISTS app_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT DEFAULT '',
    is_active BOOLEAN DEFAULT true,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_app_users_username ON app_users(username);
CREATE INDEX IF NOT EXISTS idx_app_users_active ON app_users(is_active);

-- ============================================
-- USER SESSIONS TABLE
-- For persistent login sessions
-- ============================================
CREATE TABLE IF NOT EXISTS user_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    device_info TEXT DEFAULT '',
    ip_address TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    is_valid BOOLEAN DEFAULT true
);

-- Create indexes for user_sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_valid ON user_sessions(is_valid);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

-- ============================================
-- RLS POLICIES - Allow all for simplicity
-- ============================================

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Allow public all on app_users" ON app_users;
    DROP POLICY IF EXISTS "Allow public all on user_sessions" ON user_sessions;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- Enable RLS
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create permissive policies
CREATE POLICY "Allow public all on app_users" ON app_users
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public all on user_sessions" ON user_sessions
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- DEFAULT ADMIN USER
-- Username: admin
-- Password: admin123
-- 
-- IMPORTANT: Change this password after first login!
-- Go to Users tab (admin only) to change passwords
-- ============================================

-- Password hash for 'admin123' using bcryptjs
-- This hash was generated with bcrypt.hash('admin123', 10)
INSERT INTO app_users (id, username, password_hash, full_name, is_active, is_admin)
VALUES (
    'USR-00001',
    'admin',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.iW8jY9D6aV7xTk5mO2',
    'Administrator',
    true,
    true
) ON CONFLICT (username) DO NOTHING;

-- ============================================
-- COMPLETE! 
-- 
-- Default Login Credentials:
-- Username: admin
-- Password: admin123
-- 
-- After logging in, go to Users tab to:
-- 1. Change the admin password
-- 2. Add new users
-- ============================================
