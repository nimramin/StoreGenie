'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// A simple spinner component for loading states
const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function NewProductPage() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [stock, setStock] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Upload, 2: Edit

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    // Pre-load the default image for development
    if (process.env.NODE_ENV === 'development') {
      fetch('/poster.jpg')
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'poster.jpg', { type: 'image/jpeg' });
          setImage(file);
          setImagePreview(URL.createObjectURL(file));
        });
    }
  }, []);

  const handleGenerateListing = async () => {
    if (!image) return;
    setIsGenerating(true);
    setError('');

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('/api/products/generate-listing', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate listing.');
      }

      const data = await response.json();
      setTitle(data.title);
      setDescription(data.description);
      setTags(data.tags);
      setStep(2); // Move to the editing step
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    const formData = new FormData();
    if (image) formData.append('image', image);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('stock', stock.toString());

    const response = await fetch('/api/products', {
      method: 'POST',
      body: formData,
    });

    setIsSaving(false);
    if (response.ok) {
      alert('Product created successfully!');
      router.push('/dashboard/products');
    } else {
      const data = await response.json();
      setError(data.error || 'Failed to create product.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-3xl p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Create a New Product
        </h1>

        {/* Step 1: Image Upload */}
        {step === 1 && (
          <div className="text-center">
            <label htmlFor="image-upload" className="block text-lg font-medium text-gray-700 mb-4">
              Start by uploading a great photo
            </label>
            <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
              {imagePreview ? (
                <img src={imagePreview} alt="Product preview" className="h-full w-full object-cover rounded-lg" />
              ) : (
                <span className="text-gray-500">Your image will appear here</span>
              )}
            </div>
            <input id="image-upload" type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
            <label htmlFor="image-upload" className="cursor-pointer px-6 py-3 font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900">
              Choose Image
            </label>
            {image && (
              <button
                type="button"
                onClick={handleGenerateListing}
                disabled={isGenerating}
                className="w-full mt-4 px-4 py-3 flex justify-center items-center font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 disabled:bg-gray-400"
              >
                {isGenerating && <Spinner />}
                {isGenerating ? 'Generating...' : 'Generate Listing with AI'}
              </button>
            )}
          </div>
        )}

        {/* Step 2: Edit and Save */}
        {step === 2 && (
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
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full px-4 py-3 flex justify-center items-center font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 disabled:bg-gray-400"
            >
              {isSaving && <Spinner />}
              {isSaving ? 'Saving...' : 'Save Product'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}