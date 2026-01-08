'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import {
  CreateMatchDocument,
  type CreateMatchMutation,
  type CreateMatchMutationVariables,
  MatchStatus,
  TeamsDocument,
  type TeamsQuery,
} from '@/graphql';
import { mapTeam } from '@/domains/team/mappers/mapTeam';

export type AdminMatchCreateFormData = {
  firstOpponentId: string;
  secondOpponentId: string;
  date: string;
  status: MatchStatus;
};

export const getTranslationCode = (e: unknown) => {
  if (!e || typeof e !== 'object') return null;
  const graphQLErrors = (e as { graphQLErrors?: unknown }).graphQLErrors;
  if (!Array.isArray(graphQLErrors) || graphQLErrors.length === 0) return null;
  const first = graphQLErrors[0] as { extensions?: unknown };
  const code = (first.extensions as { translationCode?: unknown } | undefined)?.translationCode;
  if (typeof code === 'string') return code;
  return null;
};

export const useAdminMatchCreate = () => {
  const router = useRouter();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [externalErrors, setExternalErrors] = useState<Record<string, string>>({});

  const { data: teamsData, loading: teamsLoading, error: teamsError } = useQuery<TeamsQuery>(TeamsDocument);

  const teams = useMemo(() => (teamsData?.teams ?? []).map(mapTeam), [teamsData]);

  const [createMatchMutation, { loading: createLoading }] = useMutation<
    CreateMatchMutation,
    CreateMatchMutationVariables
  >(CreateMatchDocument);

  const onCreateMatch = async (data: AdminMatchCreateFormData) => {
    setSubmitError(null);
    setExternalErrors({});

    const d = new Date(data.date);
    if (Number.isNaN(d.getTime())) {
      setExternalErrors({ date: 'Invalid date' });
      return;
    }

    try {
      await createMatchMutation({
        variables: {
          dto: {
            firstOpponentId: data.firstOpponentId,
            secondOpponentId: data.secondOpponentId,
            date: d.toISOString(),
            status: data.status,
          },
        },
      });
      router.push('/admin/matches');
      router.refresh();
    } catch (e) {
      const code = getTranslationCode(e);
      if (code === 'opponentTeamsMustBeDifferent') {
        setExternalErrors({ secondOpponentId: 'Teams must be different' });
        return;
      }
      if (code === 'invalidMatchDate') {
        setExternalErrors({ date: 'Invalid date' });
        return;
      }
      if (code === 'opponentTeamNotFound') {
        setExternalErrors({ firstOpponentId: 'Team not found', secondOpponentId: 'Team not found' });
        return;
      }
      setSubmitError(code ?? (e instanceof Error ? e.message : 'Failed to create match'));
    }
  };

  return {
    teams,
    teamsLoading,
    teamsError,
    externalErrors,
    submitError,
    createLoading,
    onCreateMatch,
  };
};
