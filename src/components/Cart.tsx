"use client";

import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function Cart() {
  const { cart, isLoading } = useCart();

  const itemCount = cart?.cart_items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <Link href="/cart" className="group -m-2 flex items-center p-2">
      <ShoppingBagIcon
        className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
        aria-hidden="true"
      />
      <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
        {isLoading ? '...' : itemCount}
      </span>
      <span className="sr-only">items in cart, view bag</span>
    </Link>
  );
}