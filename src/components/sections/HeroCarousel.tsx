import * as React from "react"
import { motion } from "motion/react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import Autoplay from "embla-carousel-autoplay"

const carouselItems = [
  {
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2000&auto=format&fit=crop",
    title: "Celestial Collection",
    subtitle: "Celestial Wrap Top in fine cotton yarn",
    link: "/shop"
  },
  {
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop",
    title: "Handcrafted Luxury",
    subtitle: "Bespoke pieces made for the modern silhouette",
    link: "/shop"
  },
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop",
    title: "Eco-Conscious Fashion",
    subtitle: "Sustainably sourced fibers, ethically made in Kenya",
    link: "/shop"
  }
]

export function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <section className="relative w-full overflow-hidden group">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {carouselItems.map((item, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[80vh] w-full">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading={index === 0 ? "eager" : "lazy"}
                  {...(index === 0 ? { fetchPriority: "high" } : {})}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* KFC-Inspired Stripes Overlay (High-Fashion) */}
                <div className="absolute top-0 right-0 w-1/4 h-full kfc-stripes opacity-10 pointer-events-none" />
                
                <div className="absolute inset-x-0 bottom-0 p-12 md:p-24 flex flex-col items-center text-center space-y-6">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tighter leading-[0.85] text-glow text-white uppercase">
                      {item.title}
                    </h2>
                    <p className="text-lg sm:text-2xl text-white/90 max-w-2xl mx-auto mt-6 font-medium italic tracking-tight">
                      {item.subtitle}
                    </p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-4"
                  >
                    <Button 
                      render={<Link to={item.link} />} 
                      nativeButton={false}
                      size="lg" 
                      className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 h-14 text-lg font-semibold shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-all hover:scale-105"
                    >
                      <span className="flex items-center gap-2">
                        Shop Collection <ArrowRight className="w-5 h-5" />
                      </span>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-8 right-24 flex gap-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <CarouselPrevious className="static translate-x-0 translate-y-0 h-12 w-12 glass-panel border-black/5 hover:bg-black/5 text-foreground" />
          <CarouselNext className="static translate-x-0 translate-y-0 h-12 w-12 glass-panel border-black/5 hover:bg-black/5 text-foreground" />
        </div>
      </Carousel>
    </section>
  )
}
