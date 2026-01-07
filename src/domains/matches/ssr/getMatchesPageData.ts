import { getClient } from '@/lib/initializeApollo';
import { MatchesDocument, type MatchesQuery, type MatchesQueryVariables } from '@/graphql';

export type MatchListItem = {
  id: string;
  date: string;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'CANCELLED';
  score1?: number;
  score2?: number;
  firstOpponent: { id: string; name: string };
  secondOpponent: { id: string; name: string };
};

export const getMatchesPageData = async () => {
  const client = await getClient();

  const { data, error: matchesError } = await client.query<MatchesQuery, MatchesQueryVariables>({
    query: MatchesDocument,
  });

  const matches: MatchListItem[] =
    data?.matches.map((m) => ({
      id: m.id,
      date: String(m.date),
      status: m.status,
      ...(m.score1 == null ? {} : { score1: m.score1 }),
      ...(m.score2 == null ? {} : { score2: m.score2 }),
      firstOpponent: { id: m.firstOpponent.id, name: m.firstOpponent.name },
      secondOpponent: { id: m.secondOpponent.id, name: m.secondOpponent.name },
    })) ?? [];

  return { matches, error: matchesError };
};


