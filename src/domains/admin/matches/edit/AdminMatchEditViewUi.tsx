'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Radio } from 'lucide-react';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';
import { MatchStatus } from '@/graphql';
import { type AdminMatchEditFormData } from './hooks/useAdminMatchEdit';
import { Match } from '@/domains/matches/contracts';

/**
 * Props for the AdminMatchEditViewUi component.
 *
 * This component receives all necessary data and handlers from the parent,
 * following a separation of concerns where the hook handles logic and this component handles UI.
 */
type AdminMatchEditViewUiProps = {
  match: Match | null; // The match data to edit (null while loading or if not found)
  matchLoading: boolean; // Whether the match is currently being fetched
  matchError?: unknown; // Any error that occurred while fetching the match
  externalErrors?: Record<string, string>; // Server-side validation errors keyed by field name
  submitError?: string | null; // General error message for the entire form submission
  onUpdateMatch: (data: AdminMatchEditFormData) => Promise<void>; // Handler to submit the form
  updateLoading: boolean; // Whether the update mutation is currently in progress
};

function formatMatchDateForDatetimeLocalInput(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  // Adjust for timezone offset to show local time correctly in the input
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

/**
 * UI component for editing a match in the admin panel.
 *
 * This component provides a form interface for updating match details including:
 * - Match date and time
 * - Match status
 *
 * It handles client-side validation, displays server-side errors, and manages
 * form state synchronization with the fetched match data.
 */
const AdminMatchEditViewUi = ({
  match,
  matchLoading,
  matchError,
  externalErrors,
  submitError,
  onUpdateMatch,
  updateLoading,
}: AdminMatchEditViewUiProps) => {
  const router = useRouter();

  /**
   * Initializes form data from the match object.
   *
   * If match is not yet loaded, returns empty default values.
   * Otherwise, populates the form with the current match's data.
   */
  const initialFormData = useMemo<AdminMatchEditFormData>(() => {
    if (!match) {
      return {
        date: '',
        status: MatchStatus.Scheduled,
        round: 1,
      };
    }
    return {
      date: formatMatchDateForDatetimeLocalInput(match.date),
      status: match.status,
      round: match.round,
    };
  }, [match]);

  const [formData, setFormData] = useState<AdminMatchEditFormData>(initialFormData);

  // Syncs form data when match loads or changes.
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  // Local (client-side) validation errors.
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  // Merges local and external errors, with local errors taking precedence.
  const getError = (field: string): string => {
    return Object.prototype.hasOwnProperty.call(localErrors, field)
      ? localErrors[field]
      : externalErrors?.[field] ?? '';
  };

  const errors = {
    date: getError('date'),
    status: getError('status'),
    round: getError('round'),
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'round') {
      const parsedValue = value === '' ? 0 : parseInt(value, 10);
      setFormData((prev) => ({ ...prev, [name]: isNaN(parsedValue) ? 0 : parsedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name as keyof typeof errors]) {
      setLocalErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors]) {
      setLocalErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.status || !Object.values(MatchStatus).includes(formData.status)) {
      newErrors.status = 'Status is required';
    }

    if (!formData.round || formData.round < 1 || formData.round > 4) {
      newErrors.round = 'Round must be between 1 and 4';
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
    router.push('/admin/matches');
  };

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

  // Show error state if match query failed
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

      <Card>
        <CardHeader>
          <CardTitle>Match Information</CardTitle>
          <CardDescription>Update the match details below</CardDescription>
        </CardHeader>

        <form key={match?.id} onSubmit={handleSubmit} className="space-y-10">
          <CardContent>
            {Boolean(submitError) && (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive mb-6">
                <p className="font-medium">Operation failed</p>
                {submitError && <p className="mt-1 text-sm">{submitError}</p>}
              </div>
            )}
            <FieldGroup>
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
                    disabled={updateLoading}
                  />
                  {errors.date && <FieldError>{errors.date}</FieldError>}
                  <FieldDescription>Select the date and time for the match</FieldDescription>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="round">Round *</FieldLabel>
                <FieldContent>
                  <Input
                    id="round"
                    name="round"
                    type="number"
                    min="1"
                    max="4"
                    value={formData.round}
                    onChange={handleChange}
                    aria-invalid={!!errors.round}
                    disabled={updateLoading}
                  />
                  {errors.round && <FieldError>{errors.round}</FieldError>}
                  <FieldDescription>Enter the round number (1-4)</FieldDescription>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="status">Status *</FieldLabel>
                <FieldContent>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange('status', value)}
                    disabled={updateLoading}
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
                  <FieldDescription>Update the match status</FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button type="button" variant="outline" onClick={handleCancel} className="w-full sm:w-auto cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={updateLoading} className="w-full sm:w-auto cursor-pointer">
              {updateLoading ? 'Updating...' : 'Update Match'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminMatchEditViewUi;
