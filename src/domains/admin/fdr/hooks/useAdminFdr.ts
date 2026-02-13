'use client';

import { useState, useMemo, useCallback } from 'react';
import { useMutation } from '@apollo/client/react';
import {
  UpdateMatchDocument,
  type UpdateMatchMutation,
  type UpdateMatchMutationVariables,
} from '@/graphql';
import { getErrorMessage } from '@/domains/admin/utils/getErrorMessage';
import type { Match } from '@/domains/matches/contracts';

type FdrValue = 1 | 2 | 3 | 4 | 5;

type FdrEntry = {
  team1Fdr: FdrValue | null;
  team2Fdr: FdrValue | null;
};

export const useAdminFdr = (initialMatches: Match[]) => {
  const [selectedRound, setSelectedRound] = useState<number | 'all'>('all');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [fdrState, setFdrState] = useState<Record<string, FdrEntry>>(() => {
    const state: Record<string, FdrEntry> = {};
    for (const m of initialMatches) {
      state[m.id] = {
        team1Fdr: (m.fdr1 as FdrValue) ?? null,
        team2Fdr: (m.fdr2 as FdrValue) ?? null,
      };
    }
    return state;
  });

  const [updateMatch] = useMutation<UpdateMatchMutation, UpdateMatchMutationVariables>(UpdateMatchDocument);

  const rounds = useMemo(() => {
    const roundSet = new Set(initialMatches.map((m) => m.round));
    return [...roundSet].sort((a, b) => a - b);
  }, [initialMatches]);

  const filteredMatches = useMemo(() => {
    const filtered = selectedRound === 'all' ? initialMatches : initialMatches.filter((m) => m.round === selectedRound);
    return filtered.sort((a, b) => a.round - b.round);
  }, [initialMatches, selectedRound]);

  const handleFdrChange = useCallback((matchId: string, side: 'team1Fdr' | 'team2Fdr', value: FdrValue) => {
    setFdrState((prev) => ({
      ...prev,
      [matchId]: {
        team1Fdr: prev[matchId]?.team1Fdr ?? null,
        team2Fdr: prev[matchId]?.team2Fdr ?? null,
        [side]: value,
      },
    }));
    setError(null);
    setSuccess(false);
  }, []);

  const handleSaveAll = useCallback(async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const matchesToSave = filteredMatches.filter((m) => {
        const entry = fdrState[m.id];
        if (!entry) return false;
        return entry.team1Fdr !== null || entry.team2Fdr !== null;
      });

      await Promise.all(
        matchesToSave.map((m) => {
          const entry = fdrState[m.id];
          return updateMatch({
            variables: {
              id: m.id,
              dto: {
                fdr1: entry.team1Fdr,
                fdr2: entry.team2Fdr,
              },
            },
          });
        }),
      );

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }, [filteredMatches, fdrState, updateMatch]);

  const hasDirtyEntries = useMemo(() => {
    return filteredMatches.some((m) => {
      const entry = fdrState[m.id];
      if (!entry) return false;
      return entry.team1Fdr !== (m.fdr1 ?? null) || entry.team2Fdr !== (m.fdr2 ?? null);
    });
  }, [filteredMatches, fdrState]);

  return {
    rounds,
    filteredMatches,
    selectedRound,
    setSelectedRound,
    fdrState,
    handleFdrChange,
    handleSaveAll,
    saving,
    error,
    success,
    hasDirtyEntries,
  };
};
