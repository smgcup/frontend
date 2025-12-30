const fs = require('fs'); // eslint-disable-line @typescript-eslint/no-require-imports
const path = require('path'); // eslint-disable-line @typescript-eslint/no-require-imports

const queryFilePath = path.join(__dirname, '../src/generated/types.ts');

function generateQueriesEnum() {
    let fileContent;

    try {
        fileContent = fs.readFileSync(queryFilePath, 'utf8');
    } catch (err) {
        console.error('Error reading types.ts:', err.message);
        process.exit(1);
    }

    // Check if enum already exists
    if (fileContent.includes('export enum Queries {')) {
        console.log('⏭️  Queries enum already exists, skipping generation');
        return;
    }

    let enumContent = '\n\nexport enum Queries {\n';
    let inQueryType = false;
    const queries = [];

    // Parse line by line
    fileContent.split('\n').forEach((line) => {
        // Detect the start of the Query type
        if (line.includes('export type Query = {')) {
            inQueryType = true;
            return;
        }

        // Exit the Query type block at the closing brace
        if (inQueryType && line.includes('};')) {
            inQueryType = false;
            return;
        }

        // Capture each property within the Query type block
        if (inQueryType) {
            // Handle optional fields with ? and regular fields
            const match = line.trim().match(/^(\w+)\s*[?:]?\s*:/);
            if (match) {
                const queryName = match[1];
                queries.push(queryName);
                enumContent += `  ${queryName} = '${queryName}',\n`;
            }
        }
    });

    enumContent += '}\n';

    if (queries.length === 0) {
        console.warn('⚠️  No queries found in types.ts');
        return;
    }

    // Append the generated enum to types.ts
    fs.appendFileSync(queryFilePath, enumContent, 'utf8');
    console.log(`✅ Generated Queries enum with ${queries.length} queries`);
}

generateQueriesEnum();
