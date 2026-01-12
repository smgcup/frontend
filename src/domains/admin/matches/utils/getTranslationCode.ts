export const getTranslationCode = (e: unknown) => {
  if (!e || typeof e !== 'object') return null;
  const graphQLErrors = (e as { graphQLErrors?: unknown }).graphQLErrors;
  if (!Array.isArray(graphQLErrors) || graphQLErrors.length === 0) return null;
  const first = graphQLErrors[0] as { extensions?: unknown };
  const code = (first.extensions as { translationCode?: unknown } | undefined)?.translationCode;
  if (typeof code === 'string') return code;
  return null;
};
