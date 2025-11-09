// Script to replace all base64 icons with Clearbit URLs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toolsFile = path.join(__dirname, '../src/data/tools.js');

// Read the file
let content = fs.readFileSync(toolsFile, 'utf8');

// Domain mapping for special cases
const domainMap = {
  'perplexity': 'perplexity.ai',
  'claude': 'anthropic.com',
  'microsoft-copilot': 'microsoft.com',
  'stable-diffusion': 'stability.ai',
  'bing-image-creator': 'bing.com',
  'leonardo-ai': 'leonardo.ai',
  'pixabay-music': 'pixabay.com',
  'uberduck': 'uberduck.ai',
  'adobe-enhance': 'adobe.com',
  'runway': 'runwayml.com',
  'd-id-video': 'd-id.com',
  'agentgpt': 'reworkd.ai',
  'prompt-engineering': 'promptengineering.org',
  'wisdolia': 'wisdolia.com',
  'tome': 'tome.app',
  'pdfgear': 'pdfgear.com',
  'simplified': 'simplified.com',
  'chat-d-id': 'd-id.com',
  'promptbase': 'promptbase.com',
  'phcode': 'phcode.dev',
  'nvidia-canvas': 'nvidia.com',
  'ask-your-pdf': 'askyourpdf.com',
  'gamma': 'gamma.app'
};

// Replace base64 icons with Clearbit URLs
const lines = content.split('\n');
let inTool = false;
let currentId = '';
let iconLineIndex = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Detect tool ID
  if (line.includes("id: '") || line.includes('id: "')) {
    const match = line.match(/id:\s*['"]([^'"]+)['"]/);
    if (match) {
      currentId = match[1];
      inTool = true;
    }
  }
  
  // Find icon line with base64
  if (inTool && line.includes("icon: 'data:image/png;base64,")) {
    // Extract domain from URL or use mapping
    let domain = '';
    
    // Look ahead to find URL
    for (let j = i - 5; j < i + 5 && j < lines.length; j++) {
      if (lines[j].includes("url: '") || lines[j].includes('url: "')) {
        const urlMatch = lines[j].match(/url:\s*['"]https?:\/\/(?:www\.)?([^/'"]+)/);
        if (urlMatch) {
          domain = urlMatch[1];
          break;
        }
      }
    }
    
    // Use domain mapping if available
    if (domainMap[currentId]) {
      domain = domainMap[currentId];
    }
    
    if (domain) {
      // Find the end of the base64 string
      let endIndex = i;
      while (endIndex < lines.length && !lines[endIndex].includes("',")) {
        endIndex++;
      }
      
      // Replace all lines from icon line to end with single line
      const indent = line.match(/^\s*/)[0];
      const newIconLine = `${indent}icon: 'https://logo.clearbit.com/${domain}',`;
      lines.splice(i, endIndex - i + 1, newIconLine);
    }
    
    inTool = false;
  }
  
  // Reset when we hit next tool or end of tool
  if (line.includes('  },') || line.includes('  }')) {
    inTool = false;
    currentId = '';
  }
}

// Write back
const newContent = lines.join('\n');
fs.writeFileSync(toolsFile, newContent, 'utf8');

console.log('✅ All base64 icons replaced with Clearbit URLs');
