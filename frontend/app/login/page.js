"use client";

import { useState, useEffect, Suspense } from "react"; // useEffect masih dipakai di bawah
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { authErrorMessage } from "../../lib/auth";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, signUp, signIn, signInWithGoogle, signInWithDiscord, resetPassword, isConfigured } = useAuth();

  /* derive mode langsung dari searchParams, tanpa state terpisah */
  const tabParam = searchParams.get("tab");
  const [mode, setMode] = useState(tabParam === "signin" ? "signin" : "signup");

  /* Sign Up form */
  const [signupForm, setSignupForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", password: "",
  });

  /* Sign In form */
  const [signinForm, setSigninForm] = useState({ email: "", password: "" });

  const [error, setError]       = useState("");
  const [info, setInfo]         = useState("");
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace("/chat");
  }, [user, authLoading, router]);

  /* ── handlers ── */
  const handleSignupChange = (e) =>
    setSignupForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSigninChange = (e) =>
    setSigninForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    const { firstName, email, phone, password } = signupForm;
    if (!firstName || !email || !phone || !password) {
      setError("Lengkapi semua field wajib.");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    if (!isConfigured) {
      setError("Supabase belum dikonfigurasi. Cek file .env.local");
      return;
    }
    setLoading(true);
    try {
      const data = await signUp({
        email,
        password,
        firstName,
        lastName: signupForm.lastName,
        phone,
      });
      if (data.session) {
        router.push("/chat");
      } else {
        setInfo("Cek email kamu untuk konfirmasi akun, lalu masuk.");
        setMode("signin");
      }
    } catch (err) {
      setError(authErrorMessage(err));
    }
    setLoading(false);
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    const { email, password } = signinForm;
    if (!email || !password) {
      setError("Lengkapi email dan password.");
      return;
    }
    if (!isConfigured) {
      setError("Supabase belum dikonfigurasi. Cek file .env.local");
      return;
    }
    setLoading(true);
    try {
      await signIn({ email, password });
      router.push("/chat");
    } catch (err) {
      setError(authErrorMessage(err));
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    setError("");
    setInfo("");
    const email = signinForm.email;
    if (!email) {
      setError("Masukkan email dulu, lalu klik lupa password.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setInfo("Link reset password dikirim ke email kamu.");
    } catch (err) {
      setError(authErrorMessage(err));
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(authErrorMessage(err));
    }
  };

  const handleDiscord = async () => {
    setError("");
    try {
      await signInWithDiscord();
    } catch (err) {
      setError(authErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10"
      style={{background: "radial-gradient(ellipse at 60% 80%, #1e1040 0%, #0a0a0a 70%)"}}>

      {/* Card */}
      <div className="relative w-full max-w-sm bg-[#111] rounded-3xl p-7 shadow-2xl border border-white/10">

        {/* Close button */}
        <Link href="/"
          className="absolute top-4 right-4 w-9 h-9 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>

        {/* Toggle Daftar / Masuk */}
        <div className="inline-flex bg-[#222] rounded-full p-1 mb-7">
          <button
            onClick={() => { setMode("signup"); setError(""); }}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              mode === "signup" ? "bg-white text-black shadow" : "text-gray-400 hover:text-white"
            }`}
          >
            Daftar
          </button>
          <button
            onClick={() => { setMode("signin"); setError(""); }}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              mode === "signin" ? "bg-white text-black shadow" : "text-gray-400 hover:text-white"
            }`}
          >
            Masuk
          </button>
        </div>

        {/* ── DAFTAR ── */}
        {mode === "signup" && (
          <>
            <h1 className="text-2xl font-bold text-white mb-6">Buat akun baru</h1>

            {error && (
              <p className="mb-4 text-xs text-red-400 bg-red-900/30 border border-red-800 rounded-xl px-3 py-2">{error}</p>
            )}
            {info && (
              <p className="mb-4 text-xs text-emerald-400 bg-emerald-900/30 border border-emerald-800 rounded-xl px-3 py-2">{info}</p>
            )}

            <form onSubmit={handleSignup} className="space-y-3">
              {/* Nama depan / belakang */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="firstName"
                  value={signupForm.firstName}
                  onChange={handleSignupChange}
                  placeholder="Nama depan"
                  className="w-full bg-[#1e1e1e] border border-white/10 text-white placeholder-gray-500 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  name="lastName"
                  value={signupForm.lastName}
                  onChange={handleSignupChange}
                  placeholder="Nama belakang"
                  className="w-full bg-[#1e1e1e] border border-white/10 text-white placeholder-gray-500 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Email */}
              <div className="flex items-center bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 gap-3">
                <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email"
                  name="email"
                  value={signupForm.email}
                  onChange={handleSignupChange}
                  placeholder="Masukkan email kamu"
                  className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none"
                />
              </div>

              {/* Nomor HP */}
              <div className="flex items-center bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 gap-3">
                <div className="flex items-center gap-1.5 shrink-0 cursor-pointer">
                  <span className="text-lg">🇮🇩</span>
                  <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="w-px h-4 bg-white/10"></div>
                <input
                  type="tel"
                  name="phone"
                  value={signupForm.phone}
                  onChange={handleSignupChange}
                  placeholder="(+62) 812-3456-7890"
                  className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none"
                />
              </div>

              {/* Password */}
              <div className="flex items-center bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 gap-3">
                <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type="password"
                  name="password"
                  value={signupForm.password}
                  onChange={handleSignupChange}
                  placeholder="Password (min. 6 karakter)"
                  className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none"
                  autoComplete="new-password"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-white hover:bg-gray-100 text-black text-sm font-bold rounded-xl transition-colors disabled:opacity-50 mt-1"
              >
                {loading ? "Membuat akun..." : "Buat akun"}
              </button>
            </form>
          </>
        )}

        {/* ── MASUK ── */}
        {mode === "signin" && (
          <>
            <h1 className="text-2xl font-bold text-white mb-6">Selamat datang kembali</h1>

            {error && (
              <p className="mb-4 text-xs text-red-400 bg-red-900/30 border border-red-800 rounded-xl px-3 py-2">{error}</p>
            )}
            {info && (
              <p className="mb-4 text-xs text-emerald-400 bg-emerald-900/30 border border-emerald-800 rounded-xl px-3 py-2">{info}</p>
            )}

            <form onSubmit={handleSignin} className="space-y-3">
              {/* Email */}
              <div className="flex items-center bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 gap-3">
                <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email"
                  name="email"
                  value={signinForm.email}
                  onChange={handleSigninChange}
                  placeholder="Masukkan email kamu"
                  className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="flex items-center bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 gap-3">
                <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type="password"
                  name="password"
                  value={signinForm.password}
                  onChange={handleSigninChange}
                  placeholder="Masukkan password"
                  className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none"
                  autoComplete="current-password"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Lupa password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-white hover:bg-gray-100 text-black text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Masuk"}
              </button>
            </form>
          </>
        )}

        {/* ── ATAU MASUK DENGAN ── */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-[10px] font-semibold text-gray-500 tracking-widest uppercase">Atau masuk dengan</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            className="flex items-center justify-center py-3 bg-[#1e1e1e] hover:bg-[#2a2a2a] border border-white/10 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </button>

          {/* Discord */}
          <button
            type="button"
            onClick={handleDiscord}
            className="flex items-center justify-center py-3 bg-[#1e1e1e] hover:bg-[#2a2a2a] border border-white/10 rounded-xl transition-colors">
            {/* Discord logo SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#5865F2">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </button>
        </div>

        {/* Terms */}
        <p className="text-center text-[10px] text-gray-600 mt-5 leading-relaxed">
          Dengan membuat akun, kamu menyetujui{" "}
          <span className="text-gray-400 hover:text-white cursor-pointer">Syarat &amp; Ketentuan</span>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <AuthForm />
    </Suspense>
  );
}
