'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import {
  MatchByIdDocument,
  type MatchByIdQuery,
  type MatchByIdQueryVariables,
  MatchStatus,
  TeamsDocument,
  type TeamsQuery,
  UpdateMatchDocument,
  type UpdateMatchMutation,
  type UpdateMatchMutationVariables,
} from '@/graphql';
import { mapTeam } from '@/domains/team/mappers/mapTeam';
import { mapMatchById } from '@/domains/matches/mappers/mapMatchById';
import { getTranslationCode } from '../../utils/getTranslationCode';

export type AdminMatchEditFormData = {
  firstOpponentId: string;
  secondOpponentId: string;
  date: string;
  status: MatchStatus;
};

export const useAdminMatchEdit = (matchId: string) => {
  const router = useRouter();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [externalErrors, setExternalErrors] = useState<Record<string, string>>({});

  const {
    data: matchData,
    loading: matchLoading,
    error: matchError,
  } = useQuery<MatchByIdQuery, MatchByIdQueryVariables>(MatchByIdDocument, {
    variables: { id: matchId },
  });

  const { data: teamsData, loading: teamsLoading, error: teamsError } = useQuery<TeamsQuery>(TeamsDocument);

  const [updateMatchMutation, { loading: updateLoading }] = useMutation<
    UpdateMatchMutation,
    UpdateMatchMutationVariables
  >(UpdateMatchDocument);

  const match = useMemo(() => {
    const row = matchData?.matchById;
    if (!row) return null;
    return mapMatchById(row);
  }, [matchData?.matchById]);

  const teams = useMemo(() => (teamsData?.teams ?? []).map(mapTeam), [teamsData]);

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
            firstOpponentId: data.firstOpponentId,
            secondOpponentId: data.secondOpponentId,
            date: d.toISOString(),
            status: data.status,
            ...(status === MatchStatus.Live || status === MatchStatus.Finished ? {} : { score1: null, score2: null }),
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
      if (code === 'scoreNotAllowedForStatus') {
        setSubmitError('scoreNotAllowedForStatus');
        return;
      }
      setSubmitError(code ?? (e instanceof Error ? e.message : 'Failed to update match'));
    }
  };

  return {
    match,
    teams,
    matchLoading,
    matchError,
    teamsLoading,
    teamsError,
    updateLoading,
    externalErrors,
    submitError,
    onUpdateMatch,
  };
};
