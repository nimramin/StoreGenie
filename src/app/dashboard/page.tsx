import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/login');
  }

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
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {data.user.email}
          </h1>
          <form action={handleLogout}>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700"
            >
              Logout
            </button>
          </form>
        </div>

        <nav>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li>
              <Link
                href="/dashboard/products"
                className="block p-6 text-center bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <h2 className="text-xl font-bold">Products</h2>
                <p>Manage your inventory and listings.</p>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/analytics"
                className="block p-6 text-center bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <h2 className="text-xl font-bold">Analytics</h2>
                <p>View sales and customer insights.</p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}