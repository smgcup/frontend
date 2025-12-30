import * as Types from '../../generated/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AdminCreatePlayerMutationVariables = Types.Exact<{
  createPlayerDto: Types.CreatePlayerDto;
}>;


export type AdminCreatePlayerMutation = { __typename?: 'Mutation', createPlayer: { __typename?: 'Player', id: string } };


export const AdminCreatePlayerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AdminCreatePlayer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createPlayerDto"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePlayerDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPlayer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createPlayerDto"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createPlayerDto"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AdminCreatePlayerMutation, AdminCreatePlayerMutationVariables>;