import * as Types from '../../generated/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type GetPlayersStandingsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetPlayersStandingsQuery = { __typename?: 'Query', teams: Array<{ __typename?: 'Team', id: string, name: string, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: string, position: Types.PlayerPosition, imageUrl?: string | null }> }> };


export const GetPlayersStandingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPlayersStandings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GetPlayersStandingsQuery, GetPlayersStandingsQueryVariables>;