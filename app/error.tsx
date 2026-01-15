// Custom error pages
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0b0d] p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Something went wrong!</h1>
        <p className="text-slate-400 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
