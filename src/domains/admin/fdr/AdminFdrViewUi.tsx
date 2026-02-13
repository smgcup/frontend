'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Calendar, Loader2, Check } from 'lucide-react';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';
import { cn } from '@/lib/utils';
import type { Match } from '@/domains/matches/contracts';

type FdrValue = 1 | 2 | 3 | 4 | 5;

const FDR_COLORS: Record<FdrValue, string> = {
  1: 'bg-[#375523] text-white',
  2: 'bg-[#01fc7a] text-[#1a1a2e]',
  3: 'bg-[#e7e7e7] text-[#1a1a2e]',
  4: 'bg-[#ff1751] text-white',
  5: 'bg-[#80072d] text-white',
};

type FdrEntry = {
  team1Fdr: FdrValue | null;
  team2Fdr: FdrValue | null;
};

type AdminFdrViewUiProps = {
  matches: Match[];
  rounds: number[];
  selectedRound: number | 'all';
  onRoundChange: (round: number | 'all') => void;
  fdrState: Record<string, FdrEntry>;
  onFdrChange: (matchId: string, side: 'team1Fdr' | 'team2Fdr', value: FdrValue) => void;
  onSaveAll: () => Promise<void>;
  saving: boolean;
  error: string | null;
  success: boolean;
  hasDirtyEntries: boolean;
};

const FdrButtonGroup = ({
  selected,
  onChange,
}: {
  selected: FdrValue | null;
  onChange: (value: FdrValue) => void;
}) => (
  <div className="flex gap-1">
    {([1, 2, 3, 4, 5] as FdrValue[]).map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n)}
        className={cn(
          'h-8 w-8 rounded-md text-sm font-bold transition-all',
          selected === n ? FDR_COLORS[n] : 'bg-muted text-muted-foreground hover:bg-muted/80',
          selected === n && 'ring-2 ring-primary ring-offset-1 ring-offset-background',
        )}
      >
        {n}
      </button>
    ))}
  </div>
);

const AdminFdrViewUi = ({
  matches,
  rounds,
  selectedRound,
  onRoundChange,
  fdrState,
  onFdrChange,
  onSaveAll,
  saving,
  error,
  success,
  hasDirtyEntries,
}: AdminFdrViewUiProps) => {
  return (
    <div className="space-y-8 py-4 lg:p-10">
      <AdminPageHeader
        title="Fixture Difficulty Ratings"
        subtitle={`${matches.length} matches`}
        description="Set FDR values (1-5) for each team in every match"
      />

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Round:</span>
        <Select
          value={selectedRound === 'all' ? 'all' : String(selectedRound)}
          onValueChange={(v) => onRoundChange(v === 'all' ? 'all' : Number(v))}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Round" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All rounds</SelectItem>
            {rounds.map((r) => (
              <SelectItem key={r} value={String(r)}>
                Round {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* FDR Legend */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground">Key:</span>
        <div className="flex items-center gap-1.5">
          {([1, 2, 3, 4, 5] as FdrValue[]).map((n) => (
            <div
              key={n}
              className={cn('h-7 w-7 rounded-md flex items-center justify-center text-xs font-bold', FDR_COLORS[n])}
            >
              {n}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Easy</span>
          <span>→</span>
          <span>Hard</span>
        </div>
      </div>

      {matches.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No matches found</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              {selectedRound === 'all'
                ? 'Create matches first before setting FDR values.'
                : 'No matches in this round.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {matches.map((match) => {
            const entry = fdrState[match.id] ?? { team1Fdr: null, team2Fdr: null };

            return (
              <Card key={match.id}>
                <CardContent className="py-4">
                  {/* Round badge */}
                  <div className="mb-3">
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      Round {match.round}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr]">
                    {/* Team 1 */}
                    <div className="flex flex-col items-center gap-2 lg:items-end">
                      <span className="text-sm font-semibold">{match.firstOpponent.name}</span>
                      <FdrButtonGroup
                        selected={entry.team1Fdr}
                        onChange={(v) => onFdrChange(match.id, 'team1Fdr', v)}
                      />
                    </div>

                    {/* VS divider */}
                    <div className="hidden lg:flex items-center justify-center">
                      <span className="text-xs font-bold text-muted-foreground">vs</span>
                    </div>
                    <div className="flex lg:hidden items-center justify-center">
                      <div className="h-px w-12 bg-border" />
                    </div>

                    {/* Team 2 */}
                    <div className="flex flex-col items-center gap-2 lg:items-start">
                      <span className="text-sm font-semibold">{match.secondOpponent.name}</span>
                      <FdrButtonGroup
                        selected={entry.team2Fdr}
                        onChange={(v) => onFdrChange(match.id, 'team2Fdr', v)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={onSaveAll} disabled={saving || !hasDirtyEntries} className="gap-2">
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : success ? (
                <Check className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? 'Saving...' : success ? 'Saved!' : 'Save All'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFdrViewUi;
