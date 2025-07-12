import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to update a product." },
        { status: 401 }
      );
    }

    const { productId } = params;
    const { title, description, tags, stock, price } = await request.json();

    if (!title || !stock || !price) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Verify that the product belongs to the user
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("user_id")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.user_id !== user.id) {
      return NextResponse.json(
        { error: "You are not authorized to update this product." },
        { status: 403 }
      );
    }

    type UpdatePayload = {
      title?: string;
      description?: string;
      tags?: string;
      stock?: number;
      price?: number;
    };

    const updatePayload: UpdatePayload = {};
    if (title !== undefined) updatePayload.title = title;
    if (description !== undefined) updatePayload.description = description;
    if (tags !== undefined) updatePayload.tags = tags;
    if (stock !== undefined) updatePayload.stock = Number(stock);
    if (price !== undefined) updatePayload.price = Number(price);

    console.log('Update Payload:', updatePayload);
    console.log('Stock Type:', typeof updatePayload.stock);
    console.log('Price Type:', typeof updatePayload.price);

    const { error: updateError } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', productId);

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    const { data: updatedProduct, error: selectError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

    if (selectError) {
        return NextResponse.json({ error: selectError.message }, { status: 500 });
    }

    if (!updatedProduct) {
        return NextResponse.json({ error: 'Update failed or product not found after update.' }, { status: 500 });
    }

    return NextResponse.json(updatedProduct);
  } catch (e: unknown) {
    console.error("Error updating product:", e);
    let errorMessage = "An unknown error occurred.";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to delete a product." },
        { status: 401 }
      );
    }

    const { productId } = params;

    // Verify that the product belongs to the user
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("user_id, image")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.user_id !== user.id) {
      return NextResponse.json(
        { error: "You are not authorized to delete this product." },
        { status: 403 }
      );
    }

    // Delete the product image from storage
    if (product.image) {
      const { error: imageError } = await supabase.storage
        .from("product_images")
        .remove([product.image]);

      if (imageError) {
        // Log the error but don't block the product deletion
        console.error("Error deleting product image:", imageError);
      }
    }

    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (e: unknown) {
    console.error("Error deleting product:", e);
    let errorMessage = "An unknown error occurred.";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
