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
    const price = parseFloat(formData.get("price") as string);

    if (!image || !title || !stock || !price) {
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

    // 2. Get the user's profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      throw new Error("Could not find the user's profile.");
    }

    // 3. Save product details to the database
    const { data: productData, error: productError } = await supabase
      .from("products")
      .insert([
        {
          user_id: user.id,
          profile_id: profile.id, // Use the fetched profile_id
          title,
          description,
          tags,
          stock,
          image: imageData.path,
          price,
        },
      ])
      .select();

    if (productError) {
      throw productError;
    }

    return NextResponse.json(productData[0]);
  } catch (e: unknown) {
    console.error("Error creating product:", e); // Detailed server-side log
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    // Attempt to serialize the error if it's not a standard Error instance
    const errorMessage =
      typeof e === "object" && e !== null
        ? JSON.stringify(e)
        : "An unknown error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
