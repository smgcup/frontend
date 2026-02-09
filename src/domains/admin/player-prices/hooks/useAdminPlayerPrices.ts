'use client';

import { useMemo, useState, useCallback } from 'react';
import { useMutation } from '@apollo/client/react';
import {
  CreateFantasyPlayerDocument,
  type CreateFantasyPlayerMutation,
  type CreateFantasyPlayerMutationVariables,
  UpdateFantasyPlayerDocument,
  type UpdateFantasyPlayerMutation,
  type UpdateFantasyPlayerMutationVariables,
} from '@/graphql';
import { getErrorMessage } from '@/domains/admin/utils/getErrorMessage';
import type { PlayerPriceEntry, SortField } from '../contracts';

type PlayerFormState = {
  displayName: string;
  price: string;
  hasFantasyData: boolean;
};

export const useAdminPlayerPrices = (initialPlayers: PlayerPriceEntry[]) => {
  const [formState, setFormState] = useState<Record<string, PlayerFormState>>(() => {
    const state: Record<string, PlayerFormState> = {};
    for (const p of initialPlayers) {
      state[p.playerId] = {
        displayName: p.displayName ?? '',
        price: p.price,
        hasFantasyData: p.hasFantasyData,
      };
    }
    return state;
  });

  // Track the last-saved values so we can detect dirty state
  const [savedState, setSavedState] = useState<Record<string, { displayName: string; price: string }>>(() => {
    const state: Record<string, { displayName: string; price: string }> = {};
    for (const p of initialPlayers) {
      if (p.hasFantasyData) {
        state[p.playerId] = { displayName: p.displayName ?? '', price: p.price };
      }
    }
    return state;
  });

  const [savingPlayerId, setSavingPlayerId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successes, setSuccesses] = useState<Record<string, boolean>>({});

  const [sortField, setSortField] = useState<SortField>('name');
  const [searchQuery, setSearchQuery] = useState('');

  const [createFantasyPlayer] = useMutation<CreateFantasyPlayerMutation, CreateFantasyPlayerMutationVariables>(
    CreateFantasyPlayerDocument,
  );

  const [updateFantasyPlayer] = useMutation<UpdateFantasyPlayerMutation, UpdateFantasyPlayerMutationVariables>(
    UpdateFantasyPlayerDocument,
  );

  const filteredAndSortedPlayers = useMemo(() => {
    const filtered = searchQuery.trim()
      ? initialPlayers.filter((p) => {
          const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
          const teamName = p.teamName.toLowerCase();
          const query = searchQuery.trim().toLowerCase();
          return fullName.includes(query) || teamName.includes(query);
        })
      : initialPlayers;

    return [...filtered].sort((a, b) => {
      if (sortField === 'name') {
        return `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);
      }
      return a.teamName.localeCompare(b.teamName);
    });
  }, [initialPlayers, sortField, searchQuery]);

  const isDirty = useCallback(
    (playerId: string) => {
      const form = formState[playerId];
      if (!form) return false;
      const saved = savedState[playerId];
      // No saved data yet = new entry, always dirty if fields are filled
      if (!saved) return true;
      return form.displayName.trim() !== saved.displayName || form.price !== saved.price;
    },
    [formState, savedState],
  );

  const updateField = useCallback((playerId: string, field: 'displayName' | 'price', value: string) => {
    setFormState((prev) => ({
      ...prev,
      [playerId]: { ...prev[playerId], [field]: value },
    }));
    setErrors((prev) => {
      if (!prev[playerId]) return prev;
      const next = { ...prev };
      delete next[playerId];
      return next;
    });
  }, []);

  const onSave = useCallback(
    async (playerId: string) => {
      const form = formState[playerId];
      if (!form) return;

      if (!form.price.trim() || isNaN(Number(form.price)) || Number(form.price) <= 0) {
        setErrors((prev) => ({ ...prev, [playerId]: 'Price must be a positive number' }));
        return;
      }

      setSavingPlayerId(playerId);
      setErrors((prev) => {
        const next = { ...prev };
        delete next[playerId];
        return next;
      });

      try {
        if (form.hasFantasyData) {
          await updateFantasyPlayer({
            variables: {
              playerId,
              updateFantasyPlayerDto: {
                displayName: form.displayName.trim() || undefined,
                price: Number(form.price),
              },
            },
          });
        } else {
          await createFantasyPlayer({
            variables: {
              createFantasyPlayerDto: {
                playerId,
                displayName: form.displayName.trim() || undefined,
                price: Number(form.price),
              },
            },
          });
          setFormState((prev) => ({
            ...prev,
            [playerId]: { ...prev[playerId], hasFantasyData: true },
          }));
        }

        // Update saved state so dirty detection works correctly
        setSavedState((prev) => ({
          ...prev,
          [playerId]: { displayName: form.displayName.trim(), price: form.price },
        }));

        setSuccesses((prev) => ({ ...prev, [playerId]: true }));
        setTimeout(() => {
          setSuccesses((prev) => {
            const next = { ...prev };
            delete next[playerId];
            return next;
          });
        }, 2000);
      } catch (e) {
        setErrors((prev) => ({ ...prev, [playerId]: getErrorMessage(e) }));
      } finally {
        setSavingPlayerId(null);
      }
    },
    [formState, createFantasyPlayer, updateFantasyPlayer],
  );

  return {
    filteredAndSortedPlayers,
    formState,
    savingPlayerId,
    errors,
    successes,
    isDirty,
    sortField,
    searchQuery,
    setSortField,
    setSearchQuery,
    updateField,
    onSave,
  };
};
