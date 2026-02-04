'use client';

import { useState, useMemo } from 'react';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import AdminMatchAppearancesViewUi from './AdminMatchAppearancesViewUi';
import type { Match } from '@/domains/matches/contracts';
import type { AppearanceLevel } from './contracts';
import type { ExistingAppearance } from './ssr/getAdminMatchAppearancesPageData';
import {
  CreateAllPlayerAppearancesDocument,
  type CreateAllPlayerAppearancesMutation,
  type CreateAllPlayerAppearancesMutationVariables,
  DeletePlayerAppearanceDocument,
  type DeletePlayerAppearanceMutation,
  type DeletePlayerAppearanceMutationVariables,
} from '@/graphql';

const levelToNumber = (level: AppearanceLevel): number => {
  if (level === 'half') return 1;
  if (level === 'full') return 2;
  return 0;
};

const numberToLevel = (num: number): AppearanceLevel => {
  if (num === 1) return 'half';
  if (num === 2) return 'full';
  return 'none';
};

type AdminMatchAppearancesViewProps = {
  match: Match;
  existingAppearances: ExistingAppearance[];
};

const AdminMatchAppearancesView = ({ match, existingAppearances }: AdminMatchAppearancesViewProps) => {
  const router = useRouter();

  // Initialize appearances state from existing data
  const [appearances, setAppearances] = useState<Map<string, AppearanceLevel>>(() => {
    const map = new Map<string, AppearanceLevel>();
    const allPlayers = [...(match.firstOpponent.players ?? []), ...(match.secondOpponent.players ?? [])];

    // Set all players to 'none' first
    allPlayers.forEach((player) => map.set(player.id, 'none'));

    // Then override with existing appearances
    existingAppearances.forEach((appearance) => {
      map.set(appearance.playerId, numberToLevel(appearance.level));
    });

    return map;
  });

  const [mvpId, setMvpId] = useState<string | null>(null);

  const [createAppearances, { loading: isCreating }] = useMutation<
    CreateAllPlayerAppearancesMutation,
    CreateAllPlayerAppearancesMutationVariables
  >(CreateAllPlayerAppearancesDocument);

  const [deleteAppearance, { loading: isDeleting }] = useMutation<
    DeletePlayerAppearanceMutation,
    DeletePlayerAppearanceMutationVariables
  >(DeletePlayerAppearanceDocument);

  const isSaving = isCreating || isDeleting;

  // Get list of players who have appeared (for MVP selection)
  const appearedPlayers = useMemo(() => {
    const allPlayers = [...(match.firstOpponent.players ?? []), ...(match.secondOpponent.players ?? [])];
    return allPlayers.filter((player) => {
      const level = appearances.get(player.id);
      return level === 'half' || level === 'full';
    });
  }, [appearances, match.firstOpponent.players, match.secondOpponent.players]);

  const handleAppearanceChange = (playerId: string, level: AppearanceLevel) => {
    setAppearances((prev) => {
      const next = new Map(prev);
      next.set(playerId, level);
      return next;
    });

    // If MVP is no longer appeared, reset MVP
    if (mvpId === playerId && level === 'none') {
      setMvpId(null);
    }
  };

  const handleMvpChange = (playerId: string | null) => {
    setMvpId(playerId);
  };

  const handleSave = async () => {
    // Find players who had existing appearances but are now set to 'none' - need to delete
    const existingPlayerIds = new Set(existingAppearances.map((a) => a.playerId));
    const toDelete = Array.from(appearances.entries())
      .filter(([playerId, level]) => level === 'none' && existingPlayerIds.has(playerId))
      .map(([playerId]) => playerId);

    // Only include players who appeared (level 1 or 2)
    const appearancesArray = Array.from(appearances.entries())
      .filter(([, level]) => level !== 'none')
      .map(([playerId, level]) => ({
        playerId,
        level: levelToNumber(level),
      }));

    try {
      // Delete removed appearances
      await Promise.all(
        toDelete.map((playerId) =>
          deleteAppearance({
            variables: {
              matchId: match.id,
              playerId,
            },
          }),
        ),
      );

      // Create/update appearances (only if there are any)
      if (appearancesArray.length > 0) {
        await createAppearances({
          variables: {
            input: {
              matchId: match.id,
              appearances: appearancesArray,
            },
          },
        });
      }

      // TODO: Save MVP when backend supports it
      console.log('MVP:', mvpId);

      router.push('/admin/matches');
    } catch (error) {
      console.error('Failed to save appearances:', error);
    }
  };

  return (
    <AdminMatchAppearancesViewUi
      match={match}
      appearances={appearances}
      mvpId={mvpId}
      appearedPlayers={appearedPlayers}
      isSaving={isSaving}
      onAppearanceChange={handleAppearanceChange}
      onMvpChange={handleMvpChange}
      onSave={handleSave}
    />
  );
};

export default AdminMatchAppearancesView;
