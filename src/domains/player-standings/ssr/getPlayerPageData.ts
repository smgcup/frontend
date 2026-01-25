// import { getClient } from '@/lib/initializeApollo';
// import { GetPlayerStandingsDocument, GetPlayerStandingsQuery, GetPlayerStandingsQueryVariables } from '@/graphql';
// import { mapTeam } from '@/domains/team/mappers/mapTeam';
// import type { PlayersPageData } from '../contracts';
// import { CATEGORIES } from '../constants';

// export const getPlayerPageData = async (): Promise<PlayersPageData> => {
//   const client = await getClient();

//   const { data } = await client.query<GetPlayerStandingsQuery, GetPlayerStandingsQueryVariables>({
//     query: GetPlayerStandingsDocument,
//   });

//   const teams = (data?.teams ?? []).map(mapTeam);

//   const allPlayers = teams.flatMap((team) =>
//     (team.players ?? []).map((player) => ({
//       ...player,
//       team: team,
//     })),
//   );

//   const standings = Object.values(CATEGORIES).map((category) => {
//     return {
//       title: category,
//       players: allPlayers.map((player, index) => ({
//         ...player,
//         rank: index + 1,
//       })),
//     };
//   });

//   return { standings };
// };
