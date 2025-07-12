'use client';

import Link from 'next/link';

// This would typically come from your database
const products = [
  { id: 1, name: 'Hand-painted Mug', stock: 15 },
  { id: 2, name: 'Crochet Bee', stock: 8 },
  { id: 3, name: 'Resin Coaster Set', stock: 22 },
];

export default function ProductsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl p-8 bg-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Your Products
          </h1>
          <Link
            href="/dashboard/products/new"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            + Add New Product
          </Link>
        </div>

        <div className="flow-root">
          <ul className="-my-5 divide-y divide-gray-200">
            {products.map((product) => (
              <li key={product.id} className="py-5">
                <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                  <h3 className="text-sm font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    Stock: {product.stock}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}