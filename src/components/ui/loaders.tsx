import { motion } from 'motion/react';

export function CrochetLoader() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="relative w-24 h-24">
        {/* The "Yarn Ball" base */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: { duration: 4, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute inset-0 rounded-full border-4 border-dashed border-secondary/30"
        />
        
        {/* The "Hook" weaving */}
        <motion.div
          animate={{
            rotate: [0, 15, -15, 0],
            x: [0, 5, -5, 0],
            y: [0, -5, 5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-1 h-12 bg-secondary rounded-full relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-secondary rounded-full" />
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-1 border-t-2 border-secondary rounded-full rotate-45" />
          </div>
        </motion.div>

        {/* Floating Yarn Particles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0.5],
              x: Math.cos(i * 90 * (Math.PI / 180)) * 40,
              y: Math.sin(i * 90 * (Math.PI / 180)) * 40,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut"
            }}
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-secondary/40 rounded-full"
          />
        ))}
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="text-secondary font-bold tracking-[0.3em] uppercase text-xs"
      >
        Weaving your experience...
      </motion.p>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[200] bg-white flex items-center justify-center">
      {/* Background Pattern - Subtle Stripes (KFC hint) */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ 
             backgroundImage: 'repeating-linear-gradient(45deg, #ff0000 0, #ff0000 20px, transparent 20px, transparent 40px)' 
           }} 
      />
      <CrochetLoader />
    </div>
  );
}
