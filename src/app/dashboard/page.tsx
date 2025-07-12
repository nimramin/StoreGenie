import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('store_name, store_slug')
    .eq('id', user.id)
    .single();

  const handleLogout = async () => {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl p-8 bg-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {profile?.store_name || 'Your Dashboard'}
            </h1>
            {profile?.store_slug && (
              <a
                href={`/${profile.store_slug}`}
                className="text-sm text-indigo-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {`storegenie.com/${profile.store_slug}`}
              </a>
            )}
          </div>
          <form action={handleLogout}>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900"
            >
              Logout
            </button>
          </form>
        </div>

        <nav>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <li>
              <Link
                href="/dashboard/products"
                className="block p-8 text-center bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all"
              >
                <h2 className="text-2xl font-bold text-gray-800">Products</h2>
                <p className="text-gray-600 mt-1">Manage your inventory and listings.</p>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/analytics"
                className="block p-8 text-center bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all"
              >
                <h2 className="text-2xl font-bold text-gray-800">Analytics</h2>
                <p className="text-gray-600 mt-1">View sales and customer insights.</p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}