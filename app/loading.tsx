export default function GlobalLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Clean, professional tailwind spinning element */}
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-600 font-medium text-sm animate-pulse">
        Preparing your dashboard...
      </p>
    </div>
  );
}
