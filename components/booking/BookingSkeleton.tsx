export default function BookingSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4 p-4">
      <div className="h-5 bg-surface rounded w-1/3" />
      <div className="flex flex-col gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-surface rounded-xl" />
        ))}
      </div>
    </div>
  );
}
