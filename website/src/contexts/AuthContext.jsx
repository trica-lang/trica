import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { loginToInkflow } from '../lib/inkflow';
import { useInkflow } from './InkflowContext';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);


  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithGitHub = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  const signInWithInkflow = async () => {
    try {
      setLoading(true);
      
      // Use the official INKFLOW provider
      const userId = 'trica_user_' + Date.now();
      const email = 'user@trica.dev';
      const displayName = 'TRICA Developer';
      
      console.log('Authenticating with INKFLOW...');
      const inkflowResponse = await loginToInkflow(userId, email, displayName);
      
      // Create user object compatible with your auth system
      const inkflowUser = {
        id: userId,
        email: email,
        user_metadata: {
          name: displayName,
          provider: 'inkflow',
          avatar_url: 'https://inkflow.lovable.app/favicon.ico',
          full_name: displayName
        },
        email_confirmed_at: new Date().toISOString(),
        provider: 'inkflow'
      };
      
      setUser(inkflowUser);
      setLoading(false);
      
      return { success: true, user: inkflowUser, inkflow: inkflowResponse };
    } catch (error) {
      setLoading(false);
      console.error('Error signing in with INKFLOW:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error && !user?.provider === 'inkflow') throw error;
      
      // Clear INKFLOW session
      localStorage.removeItem('inkflow_session');
      
      // If user signed in with INKFLOW only, clear user state
      if (user?.provider === 'inkflow') {
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const isVerifiedUser = () => {
    if (!user) return false;
    
    // Check if user has verified email
    if (!user.email_confirmed_at) return false;
    
    // Check for special domains or criteria
    const specialDomains = ['google.com', 'github.com', 'microsoft.com', 'apple.com'];
    const userDomain = user.email?.split('@')[1];
    
    return specialDomains.includes(userDomain) || user.user_metadata?.verified === true;
  };

  const isPremiumUser = () => {
    if (!user) return false;
    
    // Check for premium status (you can implement your own logic)
    return user.user_metadata?.premium === true || 
           user.user_metadata?.subscription === 'premium' ||
           isVerifiedUser(); // Verified users get premium features
  };

  const getUserDisplayName = () => {
    if (!user) return null;
    return user.user_metadata?.full_name || 
           user.user_metadata?.name || 
           user.email?.split('@')[0] || 
           'Anonymous User';
  };

  const getUserAvatar = () => {
    if (!user) return null;
    return user.user_metadata?.avatar_url || 
           user.user_metadata?.picture || 
           `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`;
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithGitHub,
    signInWithEmail,
    signInWithInkflow,
    signOut,
    isVerifiedUser,
    isPremiumUser,
    getUserDisplayName,
    getUserAvatar
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};