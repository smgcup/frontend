import { ApolloLink } from '@apollo/client';
import { getMainDefinition, Observable } from '@apollo/client/utilities';
import { print } from 'graphql';

type OperationKind = 'query' | 'mutation' | 'subscription' | 'unknown';

function getOperationKind(query: unknown): OperationKind {
  const def = getMainDefinition(query as never);
  if (def.kind !== 'OperationDefinition') return 'unknown';
  if (def.operation === 'query') return 'query';
  if (def.operation === 'mutation') return 'mutation';
  if (def.operation === 'subscription') return 'subscription';
  return 'unknown';
}

function getOperationEmoji(kind: OperationKind): string {
  switch (kind) {
    case 'query':
      return '🔵';
    case 'mutation':
      return '🟣';
    case 'subscription':
      return '🟢';
    default:
      return '⚪️';
  }
}

/**
 * Logs every GraphQL operation (query/mutation/subscription) in a grouped format.
 * Format: 🔵 GraphQL QUERY: GetTeams  Query: query GetTeams { ... }  Variables: { ... }
 */
export function createGraphQLLoggerLink(): ApolloLink {
  return new ApolloLink((operation, forward) => {
    const kind = getOperationKind(operation.query);
    const opName =
      operation.operationName ||
      (() => {
        const def = getMainDefinition(operation.query as never);
        if (def.kind === 'OperationDefinition' && def.name?.value) return def.name.value;
        return 'Anonymous';
      })();

    const emoji = getOperationEmoji(kind);
    const operationType = kind.toUpperCase();
    const queryString = print(operation.query);
    const variables = operation.variables ?? {};

    // Log in grouped format as requested
    // eslint-disable-next-line no-console
    console.group(`${emoji} GraphQL ${operationType}: ${opName}`);
    // eslint-disable-next-line no-console
    console.log('Query:', queryString);
    // eslint-disable-next-line no-console
    console.log('Variables:', variables);
    // eslint-disable-next-line no-console
    console.groupEnd();

    if (!forward) {
      return new Observable((observer) => {
        observer.complete();
      });
    }

    return forward(operation);
  });
}

