import * as Types from '../../generated/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type UpdateFantasyPlayerMutationVariables = Types.Exact<{
  playerId: Types.Scalars['String']['input'];
  updateFantasyPlayerDto: Types.UpdateFantasyPlayerDto;
}>;


export type UpdateFantasyPlayerMutation = { __typename?: 'Mutation', updateFantasyPlayer: { __typename?: 'FantasyPlayer', playerId: string, displayName: string, price: number } };


export const UpdateFantasyPlayerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateFantasyPlayer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"playerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateFantasyPlayerDto"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateFantasyPlayerDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFantasyPlayer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"playerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"playerId"}}},{"kind":"Argument","name":{"kind":"Name","value":"updateFantasyPlayerDto"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateFantasyPlayerDto"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playerId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}}]} as unknown as DocumentNode<UpdateFantasyPlayerMutation, UpdateFantasyPlayerMutationVariables>;