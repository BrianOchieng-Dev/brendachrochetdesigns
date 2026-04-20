import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

export const isPlaceholder = 
  !supabaseUrl || 
  supabaseUrl === 'undefined' || 
  supabaseUrl === 'null' ||
  supabaseUrl.includes('placeholder');

if (isPlaceholder) {
  console.warn('Supabase URL or Anon Key is missing or invalid. Application is running in simulation mode.');
}

export const supabase = createClient(
  isPlaceholder ? 'https://placeholder.supabase.co' : supabaseUrl,
  isPlaceholder ? 'placeholder' : supabaseAnonKey
);
