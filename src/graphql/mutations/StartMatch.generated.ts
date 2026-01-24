import * as Types from '../../generated/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type StartMatchMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;


export type StartMatchMutation = { __typename?: 'Mutation', startMatch: { __typename?: 'Match', id: string, status: Types.MatchStatus, score1?: number | null, score2?: number | null, firstOpponent: { __typename?: 'Team', id: string, name: string }, secondOpponent: { __typename?: 'Team', id: string, name: string } } };


export const StartMatchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartMatch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startMatch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"score1"}},{"kind":"Field","name":{"kind":"Name","value":"score2"}},{"kind":"Field","name":{"kind":"Name","value":"firstOpponent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"secondOpponent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<StartMatchMutation, StartMatchMutationVariables>;