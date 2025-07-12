import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('Authentication Error:', error.message);
        return NextResponse.redirect(new URL('/login?error=Could not authenticate user', request.url));
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error('Callback Error:', e.message);
      }
      return NextResponse.redirect(new URL('/login?error=An unexpected error occurred', request.url));
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/dashboard', request.url));
}