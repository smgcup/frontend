import * as Types from '../../generated/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type UpdateNewsMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
  updateNewsDto: Types.UpdateNewsDto;
}>;


export type UpdateNewsMutation = { __typename?: 'Mutation', updateNews: boolean };


export const UpdateNewsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateNewsDto"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateNewsDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"updateNewsDto"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateNewsDto"}}}]}]}}]} as unknown as DocumentNode<UpdateNewsMutation, UpdateNewsMutationVariables>;