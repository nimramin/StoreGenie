import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ProductsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    // Handle error appropriately
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-4xl p-8 bg-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Your Products
          </h1>
          <Link
            href="/dashboard/products/new"
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900"
          >
            + Add New Product
          </Link>
        </div>

        <div className="flow-root">
          {products && products.length > 0 ? (
            <ul className="-my-5 divide-y divide-gray-200">
              {products.map((product) => (
                <li key={product.id} className="py-5 flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img className="h-16 w-16 rounded-lg object-cover" src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product_images/${product.image_url}`} alt={product.title} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Stock: {product.stock}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-700">No products yet!</h2>
              <p className="mt-2 text-gray-500">Click &quot;Add New Product&quot; to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}