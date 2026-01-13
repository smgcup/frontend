import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.GRAPHQL_SCHEMA_URL || 'http://localhost:4000/graphql',
  // Optional: Add headers for authentication
  // @ts-expect-error - headers exist but aren't typed in CodegenConfig
  headers: {
    Authorization: process.env.GRAPHQL_AUTH_TOKEN || '',
    // Add other headers as needed
  },
  config: {
    // Enable if your schema has deprecated fields
    inputValueDeprecation: true,
    scalars: {
      DateTime: 'string',
      Date: 'string',
    },
  },
  documents: ['src/graphql/**/*.graphql'],
  generates: {
    // Generate base types from schema
    'src/generated/types.ts': {
      plugins: ['typescript'],
    },
    // Generate operation-specific types next to each .graphql file
    'src/graphql/': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.ts',
        baseTypesPath: '../generated/types',
      },
      plugins: ['typescript-operations', 'typed-document-node'],
      config: {
        inputValueDeprecation: true,
      },
    },
  },
};

export default config;
