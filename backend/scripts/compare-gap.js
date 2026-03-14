const { Client } = require('pg');
require('dotenv').config();

// Tools from the gap analysis that were suggested
const gapAnalysisTools = [
  // Chat
  'Mistral Le Chat', 'Meta AI', 'Pi (Inflection)', 'Chatsonic', 'Jasper Chat', 'HuggingChat',
  // Image
  'Ideogram', 'Flux', 'Playground AI', 'Canva Magic Studio', 'Freepik AI', 'Craiyon', 'NightCafe', 'ImagineArt', 'Krea AI',
  // Video
  'HeyGen', 'Fliki', 'Descript', 'OpusClip', 'Filmora AI', 'Google Veo', 'PixVerse', 'Luma Dream Machine', 'InVideo AI',
  // Audio
  'Murf AI', 'Speechify', 'WellSaid Labs', 'Respeecher', 'Altered', 'Otter.ai',
  // Coding
  'Tabnine', 'Amazon CodeWhisperer', 'Codeium', 'Replit AI', 'AskCodi', 'v0 by Vercel', 'Kiro', 'Trae',
  // Agent
  'CrewAI', 'LangChain', 'OpenAI Agents SDK', 'Microsoft AutoGen', 'Lindy AI', 'Taskade AI', 'Relevance AI', 'Bland AI',
  // Writing
  'Grammarly', 'Rytr', 'Writesonic', 'Sudowrite', 'Anyword', 'Wordtune', 'ProWritingAid', 'Hemingway Editor', 'QuillBot',
  // Design
  'Figma AI', 'Framer', 'Looka', 'Designs.ai', 'Khroma', 'Beautiful.ai', 'Galileo AI', 'Uizard',
  // Productivity
  'Fireflies.ai', 'Reclaim.ai', 'Motion', 'Clockwise', 'ClickUp AI', 'Asana AI', 'Taskade', 'Zapier AI', 'Make.com', 'n8n',
  // Research
  'Elicit', 'Consensus', 'Semantic Scholar', 'Surfer SEO', 'Frase.io', 'MarketMuse', 'Ahrefs AI',
  // 3D
  'Meshy AI', 'Tripo AI', 'Luma AI', 'Rodin (Deemos)', 'Kaedim', '3D AI Studio', 'Masterpiece Studio',
  // Social Media
  'Buffer', 'Hootsuite', 'FeedHive', 'Vista Social', 'Predis.ai', 'SocialPilot', 'Publer',
  // Education
  'Khanmigo', 'Duolingo Max', 'Quizlet AI', 'Socratic', 'Photomath', 'ProProfs LMS',
  // Business
  'HubSpot AI', 'Gong.io', 'Intercom Fin', 'Tidio', 'Drift', 'Salesforce Einstein', 'Lavender',
];

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL_IPV4_SESSION_POOLER });
  await client.connect();
  const { rows } = await client.query('SELECT name FROM tools');
  const dbNames = rows.map(r => r.name.toLowerCase());

  console.log('=== STILL MISSING (from gap analysis) ===\n');
  const missing = [];
  const added = [];
  for (const tool of gapAnalysisTools) {
    const found = dbNames.some(n =>
      n.includes(tool.toLowerCase().split(' (')[0]) ||
      tool.toLowerCase().split(' (')[0].includes(n)
    );
    if (!found) {
      missing.push(tool);
    } else {
      added.push(tool);
    }
  }

  console.log('Added (' + added.length + '):', added.join(', '));
  console.log('\nStill missing (' + missing.length + '):');
  missing.forEach(t => console.log('  ✗', t));

  await client.end();
})();
