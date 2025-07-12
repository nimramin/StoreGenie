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
  price: number;
  stock: number;
  image: string | null;
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
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12 border-b pb-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 tracking-tight">{profile.store_name}</h1>
        </header>
        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {profile.products.map((product: Product) => {
              const firstImage = product.image;
              return (
                <div key={product.id} className="group relative bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                    {firstImage ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product_images/${firstImage}`}
                        alt={product.title}
                        className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      <Link href={`/${artistStore}/${product.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 truncate">{product.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-lg font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        product.stock > 10 ? 'bg-green-100 text-green-800' :
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}