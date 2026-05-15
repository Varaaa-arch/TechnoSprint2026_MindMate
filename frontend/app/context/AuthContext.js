"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { mapSupabaseUser } from "../../lib/auth";
import { setAuthTokenGetter } from "../../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((nextSession) => {
    setSession(nextSession);
    setUser(mapSupabaseUser(nextSession?.user ?? null));
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (mounted) applySession(s);
      if (mounted) setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      applySession(s);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [applySession]);

  useEffect(() => {
    setAuthTokenGetter(async () => {
      if (!isSupabaseConfigured()) return null;
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token ?? null;
    });
  }, [session]);

  const signUp = useCallback(async ({ email, password, firstName, lastName, phone }) => {
    if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: [firstName, lastName].filter(Boolean).join(" ").trim(),
          phone,
        },
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback`
            : undefined,
      },
    });
    if (error) throw error;
    if (data.session) applySession(data.session);
    return data;
  }, [applySession]);

  const signIn = useCallback(async ({ email, password }) => {
    if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    applySession(data.session);
    return data;
  }, [applySession]);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback`
            : undefined,
      },
    });
    if (error) throw error;
  }, []);

  const signInWithDiscord = useCallback(async () => {
    if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback`
            : undefined,
      },
    });
    if (error) throw error;
  }, []);

  const resetPassword = useCallback(async (email) => {
    if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/login?tab=signin`
          : undefined,
    });
    if (error) throw error;
  }, []);

  const logout = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    applySession(null);
  }, [applySession]);

  const getAccessToken = useCallback(async () => {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      isConfigured: isSupabaseConfigured(),
      signUp,
      signIn,
      signInWithGoogle,
      signInWithDiscord,
      resetPassword,
      logout,
      getAccessToken,
    }),
    [
      user,
      session,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      signInWithDiscord,
      resetPassword,
      logout,
      getAccessToken,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
