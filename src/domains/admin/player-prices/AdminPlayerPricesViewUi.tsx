'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchInput } from '@/domains/admin/components/search-input';
import { Check, Loader2, Save, User } from 'lucide-react';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';
import type { PlayerPriceEntry, SortField } from './contracts';

type PlayerFormState = {
  displayName: string;
  price: string;
  hasFantasyData: boolean;
};

type AdminPlayerPricesViewUiProps = {
  players: PlayerPriceEntry[];
  formState: Record<string, PlayerFormState>;
  savingPlayerId: string | null;
  errors: Record<string, string>;
  successes: Record<string, boolean>;
  isDirty: (playerId: string) => boolean;
  sortField: SortField;
  searchQuery: string;
  onSortFieldChange: (field: SortField) => void;
  onSearchChange: (query: string) => void;
  onUpdateField: (playerId: string, field: 'displayName' | 'price', value: string) => void;
  onSave: (playerId: string) => Promise<void>;
};

const AdminPlayerPricesViewUi = ({
  players,
  formState,
  savingPlayerId,
  errors,
  successes,
  isDirty,
  sortField,
  searchQuery,
  onSortFieldChange,
  onSearchChange,
  onUpdateField,
  onSave,
}: AdminPlayerPricesViewUiProps) => {
  return (
    <div className="space-y-8 py-4 lg:p-10">
      <AdminPageHeader
        title="Player Prices"
        subtitle={`${players.length} players`}
        description="Set display names and prices for fantasy players"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortField} onValueChange={(v) => onSortFieldChange(v as SortField)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Player Name</SelectItem>
              <SelectItem value="team">Team</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <SearchInput
          placeholder="Search by name or team..."
          value={searchQuery}
          onChange={onSearchChange}
          className="w-full sm:w-[240px]"
        />
      </div>

      {players.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No players found</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              Create teams and players first before setting fantasy prices.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {players.map((player) => {
            const form = formState[player.playerId];
            const isSaving = savingPlayerId === player.playerId;
            const error = errors[player.playerId];
            const isSuccess = successes[player.playerId];

            return (
              <Card
                key={player.playerId}
                className={`group overflow-hidden transition-all hover:shadow-lg hover:border-primary/20 ${
                  isSuccess ? 'border-green-500/50 bg-green-500/5' : ''
                } ${form?.hasFantasyData ? '' : 'border-dashed'}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="text-base truncate">
                        {player.firstName} {player.lastName}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{player.position ?? 'N/A'}</p>
                      <p className="text-xs text-muted-foreground">
                        Team: <span className="text-foreground">{player.teamName}</span>
                      </p>
                    </div>
                    {form?.hasFantasyData && (
                      <span className="shrink-0 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium" htmlFor={`displayName-${player.playerId}`}>
                      Display Name
                    </label>
                    <Input
                      id={`displayName-${player.playerId}`}
                      placeholder="e.g. J. Smith"
                      value={form?.displayName ?? ''}
                      onChange={(e) => onUpdateField(player.playerId, 'displayName', e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium" htmlFor={`price-${player.playerId}`}>
                      Price *
                    </label>
                    <Input
                      id={`price-${player.playerId}`}
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="e.g. 5.5"
                      value={form?.price ?? ''}
                      onChange={(e) => onUpdateField(player.playerId, 'price', e.target.value)}
                      disabled={isSaving}
                    />
                  </div>

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <Button
                    size="sm"
                    className="w-full"
                    disabled={isSaving || !form?.price?.trim() || !isDirty(player.playerId)}
                    onClick={() => onSave(player.playerId)}
                  >
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : isSuccess ? (
                      <Check className="mr-2 h-4 w-4" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    {isSaving ? 'Saving...' : isSuccess ? 'Saved!' : form?.hasFantasyData ? 'Update' : 'Create'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminPlayerPricesViewUi;
