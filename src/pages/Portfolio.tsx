import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import { Camera, Layers, Scissors, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PortfolioItem } from '@/types';
import { toast } from 'sonner';

export function Portfolio() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  async function fetchPortfolio() {
    try {
      setLoading(true);

      const { data, error } = await supabase.from('portfolio').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      toast.error('Failed to load portfolio: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredItems = activeTab === 'ALL' 
    ? items 
    : items.filter(item => item.category === activeTab);

  return (
    <div className="pt-40 md:pt-48 pb-20 min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 space-y-24">
        {/* Editorial Hero */}
        <section className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.82] text-glow mb-12 uppercase">
              A Fabric<br />of Stories
            </h1>
            <p className="max-w-xl mx-auto text-muted-foreground text-lg md:text-xl italic font-medium leading-relaxed tracking-tight">
              Every stitch is a signature. Explore the evolution of Brenda's 
              handcrafted couture and conceptual crochet art.
            </p>
          </motion.div>

          <div className="flex justify-center pt-8">
            <Tabs defaultValue="ALL" onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="glass-panel p-2 rounded-full gap-2 border-black/5 h-14 bg-white/40">
                {['ALL', 'RUNWAY', 'EXHIBITION', 'BESPOKE'].map(tab => (
                  <TabsTrigger 
                    key={tab} 
                    value={tab}
                    className="rounded-full px-8 h-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground transition-all font-bold tracking-[0.1em] text-[10px] md:text-xs uppercase text-foreground/60"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </section>

        {/* Staggered Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative"
            >
              <Card className="glass-card border-black/5 rounded-lg overflow-hidden group-hover:border-secondary/20 transition-all duration-700 h-full flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-8 text-white">
                    <p className="text-sm font-bold tracking-widest uppercase mb-2 text-secondary">{item.category}</p>
                    <p className="text-xl font-medium italic leading-relaxed">{item.description}</p>
                  </div>
                  <Badge className="absolute top-6 left-6 bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold px-3 py-1">
                    {new Date(item.created_at).getFullYear() || 'Recent'}
                  </Badge>
                </div>
                <CardContent className="p-8 space-y-4 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl md:text-2xl font-bold tracking-tighter uppercase">{item.title}</h3>
                    <Badge variant="outline" className="border-secondary/20 text-secondary font-bold text-[10px] uppercase tracking-widest px-2 group-hover:bg-secondary group-hover:text-white transition-all">
                      {item.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        {/* Brand Philosophies */}
        <section className="grid md:grid-cols-3 gap-12 pt-24 border-t border-black/5">
          <div className="space-y-4">
            <div className="p-3 bg-secondary/10 w-fit rounded-lg">
              <Scissors className="w-6 h-6 text-secondary" />
            </div>
            <h4 className="text-lg md:text-xl font-bold tracking-tight uppercase tracking-[0.1em]">Precision Craft</h4>
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
              Every piece takes anywhere from 40 to 200 hours of manual labor, ensuring perfect tension and structural integrity.
            </p>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-secondary/10 w-fit rounded-lg">
              <Layers className="w-6 h-6 text-secondary" />
            </div>
            <h4 className="text-lg md:text-xl font-bold tracking-tight uppercase tracking-[0.1em]">Sustainable Alchemy</h4>
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
              We exclusively use GOTS-certified organic cotton, bamboo silk, and locally sourced recycled raffia from the Kenyan coast.
            </p>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-secondary/10 w-fit rounded-lg">
              <Sparkles className="w-6 h-6 text-secondary" />
            </div>
            <h4 className="text-lg md:text-xl font-bold tracking-tight uppercase tracking-[0.1em]">Artistic Vision</h4>
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
              Brenda's work sits at the intersection of avant-garde silhouette design and traditional heritage techniques.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
