import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Get device info from headers
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                      request.headers.get('x-real-ip') || 
                      'Unknown';

    const result = await authenticateUser(
      username.trim(), 
      password, 
      userAgent, 
      ipAddress
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Login failed' },
        { status: 401 }
      );
    }

    // Set session cookie
    await setSessionCookie(result.sessionId!);

    return NextResponse.json({
      success: true,
      user: result.user,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred during login. Please try again.' },
      { status: 500 }
    );
  }
}
