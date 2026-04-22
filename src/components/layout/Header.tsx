import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, User, Menu, Scissors, LogOut, LayoutDashboard, Heart, X, Sparkles, Instagram, Facebook } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { supabase, isConfigured } from '@/lib/supabase';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Shop', path: '/shop' },
  { name: 'Sustainability', path: '/sustainability' },
];

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user || !isConfigured) return;
    
    const fetchUnreadCount = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      setUnreadCount(count || 0);
    };

    fetchUnreadCount();

    const channel = supabase
      .channel('unread-notifications')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchUnreadCount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logged out from the studio');
      navigate('/');
      setIsMenuOpen(false);
    } catch (error: any) {
      window.location.href = '/';
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-6 pointer-events-none">
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-7xl mx-auto flex items-center justify-between glass-panel px-6 md:px-10 py-4 rounded-full pointer-events-auto relative shadow-2xl"
        >
          {/* Logo - Centrally positioned in spirit or beautifully aligned */}
          <Link to="/" className="flex items-center gap-3 group relative z-10">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-black text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Scissors className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-[0.2em] text-xs md:text-sm uppercase leading-none">Brenda</span>
              <span className="font-bold tracking-[0.3em] text-[8px] md:text-[10px] text-secondary uppercase leading-none mt-1">Studio Designs</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`relative group px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                  location.pathname === link.path ? 'text-foreground' : 'text-foreground/40 hover:text-foreground/80'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="nav-underline-premium"
                    className="absolute -bottom-1 left-0 right-0 h-1 bg-secondary rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsCartOpen(true)}
              className="rounded-full w-10 h-10 md:w-12 md:h-12 hover:bg-black/5 text-foreground relative"
            >
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-in zoom-in">
                  {totalItems}
                </span>
              )}
            </Button>
            
            <div className="hidden md:flex items-center gap-4">
              <AnimatePresence mode="wait">
                {!user ? (
                  <Link to="/auth">
                    <Button className="rounded-full bg-black text-white px-8 h-12 text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                      Join The Studio
                    </Button>
                  </Link>
                ) : (
                  <div className="flex items-center gap-3">
                    {isAdmin && (
                      <Link to="/admin">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="rounded-full w-12 h-12 hover:bg-black/5 text-secondary border border-secondary/10"
                        >
                          <LayoutDashboard className="w-5 h-5" />
                        </Button>
                      </Link>
                    )}
                    <Link to="/profile">
                      <Button 
                        variant="ghost" 
                        className={`rounded-full h-12 px-6 flex items-center gap-3 hover:bg-black/5 border border-black/5 ${location.pathname === '/profile' ? 'bg-black/5' : ''}`}
                      >
                        {user?.user_metadata?.avatar_url ? (
                          <div className="w-6 h-6 rounded-full overflow-hidden border border-black/10">
                            <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                          </div>
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {user.user_metadata?.full_name?.split(' ')[0] || 'Member'}
                        </span>
                      </Button>
                    </Link>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden rounded-full w-10 h-10 hover:bg-black/5 text-foreground" 
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </motion.div>
      </header>

      {/* Premium Full-Screen Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col p-8 md:p-12 overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-full h-full bg-secondary/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
            
            <div className="flex justify-between items-center relative z-10">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                  <Scissors className="w-6 h-6" />
                </div>
                <span className="font-black uppercase tracking-tighter text-2xl">Studio</span>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMenuOpen(false)}
                className="rounded-full w-14 h-14 bg-black/5"
              >
                <X className="w-8 h-8" />
              </Button>
            </div>

            <nav className="flex-1 flex flex-col justify-center gap-12 relative z-10 mt-12">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link 
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="group flex items-end gap-4"
                  >
                    <span className="text-muted-foreground/30 font-black text-2xl md:text-4xl italic">0{i + 1}</span>
                    <span className={`text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none transition-colors ${location.pathname === link.path ? 'text-secondary' : 'text-foreground hover:text-secondary'}`}>
                      {link.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto space-y-8 relative z-10">
              <div className="h-px bg-black/10 w-full" />
              <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                {!user ? (
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="w-full md:w-auto">
                    <Button className="w-full md:w-auto rounded-full bg-black text-white h-20 px-12 text-lg font-black uppercase tracking-widest shadow-2xl">
                      Enter The Studio
                    </Button>
                  </Link>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="rounded-full h-14 px-8 text-sm font-black uppercase tracking-widest border-black/10">
                        Profile
                      </Button>
                    </Link>
                    <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="rounded-full h-14 px-8 text-sm font-black uppercase tracking-widest border-black/10">
                        Wishlist
                      </Button>
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="rounded-full h-14 px-8 text-sm font-black uppercase tracking-widest border-secondary/20 text-secondary">
                          Admin
                        </Button>
                      </Link>
                    )}
                    <Button 
                      variant="ghost" 
                      onClick={handleSignOut}
                      className="rounded-full h-14 px-8 text-sm font-black uppercase tracking-widest text-red-500 hover:bg-red-50"
                    >
                      Sign Out
                    </Button>
                  </div>
                )}
                
                <div className="flex items-center gap-6">
                  <Instagram className="w-6 h-6 text-foreground/40" />
                  <Facebook className="w-6 h-6 text-foreground/40" />
                  <Sparkles className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
