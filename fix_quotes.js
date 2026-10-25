import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Match single quotes containing HOS
  const regex = /'([^'\n]*ANUSHKA)'S ATELIER([^'\n]*)'/g;
  
  let newContent = content.replace(regex, (match, p1, p2) => {
    return `"${p1}'S ATELIER${p2}"`;
  });

  // Also replace any specific single quote instances
  newContent = newContent.replace(/"HOS"/g, '"ANUSHKA\'S ATELIER"');
  newContent = newContent.replace(/"HOS — House of Simons"/g, '"ANUSHKA\'S ATELIER — House of Simons"');

  if (newContent !== content) {
    console.log(`Fixed quotes in: ${filePath}`);
    fs.writeFileSync(filePath, newContent, 'utf8');
  }
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        processDir(fullPath);
      }
    } else {
      const ext = path.extname(file);
      if (ext === '.js' || ext === '.jsx') {
        fixFile(fullPath);
      }
    }
  }
}

processDir(path.resolve(__dirname));
console.log('Quote fixes finished.');
