import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ComingSoonProps {
  title: string;
  description?: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-wider text-primary font-semibold">Coming Soon</p>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">{title}</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          {description || "We're working hard to bring you this feature. Check back soon!"}
        </p>
        <div className="pt-4">
          <Button asChild size="lg">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
