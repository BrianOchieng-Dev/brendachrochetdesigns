import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Loader2, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function Auth() {
  const { loginAsGuestAdmin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Exclusive Admin Logic for brenda123@gmail.com
        const isAdminEmail = email.trim() === 'brenda123@gmail.com';
        
        if (isAdminEmail && password === '123@brenda') {
          loginAsGuestAdmin();
          toast.success('System Bypass: Welcome, Super-Admin.');
          navigate('/admin');
          return;
        }

        const loginEmail = isAdminEmail ? 'admin@brendadesigns.com' : email;

        const { error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password,
        });
        if (error) throw error;
        toast.success(`Welcome back to the studio${isAdminEmail ? ', Admin' : ''}.`);
        navigate(isAdminEmail ? '/admin' : '/profile');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: 'COLLECTOR'
            },
          },
        });
        if (error) throw error;
        toast.success('Welcome to the collective. Please verify your email.');
      }
    } catch (error: any) {
      if (error.message?.includes('Failed to fetch')) {
        toast.error('Connection blocked or Supabase is not properly configured.');
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAdminMode = () => {
    setEmail('brenda123@gmail.com');
    setPassword('123@brenda');
    setIsLogin(true);
    toast.info('Admin access sequence initiated.');
  };

  return (
    <div className="pt-32 pb-20 px-6 bg-background min-h-screen flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-12 space-y-6">
          <div className="flex justify-center mb-10">
            <div className="p-5 bg-black/5 rounded-lg relative group overflow-hidden">
              <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Scissors className="w-10 h-10 text-secondary relative z-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-glow text-foreground uppercase leading-none">
            {isLogin ? 'The Studio' : 'The Collective'}
          </h1>
          <p className="text-muted-foreground font-medium italic text-lg leading-relaxed px-4">
            {isLogin 
              ? 'Enter your workshop credentials to manage the thread.' 
              : 'Join our artisanal community and claim your signature.'}
          </p>
        </div>

        <div className="glass-card p-10 rounded-lg border-black/5 space-y-8 relative overflow-hidden bg-white/40 backdrop-blur-3xl">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-repeating-linear-gradient(90deg, var(--secondary) 0, var(--secondary) 20px, transparent 20px, transparent 40px) opacity-20" />
          
          <form onSubmit={handleAuth} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-2">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="e.g. Master Weaver" 
                      className="pl-12 glass-panel h-14 rounded-lg border-black/5 focus:border-secondary/40 focus:ring-secondary/20 font-medium text-foreground bg-white/20"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-2">Digital Reach</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="email" 
                  placeholder="art@brendadesigns.com" 
                  className="pl-12 glass-panel h-14 rounded-lg border-black/5 focus:border-secondary/40 focus:ring-secondary/20 font-medium text-foreground bg-white/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-2">Secret Sequence</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-12 glass-panel h-14 rounded-lg border-black/5 focus:border-secondary/40 focus:ring-secondary/20 font-medium text-foreground bg-white/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 h-16 font-bold text-lg shadow-[0_10px_30px_rgba(255,0,0,0.2)] group transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin ? 'Enter The Studio' : 'Begin Your Journey'} <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="text-center pt-4 flex flex-col gap-4">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-secondary transition-colors"
            >
              {isLogin ? "Don't have a signature? Create one" : "Already a member? Sign in"}
            </button>
            
            {isLogin && (
              <button 
                type="button"
                onClick={toggleAdminMode}
                className="text-[8px] font-bold uppercase tracking-[0.3em] text-muted-foreground/30 hover:text-secondary/50 transition-colors"
              >
                Super-Admin Entry
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
