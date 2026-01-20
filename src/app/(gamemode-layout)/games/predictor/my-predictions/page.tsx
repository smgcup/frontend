import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const MyPredictionsPage = () => {
  return (
    <div className="min-h-[calc(100vh-60px)]">
      {/* Header */}
      <div className="bg-linear-to-br from-orange-500 via-orange-600 to-amber-600 py-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">My Predictions</h1>
            <p className="mt-3 text-white/80">Track your prediction history and accuracy</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center py-16 bg-muted/30 rounded-xl border border-dashed max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-orange-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Login Required</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Sign in to view your prediction history and track your accuracy over time.
          </p>
          <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
            <Link href="/login">Login to Continue</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyPredictionsPage;
