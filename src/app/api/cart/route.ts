import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { product_id, quantity } = await request.json();

  if (!product_id || !quantity) {
    return NextResponse.json(
      { error: 'Product ID and quantity are required' },
      { status: 400 }
    );
  }

  let cart;
  let cartError;

  if (user) {
    // User is logged in
    ({ data: cart, error: cartError } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', user.id)
      .single());
  } else {
    // Guest user
    const sessionId = cookieStore.get('session_id')?.value;
    if (sessionId) {
      ({ data: cart, error: cartError } = await supabase
        .from('carts')
        .select('*')
        .eq('session_id', sessionId)
        .single());
    }
  }

  if (cartError && cartError.code !== 'PGRST116') {
    // PGRST116 means no rows found, which is fine
    console.error('Error fetching cart:', cartError);
    return NextResponse.json({ error: 'Error fetching cart' }, { status: 500 });
  }

  if (!cart) {
    // No cart exists, create one
    const newCartData: { user_id?: string; session_id?: string } = {};
    if (user) {
      newCartData.user_id = user.id;
    } else {
      const newSessionId = uuidv4();
      newCartData.session_id = newSessionId;
      cookieStore.set('session_id', newSessionId, { path: '/' });
    }

    const { data: newCart, error: newCartError } = await supabase
      .from('carts')
      .insert(newCartData)
      .select()
      .single();

    if (newCartError) {
      console.error('Error creating cart:', newCartError);
      return NextResponse.json(
        { error: 'Error creating cart' },
        { status: 500 }
      );
    }
    cart = newCart;
  }

  // Check if item already exists in cart
  const { data: existingItem, error: existingItemError } = await supabase
    .from('cart_items')
    .select('*')
    .eq('cart_id', cart.id)
    .eq('product_id', product_id)
    .single();

  if (existingItemError && existingItemError.code !== 'PGRST116') {
    console.error('Error checking for existing item:', existingItemError);
    return NextResponse.json(
      { error: 'Error checking for existing item' },
      { status: 500 }
    );
  }

  if (existingItem) {
    // Update quantity
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id);

    if (updateError) {
      console.error('Error updating cart item:', updateError);
      return NextResponse.json(
        { error: 'Error updating cart item' },
        { status: 500 }
      );
    }
  } else {
    // Add new item
    const { error: insertError } = await supabase
      .from('cart_items')
      .insert({ cart_id: cart.id, product_id, quantity });

    if (insertError) {
      console.error('Error adding item to cart:', insertError);
      return NextResponse.json(
        { error: 'Error adding item to cart' },
        { status: 500 }
      );
    }
  }

  // Return the updated cart
  const { data: updatedCart, error: updatedCartError } = await supabase
    .from('carts')
    .select('*, cart_items(*, products(*))')
    .eq('id', cart.id)
    .single();

  if (updatedCartError) {
    console.error('Error fetching updated cart:', updatedCartError);
    return NextResponse.json(
      { error: 'Error fetching updated cart' },
      { status: 500 }
    );
  }

  return NextResponse.json(updatedCart);
}

export async function GET() {
  const cookieStore = await cookies();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let cart;
  let cartError;

  if (user) {
    // User is logged in
    ({ data: cart, error: cartError } = await supabase
      .from('carts')
      .select('*, cart_items(*, products(*))')
      .eq('user_id', user.id)
      .single());
  } else {
    // Guest user
    const sessionId = cookieStore.get('session_id')?.value;
    if (sessionId) {
      ({ data: cart, error: cartError } = await supabase
        .from('carts')
        .select('*, cart_items(*, products(*))')
        .eq('session_id', sessionId)
        .single());
    }
  }

  if (cartError && cartError.code !== 'PGRST116') {
    console.error('Error fetching cart:', cartError);
    return NextResponse.json({ error: 'Error fetching cart' }, { status: 500 });
  }

  return NextResponse.json(cart);
}

export async function PUT(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { cart_item_id, quantity } = await request.json();

  if (!cart_item_id || quantity === undefined) {
    return NextResponse.json(
      { error: 'Cart item ID and quantity are required' },
      { status: 400 }
    );
  }

  // Verify that the cart item belongs to the user's cart
  const { data: cartItem, error: itemError } = await supabase
    .from('cart_items')
    .select('*, carts(*)')
    .eq('id', cart_item_id)
    .single();

  if (itemError || !cartItem || cartItem.carts.user_id !== user.id) {
    return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
  }

  if (quantity === 0) {
    // Delete the item if quantity is 0
    const { error: deleteError } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cart_item_id);

    if (deleteError) {
      console.error('Error deleting cart item:', deleteError);
      return NextResponse.json(
        { error: 'Error deleting cart item' },
        { status: 500 }
      );
    }
  } else {
    // Update the quantity
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cart_item_id);

    if (updateError) {
      console.error('Error updating cart item:', updateError);
      return NextResponse.json(
        { error: 'Error updating cart item' },
        { status: 500 }
      );
    }
  }

  // Return the updated cart
  const { data: updatedCart, error: updatedCartError } = await supabase
    .from('carts')
    .select('*, cart_items(*, products(*))')
    .eq('user_id', user.id)
    .single();

  if (updatedCartError) {
    console.error('Error fetching updated cart:', updatedCartError);
    return NextResponse.json(
      { error: 'Error fetching updated cart' },
      { status: 500 }
    );
  }

  return NextResponse.json(updatedCart);
}

export async function DELETE(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { cart_item_id } = await request.json();

  if (!cart_item_id) {
    return NextResponse.json(
      { error: 'Cart item ID is required' },
      { status: 400 }
    );
  }

  // Verify that the cart item belongs to the user's cart
  const { data: cartItem, error: itemError } = await supabase
    .from('cart_items')
    .select('*, carts(*)')
    .eq('id', cart_item_id)
    .single();

  if (itemError || !cartItem || cartItem.carts.user_id !== user.id) {
    return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
  }

  // Delete the item
  const { error: deleteError } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cart_item_id);

  if (deleteError) {
    console.error('Error deleting cart item:', deleteError);
    return NextResponse.json(
      { error: 'Error deleting cart item' },
      { status: 500 }
    );
  }

  // Return the updated cart
  const { data: updatedCart, error: updatedCartError } = await supabase
    .from('carts')
    .select('*, cart_items(*, products(*))')
    .eq('user_id', user.id)
    .single();

  if (updatedCartError) {
    console.error('Error fetching updated cart:', updatedCartError);
    return NextResponse.json(
      { error: 'Error fetching updated cart' },
      { status: 500 }
    );
  }

  return NextResponse.json(updatedCart);
}