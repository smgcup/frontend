import * as Types from '../../generated/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type MatchesQueryVariables = Types.Exact<{ [key: string]: never }>;

export type MatchesQuery = {
  __typename?: 'Query';
  matches: Array<{
    __typename?: 'Match';
    id: string;
    date: any;
    status: Types.MatchStatus;
    score1?: number | null;
    score2?: number | null;
    firstOpponent: { __typename?: 'Team'; id: string; name: string };
    secondOpponent: { __typename?: 'Team'; id: string; name: string };
  }>;
};

export const MatchesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Matches' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'matches' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'date' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'score1' } },
                { kind: 'Field', name: { kind: 'Name', value: 'score2' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'firstOpponent' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'secondOpponent' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MatchesQuery, MatchesQueryVariables>;


