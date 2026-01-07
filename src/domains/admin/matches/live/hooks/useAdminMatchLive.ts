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
import { MatchEventType } from '../components/EventTimeline';
import type { PlayerPosition } from '@/generated/types';

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

  type Player = {
    id: string;
    firstName: string;
    lastName: string;
    position?: PlayerPosition;
  };

  type Team = {
    id: string;
    name: string;
    players: Player[];
  };

  type Match = {
    id: string;
    firstOpponent: Team;
    secondOpponent: Team;
    date: string;
    status: 'LIVE';
    score1: number;
    score2: number;
  };

  type MatchEvent = {
    id: string;
    type: MatchEventType;
    minute: number;
    player?: Player;
    team: Team;
  };

  type AddEventInput = {
    type: MatchEventType;
    minute: number;
    playerId?: string;
    teamId: string;
    payload?: unknown;
  };

  const match: Match | null = matchData?.matchById
    ? {
        id: matchData.matchById.id,
        firstOpponent: {
          id: matchData.matchById.firstOpponent.id,
          name: matchData.matchById.firstOpponent.name,
          players:
            matchData.matchById.firstOpponent.players?.map((p) => ({
              id: p.id,
              firstName: p.firstName,
              lastName: p.lastName,
              position: p.position,
            })) ?? [],
        },
        secondOpponent: {
          id: matchData.matchById.secondOpponent.id,
          name: matchData.matchById.secondOpponent.name,
          players:
            matchData.matchById.secondOpponent.players?.map((p) => ({
              id: p.id,
              firstName: p.firstName,
              lastName: p.lastName,
              position: p.position,
            })) ?? [],
        },
        date: String(matchData.matchById.date),
        status: 'LIVE',
        score1: matchData.matchById.score1 ?? 0,
        score2: matchData.matchById.score2 ?? 0,
      }
    : null;

  const events: MatchEvent[] = useMemo(() => {
    const rows = eventsData?.matchEvents ?? [];
    // Sort ascending by minute, then createdAt (stable-ish)
    const sorted = [...rows].sort((a, b) => {
      if (a.minute !== b.minute) return a.minute - b.minute;
      return String(a.createdAt).localeCompare(String(b.createdAt));
    });
    return sorted.map((e) => ({
      id: e.id,
      type: e.type as unknown as MatchEventType,
      minute: e.minute,
      player: e.player ? { id: e.player.id, firstName: e.player.firstName, lastName: e.player.lastName } : undefined,
      team: { id: e.team.id, name: e.team.name, players: [] },
    }));
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
