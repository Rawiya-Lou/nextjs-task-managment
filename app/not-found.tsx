import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
      <h2 className="text-5xl font-black text-blue-600 mb-2">404</h2>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        Page Not Found
      </h1>
      <p className="text-gray-500 max-w-sm mb-6 text-sm">
        The task dashboard or route you are searching for might have been moved, deleted, or does not exist.
      </p>
      <Link 
        href="/" 
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors"
      >
        Return to App Home
      </Link>
    </div>
  );
}
