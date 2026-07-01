"use client"
import { useState, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { createAd, updateAd } from '@/lib/actions/ads';
import { uploadImage } from '@/lib/actions/storage';

interface AdFormProps {
  initialData?: {
    id?: string;
    title: string;
    description: string;
    price: number;
    images: string[];
  };
  onSuccess?: () => void;
}

export function AdForm({ initialData, onSuccess }: AdFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const newImages = files.slice(0, 6 - images.length);
    const newPreviews = newImages.map(file => URL.createObjectURL(file));
    
    setImages(prev => [...prev, ...newImages]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !price.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    if (images.length === 0 && imagePreviews.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one image',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const uploadedImageUrls = await Promise.all(
        images.map(file => uploadImage(file))
      );

      const allImages = [...imagePreviews.filter(preview => !preview.startsWith('blob:')), ...uploadedImageUrls];

      const adData = {
        title,
        description,
        price: parseFloat(price),
        images: allImages
      };

      if (initialData?.id) {
        await updateAd(initialData.id, adData);
        toast({
          title: 'Success',
          description: 'Ad updated successfully'
        });
      } else {
        await createAd(adData);
        toast({
          title: 'Success',
          description: 'Ad created successfully'
        });
      }

      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save ad. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What are you selling?"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your item in detail..."
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price *</Label>
        <Input
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.00"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Images *</Label>
        <p className="text-sm text-gray-500">Add up to 6 images</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative aspect-square group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {images.length < 6 && (
            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
              <Camera className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Add Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                multiple
              />
            </label>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Ad' : 'Create Ad'}
      </Button>
    </form>
  );
}