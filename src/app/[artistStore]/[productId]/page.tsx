import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import ProductDetails from './product-details';

type Props = {
  params: {
    artistStore: string;
    productId: string;
  };
};

type Product = {
  id: string;
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
      id,
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

  const productDetailsProps = {
    id: product.id,
    title: product.title,
    description: product.description,
    stock: product.stock,
    image: product.image,
    storeName: product.profiles?.store_name,
  };

  return <ProductDetails product={productDetailsProps} />;
}