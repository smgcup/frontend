/**
 * Returns a GraphQL URL suitable for the browser.
 * If the env is relative ("/graphql"), keep it relative.
 */
export function getBrowserGraphqlEndpoint() {
  return process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? '/graphql';
}


