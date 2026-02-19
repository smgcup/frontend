import * as Types from '../../generated/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type GetFantasyPlayersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetFantasyPlayersQuery = { __typename?: 'Query', fantasyPlayers: Array<{ __typename?: 'FantasyPlayer', playerId: string, displayName?: string | null, price: number, player: { __typename?: 'Player', id: string, firstName: string, lastName: string, position: Types.PlayerPosition, team: { __typename?: 'Team', name: string } } }> };


export const GetFantasyPlayersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFantasyPlayers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fantasyPlayers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playerId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetFantasyPlayersQuery, GetFantasyPlayersQueryVariables>;