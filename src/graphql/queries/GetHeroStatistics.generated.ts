import * as Types from '../../generated/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type GetHeroStatisticsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetHeroStatisticsQuery = { __typename?: 'Query', statistics: { __typename?: 'StatisticsOutput', teamsCount: number, matchesPlayedCount: number, totalGoals: number } };


export const GetHeroStatisticsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetHeroStatistics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"statistics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamsCount"}},{"kind":"Field","name":{"kind":"Name","value":"matchesPlayedCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalGoals"}}]}}]}}]} as unknown as DocumentNode<GetHeroStatisticsQuery, GetHeroStatisticsQueryVariables>;