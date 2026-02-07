import * as Types from '../../generated/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CreateFantasyPlayerMutationVariables = Types.Exact<{
  createFantasyPlayerDto: Types.CreateFantasyPlayerDto;
}>;


export type CreateFantasyPlayerMutation = { __typename?: 'Mutation', createFantasyPlayer: { __typename?: 'FantasyPlayer', playerId: string, displayName: string, price: number } };


export const CreateFantasyPlayerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateFantasyPlayer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createFantasyPlayerDto"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateFantasyPlayerDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFantasyPlayer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createFantasyPlayerDto"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createFantasyPlayerDto"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playerId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}}]} as unknown as DocumentNode<CreateFantasyPlayerMutation, CreateFantasyPlayerMutationVariables>;