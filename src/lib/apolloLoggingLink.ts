import { ApolloLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

/**
 * Apollo link that logs every query and mutation to the console.
 * Use in development to trace GraphQL operations.
 */
export const apolloLoggingLink = new ApolloLink((operation, forward) => {
  const definition = getMainDefinition(operation.query);
  if (definition.kind === 'OperationDefinition') {
    const { operation: opType, name } = definition;
    const operationName = name?.value ?? 'anonymous';
    console.log(`[Apollo] ${opType} ${operationName}`, {
      variables: operation.variables,
    });
  }
  return forward(operation);
});
