'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { CreateMatchDocument, CreateMatchMutation, CreateMatchMutationVariables, MatchStatus } from '@/graphql';
import { getTranslationCode } from '../../utils/getTranslationCode';

export type AdminMatchCreateFormData = {
  firstOpponentId: string;
  secondOpponentId: string;
  date: string;
  status: MatchStatus;
  round: number;
};

export const useAdminMatchCreate = () => {
  const router = useRouter();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [externalErrors, setExternalErrors] = useState<Record<string, string>>({});

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
            round: data.round,
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
    externalErrors,
    submitError,
    createLoading,
    onCreateMatch,
  };
};
