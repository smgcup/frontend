import * as Types from '../../generated/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type GetTopPredictionsByRoundQueryVariables = Types.Exact<{
  round: Types.Scalars['Int']['input'];
}>;


export type GetTopPredictionsByRoundQuery = { __typename?: 'Query', topPredictionsByRound: Array<{ __typename?: 'MatchTopPredictions', matchId: string, topPredictions: Array<{ __typename?: 'PopularPrediction', predictedScore1: number, predictedScore2: number, percentage: number }> }> };


export const GetTopPredictionsByRoundDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTopPredictionsByRound"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"round"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topPredictionsByRound"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"round"},"value":{"kind":"Variable","name":{"kind":"Name","value":"round"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"matchId"}},{"kind":"Field","name":{"kind":"Name","value":"topPredictions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"predictedScore1"}},{"kind":"Field","name":{"kind":"Name","value":"predictedScore2"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}}]}}]}}]}}]} as unknown as DocumentNode<GetTopPredictionsByRoundQuery, GetTopPredictionsByRoundQueryVariables>;