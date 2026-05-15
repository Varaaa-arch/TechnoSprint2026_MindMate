import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-b from-purple-50 to-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-8xl font-bold text-indigo-600 mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-8">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. 
            Mungkin halaman telah dipindahkan atau URL salah.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
          >
            Kembali ke Beranda
          </Link>
          
          <Link
            href="/chat"
            className="block w-full px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold border border-gray-300"
          >
            Mulai Chat dengan MindMate
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <Link
            href="/"
            className="p-4 bg-white rounded-xl hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="text-2xl mb-2">🏠</div>
            <div className="text-xs font-medium text-gray-700">Home</div>
          </Link>
          <Link
            href="/mood"
            className="p-4 bg-white rounded-xl hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="text-2xl mb-2">😊</div>
            <div className="text-xs font-medium text-gray-700">Mood</div>
          </Link>
          <Link
            href="/dashboard"
            className="p-4 bg-white rounded-xl hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="text-xs font-medium text-gray-700">Insights</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
