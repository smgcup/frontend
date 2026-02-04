import * as Types from '../../generated/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type GetAdminStatisticsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAdminStatisticsQuery = { __typename?: 'Query', statistics: { __typename?: 'StatisticsOutput', teamsCount: number, playersCount: number, matchesCount: number, newsCount: number } };


export const GetAdminStatisticsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdminStatistics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"statistics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamsCount"}},{"kind":"Field","name":{"kind":"Name","value":"playersCount"}},{"kind":"Field","name":{"kind":"Name","value":"matchesCount"}},{"kind":"Field","name":{"kind":"Name","value":"newsCount"}}]}}]}}]} as unknown as DocumentNode<GetAdminStatisticsQuery, GetAdminStatisticsQueryVariables>;