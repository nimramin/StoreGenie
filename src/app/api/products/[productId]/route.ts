import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'You must be logged in to update a product.' }, { status: 401 });
    }

    const { title, description, tags, stock, customization_possible } = await request.json();
    const { productId } = params;

    if (!title || stock === undefined) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('products')
      .update({
        title,
        description,
        tags,
        stock,
        customization_possible,
      })
      .eq('id', productId)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Product updated successfully.' });

  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred.' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'You must be logged in to delete a product.' }, { status: 401 });
    }

    const { productId } = params;

    // First, delete all images associated with the product from storage
    const { data: images, error: imagesError } = await supabase
      .from('product_images')
      .select('image_url')
      .eq('product_id', productId);

    if (imagesError) {
      throw imagesError;
    }

    if (images && images.length > 0) {
      const filePaths = images.map(image => image.image_url);
      await supabase.storage.from('product_images').remove(filePaths);
    }

    // Then, delete the product record itself
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
      .eq('user_id', user.id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ message: 'Product deleted successfully.' });

  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred.' }, { status: 500 });
  }
}