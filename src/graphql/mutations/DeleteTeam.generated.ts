import * as Types from '../../generated/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type DeleteTeamMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;


export type DeleteTeamMutation = { __typename?: 'Mutation', deleteTeam: { __typename?: 'Team', id: string } };


export const DeleteTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteTeamMutation, DeleteTeamMutationVariables>;