export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-fuchsia-600 border-t-transparent" />
          <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full bg-fuchsia-600/20" />
        </div>
        <p className="text-sm font-medium text-fuchsia-600/80 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
