'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import {
  MatchByIdDocument,
  type MatchByIdQuery,
  type MatchByIdQueryVariables,
  MatchStatus,
  UpdateMatchDocument,
  type UpdateMatchMutation,
  type UpdateMatchMutationVariables,
} from '@/graphql';
import { MatchLocation } from '@/generated/types';
import { getTranslationCode } from '../../utils/getTranslationCode';
import { mapMatch } from '@/domains/matches/mappers/mapMatch';

export type AdminMatchEditFormData = {
  date: string;
  status: MatchStatus;
  round: number;
  location?: MatchLocation | null;
};

/**
 * Custom React hook for managing the match edit functionality in the admin panel.
 *
 * This hook handles:
 * - Fetching the match data by ID
 * - Managing form submission and validation
 * - Handling server-side errors and mapping them to appropriate form fields
 * - Navigation after successful update
 *
 * @param matchId - The ID of the match to edit
 * @returns Object containing match data, loading states, errors, and update handler
 */
export const useAdminMatchEdit = (matchId: string) => {
  const router = useRouter();

  // General error message for the entire form (e.g., "match not found")
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Field-specific errors from server validation (e.g., "Teams must be different")
  const [externalErrors, setExternalErrors] = useState<Record<string, string>>({});

  const {
    data: matchData,
    loading: matchLoading,
    error: matchError,
  } = useQuery<MatchByIdQuery, MatchByIdQueryVariables>(MatchByIdDocument, {
    variables: { id: matchId },
  });

  const [updateMatchMutation, { loading: updateLoading }] = useMutation<
    UpdateMatchMutation,
    UpdateMatchMutationVariables
  >(UpdateMatchDocument);

  const match = useMemo(() => {
    const row = matchData?.matchById;
    if (!row) return null;
    return mapMatch(row);
  }, [matchData?.matchById]);

  const onUpdateMatch = async (data: AdminMatchEditFormData) => {
    setSubmitError(null);
    setExternalErrors({});

    const d = new Date(data.date);
    if (Number.isNaN(d.getTime())) {
      setExternalErrors({ date: 'Invalid date' });
      return;
    }

    try {
      await updateMatchMutation({
        variables: {
          id: matchId,
          dto: {
            date: d.toISOString(),
            status: data.status,
            round: data.round,
            location: data.location ?? null,
          },
        },
      });
      router.push('/admin/matches');
      router.refresh();
    } catch (e) {
      const code = getTranslationCode(e);

      if (code === 'matchNotFound') {
        setSubmitError('matchNotFound');
        return;
      }
      if (code === 'invalidMatchDate') {
        setExternalErrors({ date: 'Invalid date' });
        return;
      }
      setSubmitError(code ?? (e instanceof Error ? e.message : 'Failed to update match'));
    }
  };

  return {
    match,
    matchLoading,
    matchError,
    externalErrors,
    submitError,
    updateLoading,
    onUpdateMatch,
  };
};
