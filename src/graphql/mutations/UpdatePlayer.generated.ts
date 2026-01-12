import * as Types from '../../generated/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type UpdatePlayerMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
  dto: Types.UpdatePlayerDto;
}>;


export type UpdatePlayerMutation = { __typename?: 'Mutation', updatePlayer: { __typename?: 'Player', id: string } };


export const UpdatePlayerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePlayer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dto"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePlayerDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePlayer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"updatePlayerDto"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dto"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdatePlayerMutation, UpdatePlayerMutationVariables>;