const fs = require('fs');
const path = require('path');

// Going up from Arq.tvs to GitHub then to review
const PAGES_DIR = path.resolve(__dirname, '../review/src/pages');

function getFiles(dir) {
    if (!fs.existsSync(dir)) {
        console.error(`Directory ${dir} does not exist`);
        return [];
    }
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            // results = results.concat(getFiles(filePath));
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            if (!file.includes('.backup')) {
                results.push(filePath);
            }
        }
    });
    return results;
}

const files = getFiles(PAGES_DIR);
console.log(`Found ${files.length} files`);

files.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    if (content.includes('console.log("VIEW_DEBUG:')) {
        console.log(`Skipping ${fileName} (already has log)`);
        return;
    }

    // Improved regex to handle multi-line imports and various styles
    const importRegex = /^import\s+[\s\S]*?\s+from\s+['"](.*?)['"];?|^import\s+['"](.*?)['"];?/gm;
    let match;
    const dependencies = [];
    
    // Using a simpler approach to find paths: match anything between '...' or "..." after 'from' or direct imports
    const simpleImportRegex = /from\s+['"](.*?)['"]|import\s+['"](.*?)['"]/g;
    
    while ((match = simpleImportRegex.exec(content)) !== null) {
        dependencies.push(match[1] || match[2]);
    }

    const logStatement = `\nconsole.log("VIEW_DEBUG: ${fileName}", "Dependencies:", ${JSON.stringify(dependencies, null, 2)});\n`;
    
    const lines = content.split('\n');
    let lastImportIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('import ')) {
            lastImportIndex = i;
        }
    }

    if (lastImportIndex !== -1) {
        // Find the actual end of the import (might be multi-line)
        // For simplicity, we'll just insert after the last line that starts with 'import'
        lines.splice(lastImportIndex + 1, 0, logStatement);
        content = lines.join('\n');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${fileName}`);
    } else {
        content = logStatement + content;
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${fileName} (prepended)`);
    }
});
