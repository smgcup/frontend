export default function TeamLoading() {
    return (
      <main className="min-h-screen bg-background">
        {/* Header Skeleton */}
        <div className="bg-linear-to-b from-primary/10 to-background border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="h-4 w-32 bg-muted rounded animate-pulse mb-6" />
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-xl bg-muted animate-pulse" />
              <div className="space-y-2">
                <div className="h-8 w-48 bg-muted rounded animate-pulse" />
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
  
        {/* Tabs Skeleton */}
        <div className="border-b">
          <div className="container mx-auto px-4">
            <div className="flex gap-4 py-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 w-24 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
  
        {/* Content Skeleton */}
        <div className="container mx-auto px-4 py-8 space-y-8">
          {[1, 2, 3].map((section) => (
            <div key={section} className="space-y-4">
              <div className="h-6 w-32 bg-muted rounded animate-pulse" />
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 p-4 rounded-xl border bg-card/50"
                  >
                    <div className="h-14 w-14 rounded-lg bg-muted animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-5 w-40 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }
  