import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, MapPin, Phone, Mail, Instagram, Facebook, Twitter, MessageCircle, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase, isConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';


export function WhatsAppFloat() {
  return (
    <motion.a
      href="https://wa.me/254700000000"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#128C7E] transition-colors"
      style={{ filter: 'drop-shadow(0 0 15px rgba(37, 211, 102, 0.4))' }}
    >
      <MessageCircle className="w-6 h-6 fill-current" />
      <span className="sr-only">Chat on WhatsApp</span>
    </motion.a>
  );
}

export function ContactSection() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    message: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.user_metadata?.full_name || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Identity required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email required';
    if (!formData.message.trim()) newErrors.message = 'Message required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !validate()) return;

    setIsSubmitting(true);
    try {
      if (!isConfigured) throw new Error('Database not configured');
      const { error } = await supabase.from('inquiries').insert([{
        customer_name: formData.name,
        customer_email: formData.email,
        message: formData.message,
        status: 'PENDING',
        user_id: user?.id
      }]);
      if (error) throw error;
      
      setIsSuccess(true);
      toast.success('Your message has been woven into our queue.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error: any) {
      toast.error('Sync failed: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setIsSuccess(false), 5000);
    }
  };

  return (
    <section className="py-12 md:py-24 max-w-7xl mx-auto px-6" id="contact">
      <div className="space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest"
          >
            <Sparkles className="w-3 h-3" /> Connect with the Studio
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-[0.9]">
            Begin a <span className="text-secondary italic">Conversation</span>
          </h2>
          <p className="text-muted-foreground font-medium italic text-lg">
            For bespoke commissions, private collections, or artisanal collaborations.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Info Cards */}
          <div className="lg:col-span-2 grid gap-6 order-2 lg:order-1">
            {[
              { icon: MapPin, label: "Studio Location", val: "Lavington, Nairobi, Kenya", sub: "Available by appointment" },
              { icon: Mail, label: "Digital Reach", val: "studio@brendadesigns.com", sub: "24h Response Window" },
              { icon: Instagram, label: "Visual Thread", val: "@brenda_crochet_art", sub: "Process & Milestones" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 rounded-xl border-black/5 hover:bg-black/[0.02] transition-colors flex items-center gap-6"
              >
                <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-lg font-bold text-foreground leading-tight">{item.val}</p>
                  <p className="text-xs text-muted-foreground italic mt-1">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form Card */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Card className="glass-panel border-black/5 rounded-2xl overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <MessageSquare className="w-40 h-40" />
              </div>
              
              <CardContent className="p-8 md:p-12 space-y-10 relative z-10">
                <AnimatePresence>
                  {isSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute inset-0 bg-white/95 backdrop-blur-xl z-20 flex flex-col items-center justify-center text-center p-12"
                    >
                      <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                      </div>
                      <h3 className="text-3xl font-bold uppercase tracking-tight mb-2">Message Woven</h3>
                      <p className="text-muted-foreground font-medium italic">Our artisans will reach out across the thread shortly.</p>
                      <Button variant="outline" className="mt-8 rounded-full px-8" onClick={() => setIsSuccess(false)}>Send Another</Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Identity</label>
                      <Input 
                        placeholder="Your Name" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`h-16 rounded-xl border-black/5 bg-white/50 px-8 font-bold text-lg uppercase tracking-tight focus:ring-secondary/20 ${errors.name ? 'border-red-500/50' : ''}`}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Digital Signal</label>
                      <Input 
                        placeholder="Email Address" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`h-16 rounded-xl border-black/5 bg-white/50 px-8 font-bold text-lg focus:ring-secondary/20 ${errors.email ? 'border-red-500/50' : ''}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">The Inquiry</label>
                    <textarea 
                      placeholder="Materiality, silhouette, or vision..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full h-44 rounded-xl border-black/5 bg-white/50 p-8 outline-none font-medium text-lg leading-relaxed focus:ring-2 focus:ring-secondary/20 transition-all ${errors.message ? 'border-red-500/50' : ''}`}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-20 rounded-full bg-secondary text-white font-bold uppercase text-lg tracking-widest shadow-[0_15px_40px_rgba(255,0,0,0.2)] hover:scale-[1.01] active:scale-[0.98] transition-all"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        Transmitting...
                      </div>
                    ) : (
                      <>Dispatch Message <Send className="w-6 h-6 ml-3" /></>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
