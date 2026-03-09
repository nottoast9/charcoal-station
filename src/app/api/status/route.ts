import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase';

// GET - Check storage status
export async function GET() {
  try {
    const usingSupabase = isSupabaseConfigured();
    
    return NextResponse.json({
      success: true,
      data: {
        storageMode: usingSupabase ? 'supabase' : 'none',
        configured: usingSupabase,
        message: usingSupabase 
          ? 'Data is stored in Supabase. All changes are automatically synced.'
          : 'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.',
      }
    });
  } catch (error) {
    console.error('Error checking storage status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check storage status' },
      { status: 500 }
    );
  }
}
