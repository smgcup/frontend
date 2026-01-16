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
import { getTranslationCode } from '../../utils/getTranslationCode';
import { mapMatch } from '@/domains/matches/mappers/mapMatch';

/**
 * Form data structure for editing a match in the admin panel.
 * All fields are required for submission.
 */
export type AdminMatchEditFormData = {
  date: string;
  status: MatchStatus;
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

  // Fetch the match data by ID using GraphQL query
  const {
    data: matchData,
    loading: matchLoading,
    error: matchError,
  } = useQuery<MatchByIdQuery, MatchByIdQueryVariables>(MatchByIdDocument, {
    variables: { id: matchId },
  });

  // Mutation hook for updating the match
  const [updateMatchMutation, { loading: updateLoading }] = useMutation<
    UpdateMatchMutation,
    UpdateMatchMutationVariables
  >(UpdateMatchDocument);

  // Transform the raw GraphQL match data into the domain model format
  const match = useMemo(() => {
    const row = matchData?.matchById;
    if (!row) return null;
    return mapMatch(row);
  }, [matchData?.matchById]);

  /**
   * Handles the submission of the match edit form.
   *
   * Validates the date, sends the update mutation, and handles various error cases
   * by mapping server error codes to appropriate form field errors or general errors.
   *
   * @param data - The form data containing match details to update
   */
  const onUpdateMatch = async (data: AdminMatchEditFormData) => {
    // Clear any previous errors
    setSubmitError(null);
    setExternalErrors({});

    // Validate date format before sending to server
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
            date: d.toISOString(), // Convert to ISO string for GraphQL Date scalar
            status: data.status,
          },
        },
      });
      // Navigate back to matches list after successful update
      router.push('/admin/matches');
      router.refresh();
    } catch (e) {
      // Extract error code from the GraphQL error
      const code = getTranslationCode(e);

      // Map server error codes to appropriate error states
      if (code === 'matchNotFound') {
        setSubmitError('matchNotFound');
        return;
      }
      if (code === 'invalidMatchDate') {
        setExternalErrors({ date: 'Invalid date' });
        return;
      }
      // Fallback for any other errors
      setSubmitError(code ?? (e instanceof Error ? e.message : 'Failed to update match'));
    }
  };

  return {
    match, // The mapped match data (null if not loaded yet)
    matchLoading, // Whether the match query is currently loading
    matchError, // Any error from fetching the match
    externalErrors, // Field-specific validation errors from server
    submitError, // General form submission error
    updateLoading, // Whether the update mutation is currently in progress
    onUpdateMatch, // Handler function to submit the form
  };
};
