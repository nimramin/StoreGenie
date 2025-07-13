'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, UploadCloud, Wand2 } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [stock, setStock] = useState(1);
  const [price, setPrice] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Upload, 2: Edit

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(file, options);
        setImage(compressedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error compressing image:', error);
        // Fallback to original file if compression fails
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };


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
    formData.append('price', price.toString());

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
    <Card className="bg-card/80 backdrop-blur-sm border-magic-accent">
      <CardHeader>
        <CardTitle>Create a New Product</CardTitle>
        <CardDescription>
          {step === 1 ? 'Start by uploading a great photo of your product.' : 'Review and edit the AI-generated details.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="text-center">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-magic-accent/50 rounded-lg cursor-pointer hover:bg-magic-accent/10 transition-colors mb-4"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Product preview" className="h-full w-full object-contain rounded-lg" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
              )}
            </label>
            <input id="image-upload" type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
            {image && (
              <Button
                type="button"
                onClick={handleGenerateListing}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                {isGenerating ? 'Generating...' : 'Generate Listing with AI'}
              </Button>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              {imagePreview && (
                <div>
                  <Label>Product Preview</Label>
                  <img src={imagePreview} alt="Product preview" className="mt-2 w-full object-contain rounded-lg border-2 border-dashed border-magic-accent/50 p-2" />
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Count</Label>
                    <Input id="stock" type="number" value={stock} onChange={(e) => setStock(parseInt(e.target.value, 10))} min="0" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} min="0" step="0.01" required />
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" disabled={isSaving} className="w-full">
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSaving ? 'Saving...' : 'Save Product'}
                </Button>
              </form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}