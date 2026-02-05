import * as Types from '../../generated/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type GetTopPlayersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetTopPlayersQuery = { __typename?: 'Query', topPlayers: Array<{ __typename?: 'TopPlayerOutput', id: string, name: string, teamId: string, teamName: string, position: Types.PlayerPosition, goals: number, assists: number, yellowCards: number, redCards: number, ownGoals: number }> };


export const GetTopPlayersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTopPlayers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topPlayers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"teamName"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"goals"}},{"kind":"Field","name":{"kind":"Name","value":"assists"}},{"kind":"Field","name":{"kind":"Name","value":"yellowCards"}},{"kind":"Field","name":{"kind":"Name","value":"redCards"}},{"kind":"Field","name":{"kind":"Name","value":"ownGoals"}}]}}]}}]} as unknown as DocumentNode<GetTopPlayersQuery, GetTopPlayersQueryVariables>;