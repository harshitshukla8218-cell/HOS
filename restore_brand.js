import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const searchAndReplace = [
  { search: /HOS10/g, replace: 'HOS10' },
  { search: /HOS-/g, replace: 'HOS-' },
  { search: /HOS/g, replace: 'HOS' },
  { search: /House of Simons/g, replace: 'House of Simons' },
  { search: /Anushka\'s Atelier/g, replace: 'House of Simons' },
  { search: /HOUSE OF SIMONS/g, replace: 'HOUSE OF SIMONS' },
  { search: /House of Simons/g, replace: 'House of Simons' },
  { search: /hos.com/g, replace: 'hos.com' },
  { search: /@houseofsimons/g, replace: '@houseofsimons' },
  { search: /hos_token/g, replace: 'hos_token' },
  { search: /hos_cart/g, replace: 'hos_cart' },
  { search: /hos_wishlist/g, replace: 'hos_wishlist' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== '.gemini') {
        processDir(fullPath);
      }
    } else {
      const ext = path.extname(file);
      if (['.js', '.jsx', '.html', '.css', '.json'].includes(ext)) {
        if (file === 'package-lock.json' || file === 'database.json') continue;
        
        let content = fs.readFileSync(fullPath, 'utf8');
        let original = content;
        for (const rule of searchAndReplace) {
          content = content.replace(rule.search, rule.replace);
        }
        if (content !== original) {
          console.log(`Reverted: ${fullPath}`);
          fs.writeFileSync(fullPath, content, 'utf8');
        }
      }
    }
  }
}

console.log('Restoring brand name to HOS — House of Simons...');
processDir(path.resolve(__dirname));
console.log('Restoration finished.');
