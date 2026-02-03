import { ApolloLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { print } from 'graphql';

/** Remove Apollo-injected __typename from printed query for cleaner logs. */
function stripTypenameFromQuery(printed: string): string {
  return printed.replace(/^\s*__typename\s*$/gm, '').replace(/\n{3,}/g, '\n\n');
}

/**
 * Apollo link that logs every GraphQL operation to the console in a grouped format.
 * Use in development to trace GraphQL operations.
 */
export const apolloLoggingLink = new ApolloLink((operation, forward) => {
  const definition = getMainDefinition(operation.query);
  if (definition.kind === 'OperationDefinition') {
    const { operation: opType, name } = definition;
    const operationName = name?.value ?? 'anonymous';
    const opLabel = opType.toUpperCase();
    const queryString = stripTypenameFromQuery(print(operation.query));

    console.group(`🔵 GraphQL ${opLabel}: ${operationName}`);
    console.log('Query:', queryString);
    console.log('Variables:', operation.variables);
    console.groupEnd();
  }
  return forward(operation);
});
