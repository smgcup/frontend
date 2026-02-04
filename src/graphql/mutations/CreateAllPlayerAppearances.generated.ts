import * as Types from '../../generated/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CreateAllPlayerAppearancesMutationVariables = Types.Exact<{
  input: Types.CreateAllPlayerAppearancesDto;
}>;


export type CreateAllPlayerAppearancesMutation = { __typename?: 'Mutation', createAllPlayerAppearances: Array<{ __typename?: 'PlayerAppearance', playerId: string, matchId: string, level: number }> };


export const CreateAllPlayerAppearancesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAllPlayerAppearances"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAllPlayerAppearancesDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAllPlayerAppearances"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playerId"}},{"kind":"Field","name":{"kind":"Name","value":"matchId"}},{"kind":"Field","name":{"kind":"Name","value":"level"}}]}}]}}]} as unknown as DocumentNode<CreateAllPlayerAppearancesMutation, CreateAllPlayerAppearancesMutationVariables>;