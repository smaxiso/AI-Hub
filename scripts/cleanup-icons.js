// Clean up remaining base64 icons and fix duplicates
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toolsFile = path.join(__dirname, '../src/data/tools.js');

// Read the file
let content = fs.readFileSync(toolsFile, 'utf8');

// Remove all remaining base64 icon lines (they span multiple lines)
// Match: icon: 'data:image/png;base64,XXXXX',
content = content.replace(/icon:\s*'data:image\/png;base64,[^']*',?\s*\n/g, '');

// Fix duplicate icon entries (keep Clearbit ones)
// This regex finds patterns where there are two icon: lines for the same tool
content = content.replace(/(icon:\s*'https:\/\/logo\.clearbit\.com\/[^']+',)\s*\n\s*name:/g, '$1\n    name:');

// Fix any leftover duplicate patterns
const lines = content.split('\n');
const cleaned = [];
let skipNext = false;

for (let i = 0; i < lines.length; i++) {
  if (skipNext) {
    skipNext = false;
    continue;
  }
  
  const line = lines[i];
  
  // Skip empty icon lines
  if (line.trim().match(/^icon:\s*,?\s*$/)) {
    continue;
  }
  
  // Check for duplicate icon: entries
  if (line.includes("icon: '")) {
    // Look ahead to see if next line is also icon
    if (i + 1 < lines.length && lines[i + 1].includes("icon: '")) {
      // Keep the Clearbit one
      if (line.includes('clearbit')) {
        cleaned.push(line);
        skipNext = true;
      } else if (lines[i + 1].includes('clearbit')) {
        skipNext = true;
        cleaned.push(lines[i + 1]);
        i++; // Skip ahead
      }
      continue;
    }
  }
  
  cleaned.push(line);
}

// Write back
fs.writeFileSync(toolsFile, cleaned.join('\n'), 'utf8');

console.log('✅ Cleaned up remaining base64 icons and fixed duplicates');
