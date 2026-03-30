import * as Types from '../../generated/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CalculateMatchPointsMutationVariables = Types.Exact<{
  matchId: Types.Scalars['String']['input'];
}>;


export type CalculateMatchPointsMutation = { __typename?: 'Mutation', calculateMatchPoints: { __typename?: 'Match', id: string, pointsCalculated: boolean } };


export const CalculateMatchPointsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CalculateMatchPoints"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"matchId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculateMatchPoints"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"matchId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"matchId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pointsCalculated"}}]}}]}}]} as unknown as DocumentNode<CalculateMatchPointsMutation, CalculateMatchPointsMutationVariables>;