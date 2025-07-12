th'use client';

import { useState } from 'react';

export default function NewProductPage() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [stock, setStock] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleGenerateListing = async () => {
    if (!image) return;
    setIsGenerating(true);
    // --- AI Generation Logic (to be implemented) ---
    console.log('Sending image to AI for generation...');
    // For now, we'll simulate the AI response after a delay.
    setTimeout(() => {
      setTitle('Hand-Painted Ceramic Mug');
      setDescription('A beautifully crafted ceramic mug, hand-painted with a unique floral design. Perfect for your morning coffee or as a thoughtful gift.');
      setTags('handmade, ceramic, mug, coffee, gift, art');
      setIsGenerating(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save the final product details to the database
    console.log({ title, description, tags, stock, image });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-3xl p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Create a New Product Listing
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Upload and Preview */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              1. Upload Your Product Image
            </label>
            <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Product preview" className="h-full w-full object-cover rounded-lg" />
              ) : (
                <span className="text-gray-500">Image Preview</span>
              )}
            </div>
            <input
              type="file"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
              accept="image/*"
            />
            <button
              type="button"
              onClick={handleGenerateListing}
              disabled={!image || isGenerating}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {isGenerating ? 'Generating...' : '2. Generate Listing with AI'}
            </button>
          </div>

          {/* Generated Content Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">3. Review and Edit Your Listing</h2>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
              <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Count</label>
              <input
                type="number"
                id="stock"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value, 10))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              Save Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}