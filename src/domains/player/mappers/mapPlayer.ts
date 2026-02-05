import { Player, PlayerStats } from '../contracts';
import {
  MatchByIdQuery,
  PlayerByIdQuery,
  TeamsWithPlayersQuery,
  MatchEventsQuery,
  GetPlayerStandingsQuery,
  GetLeaderboardQuery,
  TeamByIdQuery,
  GetTopPlayersQuery,
} from '@/graphql';

export const mapPlayer = (
  player:
    | GetTopPlayersQuery['topPlayers'][number]
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
    const rawStats = player.stats as Partial<PlayerStats>;
    stats = {
      appearances: rawStats.appearances ?? 0,
      goals: 'goals' in player.stats ? player.stats.goals : 0,
      assists: 'assists' in player.stats ? player.stats.assists : 0,
      yellowCards: 'yellowCards' in player.stats ? player.stats.yellowCards : 0,
      redCards: 'redCards' in player.stats ? player.stats.redCards : 0,
      ownGoals: 'ownGoals' in player.stats ? player.stats.ownGoals : 0,
      penaltiesMissed: 'penaltiesMissed' in player.stats ? player.stats.penaltiesMissed : 0,
      penaltiesScored: 'penaltiesScored' in player.stats ? player.stats.penaltiesScored : 0,
      goalkeeperSaves: 'goalkeeperSaves' in player.stats ? player.stats.goalkeeperSaves : 0,
    };
  }

  return {
    id: player.id,
    firstName: player.firstName,
    lastName: player.lastName,
    position: 'position' in player ? player.position : undefined,
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
