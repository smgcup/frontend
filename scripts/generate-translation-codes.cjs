const fs = require('fs'); // eslint-disable-line @typescript-eslint/no-require-imports
const path = require('path'); // eslint-disable-line @typescript-eslint/no-require-imports

const BACKEND_URL = 'http://localhost:4000';

async function generate() {
  const response = await fetch(`${BACKEND_URL}/generator/translation-codes`);

  if (!response.ok) {
    throw new Error(`Failed to fetch translation codes: ${response.status}`);
  }

  const codes = await response.json();

  const output = `// Auto-generated from backend - DO NOT EDIT
// Run: npm run codegen:translations

export const TRANSLATION_CODES = {
${codes.map((code) => `  ${code}: '${code}',`).join('\n')}
} as const;

export type TranslationCode = (typeof TRANSLATION_CODES)[keyof typeof TRANSLATION_CODES];
`;

  const outputPath = path.resolve(__dirname, '../src/generated/translation-codes.ts');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, output);

  console.log(`✓ Generated ${codes.length} translation codes`);
}

generate().catch((err) => {
  console.error('Failed to generate translation codes:', err.message);
  process.exit(1);
});
