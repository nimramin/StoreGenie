import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type Props = {
  params: {
    artistStore: string;
  };
};

type Product = {
  id: string;
  title: string;
  description: string;
  stock: number;
  product_images: { image_url: string | null }[];
};

export default async function StorePage({ params }: Props) {
  const supabase = await createClient();
  const { artistStore } = params;

  // Fetch the profile and the products for this store slug
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(`
      store_name,
      products (
        id,
        title,
        description,
        stock,
        product_images (
          image_url
        )
      )
    `)
    .eq('store_slug', artistStore)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="text-center my-8 md:my-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{profile.store_name}</h1>
      </header>
      <main>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {profile.products.map((product: Product) => {
            const firstImage = product.product_images?.[0]?.image_url;
            return (
              <Link href={`/${artistStore}/${product.id}`} key={product.id} className="group block border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="relative">
                  {firstImage ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product_images/${firstImage}`}
                      alt={product.title}
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-white">
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">{product.title}</h2>
                  <p className="text-gray-600 mt-2 truncate">{product.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-900">Stock: {product.stock}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}