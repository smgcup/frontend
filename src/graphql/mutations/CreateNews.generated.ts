import * as Types from '../../generated/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CreateNewsMutationVariables = Types.Exact<{
  createNewsDto: Types.CreateNewsDto;
}>;


export type CreateNewsMutation = { __typename?: 'Mutation', createNews: { __typename?: 'News', id: string } };


export const CreateNewsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createNewsDto"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateNewsDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createNewsDto"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createNewsDto"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateNewsMutation, CreateNewsMutationVariables>;