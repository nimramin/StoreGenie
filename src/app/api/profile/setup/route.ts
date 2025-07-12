import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'You must be logged in to update your profile.' }, { status: 401 });
    }

    const { storeName, storeSlug } = await request.json();

    if (!storeName || !storeSlug) {
      return NextResponse.json({ error: 'Store name and URL are required.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        store_name: storeName,
        store_slug: storeSlug,
        is_setup_complete: true,
      })
      .eq('id', user.id);

    if (error) {
      // Handle potential duplicate slug error
      if (error.code === '23505') {
        return NextResponse.json({ error: 'This store URL is already taken.' }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ message: 'Profile updated successfully.' });

  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred.' }, { status: 500 });
  }
}