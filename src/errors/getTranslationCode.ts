import { translationCodesMessages } from './translation-codes-messages';
import { ErrorLike } from '@apollo/client';

type GraphQLErrorWithExtensions = {
  extensions?: {
    originalError?: {
      message?: string | string[];
    };
  };
};

/**
 * Get the translation code message for a given translation code
 * @param error - The error object from Apollo Client
 * @returns The translation code message
 */
export const getTranslationCodeMessage = (error: ErrorLike) => {
  // Apollo Client 4.x uses 'errors' instead of 'graphQLErrors'
  if (error && typeof error === 'object' && 'errors' in error) {
    const errors = (error as { errors?: GraphQLErrorWithExtensions[] }).errors;

    if (Array.isArray(errors) && errors.length > 0) {
      const firstError = errors[0];

      // Check for translation code in extensions.originalError.message
      const originalError = firstError?.extensions?.originalError;
      if (originalError?.message) {
        // Handle both array and string formats
        const message = Array.isArray(originalError.message) ? originalError.message[0] : originalError.message;

        if (message && typeof message === 'string' && message in translationCodesMessages) {
          return translationCodesMessages[message as keyof typeof translationCodesMessages];
        }
      }
    }
  }

  // Fallback for older Apollo Client versions (graphQLErrors)
  if (error && typeof error === 'object' && 'graphQLErrors' in error) {
    const graphQLErrors = (error as { graphQLErrors?: GraphQLErrorWithExtensions[] }).graphQLErrors;

    if (Array.isArray(graphQLErrors) && graphQLErrors.length > 0) {
      const firstError = graphQLErrors[0];
      const originalError = firstError?.extensions?.originalError;
      if (originalError?.message) {
        const message = Array.isArray(originalError.message) ? originalError.message[0] : originalError.message;

        if (message && typeof message === 'string' && message in translationCodesMessages) {
          return translationCodesMessages[message as keyof typeof translationCodesMessages];
        }
      }
    }
  }

  // Final fallback: use error message directly
  const errorMessage = error?.message;
  if (errorMessage && typeof errorMessage === 'string' && errorMessage in translationCodesMessages) {
    return translationCodesMessages[errorMessage as keyof typeof translationCodesMessages];
  }

  return errorMessage || 'Unknown error';
};
