"use client";

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  image: string | null;
  storeName: string | undefined;
};

export default function ProductDetails({ product }: { product: Product }) {
  const [quantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { refetch } = useCart();

  const addToCart = async () => {
    setIsAdding(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: product.id, quantity }),
      });

      if (response.ok) {
        refetch();
        alert('Added to cart!');
      } else {
        alert('Error adding to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="pt-6">
        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="aspect-w-4 aspect-h-5 sm:overflow-hidden sm:rounded-lg">
            {product.image ? (
              <img
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product_images/${product.image}`}
                alt={product.title}
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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.title}</h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">${product.price.toFixed(2)}</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6 text-base text-gray-700" dangerouslySetInnerHTML={{ __html: product.description || '' }} />
            </div>

            <div className="mt-10">
              <button
                type="button"
                onClick={addToCart}
                disabled={isAdding}
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isAdding ? 'Adding...' : 'Add to bag'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">Sold by: {product.storeName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}