import * as Types from '../../generated/types';

import { gql } from '@apollo/client';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

export type UpdateTeamMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
  dto: Types.UpdateTeamDto;
}>;

export type UpdateTeamMutation = {
  __typename?: 'Mutation';
  updateTeam: { __typename?: 'Team'; id: string; name: string; createdAt: any };
};

export const UpdateTeamDocument = gql`
  mutation UpdateTeam($id: String!, $dto: UpdateTeamDto!) {
    updateTeam(id: $id, updateTeamDto: $dto) {
      id
      name
      createdAt
    }
  }
` as unknown as DocumentNode<UpdateTeamMutation, UpdateTeamMutationVariables>;


