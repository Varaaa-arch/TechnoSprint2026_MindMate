/** Map Supabase session user → MindMate app user shape */

export function mapSupabaseUser(supabaseUser) {
  if (!supabaseUser) return null;

  const meta = supabaseUser.user_metadata || {};
  const first = meta.first_name || "";
  const last = meta.last_name || "";
  const fullName =
    meta.full_name ||
    [first, last].filter(Boolean).join(" ").trim() ||
    supabaseUser.email?.split("@")[0] ||
    "Pengguna";

  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: fullName,
    phone: meta.phone || null,
    avatarUrl: meta.avatar_url || null,
  };
}

export function authErrorMessage(error) {
  if (!error?.message) return "Terjadi kesalahan. Coba lagi.";
  const msg = error.message.toLowerCase();
  if (msg.includes("invalid login credentials")) {
    return "Email atau password salah.";
  }
  if (msg.includes("user already registered")) {
    return "Email sudah terdaftar. Silakan masuk.";
  }
  if (msg.includes("password")) {
    return "Password minimal 6 karakter.";
  }
  if (msg.includes("email not confirmed")) {
    return "Cek email kamu untuk konfirmasi akun sebelum masuk.";
  }
  return error.message;
}
