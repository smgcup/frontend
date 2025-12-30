import * as Types from '../../generated/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AdminCreateTeamMutationVariables = Types.Exact<{
  createTeamDto: Types.CreateTeamDto;
}>;


export type AdminCreateTeamMutation = { __typename?: 'Mutation', createTeam: { __typename?: 'Team', name: string } };


export const AdminCreateTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AdminCreateTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createTeamDto"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTeamDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createTeamDto"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createTeamDto"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AdminCreateTeamMutation, AdminCreateTeamMutationVariables>;