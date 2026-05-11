"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    let mounted = true;
    const restore = () => {
      try {
        const stored = localStorage.getItem("mindmate_user");
        if (stored && mounted) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
        }
      } catch {
        // ignore parse errors
      } finally {
        if (mounted) setLoading(false);
      }
    };
    restore();
    return () => { mounted = false; };
  }, []);

  const login = (userData) => {
    const u = { ...userData, loggedInAt: Date.now() };
    setUser(u);
    localStorage.setItem("mindmate_user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mindmate_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
