import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type AdminPageHeaderProps = {
  title: string;
  subtitle?: string;
  description?: string;
  backHref?: string;
  actions?: React.ReactNode;
};

export default function AdminPageHeader({ title, subtitle, description, backHref, actions }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3 min-w-0">
        {backHref && (
          <Button asChild variant="outline" size="icon" className="shrink-0">
            <Link href={backHref} aria-label="Back">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {description && <p className="mt-2 text-muted-foreground">{description}</p>}
        </div>
      </div>

      {actions && <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">{actions}</div>}
    </div>
  );
}


