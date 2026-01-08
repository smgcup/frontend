'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';
import { MatchStatus } from '@/graphql';
import { Team } from '@/domains/team/contracts';

type AdminMatchCreateViewUiProps = {
  teams: Team[];
  teamsLoading?: boolean;
  teamsError?: unknown;
  externalErrors?: Record<string, string>;
  submitError?: string | null;
  onCreateMatch: (data: {
    firstOpponentId: string;
    secondOpponentId: string;
    date: string;
    status: MatchStatus;
  }) => Promise<void>;
  createLoading: boolean;
};

const AdminMatchCreateViewUi = ({
  teams,
  teamsLoading,
  teamsError,
  externalErrors,
  submitError,
  onCreateMatch,
  createLoading,
}: AdminMatchCreateViewUiProps) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstOpponentId: '',
    secondOpponentId: '',
    date: '',
    status: MatchStatus.Scheduled,
  });

  // Local (client-side) validation errors. External errors come from the server via props.
  // We intentionally *do not* sync external errors into local state to avoid setState-in-effect warnings.
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  // Merge local and external errors - local errors take precedence
  const getError = (field: string): string => {
    return Object.prototype.hasOwnProperty.call(localErrors, field)
      ? localErrors[field]
      : externalErrors?.[field] ?? '';
  };

  const errors = {
    firstOpponentId: getError('firstOpponentId'),
    secondOpponentId: getError('secondOpponentId'),
    date: getError('date'),
    status: getError('status'),
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setLocalErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
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

    // Status has a default value, but validate it's a valid enum value
    if (!formData.status || !Object.values(MatchStatus).includes(formData.status as MatchStatus)) {
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

    await onCreateMatch(formData);
  };

  const handleCancel = () => {
    router.push('/admin/matches');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4 lg:p-10">
      <AdminPageHeader title="Create match" description="Schedule a new match" backHref="/admin/matches" />

      <Card>
        <CardHeader>
          <CardTitle>Match Information</CardTitle>
          <CardDescription>Fill in the details below to create a new match</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-10">
          <CardContent>
            {(Boolean(submitError) || Boolean(teamsError)) && (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive mb-6">
                <p className="font-medium">Operation failed</p>
                {submitError && <p className="mt-1 text-sm">{submitError}</p>}
                {Boolean(teamsError) && (
                  <p className="mt-1 text-sm">
                    {typeof teamsError === 'object' && teamsError && 'message' in teamsError
                      ? String((teamsError as { message?: unknown }).message ?? 'Failed to load teams.')
                      : 'Failed to load teams.'}
                  </p>
                )}
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
                    disabled={teamsLoading || createLoading || teams.length === 0}
                  >
                    <SelectTrigger id="firstOpponentId" className="w-full" aria-invalid={!!errors.firstOpponentId}>
                      <SelectValue placeholder={teams.length === 0 ? 'No teams available' : 'Select first team'} />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.length === 0 ? (
                        <SelectItem value="" disabled>
                          No teams available
                        </SelectItem>
                      ) : (
                        teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.firstOpponentId && <FieldError>{errors.firstOpponentId}</FieldError>}
                  {teams.length === 0 && !errors.firstOpponentId && (
                    <FieldDescription className="text-destructive">
                      No teams available. Please create teams before creating a match.
                    </FieldDescription>
                  )}
                  {teams.length > 0 && <FieldDescription>Select the first team</FieldDescription>}
                </FieldContent>
              </Field>

              {/* Second Opponent */}
              <Field>
                <FieldLabel htmlFor="secondOpponentId">Second Opponent *</FieldLabel>
                <FieldContent>
                  <Select
                    value={formData.secondOpponentId}
                    onValueChange={(value) => handleSelectChange('secondOpponentId', value)}
                    disabled={teamsLoading || createLoading || teams.length === 0}
                  >
                    <SelectTrigger id="secondOpponentId" className="w-full" aria-invalid={!!errors.secondOpponentId}>
                      <SelectValue placeholder={teams.length === 0 ? 'No teams available' : 'Select second team'} />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.length === 0 ? (
                        <SelectItem value="" disabled>
                          No teams available
                        </SelectItem>
                      ) : (
                        teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.secondOpponentId && <FieldError>{errors.secondOpponentId}</FieldError>}
                  {teams.length === 0 && !errors.secondOpponentId && (
                    <FieldDescription className="text-destructive">
                      No teams available. Please create teams before creating a match.
                    </FieldDescription>
                  )}
                  {teams.length > 0 && <FieldDescription>Select the second team</FieldDescription>}
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
                    aria-invalid={!!errors.date}
                    disabled={createLoading}
                  />
                  {errors.date && <FieldError>{errors.date}</FieldError>}
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
                    disabled={createLoading}
                  >
                    <SelectTrigger id="status" className="w-full" aria-invalid={!!errors.status}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(MatchStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.status && <FieldError>{errors.status}</FieldError>}
                  <FieldDescription>Set the initial match status</FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button type="button" variant="outline" onClick={handleCancel} className="w-full sm:w-auto cursor-pointer">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createLoading || teamsLoading || teams.length === 0}
              className="w-full sm:w-auto cursor-pointer"
            >
              {createLoading ? 'Creating...' : 'Create Match'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminMatchCreateViewUi;
