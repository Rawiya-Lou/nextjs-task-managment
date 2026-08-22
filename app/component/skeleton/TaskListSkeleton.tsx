
export default function TaskListSkeleton() {
  return (
    <div className="space-y-3 mt-6 animate-pulse">
      {/* Creates 3 mock loading rows instantly */}
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-16 w-full bg-gray-100 rounded-lg" />
      ))}
    </div>
  );
}
