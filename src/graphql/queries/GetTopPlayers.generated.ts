import * as Types from '../../generated/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type GetTopPlayersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetTopPlayersQuery = { __typename?: 'Query', topPlayers: Array<{ __typename?: 'Player', id: string, lastName: string, firstName: string, team: { __typename?: 'Team', id: string, name: string }, stats: { __typename?: 'Stats', goals: number, yellowCards: number, redCards: number, ownGoals: number } }> };


export const GetTopPlayersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTopPlayers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topPlayers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"goals"}},{"kind":"Field","name":{"kind":"Name","value":"yellowCards"}},{"kind":"Field","name":{"kind":"Name","value":"redCards"}},{"kind":"Field","name":{"kind":"Name","value":"ownGoals"}}]}}]}}]}}]} as unknown as DocumentNode<GetTopPlayersQuery, GetTopPlayersQueryVariables>;