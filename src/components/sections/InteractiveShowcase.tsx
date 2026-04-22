import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Camera, Palette, Scissors } from 'lucide-react';

export function InteractiveShowcase() {
  const highlights = [
    {
      title: "Structural Integrity",
      desc: "Each stitch is architecturally reinforced.",
      icon: Scissors,
      color: "bg-red-500/20 text-red-500",
      image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800"
    },
    {
      title: "Bespoke Silhouette",
      desc: "Custom-fitted to your digital twin.",
      icon: Palette,
      color: "bg-secondary/20 text-secondary",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800"
    }
  ];

  return (
    <div className="w-full h-full relative group overflow-hidden rounded-xl bg-black/5 p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        {highlights.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="relative h-full min-h-[250px] rounded-lg overflow-hidden glass-panel border-black/5 group/card"
          >
            <img 
              src={item.image} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" 
              alt={item.title} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
              <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center mb-4`}>
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">{item.title}</h3>
              <p className="text-white/60 text-sm font-medium italic">{item.desc}</p>
            </div>
            
            <motion.div 
              className="absolute top-4 right-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-white/20" />
            </motion.div>
          </motion.div>
        ))}
      </div>
      
      {/* Interactive Overlay Elements */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full border-2 border-secondary/30 flex items-center justify-center animate-ping absolute opacity-20" />
          <div className="w-20 h-20 rounded-full border border-white/20 backdrop-blur-xl flex items-center justify-center text-white">
            <Camera className="w-8 h-8 animate-pulse" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
