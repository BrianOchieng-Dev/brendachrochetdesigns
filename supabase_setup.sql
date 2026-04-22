-- 1. Inquiries Table (For Contact Section)
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RESOLVED')),
    response TEXT,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for Inquiries
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert an inquiry
CREATE POLICY "Public can insert inquiries" ON public.inquiries 
FOR INSERT WITH CHECK (true);

-- Policy: Users can view their own inquiries
CREATE POLICY "Users can view own inquiries" ON public.inquiries 
FOR SELECT USING (auth.uid() = user_id);

-- Policy: Admin can do everything
CREATE POLICY "Admins have full access on inquiries" ON public.inquiries 
FOR ALL USING (auth.jwt() ->> 'email' = 'studio@brendadesigns.com');


-- 2. Philosophies Table (For Sustainability Page)
CREATE TABLE IF NOT EXISTS public.philosophies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    icon_name TEXT DEFAULT 'Sparkles',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for Philosophies
ALTER TABLE public.philosophies ENABLE ROW LEVEL SECURITY;

-- Policy: Public read
CREATE POLICY "Public can read philosophies" ON public.philosophies 
FOR SELECT USING (true);

-- Policy: Admin write
CREATE POLICY "Admin can manage philosophies" ON public.philosophies 
FOR ALL USING (auth.jwt() ->> 'email' = 'studio@brendadesigns.com');


-- 3. Profiles Table (For Collectors/Muses)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'GUEST' CHECK (role IN ('GUEST', 'COLLECTOR', 'MUSE')),
    measurements JSONB DEFAULT '{"height": 0, "chest": 0, "arm_length": 0, "unit": "cm"}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage their own profile
CREATE POLICY "Users can manage own profile" ON public.profiles 
FOR ALL USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 4. Portfolio Table
CREATE TABLE IF NOT EXISTS public.portfolio (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for Portfolio
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

-- Policy: Public read
CREATE POLICY "Public can read portfolio" ON public.portfolio 
FOR SELECT USING (true);

-- Policy: Admin write
CREATE POLICY "Admin can manage portfolio" ON public.portfolio 
FOR ALL USING (auth.jwt() ->> 'email' = 'studio@brendadesigns.com');
