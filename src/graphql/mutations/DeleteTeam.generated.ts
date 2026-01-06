import * as Types from '../../generated/types';

import { gql } from '@apollo/client';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

export type DeleteTeamMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;

export type DeleteTeamMutation = {
  __typename?: 'Mutation';
  deleteTeam: { __typename?: 'Team'; id: string };
};

export const DeleteTeamDocument = gql`
  mutation DeleteTeam($id: String!) {
    deleteTeam(id: $id) {
      id
    }
  }
` as unknown as DocumentNode<DeleteTeamMutation, DeleteTeamMutationVariables>;


