'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProductActions({ productId }: { productId: number }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setIsDeleting(true);
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Product deleted successfully');
        router.refresh();
      } else {
        const data = await response.json();
        alert(`Failed to delete product: ${data.error}`);
      }
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Link href={`/dashboard/products/${productId}/edit`} className="text-indigo-600 hover:text-indigo-900">
        Edit
      </Link>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-600 hover:text-red-900 disabled:opacity-50"
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}