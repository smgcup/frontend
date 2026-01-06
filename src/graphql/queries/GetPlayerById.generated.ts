import * as Types from '../../generated/types';

import { gql } from '@apollo/client';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

export type PlayerByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;

export type PlayerByIdQuery = {
  __typename?: 'Query';
  playerById: {
    __typename?: 'Player';
    id: string;
    firstName: string;
    lastName: string;
    yearOfBirth: number;
    height: number;
    weight: number;
    imageUrl?: string | null;
    prefferedFoot: Types.PreferredFoot;
    position: Types.PlayerPosition;
    team: { __typename?: 'Team'; id: string; name: string };
  };
};

export const PlayerByIdDocument = gql`
  query PlayerById($id: String!) {
    playerById(id: $id) {
      id
      firstName
      lastName
      yearOfBirth
      height
      weight
      imageUrl
      prefferedFoot
      position
      team {
        id
        name
      }
    }
  }
` as unknown as DocumentNode<PlayerByIdQuery, PlayerByIdQueryVariables>;


