import * as Types from '../../generated/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type GetFantasyPlayersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetFantasyPlayersQuery = { __typename?: 'Query', fantasyPlayers: Array<{ __typename?: 'FantasyPlayer', playerId: string, displayName: string, price: number }> };


export const GetFantasyPlayersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFantasyPlayers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fantasyPlayers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playerId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}}]} as unknown as DocumentNode<GetFantasyPlayersQuery, GetFantasyPlayersQueryVariables>;