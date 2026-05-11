"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-600 mb-8">
            Maaf, sepertinya ada yang tidak beres. Jangan khawatir, kami di sini untuk membantu Anda.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => reset()}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
          >
            Coba Lagi
          </button>
          
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold border border-gray-300"
          >
            Kembali ke Beranda
          </Link>
        </div>

        <div className="mt-8 p-4 bg-purple-50 rounded-xl">
          <p className="text-sm text-gray-700">
            Jika masalah terus berlanjut, silakan{" "}
            <Link href="#" className="text-indigo-600 font-semibold hover:text-indigo-700">
              hubungi dukungan kami
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
