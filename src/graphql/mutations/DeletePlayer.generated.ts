import * as Types from '../../generated/types';

import { gql } from '@apollo/client';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

export type DeletePlayerMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;

export type DeletePlayerMutation = {
  __typename?: 'Mutation';
  deletePlayer: { __typename?: 'Player'; id: string };
};

export const DeletePlayerDocument = gql`
  mutation DeletePlayer($id: String!) {
    deletePlayer(id: $id) {
      id
    }
  }
` as unknown as DocumentNode<DeletePlayerMutation, DeletePlayerMutationVariables>;


