import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if configuration is valid
export const isConfigured = !!(url && url.startsWith('http') && !url.includes('placeholder')) && !!(key && key.length > 20);

if (!isConfigured) {
  console.warn('Supabase Configuration: Missing or invalid credentials. Check your .env file.');
}

// Ensure we have a valid URL if VITE_SUPABASE_URL is junk or missing
const supabaseUrl = isConfigured ? url : 'https://placeholder.supabase.co';
const supabaseAnonKey = isConfigured ? key : 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
