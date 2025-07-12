'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [storeName, setStoreName] = useState('');
  const [storeSlug, setStoreSlug] = useState('');
  const [loading] = useState(false); // Start with loading false
  const [error, setError] = useState('');

  // Get the user object on page load
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        // If no user, redirect to login
        router.push('/login');
      }
    };
    getUser();
  }, [router, supabase]);

  // Create a profile as soon as the user is available
  useEffect(() => {
    const createProfile = async () => {
      if (user) {
        // The upsert will create the profile if it doesn't exist,
        // or do nothing if it does.
        await supabase.from('profiles').upsert({ id: user.id, email: user.email });
      }
    };
    createProfile();
  }, [user, supabase]);

  // Pre-fill form with details from email
  useEffect(() => {
    if (user?.email) {
      const emailUsername = user.email.split('@')[0];
      
      // Create a store name: "john.doe" -> "John Doe"
      const suggestedName = emailUsername
        .split('.')
        .map(name => name.charAt(0).toUpperCase() + name.slice(1))
        .join(' ');
      setStoreName(suggestedName);

      // Create a store slug: "john.doe" -> "john-doe"
      const suggestedSlug = emailUsername.replace(/\./g, '-').toLowerCase();
      setStoreSlug(suggestedSlug);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!user) {
      setError('Could not identify user. Please try logging in again.');
      return;
    }

    // We will create this API endpoint in the next step
    const response = await fetch('/api/profile/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeName, storeSlug }),
    });

    if (response.ok) {
      router.push('/dashboard');
    } else {
      const data = await response.json();
      setError(data.error || 'Failed to update profile.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to StoreGenie!</h1>
        <p className="text-gray-600 mb-8">Let&apos;s set up your store.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
              Store Name
            </label>
            <input
              type="text"
              id="storeName"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="storeSlug" className="block text-sm font-medium text-gray-700">
              Store URL
            </label>
            <div className="flex items-center mt-1">
              <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                storegenie.com/
              </span>
              <input
                type="text"
                id="storeSlug"
                value={storeSlug}
                onChange={(e) => setStoreSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-3 font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900"
          >
            Save and Continue to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}