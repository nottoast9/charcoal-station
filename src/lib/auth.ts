/**
 * Authentication Library
 * 
 * Handles user authentication with password hashing,
 * session management, and cookie-based persistence.
 */

import { cookies } from 'next/headers';
import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

// Session configuration
const SESSION_COOKIE_NAME = 'charcoal_session';
const SESSION_DURATION_DAYS = 30;
const SESSION_DURATION_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

// Password hashing using bcryptjs
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate secure session ID
export function generateSessionId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate user ID
export function generateUserId(): string {
  const prefix = 'USR';
  const number = Math.floor(Math.random() * 99999) + 1;
  return `${prefix}-${number.toString().padStart(5, '0')}`;
}

// User type
export interface AppUser {
  id: string;
  username: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  last_login: string | null;
}

// Authenticate user and create session
export async function authenticateUser(
  username: string,
  password: string,
  deviceInfo: string = '',
  ipAddress: string = ''
): Promise<{ 
  success: boolean; 
  user?: AppUser; 
  sessionId?: string; 
  error?: string 
}> {
  try {
    // Get user by username
    const { data: user, error } = await supabase
      .from('app_users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !user) {
      return { success: false, error: 'Invalid username or password' };
    }
    
    // Check if user is active
    if (!user.is_active) {
      return { success: false, error: 'Your account has been deactivated. Please contact the administrator.' };
    }
    
    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return { success: false, error: 'Invalid username or password' };
    }
    
    // Create session
    const sessionId = generateSessionId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS);
    
    const { error: sessionError } = await supabase
      .from('user_sessions')
      .insert({
        id: sessionId,
        user_id: user.id,
        device_info: deviceInfo,
        ip_address: ipAddress,
        created_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        is_valid: true,
      });
    
    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return { success: false, error: 'Failed to create session' };
    }
    
    // Update last_login
    await supabase
      .from('app_users')
      .update({ last_login: now.toISOString() })
      .eq('id', user.id);
    
    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user;
    
    return {
      success: true,
      user: userWithoutPassword as AppUser,
      sessionId,
    };
  } catch (error) {
    console.error('Error authenticating user:', error);
    return { success: false, error: 'Authentication failed. Please try again.' };
  }
}

// Get current session from cookie
export async function getSession(): Promise<{ userId: string; user: AppUser } | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    
    if (!sessionId) {
      return null;
    }
    
    // Get session from database
    const { data: session, error } = await supabase
      .from('user_sessions')
      .select('id, user_id, expires_at, is_valid')
      .eq('id', sessionId)
      .single();
    
    if (error || !session || !session.is_valid) {
      return null;
    }
    
    // Check if session expired
    if (new Date(session.expires_at) < new Date()) {
      await supabase
        .from('user_sessions')
        .update({ is_valid: false })
        .eq('id', sessionId);
      return null;
    }
    
    // Get user
    const { data: user, error: userError } = await supabase
      .from('app_users')
      .select('id, username, full_name, is_active, is_admin, created_at, last_login')
      .eq('id', session.user_id)
      .single();
    
    if (userError || !user || !user.is_active) {
      await supabase
        .from('user_sessions')
        .update({ is_valid: false })
        .eq('id', sessionId);
      return null;
    }
    
    return { userId: session.user_id, user };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

// Get current user
export async function getCurrentUser(): Promise<AppUser | null> {
  const session = await getSession();
  return session?.user || null;
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.user?.is_admin || false;
}

// Invalidate current session (logout)
export async function invalidateSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    
    if (sessionId) {
      await supabase
        .from('user_sessions')
        .update({ is_valid: false })
        .eq('id', sessionId);
    }
  } catch (error) {
    console.error('Error invalidating session:', error);
  }
}

// Invalidate all sessions for a user
export async function invalidateAllUserSessions(userId: string): Promise<void> {
  try {
    await supabase
      .from('user_sessions')
      .update({ is_valid: false })
      .eq('user_id', userId);
  } catch (error) {
    console.error('Error invalidating user sessions:', error);
  }
}

// Get session cookie options
export function getSessionCookieOptions(): {
  name: string;
  options: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'lax' | 'strict' | 'none';
    path: string;
    maxAge: number;
  };
} {
  return {
    name: SESSION_COOKIE_NAME,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
    },
  };
}

// Set session cookie
export async function setSessionCookie(sessionId: string): Promise<void> {
  const cookieStore = await cookies();
  const options = getSessionCookieOptions();
  cookieStore.set(options.name, sessionId, options.options);
}
