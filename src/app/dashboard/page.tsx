'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email);
    };
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      {userEmail ? (
        <p>You are logged in as: {userEmail}</p>
      ) : (
        <p>Loading user information...</p>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}