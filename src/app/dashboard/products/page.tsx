import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Package } from "lucide-react";
import ProductActions from "@/components/ProductActions";

export default async function ProductsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    // Handle error appropriately
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Products</h1>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Product
          </Link>
        </Button>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-magic-accent">
        <CardHeader>
          <CardTitle>Your Product Listings</CardTitle>
        </CardHeader>
        <CardContent>
          {products && products.length > 0 ? (
            <ul className="divide-y divide-magic-accent/20">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="py-4 flex items-center space-x-4"
                >
                  <img
                    className="h-20 w-20 rounded-lg object-cover border-2 border-magic-accent/30"
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product_images/${product.image}`}
                    alt={product.title}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground truncate">
                      {product.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Stock: {product.stock} | Price: ${product.price}
                    </p>
                  </div>
                  <ProductActions productId={product.id} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-16">
              <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h2 className="mt-4 text-xl font-semibold text-foreground">
                No products yet!
              </h2>
              <p className="mt-2 text-muted-foreground">
                Click & Add New Product & to get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
