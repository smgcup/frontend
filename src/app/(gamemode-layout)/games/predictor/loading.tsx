const PredictorLoading = () => {
  return (
    <div className="min-h-[calc(100vh-60px)]">
      {/* Hero Skeleton */}
      <div className="relative overflow-hidden bg-linear-to-br from-orange-500 via-orange-600 to-amber-600">
        <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-10 w-64 bg-white/20 rounded-lg mx-auto animate-pulse" />
            <div className="h-6 w-96 bg-white/20 rounded-lg mx-auto mt-4 animate-pulse" />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 w-40 bg-white/10 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-72 bg-muted rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-muted/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictorLoading;
