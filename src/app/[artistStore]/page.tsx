import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Props = {
  params: {
    artistStore: string;
  };
};

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  image: string | null;
};

export default async function StorePage({ params }: Props) {
  const supabase = await createClient();
  const { artistStore } = params;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(`
      store_name,
      products (
        id,
        title,
        description,
        price,
        stock,
        image
      )
    `)
    .eq('store_slug', artistStore)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-magic-accent/20 to-magic-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Welcome to <span className="bg-gradient-to-r from-magic-primary to-magic-secondary bg-clip-text text-transparent">{profile.store_name}</span>
          </h1>
        </header>
        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {profile.products.map((product: Product) => (
              <Card key={product.id} className="bg-card/80 backdrop-blur-sm border-magic-accent hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden group">
                <Link href={`/${artistStore}/${product.id}`}>
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                    {product.image ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product_images/${product.image}`}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No Image</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-foreground truncate">{product.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground truncate">{product.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-xl font-bold text-magic-primary">${product.price.toFixed(2)}</p>
                      <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </Badge>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}