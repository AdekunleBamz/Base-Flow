export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0b0d] p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-slate-400 mb-6">Page not found</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
