import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Leaf, Scissors, Sparkles, Factory } from 'lucide-react';
import { supabase, isConfigured } from '@/lib/supabase';
import { Philosophy } from '@/types';
import { Badge } from '@/components/ui/badge';

const IconMap: Record<string, any> = {
  Leaf,
  Scissors,
  Sparkles,
  Factory
};

export function Sustainability() {
  const [philosophies, setPhilosophies] = useState<Philosophy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhilosophies();
  }, []);

  async function fetchPhilosophies() {
    if (!isConfigured) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('philosophies')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      if (data) setPhilosophies(data);
    } catch (error) {
      console.error('Error fetching philosophies:', error);
    } finally {
      setLoading(false);
    }
  }

  // Fallback content if database is empty or not configured
  const fallbackPhilosophies: Philosophy[] = [
    {
      id: 'fallback-1',
      title: 'The Craftsmanship',
      content: 'At Brenda Designs, we believe in the philosophy of "slow fashion." Every piece is handmade, utilizing traditional crochet techniques that emphasize quality over quantity. By meticulously controlling our production, we minimize waste and ensure each garment is built to last for generations.',
      image_url: 'https://images.unsplash.com/photo-1598440947619-2c35fd95604d?q=80&w=1000&auto=format&fit=crop',
      icon_name: 'Scissors',
      created_at: new Date().toISOString()
    },
    {
      id: 'fallback-2',
      title: 'Sustainable Future',
      content: 'We meticulously source our yarns from sustainable suppliers, ensuring that our materials align with our ethical standards. Our commitment goes beyond the product; it encompasses our entire resource management cycle.',
      image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop',
      icon_name: 'Leaf',
      created_at: new Date().toISOString()
    }
  ];

  const displayData = philosophies.length > 0 ? philosophies : fallbackPhilosophies;

  return (
    <div className="pt-40 md:pt-48 pb-20 px-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-24">
        <header className="text-center space-y-6">
          <Badge className="bg-secondary/10 text-secondary border-secondary/20 font-bold px-4 py-2 text-xs tracking-widest uppercase mb-4">
            Our Philosophy
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-glow text-foreground uppercase leading-none">
            Stitched with <span className="text-secondary italic">Conscience</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto italic">
            Sustainability isn't a trend; it's the foundation of everything we craft.
          </p>
        </header>

        {displayData.map((phil, index) => {
          const Icon = IconMap[phil.icon_name || 'Sparkles'] || Sparkles;
          const isEven = index % 2 === 0;

          return (
            <section key={phil.id} className="grid lg:grid-cols-2 gap-16 items-center">
              <div className={`space-y-8 ${isEven ? 'order-1' : 'lg:order-2 order-1'}`}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h2 className="text-4xl font-bold tracking-tighter uppercase leading-none">{phil.title}</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed italic">
                  {phil.content}
                </p>
                
                {/* Visual accent for premium feel */}
                <div className="pt-4 border-l-2 border-secondary/20 pl-6">
                   <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary/60">Studio Manifesto Archive /// {new Date(phil.created_at).getFullYear()}</p>
                </div>
              </div>

              <div className={`glass-panel p-2 rounded-lg aspect-square relative overflow-hidden ${isEven ? 'order-2' : 'lg:order-1 order-2'}`}>
                <motion.img 
                  initial={{ scale: 1.1, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  src={phil.image_url || 'https://images.unsplash.com/photo-1598440947619-2c35fd95604d?q=80&w=1000&auto=format&fit=crop'} 
                  className="w-full h-full object-cover rounded-lg"
                  alt={phil.title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
