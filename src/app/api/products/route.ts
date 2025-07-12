import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to create a product." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const tags = formData.get("tags") as string;
    const stock = parseInt(formData.get("stock") as string, 10);

    if (!image || !title || !stock) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // 1. Upload image to Supabase Storage
    const fileExtension = image.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const { data: imageData, error: imageError } = await supabase.storage
      .from("product_images")
      .upload(fileName, image);

    if (imageError) {
      throw imageError;
    }

    // 2. Save product details to the database
    const { data: productData, error: productError } = await supabase
      .from("products")
      .insert([
        {
          user_id: user.id,
          profile_id: user.id, // Assuming profile_id is the same as user_id
          title,
          description,
          tags,
          stock,
          image_url: imageData.path,
        },
      ])
      .select();

    if (productError) {
      throw productError;
    }

    return NextResponse.json(productData[0]);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred." },
      { status: 500 }
    );
  }
}
