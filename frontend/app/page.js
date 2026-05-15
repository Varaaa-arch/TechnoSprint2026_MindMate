"use client";

import Link from "next/link";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f0f2f8] font-sans">

      {/* ── NAVBAR ── */}
      <Navbar />

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-purple-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-purple-400 inline-block"></span>
          <span className="text-xs text-purple-600 font-semibold tracking-wide uppercase">Selamat Datang di MindMate</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5 max-w-3xl mx-auto">
          Teman AI untuk Kesehatan Mentalmu
        </h1>

        <p className="text-gray-500 text-base max-w-xl mx-auto mb-8 leading-relaxed">
          Rasakan dukungan emosional yang personal, kapan saja di mana saja. MindMate hadir
          membantu kamu menghadapi stres, mengelola suasana hati, dan menemukan ketenangan
          batin melalui teknologi cerdas yang empatis.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
          <Link
            href={user ? "/chat" : "/login"}
            className="px-7 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            Mulai Konsultasi Gratis
          </Link>
          <button className="px-7 py-3 bg-white text-gray-700 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Lihat Cara Kerja
          </button>
        </div>

        {/* small note */}
        <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
          <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          AI Chat yang Aman &amp; Terpercaya
        </p>
      </section>

      {/* ── PHONE MOCKUP BANNER ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="relative rounded-3xl bg-linear-to-br from-[#1a4a4a] via-[#1e5c5c] to-[#0f3333] shadow-2xl" style={{minHeight: 420}}>

          {/* decorative circles */}
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-teal-600/30 blur-2xl"></div>
          <div className="absolute -bottom-24 -right-16 w-96 h-96 rounded-full bg-blue-800/40 blur-3xl"></div>

          {/* 3 phones */}
          <div className="relative z-10 flex items-end justify-center gap-4 px-8 pt-10">

            {/* Phone Left */}
            <div className="w-44 h-80 bg-[#0d2e2e] rounded-3xl border-4 border-[#1a4040] shadow-2xl shrink-0 overflow-hidden"
              style={{transform: "rotate(-8deg) translateY(20px)"}}>
              <div className="h-full bg-linear-to-b from-[#0d3535] to-[#0a2525] flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="w-full space-y-2">
                  <div className="h-2 bg-teal-500/30 rounded-full w-3/4 mx-auto"></div>
                  <div className="h-2 bg-teal-500/20 rounded-full w-1/2 mx-auto"></div>
                </div>
              </div>
            </div>

            {/* Phone Center */}
            <div className="w-52 h-96 bg-white rounded-3xl border-4 border-gray-200 shadow-2xl shrink-0 overflow-hidden z-10">
              <div className="bg-gray-50 px-4 pt-3 pb-2 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-medium">9:41</span>
                <div className="w-16 h-4 bg-gray-200 rounded-full"></div>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                </div>
              </div>
              <div className="px-3 py-2 space-y-2">
                <div className="bg-indigo-50 rounded-xl p-3">
                  <p className="text-[9px] text-indigo-400 font-semibold mb-1">MOOD HARI INI</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">😊</span>
                    <div>
                      <p className="text-[10px] font-bold text-gray-800">Senang</p>
                      <p className="text-[8px] text-gray-400">Perasaan positif</p>
                    </div>
                  </div>
                </div>
                {[
                  {emoji:"😌", label:"Tenang", sub:"Rileks"},
                  {emoji:"😔", label:"Sedih", sub:"Butuh dukungan"},
                ].map((m,i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-2.5 flex items-center gap-2">
                    <span className="text-base">{m.emoji}</span>
                    <div className="flex-1">
                      <p className="text-[9px] font-semibold text-gray-700">{m.label}</p>
                      <p className="text-[8px] text-gray-400">{m.sub}</p>
                    </div>
                    <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
                <div className="bg-purple-50 rounded-xl p-2.5">
                  <p className="text-[8px] text-purple-400 font-semibold mb-1">REKOMENDASI</p>
                  <p className="text-[9px] text-gray-700 leading-tight">Coba meditasi 10 menit untuk menenangkan pikiran.</p>
                </div>
              </div>
            </div>

            {/* Phone Right */}
            <div className="w-44 h-80 bg-[#0d2e2e] rounded-3xl border-4 border-[#1a4040] shadow-2xl shrink-0 overflow-hidden"
              style={{transform: "rotate(8deg) translateY(20px)"}}>
              <div className="h-full bg-linear-to-b from-[#0d3535] to-[#0a2525] flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="w-full space-y-2">
                  <div className="h-2 bg-blue-500/30 rounded-full w-3/4 mx-auto"></div>
                  <div className="h-2 bg-blue-500/20 rounded-full w-1/2 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating chat bubble */}
          <Link
            href="/chat"
            className="absolute bottom-6 right-6 w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg hover:bg-purple-700 hover:scale-105 transition-all z-20"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Fitur Utama untuk Kesejahteraanmu</h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Dirancang untuk mendukung kesehatan mentalmu dengan pendekatan personal dan berbasis data.
          </p>
        </div>

        {/* Top row: 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

          {/* AI Chat card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">AI Chat yang Berempati</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Bicarakan apa saja yang ada di pikiranmu tanpa takut dihakimi. AI kami hadir untuk
                mendengarkan dan memberikan respons yang memenangkan.
              </p>
            </div>
            <Link href={user ? "/chat" : "/login"} className="mt-5 text-xs text-indigo-600 font-semibold hover:text-indigo-700 inline-flex items-center gap-1">
              Pelajari Lebih Lanjut
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Center phone image */}
          <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center min-h-[280px] relative">
            <div className="absolute inset-0 bg-linear-to-br from-gray-700 to-gray-900"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full py-6">
              <div className="w-32 h-56 bg-white rounded-2xl shadow-2xl border-4 border-gray-600 overflow-hidden">
                <div className="bg-indigo-600 h-10 flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold">MindMate Chat</span>
                </div>
                <div className="p-2 space-y-2 bg-gray-50 h-full">
                  <div className="bg-indigo-100 rounded-lg p-1.5 max-w-[80%]">
                    <p className="text-[7px] text-indigo-800">Halo! Bagaimana perasaanmu hari ini?</p>
                  </div>
                  <div className="bg-white rounded-lg p-1.5 max-w-[80%] ml-auto border border-gray-200">
                    <p className="text-[7px] text-gray-700">Saya merasa lebih baik sekarang 😊</p>
                  </div>
                  <div className="bg-indigo-100 rounded-lg p-1.5 max-w-[80%]">
                    <p className="text-[7px] text-indigo-800">Senang mendengarnya! Ceritakan lebih...</p>
                  </div>
                </div>
              </div>
              <div className="mt-2 w-20 h-6 bg-gray-600/50 rounded-full blur-sm"></div>
            </div>
          </div>

          {/* Mood Tracking card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Pelacakan Suasana Hati</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Pantau perubahan emosi setiap hari. Temukan pola suasana hatimu dan ambil
                langkah nyata untuk kesejahteraan diri.
              </p>
            </div>
            {/* Mini bar chart */}
            <div className="mt-5 flex items-end gap-1.5 h-14">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm"
                  style={{
                    height: `${h}%`,
                    backgroundColor: i === 5 ? '#6366f1' : '#e0e7ff'
                  }}>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row: 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Wawasan Mendalam */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">Wawasan Mendalam</h3>
            <p className="text-gray-500 text-xs leading-relaxed mb-4">
              Dapatkan laporan personal yang menampilkan tren mood, faktor pemicu stres, dan
              rekomendasi berbasis data untuk meningkatkan kesehatan mentalmu.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] text-gray-500">
                <span>Mood Positif</span><span>72%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-indigo-500 h-1.5 rounded-full" style={{width:"72%"}}></div>
              </div>
            </div>
          </div>

          {/* CTA Card */}
          <div className="bg-linear-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-purple-800/30 rounded-full"></div>

            <div className="relative z-10">
              <h3 className="text-base font-bold mb-2">Siap untuk memulai perubahan positif?</h3>
              <p className="text-purple-100 text-xs leading-relaxed mb-5">
                Bergabunglah dengan ribuan pengguna yang telah merasakan manfaatnya.
                Mulai perjalananmu bersama MindMate hari ini.
              </p>

              <div className="flex items-center gap-4 mb-5">
                <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                  <p className="text-lg font-extrabold">10k+</p>
                  <p className="text-[10px] text-purple-200">Pengguna</p>
                </div>
                <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                  <p className="text-lg font-extrabold">4.9/5</p>
                  <p className="text-[10px] text-purple-200">Rating</p>
                </div>
              </div>

              <Link
                href={user ? "/chat" : "/register"}
                className="inline-block px-5 py-2.5 bg-white text-indigo-700 text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-md"
              >
                Unduh Aplikasi Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-7xl font-serif text-indigo-300 leading-none mb-2 select-none">&ldquo;</p>

          <blockquote className="text-gray-700 text-base md:text-lg leading-relaxed mb-6 italic">
            &ldquo;MindMate bukan sekadar aplikasi, tapi seperti teman yang selalu ada di saku. Saat
            saya merasa cemas di tengah malam, dia selalu ada untuk mendengarkan.&rdquo;
          </blockquote>

          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-300 to-pink-400 flex items-center justify-center text-white font-bold text-sm">S</div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-900">Sarah Amalia</p>
              <p className="text-xs text-gray-400">Pengguna Aktif MindMate</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-200 bg-[#f0f2f8]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-indigo-600 font-bold text-sm mb-1">MindMate</p>
            <p className="text-gray-400 text-xs">© 2026 MindMate is your emotional wellbeing partner.</p>
          </div>

          <div className="flex items-center gap-6 text-xs text-gray-500">
            <Link href="#" className="hover:text-indigo-600">Privacy Policy</Link>
            <Link href="#" className="hover:text-indigo-600">Terms of Service</Link>
            <Link href="#" className="hover:text-indigo-600">Help Center</Link>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:border-indigo-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </button>
            <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:border-indigo-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
