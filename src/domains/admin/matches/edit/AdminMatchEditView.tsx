'use client';

import AdminMatchEditViewUi from './AdminMatchEditViewUi';
import { useMutation, useQuery } from '@apollo/client/react';
import { useMemo, useState } from 'react';
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

type AdminMatchEditViewProps = {
  matchId: string;
};

const AdminMatchEditView = ({ matchId }: AdminMatchEditViewProps) => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [externalErrors, setExternalErrors] = useState<Record<string, string>>({});

  const { data: matchData, loading: matchLoading, error: matchError } = useQuery<MatchByIdQuery, MatchByIdQueryVariables>(
    MatchByIdDocument,
    { variables: { id: matchId } },
  );

  const { data: teamsData, loading: teamsLoading, error: teamsError } = useQuery<TeamsQuery>(TeamsDocument);

  const [updateMatchMutation, { loading: updateLoading }] = useMutation<
    UpdateMatchMutation,
    UpdateMatchMutationVariables
  >(UpdateMatchDocument);

  const match: Parameters<typeof AdminMatchEditViewUi>[0]['match'] = matchData?.matchById
    ? {
        id: matchData.matchById.id,
        firstOpponent: { id: matchData.matchById.firstOpponent.id, name: matchData.matchById.firstOpponent.name },
        secondOpponent: { id: matchData.matchById.secondOpponent.id, name: matchData.matchById.secondOpponent.name },
        date: String(matchData.matchById.date),
        status: matchData.matchById.status,
      }
    : null;

  const teams: Parameters<typeof AdminMatchEditViewUi>[0]['teams'] = useMemo(
    () => teamsData?.teams?.map((t) => ({ id: t.id, name: t.name })) ?? [],
    [teamsData],
  );

  const getTranslationCode = (e: unknown) => {
    if (!e || typeof e !== 'object') return null;
    const graphQLErrors = (e as { graphQLErrors?: unknown }).graphQLErrors;
    if (!Array.isArray(graphQLErrors) || graphQLErrors.length === 0) return null;
    const first = graphQLErrors[0] as { extensions?: unknown };
    const code = (first.extensions as { translationCode?: unknown } | undefined)?.translationCode;
    if (typeof code === 'string') return code;
    return null;
  };

  const onUpdateMatch: Parameters<typeof AdminMatchEditViewUi>[0]['onUpdateMatch'] = async (data) => {
    setSubmitError(null);
    setExternalErrors({});

    const d = new Date(data.date);
    if (Number.isNaN(d.getTime())) {
      setExternalErrors({ date: 'Invalid date' });
      return;
    }

    const status = data.status as MatchStatus;

    try {
      await updateMatchMutation({
        variables: {
          id: matchId,
          dto: {
            firstOpponentId: data.firstOpponentId,
            secondOpponentId: data.secondOpponentId,
            date: d.toISOString(),
            status,
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

  return (
    <AdminMatchEditViewUi
      match={match}
      teams={teams}
      matchLoading={matchLoading}
      updateLoading={updateLoading}
      matchError={matchError}
      teamsLoading={teamsLoading}
      teamsError={teamsError}
      externalErrors={externalErrors}
      submitError={submitError}
      onUpdateMatch={onUpdateMatch}
    />
  );
};

export default AdminMatchEditView;

