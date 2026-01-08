'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import {
  CreateMatchEventDocument,
  type CreateMatchEventMutation,
  type CreateMatchEventMutationVariables,
  DeleteMatchEventDocument,
  type DeleteMatchEventMutation,
  type DeleteMatchEventMutationVariables,
  MatchByIdDocument,
  type MatchByIdQuery,
  type MatchByIdQueryVariables,
  MatchEventsDocument,
  type MatchEventsQuery,
  type MatchEventsQueryVariables,
  MatchEventType as GqlMatchEventType,
} from '@/graphql';
import type { MatchEvent, MatchEventType } from '@/domains/matches/contracts';
import { mapMatchById } from '@/domains/matches/mappers/mapMatchById';
import { mapMatchEvent } from '@/domains/matches/mappers/mapMatchEvent';

export const useAdminMatchLive = (matchId: string) => {
  const { data: matchData, loading: matchLoading } = useQuery<MatchByIdQuery, MatchByIdQueryVariables>(
    MatchByIdDocument,
    { variables: { id: matchId } },
  );

  const { data: eventsData } = useQuery<MatchEventsQuery, MatchEventsQueryVariables>(MatchEventsDocument, {
    variables: { matchId },
    fetchPolicy: 'cache-and-network',
  });

  const [createMatchEventMutation] = useMutation<CreateMatchEventMutation, CreateMatchEventMutationVariables>(
    CreateMatchEventDocument,
    { refetchQueries: [{ query: MatchEventsDocument, variables: { matchId } }] },
  );

  const [deleteMatchEventMutation] = useMutation<DeleteMatchEventMutation, DeleteMatchEventMutationVariables>(
    DeleteMatchEventDocument,
    { refetchQueries: [{ query: MatchEventsDocument, variables: { matchId } }] },
  );

  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  type AddEventInput = {
    type: MatchEventType;
    minute: number;
    playerId?: string;
    teamId: string;
    payload?: unknown;
  };

  const match = useMemo(() => {
    const row = matchData?.matchById;
    if (!row) return null;
    // Live view expects scores to always be numbers.
    return {
      ...mapMatchById(row),
      score1: row.score1 ?? 0,
      score2: row.score2 ?? 0,
    };
  }, [matchData?.matchById]);

  const events: MatchEvent[] = useMemo(() => {
    const rows = eventsData?.matchEvents ?? [];
    // Sort ascending by minute, then createdAt (stable-ish)
    const sorted = [...rows].sort((a, b) => {
      if (a.minute !== b.minute) return a.minute - b.minute;
      return String(a.createdAt).localeCompare(String(b.createdAt));
    });
    return sorted.map(mapMatchEvent);
  }, [eventsData]);

  const currentMinute = useMemo(() => {
    const maxMinute = events.reduce((m, e) => Math.max(m, e.minute), 0);
    return Math.max(0, maxMinute);
  }, [events]);

  const onAddEvent = async (data: AddEventInput) => {
    await createMatchEventMutation({
      variables: {
        dto: {
          matchId,
          teamId: data.teamId,
          playerId: data.playerId ?? null,
          type: data.type as unknown as GqlMatchEventType,
          minute: data.minute,
          payload: data.payload ?? null,
        },
      },
    });
  };

  const onDeleteEvent = async (id: string) => {
    setDeletingEventId(id);
    try {
      await deleteMatchEventMutation({ variables: { id } });
    } finally {
      setDeletingEventId(null);
    }
  };

  const onEndMatch = async (): Promise<void> => {};

  return {
    match,
    events,
    matchLoading,
    currentMinute,
    onAddEvent,
    onDeleteEvent,
    deletingEventId,
    onEndMatch,
  };
};
