import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) {
        toast.error('Failed to load product');
        console.error(error);
      } else {
        setProduct(data);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) return <div className="pt-32 text-center">Loading...</div>;
  if (!product) return <div className="pt-32 text-center">Product not found.</div>;

  const images = Array.isArray(product.image_urls)
    ? product.image_urls
    : [(product as any).image_url || '']; 

  return (
    <div className="pt-32 pb-20 px-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Carousel */}
        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-black/5">
          <img 
            src={images[currentImageIndex]} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {images.length > 1 && (
            <>
              <button 
                onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/50 backdrop-blur-md"
              >
                <ChevronLeft />
              </button>
              <button 
                onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/50 backdrop-blur-md"
              >
                <ChevronRight />
              </button>
            </>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold uppercase">{product.name}</h1>
          <p className="text-2xl text-secondary">Ksh {Number(product.price).toLocaleString()}</p>
          <p className="text-muted-foreground">{product.description}</p>
          <Button className="w-full rounded-full bg-secondary text-secondary-foreground h-14 font-bold">
            <ShoppingBag className="w-5 h-5 mr-3" /> Add to Cart
          </Button>
          <Link to="/shop" className="block text-center text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
            Back to Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
