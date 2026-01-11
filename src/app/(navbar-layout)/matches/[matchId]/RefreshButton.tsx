'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const RefreshButton = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isPending}
      aria-busy={isPending}
      onClick={() => startTransition(() => router.refresh())}
    >
      <RotateCw className={cn('h-4 w-4 mr-2', isPending && 'animate-spin')} />
      {isPending ? 'Refreshing…' : 'Refresh'}
    </Button>
  );
};

export default RefreshButton;


