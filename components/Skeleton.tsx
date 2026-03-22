'use client';

export const MovieCardSkeleton = () => {
  return (
    <div className="w-40 sm:w-44 md:w-48 flex-shrink-0">
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-gray-800/80 rounded-md w-3/4" />
        <div className="h-3 bg-gray-800/50 rounded w-1/2" />
      </div>
    </div>
  );
};

export const MovieRowSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between px-4 md:px-8 mb-5">
        <div className="h-7 w-40 bg-gray-800/80 rounded-lg animate-pulse" />
      </div>
      <div className="flex gap-4 overflow-x-auto px-4 md:px-8 pb-4 no-scrollbar">
        {[...Array(count)].map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export const HeroSkeleton = () => {
  return (
    <div className="relative h-[85vh] md:h-[90vh] w-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
          <div className="max-w-3xl space-y-6">
            <div className="flex gap-3">
              <div className="h-7 w-24 bg-gray-700/60 rounded-md animate-pulse" />
              <div className="h-7 w-20 bg-gray-700/60 rounded-md animate-pulse" />
            </div>
            <div className="h-14 sm:h-16 md:h-20 lg:h-24 bg-gray-700/60 rounded-lg animate-pulse w-3/4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-700/60 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-700/60 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-gray-700/60 rounded animate-pulse w-4/6" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-gray-700/60 rounded-md animate-pulse" />
              <div className="h-6 w-16 bg-gray-700/60 rounded-md animate-pulse" />
              <div className="h-6 w-16 bg-gray-700/60 rounded-md animate-pulse" />
            </div>
            <div className="flex gap-4 pt-4">
              <div className="h-14 w-36 bg-gray-700/60 rounded-lg animate-pulse" />
              <div className="h-14 w-32 bg-gray-700/60 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <HeroSkeleton />
      <div className="py-8">
        <MovieRowSkeleton count={8} />
        <MovieRowSkeleton count={6} />
        <MovieRowSkeleton count={8} />
      </div>
    </div>
  );
};

export const MovieGridSkeleton = ({ count = 10 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="relative aspect-[2/3] rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-4 bg-gray-800/80 rounded-md w-3/4 mx-auto" />
            <div className="h-3 bg-gray-800/50 rounded w-1/2 mx-auto" />
          </div>
        </div>
      ))}
    </div>
  );
};
