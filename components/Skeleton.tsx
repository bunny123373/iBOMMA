'use client';

export const MovieCardSkeleton = () => {
  return (
    <div className="w-44 md:w-56 flex-shrink-0">
      <div className="aspect-[2/3] rounded-xl skeleton" />
      <div className="mt-2">
        <div className="skeleton h-4 w-3/4 rounded mb-1" />
        <div className="skeleton h-3 w-1/2 rounded" />
      </div>
    </div>
  );
};

export const MovieRowSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between px-4 md:px-8 mb-4">
        <div className="skeleton h-8 w-48 rounded" />
      </div>
      <div className="flex gap-3 md:gap-4 overflow-hidden px-4 md:px-8">
        {[...Array(count)].map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export const HeroSkeleton = () => {
  return (
    <div className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
      <div className="absolute inset-0 skeleton" />
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-2xl px-4 md:px-8 space-y-4">
          <div className="skeleton h-6 w-32 rounded" />
          <div className="skeleton h-12 w-96 rounded" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="flex gap-3 mt-6">
            <div className="skeleton h-12 w-32 rounded-lg" />
            <div className="skeleton h-12 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-mirror-darker">
      <HeroSkeleton />
      <div className="py-8">
        <MovieRowSkeleton count={8} />
        <MovieRowSkeleton count={6} />
        <MovieRowSkeleton count={8} />
      </div>
    </div>
  );
};
