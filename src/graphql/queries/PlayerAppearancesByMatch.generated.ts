import * as Types from '../../generated/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type PlayerAppearancesByMatchQueryVariables = Types.Exact<{
  matchId: Types.Scalars['String']['input'];
}>;


export type PlayerAppearancesByMatchQuery = { __typename?: 'Query', playerAppearancesByMatch: Array<{ __typename?: 'PlayerAppearance', playerId: string, matchId: string, level: number, player: { __typename?: 'Player', id: string, firstName: string, lastName: string, position: Types.PlayerPosition } }> };


export const PlayerAppearancesByMatchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PlayerAppearancesByMatch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"matchId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playerAppearancesByMatch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"matchId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"matchId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playerId"}},{"kind":"Field","name":{"kind":"Name","value":"matchId"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}}]}}]} as unknown as DocumentNode<PlayerAppearancesByMatchQuery, PlayerAppearancesByMatchQueryVariables>;