import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  LayoutGrid,
  Settings,
  ShieldCheck,
  Ruler,
  MessageSquare,
  Lock,
  Globe,
  Palette,
  Camera,
  Layers,
  ArrowUpRight,
  UserCheck,
  Ban,
  Crown,
  Upload,
  Sparkles,
  Scissors,
  Leaf,
  Factory
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Product, PortfolioItem, Inquiry, Philosophy } from '@/types';
import { supabase, isConfigured } from '@/lib/supabase';
import { useAuth, AdminAuthority, UserRole } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip
} from 'recharts';

const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

export function Admin() {
  const { user, hasAuthority, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [philosophies, setPhilosophies] = useState<Philosophy[]>([]);
  const [commissionConfig, setCommissionConfig] = useState<any>(null);
  const [respondingToInquiry, setRespondingToInquiry] = useState<string | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [stats, setStats] = useState({
    revenue: 'Ksh 0',
    commissions: '0',
    collectors: '0',
    stability: 'Optimal'
  });
  const [velocity, setVelocity] = useState(data);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
  const [isAddingPhilosophy, setIsAddingPhilosophy] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPortfolioItem, setEditingPortfolioItem] = useState<PortfolioItem | null>(null);
  const [editingPhilosophy, setEditingPhilosophy] = useState<Philosophy | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('OVERVIEW');

  const displayName = user?.user_metadata?.full_name || 'Maestro';

  useEffect(() => {
    fetchAllData();

    // Listen to cross-tab updates and simulation events
    const handleStorageChange = () => fetchAllData();
    window.addEventListener('storage', handleStorageChange);

    // Setup Supabase Realtime
    const channel = supabase
      .channel('admin-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries' }, () => {
        fetchAllData();
      })
      .subscribe();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      supabase.removeChannel(channel);
    };
  }, []);

  if (!isAdmin && !loading) {
    return (
      <div className="pt-48 pb-20 px-6 flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
        <div className="p-8 bg-secondary/5 rounded-full relative group">
          <div className="absolute inset-0 bg-secondary/10 rounded-full animate-ping opacity-20" />
          <Lock className="w-20 h-20 text-secondary relative z-10" />
        </div>
        <div className="space-y-4 max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-glow text-foreground uppercase italic">Authority Restricted</h1>
          <p className="text-muted-foreground text-lg italic leading-relaxed">
            The thread of administrative control is reserved for the Studio Maestro. Your current digital signature does not hold the necessary clearance for this workshop.
          </p>
        </div>
        <Button 
          variant="outline" 
          className="rounded-full border-secondary/30 text-secondary hover:bg-secondary hover:text-white px-10 h-14 font-bold uppercase tracking-widest transition-all"
          onClick={() => window.location.href = '/'}
        >
          Return to The Shop
        </Button>
      </div>
    );
  }

  async function fetchAllData() {
    if (!isConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    
    try {
      // 1. Fetch Products
      const { data: productsData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (productsData) setProducts(productsData);

      // 2. Fetch Stats
      const { data: ordersData } = await supabase.from('orders').select('amount, status');
      if (ordersData) {
        const total = ordersData.reduce((acc, curr) => acc + Number(curr.amount), 0);
        const inProgress = ordersData.filter(o => o.status === 'IN_PROGRESS').length;
        setStats(prev => ({ ...prev, revenue: `Ksh ${total.toLocaleString()}`, commissions: inProgress.toString() }));
      }

      // 3. Fetch Personnel with metrics
      const { data: profilesData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      const { data: ordersDataForUsers } = await supabase.from('orders').select('customer_id');
      const { data: philData } = await supabase.from('philosophies').select('*').order('created_at', { ascending: true });
      
      if (philData) setPhilosophies(philData);
      if (profilesData) {
        setPersonnel(profilesData.map(p => {
          const userOrders = ordersDataForUsers?.filter(o => o.customer_id === p.id) || [];
          const monthsActive = Math.floor((Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30.44));
          
          return {
            id: p.id,
            name: p.full_name || 'Anonymous',
            email: p.email || 'No email documented', 
            role: p.role,
            createdAt: p.created_at,
            orderCount: userOrders.length,
            monthsActive,
            status: 'ACTIVE'
          };
        }));
        setStats(prev => ({ ...prev, collectors: profilesData.length.toString() }));
      }

      // 4. Fetch Activities
      const { data: activityData } = await supabase.from('activities').select('*').order('created_at', { ascending: false }).limit(5);
      if (activityData) {
        setActivities(activityData.map(a => ({
          u: a.user_name,
          a: a.action,
          icon: a.icon_type === 'user' ? UserCheck : ShieldCheck,
          t: new Date(a.created_at).toLocaleTimeString()
        })));
      }

      // 5. Fetch Inquiries
      const { data: inquiryData } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      if (inquiryData) setInquiries(inquiryData);

      // 6. Fetch Portfolio
      const { data: portfolioData } = await supabase.from('portfolio').select('*').order('created_at', { ascending: false });
      if (portfolioData) setPortfolio(portfolioData);

      // 7. Fetch Commission Config
      const { data: configData } = await supabase.from('commission_config').select('*').single();
      if (configData) setCommissionConfig(configData);

    } catch (error: any) {
        toast.error('Sync failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProduct(e: React.FormEvent) {
    if (!isConfigured) return;
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const imageLink = formData.get('image') as string;
    const fileInput = (e.target as HTMLFormElement).querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    let finalImageUrl = imageLink || (editingProduct?.image_url);

    try {
      setIsUploading(true);
      if (file) {
        // Size validation (2MB)
        if (file.size > 2 * 1024 * 1024) {
          throw new Error('Asset exceeds 2MB limit. Please curate a smaller version.');
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `design-${Math.random()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);
        
        finalImageUrl = publicUrl;

        // If we were editing and had a previous local image, we might want to delete it
        // For simplicity, we just upload the new one.
      }

      if (!finalImageUrl) throw new Error('A visual asset (link or file) is required.');

      const productData = {
        name: formData.get('name') as string,
        price: Number(formData.get('price')),
        image_url: finalImageUrl,
        description: formData.get('description') as string,
        category: formData.get('category') as any,
        is_featured: formData.get('is_featured') === 'on'
      };
      
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        if (error) throw error;
        toast.success('Design concept recalibrated in the ledger.');
      } else {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
        toast.success('Concept archived in the studio ledger.');
      }

      setIsAdding(false);
      setEditingProduct(null);
      fetchAllData();
    } catch (error: any) {
      console.error('handleSaveProduct Error:', error);
      toast.error('Sync failed: ' + (error.message || 'Unknown error'));
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDeleteProduct(id: string, imageUrl: string) {
    if (!isConfigured) return;
    if (!confirm('Are you certain you wish to permanently remove this design concept? This cannot be undone.')) return;

    try {
      // 1. Delete from DB
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;

      // 2. Delete from Storage if it's a local file
      if (imageUrl.includes('storage.googleapis.com') || imageUrl.includes('supabase.co')) {
        const path = imageUrl.split('/').pop();
        if (path) {
          await supabase.storage.from('products').remove([`products/${path}`]);
        }
      }

      toast.success('Design concept purged from the ledger.');
      fetchAllData();
    } catch (error: any) {
      toast.error('Purge failed: ' + error.message);
    }
  }

  async function handleSavePortfolio(e: React.FormEvent) {
    if (!isConfigured) return;
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const imageLink = formData.get('image') as string;
    const fileInput = (e.target as HTMLFormElement).querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    let finalImageUrl = imageLink || (editingPortfolioItem?.image_url);
    
    try {
      setIsUploading(true);
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          throw new Error('Asset exceeds 2MB limit.');
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `portfolio-${Math.random()}.${fileExt}`;
        const filePath = `portfolio/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio')
          .getPublicUrl(filePath);
        
        finalImageUrl = publicUrl;
      }

      if (!finalImageUrl) throw new Error('Asset required.');

      const itemData = {
        title: formData.get('title') as string,
        category: formData.get('category') as string,
        image_url: finalImageUrl,
        description: formData.get('description') as string,
      };
      
      if (editingPortfolioItem) {
        const { error } = await supabase
          .from('portfolio')
          .update(itemData)
          .eq('id', editingPortfolioItem.id);
        if (error) throw error;
        toast.success('Portfolio project recalibrated.');
      } else {
        const { error } = await supabase.from('portfolio').insert([itemData]);
        if (error) throw error;
        toast.success('Portfolio calibrated with new work.');
      }

      setIsAddingPortfolio(false);
      setEditingPortfolioItem(null);
      fetchAllData();
    } catch (error: any) {
      toast.error('Sync failed: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDeletePortfolio(id: string, imageUrl: string) {
    if (!isConfigured) return;
    if (!confirm('Are you certain you wish to purge this milestone from the portfolio?')) return;

    try {
      const { error } = await supabase.from('portfolio').delete().eq('id', id);
      if (error) throw error;

      if (imageUrl.includes('supabase.co')) {
        const path = imageUrl.split('/').pop();
        if (path) {
          await supabase.storage.from('portfolio').remove([`portfolio/${path}`]);
        }
      }

      toast.success('Portfolio milestone removed.');
      fetchAllData();
    } catch (error: any) {
      toast.error('Deletion failed: ' + error.message);
    }
  }

  async function handleResolveInquiry(id: string, userId?: string) {
    if (!isConfigured) return;
    if (!adminResponse.trim()) {
      toast.error('Response cannot be empty');
      return;
    }

    try {
      const { error } = await supabase.from('inquiries').update({ 
        status: 'RESOLVED',
        response: adminResponse,
        updated_at: new Date().toISOString()
      }).eq('id', id);
      
      if (error) throw error;

      // Create notification for the user if ID exists
      if (userId) {
        await supabase.from('notifications').insert([{
          user_id: userId,
          title: 'Studio Response Received',
          message: 'The Studio Maestro has responded to your inquiry regarding artisanal craftsmanship.',
          type: 'INQUIRY'
        }]);
      }

      toast.success('Inquiry resolved. Notification dispatched.');
      setRespondingToInquiry(null);
      setAdminResponse('');
      fetchAllData();
    } catch (error: any) {
      toast.error('Response failed: ' + error.message);
    }
  }

  async function handlePromote(personId: string, currentRole: string) {
    if (!isConfigured) return;
    const roles: UserRole[] = ['COLLECTOR', 'MUSE', 'VIP'];
    const currentIndex = roles.indexOf(currentRole as UserRole);
    
    let nextRole: UserRole;
    
    if (currentIndex === -1 && currentRole !== 'ADMIN') {
      nextRole = 'COLLECTOR';
    } else if (currentRole === 'VIP' || currentRole === 'ADMIN') {
      toast.info('This user has already reached the maximum tier or is an Admin.');
      return;
    } else {
      nextRole = roles[currentIndex + 1];
    }

    try {
      const { error } = await supabase.from('profiles').update({ role: nextRole }).eq('id', personId);
      if (error) throw error;
      toast.success(`Access elevated to ${nextRole} tier.`);
      fetchAllData();
    } catch (error: any) {
      toast.error('Promotion failed: ' + error.message);
    }
  }

  async function updateNarrative(section: string) {
    if (!isConfigured) return;
    const newContent = prompt('Enter new narrative content:');
    if (!newContent) return;

    try {
      const { error } = await supabase.from('narratives').upsert({ section, content: newContent });
      if (error) throw error;
      toast.success('Studio narrative recalibrated.');
    } catch (error: any) {
      toast.error('Calibration failed: ' + error.message);
    }
  }

  const handleSavePhilosophy = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isConfigured) return;

    const formData = new FormData(e.currentTarget);
    const philosophyData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      icon_name: formData.get('icon_name') as string,
      image_url: formData.get('image_url') as string,
    };

    setIsUploading(true);
    try {
      if (editingPhilosophy) {
        const { error } = await supabase
          .from('philosophies')
          .update(philosophyData)
          .eq('id', editingPhilosophy.id);
        if (error) throw error;
        toast.success('Philosophy Refined');
      } else {
        const { error } = await supabase
          .from('philosophies')
          .insert([philosophyData]);
        if (error) throw error;
        toast.success('Philosophy Documented');
      }
      fetchAllData();
      setIsAddingPhilosophy(false);
      setEditingPhilosophy(null);
    } catch (error: any) {
      console.error('Error saving philosophy:', error);
      if (error.code === '42501') {
        toast.error('Security Breach: Your current clearance level does not allow managing philosophies. Please run the Security Sync SQL script.');
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhilosophy = async (id: string) => {
    if (!isConfigured || !window.confirm('Strike this philosophy from the record?')) return;
    try {
      const { error } = await supabase.from('philosophies').delete().eq('id', id);
      if (error) throw error;
      toast.success('Philosophy Redacted');
      fetchAllData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleCommissionStatus = async () => {
    if (!commissionConfig) return;
    try {
      const newStatus = !commissionConfig.is_open;
      const { error } = await supabase
        .from('commission_config')
        .update({ is_open: newStatus })
        .eq('singleton_id', 1);
      
      if (error) throw error;
      setCommissionConfig({ ...commissionConfig, is_open: newStatus });
      toast.success(newStatus ? 'Commissions Open' : 'Commissions Closed');
    } catch (error: any) {
      toast.error('Status update failed: ' + error.message);
    }
  };

  const handleAssignPriority = async (userId: string, currentRole: string) => {
    try {
      const { error } = await supabase
        .from('commission_access')
        .insert([{ user_id: userId, slots_allocated: 1, reason: `Loyalty Reward (${currentRole})` }])
        .select();
      
      if (error) {
        if (error.code === '23505') {
          toast.error('Collector already holds a priority slot.');
        } else {
          throw error;
        }
      } else {
        toast.success('Priority Slot Assigned');
      }
    } catch (error: any) {
      toast.error('Assignment failed: ' + error.message);
    }
  };

  // Permission Check Helper for the UI
  const AuthGate = ({ authority, children }: { authority: AdminAuthority, children: React.ReactNode }) => {
    if (hasAuthority(authority)) return <>{children}</>;
    return (
      <div className="opacity-40 grayscale pointer-events-none cursor-not-allowed select-none relative group">
        <div className="absolute inset-0 z-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/40 backdrop-blur-sm rounded-lg">
           <Badge variant="outline" className="bg-background border-red-500/20 text-red-500 font-bold uppercase tracking-widest text-[10px]">Authority Required</Badge>
        </div>
        {children}
      </div>
    );
  };

  return (
    <div className="pt-32 pb-20 px-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge className="bg-secondary/10 text-secondary border-secondary/20 font-bold px-3 py-1 text-[10px] tracking-widest uppercase">
                {isAdmin ? 'Super Admin' : 'Authority Restricted'}
              </Badge>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-l border-black/10 pl-3">Studio Operational</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-glow text-foreground uppercase leading-none">
              Command <span className="text-secondary italic">Center</span>
            </h1>
            <p className="text-muted-foreground font-medium text-lg italic max-w-2xl">
              Artisanal oversight and system orchestration. Manage authorities, assets, and the digital collective.
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="rounded-full border-black/5 glass-panel h-14 px-8 font-bold text-foreground">
              <Settings className="w-5 h-5 mr-3" /> System Config
            </Button>
            <AuthGate authority="DROP_COORDINATOR">
              <Button className="rounded-full bg-secondary text-secondary-foreground h-14 px-10 font-bold shadow-[0_10px_25px_rgba(255,0,0,0.25)]" onClick={() => setIsAdding(!isAdding)}>
                <Plus className="w-5 h-5 mr-3" /> New Collection
              </Button>
            </AuthGate>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-10">
          <TabsList className="glass-panel p-2 rounded-full gap-2 border-black/5 h-16 bg-white/40 mb-10 w-full md:w-fit mx-auto md:mx-0 overflow-x-auto overflow-y-hidden">
            <TabsTrigger value="OVERVIEW" className="rounded-full px-8 h-full data-[state=active]:bg-secondary data-[state=active]:text-white font-bold tracking-widest text-[10px] uppercase transition-all">Overview</TabsTrigger>
            <TabsTrigger value="CUSTOMERS" className="rounded-full px-8 h-full data-[state=active]:bg-secondary data-[state=active]:text-white font-bold tracking-widest text-[10px] uppercase transition-all">Collective</TabsTrigger>
            <TabsTrigger value="CONTENT" className="rounded-full px-8 h-full data-[state=active]:bg-secondary data-[state=active]:text-white font-bold tracking-widest text-[10px] uppercase transition-all">Materiality</TabsTrigger>
            <TabsTrigger value="PHILOSOPHY" className="rounded-full px-8 h-full data-[state=active]:bg-secondary data-[state=active]:text-white font-bold tracking-widest text-[10px] uppercase transition-all">Philosophy</TabsTrigger>
            <TabsTrigger value="INQUIRIES" className="rounded-full px-8 h-full data-[state=active]:bg-secondary data-[state=active]:text-white font-bold tracking-widest text-[10px] uppercase transition-all">Inquiries</TabsTrigger>
            <TabsTrigger value="TECHNICAL" className="rounded-full px-8 h-full data-[state=active]:bg-secondary data-[state=active]:text-white font-bold tracking-widest text-[10px] uppercase transition-all">Operations</TabsTrigger>
          </TabsList>

          <TabsContent value="OVERVIEW" className="space-y-10 outline-none">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Weekly Revenue', value: stats.revenue, icon: DollarSign, change: '+12.5%' },
                { label: 'Active Commissions', value: stats.commissions, icon: Package, change: '6 Slots Open' },
                { label: 'Total Collectors', value: stats.collectors, icon: Users, change: '+18.1%' },
                { label: 'Studio Stability', value: stats.stability, icon: ShieldCheck, change: 'Optimal' },
              ].map((stat) => (
                <Card key={stat.label} className="glass-panel kfc-card-accent border-black/5 rounded-lg overflow-hidden group pl-1.5 transition-all duration-300 hover:shadow-xl">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="p-4 bg-secondary/10 rounded-md border border-secondary/20 group-hover:scale-110 transition-transform">
                        <stat.icon className="w-6 h-6 text-secondary" />
                      </div>
                      <Badge variant="outline" className="bg-secondary/5 text-secondary border-secondary/20 font-bold px-3 py-1 text-[10px]">
                        {stat.change}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                      <h3 className="text-3xl font-bold tracking-tighter mt-2 text-foreground">{stat.value}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

             <div className="grid lg:grid-cols-1 gap-8">
              <Card className="glass-panel border-black/5 rounded-lg p-10 space-y-8">
                <CardTitle className="text-xl font-bold uppercase tracking-widest flex items-center gap-3">
                  <Globe className="w-6 h-6 text-secondary" /> Global Feed
                </CardTitle>
                <div className="space-y-8">
                  {activities.map((activity, i) => {
                    const Icon = activity.icon;
                    return (
                      <div key={i} className="flex items-center gap-5 group">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-black/5 flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                          {Icon && <Icon className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-xs uppercase tracking-widest text-muted-foreground mb-1">{activity.t}</p>
                          <p className="font-bold text-foreground leading-tight"><span className="text-secondary italic">{activity.u}</span> {activity.a}</p>
                        </div>
                      </div>
                    );
                  })}
                  <Button variant="ghost" className="w-full rounded-full border border-black/5 font-bold uppercase tracking-widest text-[10px] h-12 hover:bg-black/5">View Full Ledger</Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="CUSTOMERS" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 outline-none">
            {/* 1. Customer Management Sections */}
            <AuthGate authority="TIER_AUTHORITY">
              <Card className="glass-panel border-black/5 rounded-lg p-10 space-y-6">
                <div className="p-4 bg-secondary/10 rounded-lg w-fit mb-4">
                  <Crown className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight">Tier Authority</h3>
                <p className="text-sm text-muted-foreground font-medium italic">Promote Collectors to Muse status or adjust curation tiers.</p>
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between p-4 bg-black/5 rounded-lg">
                    <p className="text-xs font-bold uppercase tracking-widest">Pending Upgrades</p>
                    <Badge variant="secondary" className="bg-secondary text-white font-bold">12</Badge>
                  </div>
                  <Button className="w-full rounded-full bg-black text-white font-bold uppercase text-[10px] tracking-widest h-12">Manage Curation</Button>
                </div>
              </Card>
            </AuthGate>

            <AuthGate authority="MEASUREMENT_CUSTODIAN">
               <Card className="glass-panel border-black/5 rounded-lg p-10 space-y-6">
                <div className="p-4 bg-secondary/10 rounded-lg w-fit mb-4">
                  <Ruler className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight">Measurement Custodian</h3>
                <p className="text-sm text-muted-foreground font-medium italic">Troubleshoot Digital Twin profiles and calibrate fitting data.</p>
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-4">
                    <Input placeholder="User ID or Email" className="glass-panel rounded-full border-black/5 px-6 h-12" />
                    <Button size="icon" className="rounded-full bg-black h-12 w-12 flex-shrink-0"><ArrowUpRight className="w-5 h-5" /></Button>
                  </div>
                </div>
              </Card>
            </AuthGate>

            <AuthGate authority="COMMISSION_FACILITATOR">
              <Card className="glass-panel border-black/5 rounded-lg p-10 space-y-6">
                <div className="p-4 bg-secondary/10 rounded-lg w-fit mb-4">
                  <Layers className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight">Commission Facilitator</h3>
                <p className="text-sm text-muted-foreground font-medium italic">Open, close, and assign custom crochet commission slots.</p>
                <div className="space-y-4 pt-4">
                   <div className="flex items-center justify-between border-b border-black/5 pb-4">
                     <div>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Global Status</p>
                       <span className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${commissionConfig?.is_open ? 'text-green-500' : 'text-red-500'}`}>
                         <span className={`w-2 h-2 rounded-full ${commissionConfig?.is_open ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                         {commissionConfig?.is_open ? 'Open' : 'Closed'}
                       </span>
                     </div>
                     <Button 
                       onClick={toggleCommissionStatus}
                       variant={commissionConfig?.is_open ? "outline" : "default"} 
                       className={`rounded-full h-10 px-6 font-bold text-[10px] uppercase transition-all ${commissionConfig?.is_open ? 'border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-black text-white'}`}
                     >
                       {commissionConfig?.is_open ? 'Close Slots' : 'Open Slots'}
                     </Button>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/[0.02] p-4 rounded-lg">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Active Load</p>
                        <p className="text-xl font-bold">{commissionConfig?.current_load || 0} / {commissionConfig?.max_slots || 0}</p>
                      </div>
                      <div className="bg-black/[0.02] p-4 rounded-lg">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Priority Reservations</p>
                        <p className="text-xl font-bold text-secondary">Locked</p>
                      </div>
                   </div>
                </div>
              </Card>
            </AuthGate>



            <AuthGate authority="ACCOUNT_OVERSIGHT">
              <Card className="lg:col-span-3 glass-panel border-black/5 rounded-lg overflow-hidden">
                <CardHeader className="border-b border-black/5 bg-black/[0.02] p-10 flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-bold flex items-center gap-4 text-foreground uppercase tracking-widest">
                    <UserCheck className="w-7 h-7 text-secondary" /> Studio Personnel & Collective
                  </CardTitle>
                  <Button variant="outline" className="rounded-full border-black/5 font-bold uppercase tracking-widest text-[10px] h-10 px-6">Export Ledger</Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-black/5">
                    {personnel.map((person, i) => (
                      <div key={i} className="p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 hover:bg-black/[0.01] transition-all border-b border-black/[0.02] last:border-0 group">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                           <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center font-bold text-secondary text-xl border border-secondary/20 shadow-sm flex-shrink-0">
                             {person.name.split(' ').map((n: string) => n[0]).join('')}
                           </div>
                           <div className="min-w-0">
                             <p className="font-bold text-xl text-foreground truncate">{person.name}</p>
                             <p className="text-sm font-medium text-muted-foreground italic truncate max-w-[200px]">{person.email}</p>
                           </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-10 w-full md:w-auto">
                            <div className="text-left md:text-right flex flex-col items-start md:items-end">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 opacity-60">
                                Loyalty Context /// <span className="text-foreground">Score: {(person.monthsActive * 2) + person.orderCount}</span>
                              </p>
                              <div className="flex flex-wrap gap-2 mb-3">
                                <Badge variant="outline" className="text-[9px] border-black/5 opacity-80 italic font-medium">{person.monthsActive}m Loyalty</Badge>
                                <Badge variant="outline" className="text-[9px] border-black/5 opacity-80 italic font-medium">{person.orderCount} Orders</Badge>
                              </div>
                              <Badge className={`${person.role === 'ADMIN' ? 'bg-black text-white shadow-[0_10px_25px_rgba(0,0,0,0.2)]' : 
                                                person.role === 'VIP' ? 'bg-secondary text-white shadow-[0_10px_25px_rgba(255,0,0,0.2)]' : 
                                                'bg-secondary/10 text-secondary'} font-bold px-5 py-1.5 rounded-full uppercase tracking-tighter text-[10px]`}>
                                {person.role === 'ADMIN' ? 'The Brenda Chrochet' : 
                                 person.role === 'VIP' ? 'The VIP' :
                                 person.role === 'MUSE' ? 'The Muse' :
                                 person.role === 'COLLECTOR' ? 'The Collector' : 'The Guest'}
                              </Badge>
                            </div>
                            <div className="w-full sm:w-auto flex flex-col gap-2 pt-2 sm:pt-0">
                               <Button 
                                 variant="ghost" 
                                 onClick={() => handlePromote(person.id, person.role)}
                                 disabled={person.role === 'VIP' || person.role === 'ADMIN'}
                                 className="w-full sm:w-auto rounded-full border border-black/5 px-6 h-10 font-bold text-[10px] uppercase hover:bg-black/5 transition-all text-secondary group-hover:bg-secondary/5"
                               >
                                 {person.role === 'COLLECTOR' ? 'Elevate to Muse' : person.role === 'MUSE' ? 'Elevate to VIP' : 'Max Authority'}
                               </Button>
                               <Button 
                                 onClick={() => handleAssignPriority(person.id, person.role)}
                                 className="w-full sm:w-auto rounded-full bg-black text-white px-6 h-10 font-bold text-[10px] uppercase hover:opacity-90 transition-all shadow-md"
                               >
                                 Assign Priority Slot
                               </Button>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AuthGate>
          </TabsContent>

          <TabsContent value="INQUIRIES" className="space-y-8 outline-none">
            <Card className="glass-panel border-black/5 rounded-lg overflow-hidden">
              <CardHeader className="p-10 border-b border-black/5 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold uppercase tracking-widest flex items-center gap-3">
                  <MessageSquare className="w-7 h-7 text-secondary" /> Customer Dialogue
                </CardTitle>
                <Badge variant="outline" className="bg-secondary/5 text-secondary border-secondary/20 font-bold px-4 py-1 text-[10px] uppercase">
                  {inquiries.filter(i => i.status === 'PENDING').length} Unresolved
                </Badge>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-black/5">
                  {inquiries.length === 0 ? (
                    <div className="p-20 text-center text-muted-foreground italic">No inquiries recorded in the studio ledger.</div>
                  ) : (
                    inquiries.map((inquiry) => (
                      <div key={inquiry.id} className="p-10 hover:bg-black/[0.01] transition-all grid md:grid-cols-4 gap-8 items-start">
                        <div className="md:col-span-1 space-y-2">
                          <p className="font-bold text-lg text-foreground uppercase tracking-tight leading-none">{inquiry.customer_name}</p>
                          <p className="text-sm font-medium text-muted-foreground italic truncate">{inquiry.customer_email}</p>
                          <Badge className={inquiry.status === 'PENDING' ? 'bg-secondary text-white' : 'bg-green-500/10 text-green-500 border-green-500/20'}>
                            {inquiry.status}
                          </Badge>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                          <div className="p-6 bg-black/5 rounded-md border border-black/5">
                            <p className="text-foreground font-medium leading-relaxed italic">"{inquiry.message}"</p>
                          </div>
                          {inquiry.response && (
                            <div className="p-6 bg-secondary/5 rounded-md border border-secondary/10 ml-6">
                              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Studio Response:</p>
                              <p className="text-foreground/80 font-medium italic">"{inquiry.response}"</p>
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-1 flex flex-col justify-end gap-3">
                          {inquiry.status === 'PENDING' && (
                            <>
                              {respondingToInquiry === inquiry.id ? (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                  <Textarea 
                                    placeholder="Draft your response..." 
                                    value={adminResponse}
                                    onChange={(e) => setAdminResponse(e.target.value)}
                                    className="glass-panel border-black/5 min-h-[100px] text-xs font-medium italic"
                                  />
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm"
                                      onClick={() => handleResolveInquiry(inquiry.id, inquiry.user_id)}
                                      className="flex-1 rounded-full bg-secondary text-white font-bold uppercase text-[9px] tracking-widest h-10"
                                    >
                                      Dispatch
                                    </Button>
                                    <Button 
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setRespondingToInquiry(null);
                                        setAdminResponse('');
                                      }}
                                      className="rounded-full border border-black/5 h-10 px-4 font-bold uppercase text-[9px] tracking-widest text-muted-foreground"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <Button 
                                  onClick={() => setRespondingToInquiry(inquiry.id)}
                                  className="rounded-full bg-black text-white px-8 h-12 font-bold uppercase text-[10px] tracking-widest"
                                >
                                  Compose Response
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="CONTENT" className="space-y-12 outline-none">
            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AuthGate authority="DROP_COORDINATOR">
                <Card className="glass-panel border-black/5 rounded-lg p-10 space-y-6">
                  <div className="p-4 bg-secondary/10 rounded-lg w-fit mb-4">
                    <Package className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight">Collection Drops</h3>
                  <p className="text-sm text-muted-foreground font-medium italic">Publish new designs directly to the commercial collection.</p>
                  <Button 
                    onClick={() => {
                      setEditingProduct(null);
                      setIsAdding(true);
                    }}
                    className="w-full rounded-full bg-secondary text-white font-bold uppercase text-[10px] tracking-widest h-12 shadow-[0_10px_25px_rgba(255,0,0,0.15)]"
                  >
                    Initiate Drop
                  </Button>
                </Card>
              </AuthGate>

              <AuthGate authority="STORYTELLING_LEAD">
                <Card className="glass-panel border-black/5 rounded-lg p-10 space-y-6">
                  <div className="p-4 bg-secondary/10 rounded-lg w-fit mb-4">
                    <Palette className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight">Portfolio Calibration</h3>
                  <p className="text-sm text-muted-foreground font-medium italic">Showcase high-couture projects and artisanal milestones.</p>
                  <Button 
                    onClick={() => {
                      setEditingPortfolioItem(null);
                      setIsAddingPortfolio(true);
                    }}
                    variant="outline" 
                    className="w-full rounded-full border-black/5 font-bold uppercase text-[10px] tracking-widest h-12"
                  >
                    Curate Project
                  </Button>
                </Card>
              </AuthGate>

              <AuthGate authority="STORYTELLING_LEAD">
                <Card className="glass-panel border-black/5 rounded-lg p-10 space-y-6">
                  <h3 className="text-2xl font-bold uppercase tracking-tight">Narrative Specs</h3>
                  <p className="text-sm text-muted-foreground font-medium italic">Update the studio's craftsmanship philosophies.</p>
                  <Button 
                    variant="ghost" 
                    onClick={() => setActiveTab('PHILOSOPHY')}
                    className="w-full rounded-full border border-black/5 font-bold uppercase text-[10px] tracking-widest h-12"
                  >
                    Edit Philosophies
                  </Button>
                </Card>
              </AuthGate>
            </div>

            {/* Designs Management List */}
            <AuthGate authority="DROP_COORDINATOR">
              <Card className="glass-panel border-black/5 rounded-lg overflow-hidden">
                <CardHeader className="p-10 border-b border-black/5 bg-black/[0.02]">
                  <CardTitle className="text-xl font-bold uppercase tracking-widest flex items-center gap-3">
                    <Package className="w-7 h-7 text-secondary" /> Commercial Designs Ledger
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-black/5">
                    {products.length === 0 ? (
                      <div className="p-20 text-center italic text-muted-foreground">No designs archived.</div>
                    ) : (
                      products.map((product) => (
                        <div key={product.id} className="p-8 flex items-center justify-between hover:bg-black/[0.01] transition-all">
                          <div className="flex items-center gap-6">
                            <div className="w-20 h-24 rounded-lg bg-black/5 overflow-hidden border border-black/5 flex-shrink-0">
                              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-bold text-lg uppercase tracking-tight leading-tight">{product.name}</h4>
                              <p className="text-xs font-bold text-secondary">Ksh {product.price.toLocaleString()}</p>
                              <div className="flex gap-2">
                                <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-widest opacity-60">{product.category}</Badge>
                                {product.is_featured && <Badge className="bg-secondary/10 text-secondary border-secondary/20 text-[9px]">FEATURED</Badge>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="rounded-full hover:bg-secondary/10 hover:text-secondary"
                              onClick={() => {
                                setEditingProduct(product);
                                setIsAdding(true);
                              }}
                            >
                              <Edit className="w-5 h-5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="rounded-full hover:bg-red-500/10 hover:text-red-500"
                              onClick={() => handleDeleteProduct(product.id, product.image_url || '')}
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </AuthGate>

            {/* Portfolio Management List */}
            <AuthGate authority="STORYTELLING_LEAD">
              <Card className="glass-panel border-black/5 rounded-lg overflow-hidden">
                <CardHeader className="p-10 border-b border-black/5 bg-black/[0.02]">
                  <CardTitle className="text-xl font-bold uppercase tracking-widest flex items-center gap-3">
                    <Palette className="w-7 h-7 text-secondary" /> Portfolio Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-black/5">
                    {portfolio.length === 0 ? (
                      <div className="p-20 text-center italic text-muted-foreground">No artistic milestones curated.</div>
                    ) : (
                      portfolio.map((item) => (
                        <div key={item.id} className="p-8 flex items-center justify-between hover:bg-black/[0.01] transition-all">
                          <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-md bg-black/5 overflow-hidden border border-black/5 flex-shrink-0">
                              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-bold text-lg uppercase tracking-tight leading-tight">{item.title}</h4>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{item.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                className="rounded-full hover:bg-secondary/10 hover:text-secondary"
                                onClick={() => {
                                  setEditingPortfolioItem(item);
                                  setIsAddingPortfolio(true);
                                }}
                              >
                                <Edit className="w-5 h-5" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="rounded-full hover:bg-red-500/10 hover:text-red-500"
                                onClick={() => handleDeletePortfolio(item.id, item.image_url || '')}
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </AuthGate>
          </TabsContent>

          <TabsContent value="PHILOSOPHY" className="space-y-12 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AuthGate authority="STORYTELLING_LEAD">
                <Card className="glass-panel border-black/5 rounded-lg p-10 space-y-6">
                  <div className="p-4 bg-secondary/10 rounded-lg w-fit mb-4">
                    <Sparkles className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight">Studio Pillars</h3>
                  <p className="text-sm text-muted-foreground font-medium italic">Document new ethical or aesthetic pillars for the brand narrative.</p>
                  <Button 
                    onClick={() => {
                      setEditingPhilosophy(null);
                      setIsAddingPhilosophy(true);
                    }}
                    className="w-full rounded-full bg-secondary text-white font-bold uppercase text-[10px] tracking-widest h-12 shadow-[0_10px_25px_rgba(255,0,0,0.25)]"
                  >
                    Document Pillar
                  </Button>
                </Card>
              </AuthGate>

              <AuthGate authority="TECHNICAL_AUDITOR">
                <Card className="glass-panel border-black/5 rounded-lg p-10 space-y-6">
                  <div className="p-4 bg-secondary/10 rounded-lg w-fit mb-4">
                    <ShieldCheck className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight">Narrative Integrity</h3>
                  <p className="text-sm text-muted-foreground font-medium italic">Audit and recalibrate existing studio philosophies.</p>
                  <div className="flex items-center justify-between p-4 bg-black/5 rounded-lg">
                    <p className="text-xs font-bold uppercase tracking-widest">Active Pillars</p>
                    <Badge variant="secondary" className="bg-secondary text-white font-bold">{philosophies.length}</Badge>
                  </div>
                </Card>
              </AuthGate>
            </div>

            <AuthGate authority="STORYTELLING_LEAD">
              <Card className="glass-panel border-black/5 rounded-lg overflow-hidden">
                <CardHeader className="p-10 border-b border-black/5 bg-black/[0.02]">
                  <CardTitle className="text-xl font-bold uppercase tracking-widest flex items-center gap-3">
                    <Sparkles className="w-7 h-7 text-secondary" /> Philosophical Ledger
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-black/5">
                    {philosophies.length === 0 ? (
                      <div className="p-20 text-center italic text-muted-foreground">No philosophies documented in the studio archive.</div>
                    ) : (
                      philosophies.map((phil) => (
                        <div key={phil.id} className="p-10 hover:bg-black/[0.01] transition-all grid md:grid-cols-4 gap-8 items-center">
                          <div className="md:col-span-1 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-lg bg-secondary/10 flex items-center justify-center border border-secondary/20">
                              {phil.icon_name === 'Leaf' ? <Leaf className="w-8 h-8 text-secondary" /> :
                               phil.icon_name === 'Scissors' ? <Scissors className="w-8 h-8 text-secondary" /> :
                               phil.icon_name === 'Factory' ? <Factory className="w-8 h-8 text-secondary" /> :
                               <Sparkles className="w-8 h-8 text-secondary" />}
                            </div>
                            <div>
                              <h4 className="font-bold text-xl uppercase tracking-tighter leading-none">{phil.title}</h4>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">Pillar ID: {phil.id.slice(0, 8)}</p>
                            </div>
                          </div>
                          <div className="md:col-span-2">
                             <p className="text-foreground/70 font-medium italic line-clamp-2 leading-relaxed">"{phil.content}"</p>
                          </div>
                          <div className="md:col-span-1 flex justify-end gap-4">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="rounded-full hover:bg-secondary/10 hover:text-secondary"
                              onClick={() => {
                                setEditingPhilosophy(phil);
                                setIsAddingPhilosophy(true);
                              }}
                            >
                              <Edit className="w-5 h-5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="rounded-full hover:bg-red-500/10 hover:text-red-500"
                              onClick={() => handleDeletePhilosophy(phil.id)}
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </AuthGate>
          </TabsContent>

          <TabsContent value="TECHNICAL" className="space-y-12 outline-none">
             <Card className="rounded-lg p-12 bg-black text-white relative overflow-hidden border-white/5 shadow-2xl">
                <div className="absolute top-0 right-0 p-20 opacity-20">
                   <Lock className="w-64 h-64 text-white" />
                </div>
                <div className="max-w-2xl space-y-8 relative z-10">
                   <h2 className="text-5xl md:text-6xl font-bold tracking-tighter uppercase leading-none text-white italic">Security<br />Audit <span className="text-secondary">Terminal</span></h2>
                   <p className="text-white/80 text-xl font-medium leading-relaxed max-w-xl">
                     Every action within the Command Center is logged to the immutable studio ledger. 
                     Unauthorized attempts to bypass Authority Gates will trigger an immediate account audit.
                   </p>
                   <div className="flex flex-wrap gap-4 pt-4">
                     <Button className="rounded-full bg-white text-black h-16 px-10 font-bold uppercase tracking-widest text-xs hover:bg-white/90 transition-all">Download Ledger</Button>
                     <Button variant="outline" className="rounded-full border-white/20 text-white h-16 px-10 font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all">Rotate Secrets</Button>
                   </div>
                </div>
             </Card>
          </TabsContent>
        </Tabs>

        {/* Add Product Modal */}
        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/40 backdrop-blur-3xl overflow-y-auto"
            >
              <div className="glass-panel p-8 md:p-16 rounded-lg max-w-4xl w-full border-white/10 space-y-12 relative bg-white/90 shadow-2xl my-auto">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground uppercase">{editingProduct ? 'Refine Concept' : 'Initiate Drop'}</h2>
                    <p className="text-muted-foreground font-medium italic text-lg">{editingProduct ? 'Recalibrate an existing design spec.' : 'Define a new design concept for the commercial collection.'}</p>
                  </div>
                  <Button variant="ghost" className="rounded-full w-12 h-12 p-0" onClick={() => { setIsAdding(false); setEditingProduct(null); }}>
                    <Plus className="w-6 h-6 rotate-45" />
                  </Button>
                </div>

                <form onSubmit={handleSaveProduct} className="grid lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Design Identity</label>
                      <Input name="name" defaultValue={editingProduct?.name} className="glass-panel h-16 rounded-lg border-black/5 focus:border-secondary/40 focus:ring-secondary/20 px-8 font-bold text-xl uppercase tracking-tight" required placeholder="Design Name" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Investment (Ksh)</label>
                        <Input name="price" type="number" defaultValue={editingProduct?.price} className="glass-panel h-16 rounded-lg border-black/5 focus:border-secondary/40 focus:ring-secondary/20 px-8 font-bold text-xl" required placeholder="0.00" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Category</label>
                        <select name="category" defaultValue={editingProduct?.category} className="w-full h-16 glass-panel rounded-lg border-black/5 px-8 font-bold text-[10px] uppercase tracking-widest outline-none bg-white/50">
                          <option value="FASHION">Fashion</option>
                          <option value="ACCESSORIES">Accessories</option>
                          <option value="PATTERNS">Patterns</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-black/5 rounded-lg border border-black/5">
                      <input type="checkbox" name="is_featured" id="feat" defaultChecked={editingProduct?.is_featured} className="w-5 h-5 accent-secondary" />
                      <label htmlFor="feat" className="text-xs font-bold uppercase tracking-widest cursor-pointer">Curated Highlight (Homepage)</label>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Visual Asset (Link)</label>
                        <Input 
                          name="image" 
                          defaultValue={editingProduct?.image_url} 
                          className="glass-panel h-16 rounded-lg border-black/5 focus:border-secondary/40 focus:ring-secondary/20 px-8 font-medium" 
                          placeholder="https://images.unsplash.com/..." 
                          disabled={isUploading}
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-black/5" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold text-muted-foreground bg-white/90 px-4">
                          Or local upload
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-secondary transition-colors flex items-center gap-2">
                           <Upload className="w-4 h-4" />
                           Design Template (Max 2MB)
                        </label>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20 bg-white/50 rounded-lg p-2 border border-black/5"
                          disabled={isUploading}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Artistic Statement</label>
                      <textarea 
                        name="description"
                        defaultValue={editingProduct?.description}
                        className="w-full h-40 glass-panel rounded-lg border-black/5 p-8 outline-none focus:border-secondary/40 focus:ring-2 focus:ring-secondary/20 transition-all font-medium text-lg leading-relaxed text-foreground bg-white/50"
                        placeholder="Materiality, silhouette, and technique..."
                        disabled={isUploading}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isUploading}
                      className="w-full rounded-full bg-secondary text-white h-20 font-bold uppercase text-lg tracking-widest shadow-[0_15px_40px_rgba(255,0,0,0.2)]"
                    >
                      {isUploading ? (
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                          {editingProduct ? 'Recalibrating...' : 'Archiving Concept...'}
                        </div>
                      ) : (
                        editingProduct ? 'Apply Refinements' : 'Publish Design'
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Portfolio Modal */}
        <AnimatePresence>
          {isAddingPortfolio && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/40 backdrop-blur-3xl overflow-y-auto"
            >
              <div className="glass-panel p-8 md:p-16 rounded-lg max-w-4xl w-full border-white/10 space-y-12 relative bg-white/90 shadow-2xl my-auto">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground uppercase leading-none">
                      {editingPortfolioItem ? (
                        <>Refine<br /><span className="text-secondary italic">Milestone</span></>
                      ) : (
                        <>Curate<br /><span className="text-secondary italic">Project</span></>
                      )}
                    </h2>
                    <p className="text-muted-foreground font-medium italic text-lg">{editingPortfolioItem ? 'Recalibrate a documented studio achievement.' : 'Document a high-couture milestone in the studio portfolio.'}</p>
                  </div>
                  <Button variant="ghost" className="rounded-full w-12 h-12 p-0" onClick={() => { setIsAddingPortfolio(false); setEditingPortfolioItem(null); }}>
                    <Plus className="w-6 h-6 rotate-45" />
                  </Button>
                </div>

                <form onSubmit={handleSavePortfolio} className="grid lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Project Title</label>
                      <Input name="title" defaultValue={editingPortfolioItem?.title} className="glass-panel h-16 rounded-lg border-black/5 focus:border-secondary/40 focus:ring-secondary/20 px-8 font-bold text-xl uppercase" required placeholder="e.g. The Solaris Shroud" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Presentation Category</label>
                      <Input name="category" defaultValue={editingPortfolioItem?.category} className="glass-panel h-16 rounded-lg border-black/5 focus:border-secondary/40 focus:ring-secondary/20 px-8 font-bold text-xs uppercase tracking-widest" required placeholder="RUNWAY / EXHIBITION / BESPOKE" />
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Visual Documentation (Link)</label>
                        <Input 
                          name="image" 
                          defaultValue={editingPortfolioItem?.image_url}
                          className="glass-panel h-16 rounded-lg border-black/5 focus:border-secondary/40 focus:ring-secondary/20 px-8 font-medium" 
                          placeholder="URL to project image" 
                          disabled={isUploading}
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-black/5" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold text-muted-foreground bg-white/90 px-4">
                          Or local upload
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-secondary transition-colors flex items-center gap-2">
                           <Upload className="w-4 h-4" />
                           Asset Upload (Max 2MB)
                        </label>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20 bg-white/50 rounded-lg p-2 border border-black/5"
                          disabled={isUploading}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Project Narrative</label>
                      <textarea 
                        name="description"
                        defaultValue={editingPortfolioItem?.description}
                        className="w-full h-40 glass-panel rounded-lg border-black/5 p-8 outline-none focus:border-secondary/40 focus:ring-2 focus:ring-secondary/20 transition-all font-medium text-lg leading-relaxed text-foreground bg-white/50"
                        placeholder="The concept, the technique, the journey..."
                        disabled={isUploading}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isUploading}
                      className="w-full rounded-full bg-black text-white h-20 font-bold uppercase text-lg tracking-widest"
                    >
                      {isUploading ? (
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                          {editingPortfolioItem ? 'Recalibrating...' : 'Calibrating...'}
                        </div>
                      ) : (
                        editingPortfolioItem ? 'Save Milestone' : 'Calibrate Portfolio'
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add/Edit Philosophy Modal */}
        <AnimatePresence>
          {isAddingPhilosophy && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/40 backdrop-blur-3xl overflow-y-auto"
            >
              <div className="glass-panel p-8 md:p-16 rounded-lg max-w-2xl w-full border-white/10 space-y-12 relative bg-white/90 shadow-2xl my-auto">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground uppercase leading-none italic">
                      {editingPhilosophy ? (
                        <>Refine<br /><span className="text-secondary not-italic">Philosophy</span></>
                      ) : (
                        <>Document<br /><span className="text-secondary not-italic">Pillar</span></>
                      )}
                    </h2>
                    <p className="text-muted-foreground font-medium italic text-lg">{editingPhilosophy ? 'Adjust the studio manifesto to reflect new craft paradigms.' : 'Define a new ethical or aesthetic pillar for the collective.'}</p>
                  </div>
                  <Button variant="ghost" className="rounded-full w-12 h-12 p-0" onClick={() => { setIsAddingPhilosophy(false); setEditingPhilosophy(null); }}>
                    <Plus className="w-6 h-6 rotate-45" />
                  </Button>
                </div>

                <form onSubmit={handleSavePhilosophy} className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pillar Title</label>
                      <Input name="title" defaultValue={editingPhilosophy?.title} className="glass-panel h-16 rounded-lg border-black/5 focus:border-secondary/40 focus:ring-secondary/20 px-8 font-bold text-xl uppercase" required placeholder="e.g. SLOW PRODUCTION" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Icon Signature</label>
                      <select name="icon_name" defaultValue={editingPhilosophy?.icon_name || 'Sparkles'} className="w-full glass-panel h-16 rounded-lg border-black/5 focus:border-secondary/40 focus:ring-secondary/20 px-8 font-bold text-[10px] tracking-widest uppercase appearance-none bg-white/50">
                        <option value="Sparkles">Sparkles (Visionary)</option>
                        <option value="Scissors">Scissors (Technique)</option>
                        <option value="Leaf">Leaf (Sustainable)</option>
                        <option value="Factory">Factory (Materials)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Visual Anchor (Image URL)</label>
                    <Input name="image_url" defaultValue={editingPhilosophy?.image_url} className="glass-panel h-16 rounded-lg border-black/5 focus:border-secondary/40 focus:ring-secondary/20 px-8 font-medium" placeholder="Optional background image URL" />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Manifesto Content</label>
                    <textarea 
                      name="content"
                      defaultValue={editingPhilosophy?.content}
                      className="w-full h-40 glass-panel rounded-lg border-black/5 p-8 outline-none focus:border-secondary/40 focus:ring-2 focus:ring-secondary/20 transition-all font-medium text-lg leading-relaxed text-foreground bg-white/50"
                      placeholder="Articulate the core value..."
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full rounded-full bg-black text-white h-20 font-bold uppercase text-lg tracking-widest"
                  >
                    {editingPhilosophy ? 'Confirm Refinements' : 'Seal Pillar'}
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
