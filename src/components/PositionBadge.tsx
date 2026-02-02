import { Trophy, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

type PositionBadgeProps = {
  position: number;
  className?: string;
  color?: 'default' | 'green' | 'red';
  showIcon?: boolean;
};

const PositionBadge = ({ position, className, color = 'default', showIcon = false }: PositionBadgeProps) => {
  // Convert 1-based position to 0-based index for styling logic
  const index = position - 1;

  // Show icons for top 3 positions when showIcon is true
  if (showIcon && position <= 3) {
    if (position === 1) {
      return (
        <div
          className={cn(
            'mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900',
            className,
          )}
        >
          <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        </div>
      );
    }
    if (position === 2) {
      return (
        <div
          className={cn(
            'mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700',
            className,
          )}
        >
          <Medal className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </div>
      );
    }
    if (position === 3) {
      return (
        <div
          className={cn(
            'mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900',
            className,
          )}
        >
          <Award className="h-5 w-5 text-orange-600 dark:text-orange-400" />
        </div>
      );
    }
  }

  // If custom color is provided, use it instead of default styling
  if (color === 'green') {
    return (
      <div
        className={cn(
          'mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          className,
        )}
      >
        {position}
      </div>
    );
  }

  if (color === 'red') {
    return (
      <div
        className={cn(
          'mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          className,
        )}
      >
        {position}
      </div>
    );
  }

  // Default styling
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
