import { Scissors, Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-black/5 bg-white/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6 col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-black/5 rounded-full group-hover:bg-primary/10 transition-colors">
                <Scissors className="w-5 h-5 text-primary" />
              </div>
              <span className="font-extrabold tracking-tighter text-lg md:text-xl text-foreground uppercase">
                Brenda Designs
              </span>
            </Link>
            <p className="text-muted-foreground font-medium leading-relaxed text-sm md:text-base italic">
              Bespoke, hand-crocheted fashion pieces meticulously crafted to define the future of luxury knitwear.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-black/5 rounded-full hover:bg-secondary/10 hover:text-secondary transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-black/5 rounded-full hover:bg-secondary/10 hover:text-secondary transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-black/5 rounded-full hover:bg-secondary/10 hover:text-secondary transition-all">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-6">
            <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-foreground/40">Shop</h4>
            <ul className="space-y-4">
              <li><Link to="/shop" className="text-sm font-bold uppercase tracking-widest text-foreground/80 hover:text-secondary transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop" className="text-sm font-bold uppercase tracking-widest text-foreground/80 hover:text-secondary transition-colors">Fashion</Link></li>
              <li><Link to="/shop" className="text-sm font-bold uppercase tracking-widest text-foreground/80 hover:text-secondary transition-colors">Accessories</Link></li>
              <li><Link to="/shop" className="text-sm font-bold uppercase tracking-widest text-foreground/80 hover:text-secondary transition-colors">Patterns</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-6">
            <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-foreground/40">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/portfolio" className="text-sm font-bold uppercase tracking-widest text-foreground/80 hover:text-secondary transition-colors">Portfolio</Link></li>
              <li><Link to="/" className="text-sm font-bold uppercase tracking-widest text-foreground/80 hover:text-secondary transition-colors"> Sustainability</Link></li>
              <li><Link to="/" className="text-sm font-bold uppercase tracking-widest text-foreground/80 hover:text-secondary transition-colors">Craftsmanship</Link></li>
              <li><Link to="/" className="text-sm font-bold uppercase tracking-widest text-foreground/80 hover:text-secondary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-6">
            <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-foreground/40">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground font-bold tracking-tight text-xs md:text-sm">
                <MapPin className="w-4 h-4 text-secondary shrink-0" />
                <span>Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground font-bold tracking-tight text-xs md:text-sm">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground font-bold tracking-tight text-xs md:text-sm">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <span>studio@brendadesigns.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
            © {currentYear} Brenda Designs. All rights reserved.
          </p>
          <div className="flex gap-8 text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
