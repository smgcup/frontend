'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import {
  CreateMatchEventDocument,
  type CreateMatchEventMutation,
  type CreateMatchEventMutationVariables,
  type CreateMatchEventDto,
  DeleteMatchEventDocument,
  type DeleteMatchEventMutation,
  type DeleteMatchEventMutationVariables,
} from '@/graphql';
import type { MatchEvent } from '@/domains/matches/contracts';

export const useAdminMatchLive = (matchId: string, initialEvents: MatchEvent[]) => {
  const router = useRouter();
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  const [createMatchEventMutation] = useMutation<CreateMatchEventMutation, CreateMatchEventMutationVariables>(
    CreateMatchEventDocument,
  );

  const [deleteMatchEventMutation] = useMutation<DeleteMatchEventMutation, DeleteMatchEventMutationVariables>(
    DeleteMatchEventDocument,
  );

  const currentMinute = useMemo(() => {
    const maxMinute = initialEvents.reduce((m, e) => Math.max(m, e.minute), 0);
    return Math.max(0, maxMinute);
  }, [initialEvents]);

  const onAddEvent = async (dto: CreateMatchEventDto) => {
    await createMatchEventMutation({
      variables: {
        dto,
      },
    });
    // Trigger SSR refetch by refreshing the router
    router.refresh();
  };

  const onDeleteEvent = async (id: string) => {
    setDeletingEventId(id);
    try {
      await deleteMatchEventMutation({ variables: { id } });
      // Trigger SSR refetch by refreshing the router
      router.refresh();
    } finally {
      setDeletingEventId(null);
    }
  };

  const onEndMatch = async (): Promise<void> => {};

  return {
    events: initialEvents,
    currentMinute,
    onAddEvent,
    onDeleteEvent,
    deletingEventId,
    onEndMatch,
  };
};
