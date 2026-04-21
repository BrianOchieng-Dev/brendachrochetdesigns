import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export type UserRole = 'GUEST' | 'COLLECTOR' | 'MUSE' | 'VIP' | 'ADMIN';

export type AdminAuthority = 
  | 'TIER_AUTHORITY' 
  | 'MEASUREMENT_CUSTODIAN' 
  | 'COMMISSION_FACILITATOR' 
  | 'DISPUTE_ARBITRATOR' 
  | 'ACCOUNT_OVERSIGHT' 
  | 'ASSET_GATEKEEPER' 
  | 'UI_CONTROLLER' 
  | 'STORYTELLING_LEAD' 
  | 'DROP_COORDINATOR' 
  | 'TECHNICAL_AUDITOR';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  role: UserRole;
  authorities: AdminAuthority[];
  isMuse: boolean;
  isVIP: boolean;
  isCollector: boolean;
  isAdmin: boolean;
  hasAuthority: (authority: AdminAuthority) => boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    }).catch(err => {
      if (!err.message?.includes('Failed to fetch')) {
        console.error('Session initialization failed:', err);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);


  const signOut = async () => {
    try {
      if (session) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.warn('Sign out call failed, clearing local state anyway:', error);
    } finally {
      setSession(null);
      setUser(null);
    }
  };

  const role: UserRole = user?.email === 'crochetbrenda@gmail.com' ? 'ADMIN' : 
                       ((user?.user_metadata?.role as UserRole) || 
                       (user ? 'COLLECTOR' : 'GUEST'));
  const authorities: AdminAuthority[] = (user?.user_metadata?.authorities as AdminAuthority[]) || [];
  
  const isAdmin = role === 'ADMIN';
  const isVIP = role === 'VIP' || isAdmin;
  const isMuse = role === 'MUSE' || isVIP;
  const isCollector = role === 'COLLECTOR' || isMuse;

  const hasAuthority = (authority: AdminAuthority) => {
    if (isAdmin) return true; // Admins have full access
    return authorities.includes(authority);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      role, 
      authorities,
      isMuse, 
      isVIP,
      isCollector, 
      isAdmin,
      hasAuthority,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
