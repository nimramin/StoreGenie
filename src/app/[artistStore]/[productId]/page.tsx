import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    artistStore: string;
    productId: string;
  };
};

type Product = {
  title: string;
  description: string;
  stock: number;
  image: string | null;
  profiles: {
    store_name: string;
    store_slug: string;
  } | null;
};

export default async function ProductPage({ params }: Props) {
  const supabase = await createClient();
  const { artistStore, productId } = params;

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      title,
      description,
      stock,
      image,
      profiles (
        store_name,
        store_slug
      )
    `)
    .eq('id', productId)
    .single<Product>();

  if (error || !product || product.profiles?.store_slug !== artistStore) {
    notFound();
  }

  const { title, description, stock, image } = product;
  const storeName = product.profiles?.store_name;

  return (
    <div className="bg-white">
      <div className="pt-6">
        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="aspect-w-4 aspect-h-5 sm:overflow-hidden sm:rounded-lg">
            {image ? (
              <img
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product_images/${image}`}
                alt={title}
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded-lg">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">Stock: {stock}</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6 text-base text-gray-700" dangerouslySetInnerHTML={{ __html: description || '' }} />
            </div>

            <div className="mt-10">
              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add to bag
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">Sold by: {storeName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}