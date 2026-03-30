import type { GetMyFantasyTeamQuery } from '@/graphql';
import type { FantasyTeamData, FantasyPlayer, JerseyStyle } from '../../contracts';

const defaultJersey: JerseyStyle = { color: '#4B5563', textColor: '#FFFFFF', label: '' };

export const mapMyFantasyTeam = (data: GetMyFantasyTeamQuery): FantasyTeamData | null => {
  const team = data.myFantasyTeam;
  if (!team) return null;

  const captainPlayerId = team.captainPlayer.playerId;

  const sortedSlots = [...team.slots].sort((a, b) => a.slotOrder - b.slotOrder);

  const mapSlot = (slot: (typeof sortedSlots)[number]): FantasyPlayer => {
    const fp = slot.fantasyPlayer;
    const player = fp.player;
    const displayName = fp.displayName ?? player.lastName;

    return {
      id: fp.playerId,
      firstName: player.firstName,
      lastName: player.lastName,
      displayName,
      position: player.position,
      jersey: defaultJersey,
      isCaptain: fp.playerId === captainPlayerId,
      price: fp.price,
      celebrationImageUrl: player.celebrationImageUrl ?? undefined,
      teamShort: player.team.name,
    };
  };

  const starters = sortedSlots.filter((s) => !s.isBenched).map(mapSlot);
  const bench = sortedSlots.filter((s) => s.isBenched).map(mapSlot);

  return {
    teamName: team.teamName,
    gameweek: 1,
    freeTransfers: team.freeTransfers,
    budget: team.budget,
    transferCost: 0,
    starters,
    bench,
  };
};
