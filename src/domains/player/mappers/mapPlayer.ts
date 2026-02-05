import { Player, PlayerStats } from '../contracts';
import {
  MatchByIdQuery,
  PlayerByIdQuery,
  TeamsWithPlayersQuery,
  MatchEventsQuery,
  GetPlayerStandingsQuery,
  GetLeaderboardQuery,
  TeamByIdQuery,
} from '@/graphql';

export const mapPlayer = (
  player:
    | PlayerByIdQuery['playerById']
    | MatchByIdQuery['matchById']['firstOpponent']['players'][number]
    | MatchByIdQuery['matchById']['secondOpponent']['players'][number]
    | TeamsWithPlayersQuery['teams'][number]['players'][number]
    | GetPlayerStandingsQuery['teams'][number]['players'][number]
    | GetLeaderboardQuery['playersLeaderboard']['players'][number]
    | NonNullable<TeamByIdQuery['teamById']['captain']>
    | NonNullable<MatchEventsQuery['matchEvents'][number]['player']>
    | NonNullable<MatchEventsQuery['matchEvents'][number]['assistPlayer']>,
): Player => {
  // if (!player) return null;

  const height = 'height' in player ? player.height : undefined;
  const weight = 'weight' in player ? player.weight : undefined;
  const preferredFoot = 'preferredFoot' in player ? player.preferredFoot : undefined;
  const team = 'team' in player ? { id: player.team.id, name: player.team.name } : undefined;
  const age = 'age' in player ? player.age : undefined;
  const imageUrl = 'imageUrl' in player ? player.imageUrl : undefined;
  const playerClass = 'class' in player ? player.class : undefined;
  const dateOfBirth = 'dateOfBirth' in player ? player.dateOfBirth : undefined;

  let stats: PlayerStats | undefined;
  if ('stats' in player && player.stats) {
    const s = player.stats as Partial<PlayerStats>;
    stats = {
      appearances: s.appearances ?? 0,
      goals: s.goals ?? 0,
      assists: s.assists ?? 0,
      yellowCards: s.yellowCards ?? 0,
      redCards: s.redCards ?? 0,
      ownGoals: s.ownGoals ?? 0,
      penaltiesMissed: s.penaltiesMissed ?? 0,
      penaltiesScored: s.penaltiesScored ?? 0,
      goalkeeperSaves: s.goalkeeperSaves ?? 0,
    };
  }

  return {
    id: player.id,
    firstName: player.firstName,
    lastName: player.lastName,
    position: player.position,
    height,
    weight,
    preferredFoot,
    team,
    age,
    imageUrl,
    class: playerClass,
    dateOfBirth,
    stats,
  };
};
