'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// A simple spinner component for loading states
const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

interface WelcomeFormProps {
  initialStoreName: string;
  initialStoreSlug: string;
}

export default function WelcomeForm({ initialStoreName, initialStoreSlug }: WelcomeFormProps) {
  const router = useRouter();
  const [storeName, setStoreName] = useState(initialStoreName);
  const [storeSlug, setStoreSlug] = useState(initialStoreSlug);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    const response = await fetch('/api/profile/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeName, storeSlug }),
    });

    setIsSaving(false);
    if (response.ok) {
      router.push('/dashboard');
    } else {
      const data = await response.json();
      setError(data.error || 'Failed to update profile.');
    }
  };

  return (
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
          className="mt-1 block w-full"
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
            className="flex-1 block w-full"
            required
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isSaving}
        className="w-full px-4 py-3 flex justify-center items-center font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 disabled:bg-gray-400"
      >
        {isSaving && <Spinner />}
        {isSaving ? 'Saving...' : 'Save and Continue to Dashboard'}
      </button>
    </form>
  );
}