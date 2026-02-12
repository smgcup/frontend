'use client';

import { CheckCheck, Check, X, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { predictorTheme } from '@/lib/gamemodeThemes';

type ScoreRulesDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const RULES = [
  {
    icon: CheckCheck,
    label: 'Exact match',
    description: 'You predict the exact final score for both teams.',
    points: 10,
    iconClassName: 'bg-green-500/10 text-green-600 dark:text-green-400',
  },
  {
    icon: Check,
    label: 'Correct outcome',
    description: 'You get the winner or draw right, but not the exact score.',
    points: 5,
    iconClassName: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    icon: X,
    label: 'Incorrect',
    description: 'Wrong winner or wrong draw.',
    points: 0,
    iconClassName: 'bg-red-500/10 text-red-600 dark:text-red-400',
  },
  {
    icon: Sparkles,
    label: 'Underdog bonus',
    description: 'Correctly predict a scoreline that less than 10% of players predicted.',
    points: 3,
    iconClassName: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
] as const;

const ScoreRulesDialog = ({ open, onOpenChange }: ScoreRulesDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'flex flex-col p-0 gap-0 w-[calc(100%-2rem)] max-h-[85dvh] sm:max-w-md sm:max-h-[90vh]',
          'overflow-hidden',
        )}
      >
        <DialogHeader className="shrink-0 px-4 pt-4 pb-2 pr-10 sm:px-6 sm:pt-6 sm:pb-3 sm:pr-12">
          <DialogTitle className="text-lg font-semibold sm:text-xl pr-2">Scoring Rules</DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6">
          <p className="text-sm text-muted-foreground mb-4 sm:mb-5">
            Predict the exact final score for each match. Points are awarded based on accuracy:
          </p>
          <ul className="space-y-4 sm:space-y-5">
            {RULES.map(({ icon: Icon, label, description, points, iconClassName }) => (
              <li key={label} className="flex gap-3 sm:gap-4">
                <span
                  className={cn(
                    'shrink-0 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl',
                    iconClassName,
                  )}
                  aria-hidden
                >
                  <Icon className="h-5 w-5 sm:h-5 sm:w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-semibold text-foreground">{label}</span>
                    <span className={cn('text-sm font-bold', predictorTheme.pointsText)}>{points} pts</span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter className="shrink-0 flex-row justify-end gap-2 border-t bg-muted/30 mx-0 mb-0 px-4 py-3 sm:px-6 sm:py-4 rounded-b-xl">
          <DialogClose asChild>
            <Button variant="default" size="default" className="w-full min-h-11 sm:w-auto sm:min-h-0">
              Got it
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScoreRulesDialog;
