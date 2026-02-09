'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import {
  DeleteMatchDocument,
  type DeleteMatchMutation,
  type DeleteMatchMutationVariables,
  StartMatchDocument,
  type StartMatchMutation,
  type StartMatchMutationVariables,
} from '@/graphql';
import type { Match } from '@/domains/matches/contracts';

export const useAdminMatchesList = (matches: Match[]) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRound, setSelectedRound] = useState<number | 'all'>('all');

  const rounds = useMemo(() => {
    const set = new Set(matches.map((m) => m.round));
    return Array.from(set).sort((a, b) => a - b);
  }, [matches]);

  // Mutation hook to delete a match
  // Returns the mutation function and loading state
  const [deleteMatchMutation, { loading: deleteLoading }] = useMutation<
    DeleteMatchMutation,
    DeleteMatchMutationVariables
  >(DeleteMatchDocument);

  // Mutation hook to start a match
  const [startMatchMutation] = useMutation<StartMatchMutation, StartMatchMutationVariables>(StartMatchDocument);

  const filteredMatches = useMemo(() => {
    let result = matches;
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((m) => {
        const home = m.firstOpponent.name.toLowerCase();
        const away = m.secondOpponent.name.toLowerCase();
        return home.includes(query) || away.includes(query);
      });
    }
    if (selectedRound !== 'all') {
      result = result.filter((m) => m.round === selectedRound);
    }
    return result;
  }, [matches, searchQuery, selectedRound]);

  const onDeleteMatch = async (id: string) => {
    await deleteMatchMutation({ variables: { id } });
    // Trigger SSR refetch by refreshing the router
    router.refresh();
  };

  const onStartMatch = async (id: string) => {
    await startMatchMutation({ variables: { id } });
    // Trigger SSR refetch by refreshing the router
    router.refresh();
  };

  return {
    filteredMatches,
    totalCount: matches.length,
    rounds,
    searchQuery,
    setSearchQuery,
    selectedRound,
    setSelectedRound,
    deleteLoading,
    onDeleteMatch,
    onStartMatch,
  };
};
