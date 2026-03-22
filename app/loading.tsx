export default function Loading() {
  return (
    <div className="min-h-screen bg-mirror-darker flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-mirror-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white">
          WATCH<span className="text-mirror-primary">MIRROR</span>
        </h1>
        <p className="text-gray-400 mt-2">Loading...</p>
      </div>
    </div>
  );
}
