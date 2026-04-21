import { motion } from 'motion/react';
import { Leaf, Scissors, Sparkles, Factory } from 'lucide-react';

export function Sustainability() {
  return (
    <div className="pt-32 pb-20 px-6 bg-background min-h-screen">
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

        <section className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold tracking-tighter uppercase leading-none">The Craftsmanship</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Brenda Designs, we believe in the philosophy of "slow fashion." Every piece is handmade, utilizing traditional crochet techniques that emphasize quality over quantity. By meticulously controlling our production, we minimize waste and ensure each garment is built to last for generations.
              </p>
              <ul className="space-y-4">
                {[
                  { title: 'Hand-Finished Detail', desc: 'Precision in every stitch.' },
                  { title: 'Artisanal Integrity', desc: 'Ethical labor and fair practices.' },
                  { title: 'Slow Production', desc: 'Crafted to order, not mass-produced.' },
                ].map((item, i) => (
                    <li key={i} className="flex gap-4 items-start">
                        <div className="mt-1 p-2 bg-secondary/10 rounded-lg text-secondary">
                          <Scissors className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg uppercase">{item.title}</h4>
                            <p className="text-muted-foreground">{item.desc}</p>
                        </div>
                    </li>
                ))}
            </ul>
            </div>
            <div className="glass-panel p-2 rounded-lg aspect-square relative overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1598440947619-2c35fd95604d?q=80&w=1000&auto=format&fit=crop" 
                    className="w-full h-full object-cover rounded-lg"
                    alt="Craftsmanship"
                    referrerPolicy="no-referrer"
                />
            </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="glass-panel p-2 rounded-lg aspect-square relative overflow-hidden lg:order-1 order-2">
                <img 
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop" 
                    className="w-full h-full object-cover rounded-lg"
                    alt="Sustainable Materials"
                    referrerPolicy="no-referrer"
                />
            </div>
            <div className="space-y-8 lg:order-2 order-1">
                <h2 className="text-4xl font-bold tracking-tighter uppercase leading-none">Sustainable Future</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                   We meticulously source our yarns from sustainable suppliers, ensuring that our materials align with our ethical standards. Our commitment goes beyond the product; it encompasses our entire resource management cycle.
                </p>
                <div className="grid grid-cols-2 gap-6">
                    {[
                        { icon: Leaf, label: 'Eco-Friendly Fibers' },
                        { icon: Factory, label: 'Waste Reduction' },
                        { icon: Sparkles,  label: 'Ethically Sourced' },
                    ].map((feat, i) => (
                        <div key={i} className="glass-panel p-6 rounded-lg text-center space-y-4">
                            <feat.icon className="w-8 h-8 text-secondary mx-auto" />
                            <p className="font-bold uppercase text-[10px] tracking-widest">{feat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      </div>
    </div>
  );
}

import { Badge } from '@/components/ui/badge';
