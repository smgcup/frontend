'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import {
  CreateMatchEventDocument,
  type CreateMatchEventMutation,
  type CreateMatchEventMutationVariables,
  DeleteMatchEventDocument,
  type DeleteMatchEventMutation,
  type DeleteMatchEventMutationVariables,
} from '@/graphql';
import type { MatchEvent } from '@/domains/matches/contracts';
import type { AddEventInput } from '../contracts';
import { mapAddEventInputToDto } from '../mappers/mapAddEventInputToDto';

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

  const onAddEvent = async (data: AddEventInput) => {
    await createMatchEventMutation({
      variables: {
        dto: mapAddEventInputToDto(data, matchId),
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
