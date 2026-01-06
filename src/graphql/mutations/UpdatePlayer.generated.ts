import * as Types from '../../generated/types';

import { gql } from '@apollo/client';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

export type UpdatePlayerMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
  dto: Types.UpdatePlayerDto;
}>;

export type UpdatePlayerMutation = {
  __typename?: 'Mutation';
  updatePlayer: { __typename?: 'Player'; id: string };
};

export const UpdatePlayerDocument = gql`
  mutation UpdatePlayer($id: String!, $dto: UpdatePlayerDto!) {
    updatePlayer(id: $id, updatePlayerDto: $dto) {
      id
    }
  }
` as unknown as DocumentNode<UpdatePlayerMutation, UpdatePlayerMutationVariables>;


