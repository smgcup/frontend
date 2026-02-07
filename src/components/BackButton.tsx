'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors cursor-pointer"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>Go back</span>
    </button>
  );
}
