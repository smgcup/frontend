import * as Types from '../../generated/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type DeleteMatchMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;


export type DeleteMatchMutation = { __typename?: 'Mutation', deleteMatch: { __typename?: 'Match', id: string } };


export const DeleteMatchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteMatch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMatch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteMatchMutation, DeleteMatchMutationVariables>;