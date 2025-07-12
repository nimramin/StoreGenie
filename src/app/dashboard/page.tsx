import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

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
    <div>
      <h1>Welcome to your Dashboard</h1>
      <p>You are logged in as: {data.user.email}</p>
      <form action={handleLogout}>
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}