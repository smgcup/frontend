'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, Trophy, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';
import type { Match } from '@/domains/matches/contracts';
import type { Player } from '@/domains/player/contracts';
import type { AppearanceLevel } from './contracts';
import { PlayerPosition } from '@/graphql';

const POSITION_ORDER: Record<PlayerPosition, number> = {
  [PlayerPosition.Goalkeeper]: 0,
  [PlayerPosition.Defender]: 1,
  [PlayerPosition.Midfielder]: 2,
  [PlayerPosition.Forward]: 3,
};

const sortPlayersByPosition = (players: Player[]): Player[] => {
  return [...players].sort((a, b) => {
    if (!a.position || !b.position) return 0;
    const orderA = POSITION_ORDER[a.position] ?? 99;
    const orderB = POSITION_ORDER[b.position] ?? 99;
    return orderA - orderB;
  });
};

type AdminMatchAppearancesViewUiProps = {
  match: Match;
  appearances: Map<string, AppearanceLevel>;
  mvpId: string | null;
  appearedPlayers: Player[];
  isSaving: boolean;
  onAppearanceChange: (playerId: string, level: AppearanceLevel) => void;
  onMvpChange: (playerId: string | null) => void;
  onSave: () => Promise<void>;
};

type PlayerAppearanceRowProps = {
  player: Player;
  level: AppearanceLevel;
  onLevelChange: (level: AppearanceLevel) => void;
};

const PlayerAppearanceRow = ({ player, level, onLevelChange }: PlayerAppearanceRowProps) => {
  return (
    <div className="flex flex-col gap-3 p-3 rounded-lg border bg-card/50">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="font-medium truncate">
          {player.firstName} {player.lastName}
        </span>
        <span className="text-xs text-muted-foreground ml-auto shrink-0">{player.position}</span>
      </div>
      <div className="flex gap-2">
        <Button
          variant={level === 'none' ? 'default' : 'outline'}
          size="sm"
          className="flex-1 text-xs h-9"
          onClick={() => onLevelChange('none')}
        >
          None
        </Button>
        <Button
          variant={level === 'half' ? 'default' : 'outline'}
          size="sm"
          className={cn('flex-1 text-xs h-9', level === 'half' && 'bg-amber-500 hover:bg-amber-600')}
          onClick={() => onLevelChange('half')}
        >
          <Clock className="h-3 w-3 mr-1" />
          Half
        </Button>
        <Button
          variant={level === 'full' ? 'default' : 'outline'}
          size="sm"
          className={cn('flex-1 text-xs h-9', level === 'full' && 'bg-green-500 hover:bg-green-600')}
          onClick={() => onLevelChange('full')}
        >
          <Clock className="h-3 w-3 mr-1" />
          Full
        </Button>
      </div>
    </div>
  );
};

type TeamPlayersCardProps = {
  teamName: string;
  players: Player[];
  appearances: Map<string, AppearanceLevel>;
  onAppearanceChange: (playerId: string, level: AppearanceLevel) => void;
};

const TeamPlayersCard = ({ teamName, players, appearances, onAppearanceChange }: TeamPlayersCardProps) => {
  const appearedCount = players.filter((p) => {
    const level = appearances.get(p.id);
    return level === 'half' || level === 'full';
  }).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{teamName}</CardTitle>
          <span className="text-sm text-muted-foreground">
            {appearedCount}/{players.length} appeared
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {players.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No players in this team</p>
        ) : (
          players.map((player) => (
            <PlayerAppearanceRow
              key={player.id}
              player={player}
              level={appearances.get(player.id) ?? 'none'}
              onLevelChange={(level) => onAppearanceChange(player.id, level)}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

const AdminMatchAppearancesViewUi = ({
  match,
  appearances,
  mvpId,
  appearedPlayers,
  isSaving,
  onAppearanceChange,
  onMvpChange,
  onSave,
}: AdminMatchAppearancesViewUiProps) => {
  const firstTeamPlayers = sortPlayersByPosition(match.firstOpponent.players ?? []);
  const secondTeamPlayers = sortPlayersByPosition(match.secondOpponent.players ?? []);

  return (
    <div className="space-y-6 py-4 lg:p-10">
      <AdminPageHeader
        title="Match Appearances"
        description={`${match.firstOpponent.name} vs ${match.secondOpponent.name}`}
        backHref="/admin/matches"
      />

      {/* Match Score Summary */}
      <Card className="border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-center justify-center gap-4 text-center">
            <div className="flex-1">
              <p className="font-semibold text-xl">{match.firstOpponent.name}</p>
              <p className="text-3xl font-bold text-primary">{match.score1 ?? 0}</p>
            </div>
            <span className="text-2xl font-bold text-muted-foreground">—</span>
            <div className="flex-1">
              <p className="font-semibold text-xl">{match.secondOpponent.name}</p>
              <p className="text-3xl font-bold text-primary">{match.score2 ?? 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-amber-500" />
          <span>Half Game (&lt;35 min)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-green-500" />
          <span>Full Game (35+ min)</span>
        </div>
      </div>

      {/* Player Appearances - Stacked on mobile, side-by-side on desktop */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TeamPlayersCard
          teamName={match.firstOpponent.name}
          players={firstTeamPlayers}
          appearances={appearances}
          onAppearanceChange={onAppearanceChange}
        />
        <TeamPlayersCard
          teamName={match.secondOpponent.name}
          players={secondTeamPlayers}
          appearances={appearances}
          onAppearanceChange={onAppearanceChange}
        />
      </div>

      {/* MVP Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Match MVP
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appearedPlayers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Select player appearances above to enable MVP selection
            </p>
          ) : (
            <Select value={mvpId ?? ''} onValueChange={(value) => onMvpChange(value || null)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select MVP" />
              </SelectTrigger>
              <SelectContent>
                {appearedPlayers.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.firstName} {player.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="sticky bottom-4 flex justify-end">
        <Button onClick={onSave} disabled={isSaving} size="lg" className="shadow-lg">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Appearances
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdminMatchAppearancesViewUi;
