'use client';

import { useState } from 'react';
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
import { MatchEventType } from './EventTimeline';

type Player = {
  id: string;
  firstName: string;
  lastName: string;
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
  }) => Promise<void>;
  trigger: React.ReactNode;
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

const AddEventDialog = ({ teams, currentMinute, onAddEvent, trigger }: AddEventDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: MatchEventType.GOAL,
    minute: currentMinute.toString(),
    teamId: '',
    playerId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const selectedTeam = teams.find((t) => t.id === formData.teamId);
  const selectedEventType = formData.type as MatchEventType;
  const needsPlayer = requiresPlayer(selectedEventType);

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      // Reset player when team changes
      if (name === 'teamId') {
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

    if (!formData.teamId) {
      newErrors.teamId = 'Team is required';
    }

    if (needsPlayer && !formData.playerId) {
      newErrors.playerId = 'Player is required for this event type';
    }

    const minute = parseInt(formData.minute);
    if (!formData.minute || isNaN(minute) || minute < 0 || minute > 120) {
      newErrors.minute = 'Minute must be between 0 and 120';
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
      await onAddEvent({
        type: selectedEventType,
        minute: parseInt(formData.minute),
        teamId: formData.teamId,
        playerId: needsPlayer ? formData.playerId : undefined,
      });
      setOpen(false);
      // Reset form
      setFormData({
        type: MatchEventType.GOAL,
        minute: currentMinute.toString(),
        teamId: '',
        playerId: '',
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

            {/* Team */}
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

            {/* Player (conditional) */}
            {needsPlayer && selectedTeam && (
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
                          {player.firstName} {player.lastName}
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

