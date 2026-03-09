import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hashPassword, generateUserId, invalidateAllUserSessions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// GET - List all users (admin only)
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || !currentUser.is_admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: users, error } = await supabase
      .from('app_users')
      .select('id, username, full_name, is_active, is_admin, created_at, last_login')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Create new user (admin only)
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || !currentUser.is_admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { username, password, full_name, is_admin } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 4 characters' },
        { status: 400 }
      );
    }

    // Check if username exists
    const { data: existingUser } = await supabase
      .from('app_users')
      .select('id')
      .eq('username', username)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 400 }
      );
    }

    const userId = generateUserId();
    const passwordHash = hashPassword(password);

    const { data: newUser, error } = await supabase
      .from('app_users')
      .insert({
        id: userId,
        username,
        password_hash: passwordHash,
        full_name: full_name || '',
        is_admin: is_admin || false,
        is_active: true,
      })
      .select('id, username, full_name, is_active, is_admin, created_at')
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create user' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// PUT - Update user (admin only)
export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || !currentUser.is_admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, username, password, full_name, is_admin, is_active } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Prevent admin from deactivating themselves
    if (id === currentUser.id && is_active === false) {
      return NextResponse.json(
        { success: false, error: 'Cannot deactivate your own account' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (username !== undefined) updateData.username = username;
    if (full_name !== undefined) updateData.full_name = full_name;
    if (is_admin !== undefined) updateData.is_admin = is_admin;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (password) {
      updateData.password_hash = hashPassword(password);
    }

    const { data: updatedUser, error } = await supabase
      .from('app_users')
      .update(updateData)
      .eq('id', id)
      .select('id, username, full_name, is_active, is_admin, created_at, last_login')
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update user' },
        { status: 500 }
      );
    }

    // If user was deactivated, invalidate all their sessions
    if (is_active === false) {
      await invalidateAllUserSessions(id);
    }

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || !currentUser.is_admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Prevent admin from deleting themselves
    if (id === currentUser.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Invalidate all sessions first
    await invalidateAllUserSessions(id);

    // Delete user
    const { error } = await supabase
      .from('app_users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete user' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
