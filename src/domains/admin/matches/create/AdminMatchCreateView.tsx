'use client';

import AdminMatchCreateViewUi from './AdminMatchCreateViewUi';
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
import { useMemo, useState } from 'react';

const AdminMatchCreateView = () => {
  const router = useRouter();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [externalErrors, setExternalErrors] = useState<Record<string, string>>({});

  const { data: teamsData, loading: teamsLoading, error: teamsError } = useQuery<TeamsQuery>(TeamsDocument);

  const [createMatchMutation, { loading: createLoading }] = useMutation<
    CreateMatchMutation,
    CreateMatchMutationVariables
  >(CreateMatchDocument);

  const teams: Parameters<typeof AdminMatchCreateViewUi>[0]['teams'] = useMemo(
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

  const onCreateMatch: Parameters<typeof AdminMatchCreateViewUi>[0]['onCreateMatch'] = async (data) => {
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
            status: data.status as MatchStatus,
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

  return (
    <AdminMatchCreateViewUi
      teams={teams}
      teamsLoading={teamsLoading}
      teamsError={teamsError}
      externalErrors={externalErrors}
      submitError={submitError}
      onCreateMatch={onCreateMatch}
      createLoading={createLoading}
    />
  );
};

export default AdminMatchCreateView;

