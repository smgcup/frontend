import { cn } from '@/lib/utils';

type PositionBadgeProps = {
  position: number;
  className?: string;
};

const PositionBadge = ({ position, className }: PositionBadgeProps) => {
  // Convert 1-based position to 0-based index for styling logic
  const index = position - 1;

  return (
    <div
      className={cn(
        'mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
        index === 0 && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        index === 1 && 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
        index === 2 && 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        index >= 3 && 'bg-muted text-muted-foreground',
        className,
      )}
    >
      {position}
    </div>
  );
};

export default PositionBadge;
