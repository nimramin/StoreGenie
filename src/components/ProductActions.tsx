'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

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
        // Using a more subtle notification would be better in a real app
        // For now, an alert is fine.
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
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button asChild variant="outline" size="icon">
            <Link href={`/dashboard/products/${productId}/edit`}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Link>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-auto px-3 py-1">
          <p className="text-sm">Edit product</p>
        </HoverCardContent>
      </HoverCard>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-auto px-3 py-1">
          <p className="text-sm">Delete product</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}