'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Radio } from 'lucide-react';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';

type Team = {
  id: string;
  name: string;
};

type Match = {
  id: string;
  firstOpponent: Team;
  secondOpponent: Team;
  date: string;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'CANCELLED';
};

type AdminMatchEditViewUiProps = {
  match: Match | null;
  teams: Team[];
  matchLoading: boolean;
  matchError?: unknown;
  teamsLoading?: boolean;
  teamsError?: unknown;
  externalErrors?: Record<string, string>;
  submitError?: string | null;
  updateLoading: boolean;
  onUpdateMatch: (data: {
    firstOpponentId: string;
    secondOpponentId: string;
    date: string;
    status: string;
  }) => Promise<void>;
};

const MATCH_STATUSES = [
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'LIVE', label: 'Live' },
  { value: 'FINISHED', label: 'Finished' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

function formatMatchDateForDatetimeLocalInput(dateString: string) {
  // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
  // Be defensive: Date scalar may not always be an ISO string.
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

const AdminMatchEditForm = ({
  match,
  availableTeams,
  teamsLoading,
  teamsError,
  externalErrors,
  submitError,
  updateLoading,
  onUpdateMatch,
}: Pick<
  AdminMatchEditViewUiProps,
  'teamsLoading' | 'teamsError' | 'externalErrors' | 'submitError' | 'updateLoading' | 'onUpdateMatch'
> & { match: Match; availableTeams: Team[] }) => {
  const [formData, setFormData] = useState(() => ({
    firstOpponentId: String(match.firstOpponent.id),
    secondOpponentId: String(match.secondOpponent.id),
    date: formatMatchDateForDatetimeLocalInput(match.date),
    status: String(match.status),
  }));

  // Local (client-side) validation/touched errors. External errors come from the server via props.
  // We intentionally *do not* sync external errors into local state to avoid setState-in-effect warnings.
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const displayErrors = useMemo(() => {
    const get = (key: string) =>
      Object.prototype.hasOwnProperty.call(localErrors, key) ? localErrors[key] : externalErrors?.[key] ?? '';

    return {
      firstOpponentId: get('firstOpponentId'),
      secondOpponentId: get('secondOpponentId'),
      date: get('date'),
      status: get('status'),
    };
  }, [localErrors, externalErrors]);

  const hasOperationError = Boolean(submitError) || Boolean(teamsError);
  const teamsErrorMessage =
    typeof teamsError === 'object' && teamsError && 'message' in teamsError
      ? String((teamsError as { message?: unknown }).message ?? 'Failed to load teams.')
      : 'Failed to load teams.';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (displayErrors[name as keyof typeof displayErrors]) {
      setLocalErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (displayErrors[name as keyof typeof displayErrors]) {
      setLocalErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstOpponentId) {
      newErrors.firstOpponentId = 'First opponent is required';
    }

    if (!formData.secondOpponentId) {
      newErrors.secondOpponentId = 'Second opponent is required';
    }

    if (
      formData.firstOpponentId &&
      formData.secondOpponentId &&
      formData.firstOpponentId === formData.secondOpponentId
    ) {
      newErrors.secondOpponentId = 'Teams must be different';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onUpdateMatch(formData);
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Match Information</CardTitle>
        <CardDescription>Update the match details below</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} className="space-y-10">
        <CardContent>
          {hasOperationError && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive mb-6">
              <p className="font-medium">Operation failed</p>
              {submitError && <p className="mt-1 text-sm">{submitError}</p>}
              {Boolean(teamsError) && <p className="mt-1 text-sm">{teamsErrorMessage}</p>}
            </div>
          )}
          <FieldGroup>
            {/* First Opponent */}
            <Field>
              <FieldLabel htmlFor="firstOpponentId">First Opponent *</FieldLabel>
              <FieldContent>
                <Select
                  value={formData.firstOpponentId}
                  onValueChange={(value) => handleSelectChange('firstOpponentId', value)}
                  disabled={teamsLoading || updateLoading}
                >
                  <SelectTrigger id="firstOpponentId" className="w-full" aria-invalid={!!displayErrors.firstOpponentId}>
                    <SelectValue placeholder="Select first team" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTeams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {displayErrors.firstOpponentId && <FieldError>{displayErrors.firstOpponentId}</FieldError>}
                <FieldDescription>Select the first team</FieldDescription>
              </FieldContent>
            </Field>

            {/* Second Opponent */}
            <Field>
              <FieldLabel htmlFor="secondOpponentId">Second Opponent *</FieldLabel>
              <FieldContent>
                <Select
                  value={formData.secondOpponentId}
                  onValueChange={(value) => handleSelectChange('secondOpponentId', value)}
                  disabled={teamsLoading || updateLoading}
                >
                  <SelectTrigger
                    id="secondOpponentId"
                    className="w-full"
                    aria-invalid={!!displayErrors.secondOpponentId}
                  >
                    <SelectValue placeholder="Select second team" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTeams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {displayErrors.secondOpponentId && <FieldError>{displayErrors.secondOpponentId}</FieldError>}
                <FieldDescription>Select the second team</FieldDescription>
              </FieldContent>
            </Field>

            {/* Date */}
            <Field>
              <FieldLabel htmlFor="date">Date & Time *</FieldLabel>
              <FieldContent>
                <Input
                  id="date"
                  name="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={handleChange}
                  aria-invalid={!!displayErrors.date}
                  disabled={updateLoading}
                />
                {displayErrors.date && <FieldError>{displayErrors.date}</FieldError>}
                <FieldDescription>Select the date and time for the match</FieldDescription>
              </FieldContent>
            </Field>

            {/* Status */}
            <Field>
              <FieldLabel htmlFor="status">Status *</FieldLabel>
              <FieldContent>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                  disabled={updateLoading}
                >
                  <SelectTrigger id="status" className="w-full" aria-invalid={!!displayErrors.status}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {MATCH_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {displayErrors.status && <FieldError>{displayErrors.status}</FieldError>}
                <FieldDescription>Update the match status</FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button type="button" variant="outline" onClick={handleCancel} className="w-full sm:w-auto cursor-pointer">
            Cancel
          </Button>
          <Button type="submit" disabled={updateLoading || teamsLoading} className="w-full sm:w-auto cursor-pointer">
            {updateLoading ? 'Updating...' : 'Update Match'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

const AdminMatchEditViewUi = ({
  match,
  teams,
  matchLoading,
  matchError,
  teamsLoading,
  teamsError,
  externalErrors,
  submitError,
  updateLoading,
  onUpdateMatch,
}: AdminMatchEditViewUiProps) => {
  const availableTeams = useMemo(() => {
    const map = new Map<string, Team>();
    for (const t of teams) {
      map.set(String(t.id), { id: String(t.id), name: t.name });
    }
    // Ensure current opponents always exist as options even if teams query is missing/still loading.
    if (match) {
      map.set(String(match.firstOpponent.id), { id: String(match.firstOpponent.id), name: match.firstOpponent.name });
      map.set(String(match.secondOpponent.id), {
        id: String(match.secondOpponent.id),
        name: match.secondOpponent.name,
      });
    }
    return Array.from(map.values());
  }, [teams, match]);

  if (matchLoading) {
    return (
      <div className="py-4 lg:p-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading match...</p>
          </div>
        </div>
      </div>
    );
  }

  if (matchError) {
    return (
      <div className="py-4 lg:p-10">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          <p>Error loading match. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="py-4 lg:p-10">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          <p>Match not found. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4 lg:p-10">
      <AdminPageHeader
        title="Edit match"
        description={`${match.firstOpponent.name} vs ${match.secondOpponent.name}`}
        backHref="/admin/matches"
        actions={
          match.status === 'LIVE' ? (
            <Button asChild variant="default" className="gap-2">
              <Link href={`/admin/matches/${match.id}/live`}>
                <Radio className="h-4 w-4" />
                Manage Live Match
              </Link>
            </Button>
          ) : null
        }
      />

      <AdminMatchEditForm
        key={match.id}
        match={match}
        availableTeams={availableTeams}
        teamsLoading={teamsLoading}
        teamsError={teamsError}
        externalErrors={externalErrors}
        submitError={submitError}
        updateLoading={updateLoading}
        onUpdateMatch={onUpdateMatch}
      />
    </div>
  );
};

export default AdminMatchEditViewUi;
