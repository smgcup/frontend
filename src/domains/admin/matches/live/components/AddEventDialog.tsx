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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { MatchEventType } from '@/domains/matches/contracts';

type Player = {
  id: string;
  firstName: string;
  lastName: string;
  position?: string;
};

type Team = {
  id: string;
  name: string;
  players: Player[];
};

type AddEventDialogProps = {
  teams: Team[];
  currentMinute: number;
  onAddEvent: (data: {
    type: MatchEventType;
    minute: number;
    playerId?: string;
    teamId: string;
    payload?: unknown;
  }) => Promise<void>;
  trigger: React.ReactNode;
  mode?: 'full' | 'quick';
  presetType?: MatchEventType;
};

const EVENT_TYPES = [
  { value: MatchEventType.GOAL, label: 'Goal' },
  { value: MatchEventType.YELLOW_CARD, label: 'Yellow Card' },
  { value: MatchEventType.RED_CARD, label: 'Red Card' },
  { value: MatchEventType.GOALKEEPER_SAVE, label: 'Goalkeeper Save' },
  { value: MatchEventType.PENALTY_SCORED, label: 'Penalty Scored' },
  { value: MatchEventType.PENALTY_MISSED, label: 'Penalty Missed' },
  { value: MatchEventType.HALF_TIME, label: 'Half Time' },
  { value: MatchEventType.FULL_TIME, label: 'Full Time' },
];

const requiresTeam = (type: MatchEventType): boolean => {
  return ![MatchEventType.HALF_TIME, MatchEventType.FULL_TIME].includes(type);
};

const requiresPlayer = (type: MatchEventType): boolean => {
  return [
    MatchEventType.GOAL,
    MatchEventType.YELLOW_CARD,
    MatchEventType.RED_CARD,
    MatchEventType.GOALKEEPER_SAVE,
    MatchEventType.PENALTY_SCORED,
    MatchEventType.PENALTY_MISSED,
  ].includes(type);
};

const positionShortLabel = (position?: string) => {
  switch (position) {
    case 'GOALKEEPER':
      return 'GK';
    case 'DEFENDER':
      return 'DEF';
    case 'MIDFIELDER':
      return 'MID';
    case 'FORWARD':
      return 'FWD';
    default:
      return undefined;
  }
};

const AddEventDialog = ({ teams, currentMinute, onAddEvent, trigger, mode = 'full', presetType }: AddEventDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: presetType ?? MatchEventType.GOAL,
    minute: currentMinute.toString(),
    teamId: '',
    playerId: '',
    payload: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const isQuick = mode === 'quick';
  const selectedTeam = teams.find((t) => t.id === formData.teamId);
  const selectedEventType = (presetType ?? formData.type) as MatchEventType;
  const needsPlayer = requiresPlayer(selectedEventType);
  const needsTeam = requiresTeam(selectedEventType);

  const allPlayers = useMemo(() => {
    const rows = teams.flatMap((team) =>
      team.players.map((player) => ({
        ...player,
        teamId: team.id,
        teamName: team.name,
      })),
    );
    return rows.sort((a, b) => {
      const teamCmp = a.teamName.localeCompare(b.teamName);
      if (teamCmp !== 0) return teamCmp;
      const lnCmp = a.lastName.localeCompare(b.lastName);
      if (lnCmp !== 0) return lnCmp;
      return a.firstName.localeCompare(b.firstName);
    });
  }, [teams]);

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

    const minute = parseInt(formData.minute);
    if (!formData.minute || isNaN(minute) || minute < 0 || minute > 120) {
      newErrors.minute = 'Minute must be between 0 and 120';
    }

    if (formData.payload) {
      try {
        const parsed = JSON.parse(formData.payload);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          newErrors.payload = 'Payload must be a JSON object';
        }
      } catch {
        newErrors.payload = 'Payload must be valid JSON';
      }
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
      const payload =
        formData.payload.trim().length > 0 ? (JSON.parse(formData.payload) as unknown) : undefined;
      const fallbackTeamId = teams[0]?.id ?? '';
      await onAddEvent({
        type: selectedEventType,
        minute: parseInt(formData.minute),
        teamId: needsTeam ? formData.teamId : fallbackTeamId,
        playerId: needsPlayer ? formData.playerId : undefined,
        payload,
      });
      setOpen(false);
      // Reset form
      setFormData({
        type: presetType ?? MatchEventType.GOAL,
        minute: currentMinute.toString(),
        teamId: '',
        playerId: '',
        payload: '',
      });
      setErrors({});
    } catch (error) {
      // Error handling
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
                      {allPlayers.map((player) => {
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
                      {selectedTeam.players.map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          <span className="flex w-full items-center justify-between gap-3">
                            <span className="truncate">
                              {player.firstName} {player.lastName}
                            </span>
                            <span className="shrink-0 text-muted-foreground">{positionShortLabel(player.position) ?? ''}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.playerId && <FieldError>{errors.playerId}</FieldError>}
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

            {/* Payload (optional) */}
            {!isQuick && (
              <Field>
                <FieldLabel htmlFor="payload">Payload (JSON)</FieldLabel>
                <FieldContent>
                  <Input
                    id="payload"
                    name="payload"
                    type="text"
                    placeholder='{"key":"value"}'
                    value={formData.payload}
                    onChange={handleChange}
                    aria-invalid={!!errors.payload}
                  />
                  {errors.payload && <FieldError>{errors.payload}</FieldError>}
                  <FieldDescription>Optional JSON object (leave empty if not needed)</FieldDescription>
                </FieldContent>
              </Field>
            )}
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

