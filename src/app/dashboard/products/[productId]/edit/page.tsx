'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

// A simple spinner component for loading states
const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export default function EditProductPage({ params }: { params: { productId: string } }) {
    const router = useRouter();
    const supabase = createClient();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [stock, setStock] = useState(1);
    const [customizationPossible, setCustomizationPossible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const getProduct = useCallback(async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', params.productId)
            .single();

        if (error) {
            console.error('Error fetching product:', error);
            setError('Failed to load product data.');
        } else if (data) {
            setTitle(data.title);
            setDescription(data.description || '');
            setTags(data.tags || '');
            setStock(data.stock);
            setCustomizationPossible(data.customization_possible);
        }
        setLoading(false);
    }, [supabase, params.productId]);

    useEffect(() => {
        const getUserAndProduct = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await getProduct();
            } else {
              router.push('/login');
            }
        };
        getUserAndProduct();
    }, [router, supabase, getProduct]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');

        const response = await fetch(`/api/products/${params.productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, tags, stock, customization_possible: customizationPossible }),
        });

        setIsSaving(false);
        if (response.ok) {
            alert('Product updated successfully!');
            router.push('/dashboard/products');
        } else {
            const data = await response.json();
            setError(data.error || 'Failed to update product.');
        }
    };

    if (loading) {
        return <p>Loading product...</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Edit Product
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full" required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="mt-1 block w-full" required></textarea>
                    </div>
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                        <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="mt-1 block w-full" />
                    </div>
                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Count</label>
                        <input type="number" id="stock" value={stock} onChange={(e) => setStock(parseInt(e.target.value, 10))} className="mt-1 block w-full" min="0" required />
                    </div>
                    <div className="flex items-center">
                        <input
                            id="customization"
                            name="customization"
                            type="checkbox"
                            checked={customizationPossible}
                            onChange={(e) => setCustomizationPossible(e.target.checked)}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="customization" className="ml-3 block text-sm font-medium text-gray-900">
                            Customizations available for this item
                        </label>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full px-4 py-3 flex justify-center items-center font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 disabled:bg-gray-400"
                    >
                        {isSaving && <Spinner />}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}