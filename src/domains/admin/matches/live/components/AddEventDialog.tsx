'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { MatchEventType, PlayerPosition } from '@/generated/types';
import { type Team } from '@/domains/team/contracts';
import { type CreateMatchEventDto } from '@/generated/types';
import { type MatchEvent } from '@/domains/matches/contracts';

type AddEventDialogProps = {
  matchId: string;
  teams: Team[];
  currentMinute: number;
  events: MatchEvent[];
  onAddEvent: (dto: CreateMatchEventDto) => Promise<void>;
  trigger: React.ReactNode;
  mode?: 'full' | 'quick';
  presetType?: MatchEventType;
};

const EVENT_TYPES = [
  { value: MatchEventType.Goal, label: 'Goal' },
  { value: MatchEventType.YellowCard, label: 'Yellow Card' },
  { value: MatchEventType.RedCard, label: 'Red Card' },
  { value: MatchEventType.GoalkeeperSave, label: 'Goalkeeper Save' },
  { value: MatchEventType.PenaltyScored, label: 'Penalty Scored' },
  { value: MatchEventType.PenaltyMissed, label: 'Penalty Missed' },
  { value: MatchEventType.HalfTime, label: 'Half Time' },
  { value: MatchEventType.FullTime, label: 'Full Time' },
];

const requiresTeam = (type: MatchEventType): boolean => {
  return ![MatchEventType.HalfTime, MatchEventType.FullTime].includes(type);
};

const requiresPlayer = (type: MatchEventType): boolean => {
  return [
    MatchEventType.Goal,
    MatchEventType.GoalkeeperSave,
    MatchEventType.YellowCard,
    MatchEventType.RedCard,
    MatchEventType.PenaltyScored,
    MatchEventType.PenaltyMissed,
  ].includes(type);
};
const requiresAssistPlayer = (type: MatchEventType): boolean => {
  return [MatchEventType.Goal].includes(type);
};

const positionShortLabel = (position: PlayerPosition) => {
  switch (position) {
    case PlayerPosition.Goalkeeper:
      return 'GK';
    case PlayerPosition.Defender:
      return 'DEF';
    case PlayerPosition.Midfielder:
      return 'MID';
    case PlayerPosition.Forward:
      return 'FWD';
    default:
      return 'Unknown';
  }
};

const AddEventDialog = ({
  matchId,
  teams,
  currentMinute,
  events,
  onAddEvent,
  trigger,
  mode = 'full',
  presetType,
}: AddEventDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    minute: currentMinute.toString(),
    teamId: '',
    playerId: '',
    assistPlayerId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const isQuick = mode === 'quick';
  const selectedTeam = teams.find((t) => t.id === formData.teamId);
  const selectedEventType = (presetType ?? formData.type) as MatchEventType;
  const needsPlayer = requiresPlayer(selectedEventType);
  const needsAssistPlayer = requiresAssistPlayer(selectedEventType);
  const needsTeam = requiresTeam(selectedEventType);

  // Get set of player IDs who have received a red card
  const playersWithRedCard = useMemo(() => {
    return new Set(
      events
        .filter((event) => event.type === MatchEventType.RedCard && event.player?.id)
        .map((event) => event.player!.id),
    );
  }, [events]);

  const allPlayers = useMemo(() => {
    const rows = teams.flatMap(
      (team) =>
        team?.players?.map((player) => ({
          ...player,
          teamId: team.id,
          teamName: team.name,
        })) ?? [],
    );
    return rows
      .filter((player) => !playersWithRedCard.has(player.id))
      .sort((a, b) => {
        const teamCmp = a.teamName.localeCompare(b.teamName);
        if (teamCmp !== 0) return teamCmp;
        const fnCmp = a.firstName.localeCompare(b.firstName);
        if (fnCmp !== 0) return fnCmp;
        return a.lastName.localeCompare(b.lastName);
      });
  }, [teams, playersWithRedCard]);

  const availableTeamPlayers = useMemo(() => {
    if (!selectedTeam?.players) return [];
    return selectedTeam.players.filter((player) => !playersWithRedCard.has(player.id));
  }, [selectedTeam, playersWithRedCard]);

  useEffect(() => {
    if (!open) return;
    setFormData((prev) => ({
      ...prev,
      minute: currentMinute.toString(),
      type: presetType ?? prev.type,
    }));
  }, [open, currentMinute, presetType]);

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      // Reset player when team changes
      if (name === 'teamId') {
        newData.playerId = '';
      }
      // Clear team+player if event does not require a team
      if (name === 'type') {
        const newType = value as MatchEventType;
        if (!requiresTeam(newType)) {
          newData.teamId = '';
          newData.playerId = '';
        }
      }
      // Infer team in quick mode
      if (name === 'playerId' && isQuick) {
        const selected = allPlayers.find((p) => p.id === value);
        newData.teamId = selected?.teamId ?? '';
      }
      // Clear assist player if it's the same as the goal scorer
      if (name === 'playerId' && needsAssistPlayer && newData.assistPlayerId === value) {
        newData.assistPlayerId = '';
      }
      // Clear goal scorer if it's the same as the assist player
      if (name === 'assistPlayerId' && newData.playerId === value) {
        newData.playerId = '';
      }
      return newData;
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.type) {
      newErrors.type = 'Event type is required';
    }

    if (needsTeam && !formData.teamId) {
      newErrors.teamId = 'Team is required';
    }

    if (needsPlayer && !formData.playerId) {
      newErrors.playerId = 'Player is required for this event type';
    }

    if (isQuick && needsPlayer && formData.playerId && !formData.teamId) {
      newErrors.playerId = 'Selected player must belong to a team';
    }

    // Prevent same player from being selected for both goal and assist
    if (
      needsAssistPlayer &&
      formData.playerId &&
      formData.assistPlayerId &&
      formData.playerId === formData.assistPlayerId
    ) {
      newErrors.assistPlayerId = 'Assist player cannot be the same as the goal scorer';
    }

    const minute = parseInt(formData.minute);
    if (!formData.minute || isNaN(minute) || minute < 0) {
      newErrors.minute = 'Minute must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const fallbackTeamId = teams[0]?.id ?? '';
      await onAddEvent({
        matchId,
        type: selectedEventType,
        minute: parseInt(formData.minute),
        teamId: needsTeam ? formData.teamId : fallbackTeamId,
        playerId: needsPlayer ? formData.playerId : undefined,
        assistPlayerId: needsAssistPlayer && formData.assistPlayerId ? formData.assistPlayerId : undefined,
      });
      setOpen(false);
      // Reset form
      setFormData({
        type: '',
        minute: currentMinute.toString(),
        teamId: '',
        playerId: '',
        assistPlayerId: '',
      });
      setErrors({});
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Add Match Event</AlertDialogTitle>
          <AlertDialogDescription>Record an event that occurred during the match</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <FieldGroup>
            {/* Event Type */}
            {!isQuick && (
              <Field>
                <FieldLabel htmlFor="type">Event Type *</FieldLabel>
                <FieldContent>
                  <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                    <SelectTrigger id="type" className="w-full" aria-invalid={!!errors.type}>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map((event) => (
                        <SelectItem key={event.value} value={event.value}>
                          {event.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <FieldError>{errors.type}</FieldError>}
                </FieldContent>
              </Field>
            )}

            {/* Team */}
            {!isQuick && needsTeam && (
              <Field>
                <FieldLabel htmlFor="teamId">Team *</FieldLabel>
                <FieldContent>
                  <Select value={formData.teamId} onValueChange={(value) => handleSelectChange('teamId', value)}>
                    <SelectTrigger id="teamId" className="w-full" aria-invalid={!!errors.teamId}>
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.teamId && <FieldError>{errors.teamId}</FieldError>}
                </FieldContent>
              </Field>
            )}

            {/* Player (conditional) */}
            {needsPlayer && isQuick && (
              <Field>
                <FieldLabel htmlFor="playerId">Player *</FieldLabel>
                <FieldContent>
                  <Select value={formData.playerId} onValueChange={(value) => handleSelectChange('playerId', value)}>
                    <SelectTrigger id="playerId" className="w-full" aria-invalid={!!errors.playerId}>
                      <SelectValue placeholder="Select player" />
                    </SelectTrigger>
                    <SelectContent>
                      {allPlayers
                        .filter((player) => !needsAssistPlayer || player.id !== formData.assistPlayerId)
                        .map((player) => {
                          const pos = positionShortLabel(player.position);
                          return (
                            <SelectItem key={player.id} value={player.id}>
                              <span className="flex w-full items-center justify-between gap-3">
                                <span className="truncate">
                                  {player.firstName} {player.lastName}
                                </span>
                                <span className="shrink-0 text-muted-foreground">
                                  {pos ? `${pos} · ${player.teamName}` : player.teamName}
                                </span>
                              </span>
                            </SelectItem>
                          );
                        })}
                    </SelectContent>
                  </Select>
                  {errors.playerId && <FieldError>{errors.playerId}</FieldError>}
                </FieldContent>
              </Field>
            )}
            {needsPlayer && !isQuick && selectedTeam && (
              <Field>
                <FieldLabel htmlFor="playerId">Player *</FieldLabel>
                <FieldContent>
                  <Select value={formData.playerId} onValueChange={(value) => handleSelectChange('playerId', value)}>
                    <SelectTrigger id="playerId" className="w-full" aria-invalid={!!errors.playerId}>
                      <SelectValue placeholder="Select player" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTeamPlayers
                        .filter((player) => !needsAssistPlayer || player.id !== formData.assistPlayerId)
                        .map((player) => (
                          <SelectItem key={player.id} value={player.id}>
                            <span className="flex w-full items-center justify-between gap-3">
                              <span className="truncate">
                                {player.firstName} {player.lastName}
                              </span>
                              <span className="shrink-0 text-muted-foreground">
                                {positionShortLabel(player.position)}
                              </span>
                            </span>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.playerId && <FieldError>{errors.playerId}</FieldError>}
                </FieldContent>
              </Field>
            )}

            {needsAssistPlayer && (
              <Field>
                <FieldLabel htmlFor="assistPlayerId">Assist Player</FieldLabel>
                <FieldContent>
                  <Select
                    value={formData.assistPlayerId}
                    onValueChange={(value) => handleSelectChange('assistPlayerId', value)}
                  >
                    <SelectTrigger id="assistPlayerId" className="w-full" aria-invalid={!!errors.assistPlayerId}>
                      <SelectValue placeholder="Select assist player (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {allPlayers
                        .filter((player) => player.id !== formData.playerId)
                        .map((player) => (
                          <SelectItem key={player.id} value={player.id}>
                            <span className="flex w-full items-center justify-between gap-3">
                              <span className="truncate">
                                {player.firstName} {player.lastName}
                              </span>
                              <span className="shrink-0 text-muted-foreground">
                                {positionShortLabel(player.position)}
                              </span>
                            </span>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.assistPlayerId && <FieldError>{errors.assistPlayerId}</FieldError>}
                </FieldContent>
              </Field>
            )}

            {/* Minute */}
            <Field>
              <FieldLabel htmlFor="minute">Minute *</FieldLabel>
              <FieldContent>
                <Input
                  id="minute"
                  name="minute"
                  type="number"
                  min="0"
                  max="120"
                  value={formData.minute}
                  onChange={handleChange}
                  aria-invalid={!!errors.minute}
                />
                {errors.minute && <FieldError>{errors.minute}</FieldError>}
                <FieldDescription>Enter the minute when the event occurred</FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={loading}>
            {loading ? 'Adding...' : 'Add Event'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddEventDialog;
