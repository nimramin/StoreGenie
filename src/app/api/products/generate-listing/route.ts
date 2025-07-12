import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { generateProductListing } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
    }

    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json({ error: 'No image provided.' }, { status: 400 });
    }

    const generatedData = await generateProductListing(image);

    return NextResponse.json(generatedData);

  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred.' }, { status: 500 });
  }
}