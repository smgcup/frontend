import * as Types from '../../generated/types';

import { gql } from '@apollo/client';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

export type TeamByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;

export type TeamByIdQuery = {
  __typename?: 'Query';
  teamById: {
    __typename?: 'Team';
    id: string;
    name: string;
    createdAt: any;
    players?: Array<{ __typename?: 'Player'; id: string; firstName: string; lastName: string }> | null;
  };
};

export const TeamByIdDocument = gql`
  query TeamById($id: String!) {
    teamById(id: $id) {
      id
      name
      createdAt
      players {
        id
        firstName
        lastName
      }
    }
  }
` as unknown as DocumentNode<TeamByIdQuery, TeamByIdQueryVariables>;


