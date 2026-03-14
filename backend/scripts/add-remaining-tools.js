/**
 * Add remaining tools from gap analysis + Social Media category
 * Run from backend/: node scripts/add-remaining-tools.js
 */
const { Client } = require('pg');
require('dotenv').config();

const tryConnect = async () => {
  const connectionStrings = [
    process.env.DATABASE_URL_IPV6,
    process.env.DATABASE_URL_IPV4_SESSION_POOLER,
    process.env.DATABASE_URL_IPV4_TRANSACTION_POOLER
  ].filter(Boolean);
  for (const cs of connectionStrings) {
    const client = new Client({ connectionString: cs });
    try {
      await client.connect();
      console.log('Connected!');
      return client;
    } catch (err) {
      console.warn('Retry...', err.message);
    }
  }
  throw new Error('All connections failed');
};

const newTools = [
  // ── Chat ──
  {
    id: 'chatsonic',
    name: 'Chatsonic',
    url: 'https://writesonic.com/chat',
    category: 'Chat',
    categories: ['Chat', 'Writing'],
    icon: 'https://writesonic.com/favicon.ico',
    description: 'AI chatbot by Writesonic with real-time web access, image generation, and voice commands.',
    tags: ['chatbot', 'web-access', 'voice', 'real-time'],
    pricing: 'Freemium',
    use_cases: ['Conversations', 'Content Writing', 'Research']
  },
  // ── Image ──
  {
    id: 'freepik-ai', name: 'Freepik AI', url: 'https://www.freepik.com/ai',
    category: 'Image', categories: ['Image', 'Design'],
    icon: 'https://www.freepik.com/favicon.ico',
    description: 'AI image generator integrated into Freepik, focused on marketing visuals, mockups, and stock-style imagery.',
    tags: ['image-generation', 'marketing', 'stock', 'mockups'],
    pricing: 'Freemium', use_cases: ['Marketing Visuals', 'Stock Images', 'Mockups']
  },
  {
    id: 'craiyon', name: 'Craiyon', url: 'https://www.craiyon.com/',
    category: 'Image', categories: ['Image'],
    icon: 'https://www.craiyon.com/favicon.ico',
    description: 'Free unlimited AI image generator (formerly DALL-E Mini). Simple interface for quick image creation.',
    tags: ['image-generation', 'free', 'unlimited', 'simple'],
    pricing: 'Free', use_cases: ['Quick Image Generation', 'Fun Creations', 'Memes']
  },
  {
    id: 'nightcafe', name: 'NightCafe', url: 'https://creator.nightcafe.studio/',
    category: 'Image', categories: ['Image'],
    icon: 'https://creator.nightcafe.studio/favicon.ico',
    description: 'Multi-model AI art platform with community features. Supports Stable Diffusion, DALL-E, and more.',
    tags: ['image-generation', 'multi-model', 'community', 'art'],
    pricing: 'Freemium', use_cases: ['AI Art', 'Style Transfer', 'Community Sharing']
  },
  {
    id: 'imagineart', name: 'ImagineArt', url: 'https://www.imagine.art/',
    category: 'Image', categories: ['Image'],
    icon: 'https://www.imagine.art/favicon.ico',
    description: 'Versatile AI image creation tool with multiple styles, real-time generation, and an intuitive editor.',
    tags: ['image-generation', 'styles', 'real-time', 'editor'],
    pricing: 'Freemium', use_cases: ['Image Generation', 'Art Styles', 'Creative Projects']
  },
  // ── Video ──
  {
    id: 'fliki', name: 'Fliki', url: 'https://fliki.ai/',
    category: 'Video', categories: ['Video', 'Audio'],
    icon: 'https://fliki.ai/favicon.ico',
    description: 'Text-to-video platform with AI voiceovers in 75+ languages. Turn blog posts and scripts into videos.',
    tags: ['text-to-video', 'voiceover', 'multilingual', 'content'],
    pricing: 'Freemium', use_cases: ['Blog to Video', 'Social Media Content', 'Explainer Videos']
  },
  {
    id: 'filmora-ai', name: 'Filmora AI', url: 'https://filmora.wondershare.com/',
    category: 'Video', categories: ['Video'],
    icon: 'https://filmora.wondershare.com/favicon.ico',
    description: 'Beginner-friendly video editor with AI features like auto-cut, smart scene detection, and AI copywriting.',
    tags: ['video-editing', 'beginner', 'auto-cut', 'scene-detection'],
    pricing: 'Freemium', use_cases: ['Video Editing', 'YouTube Content', 'Social Media']
  },
  {
    id: 'google-veo', name: 'Google Veo', url: 'https://deepmind.google/technologies/veo/',
    category: 'Video', categories: ['Video'],
    icon: 'https://deepmind.google/favicon.ico',
    description: 'Google DeepMind text-to-video model generating high-quality 1080p videos with cinematic understanding.',
    tags: ['text-to-video', 'google', 'high-quality', 'cinematic'],
    pricing: 'Freemium', use_cases: ['Video Generation', 'Creative Projects', 'Filmmaking']
  },
  {
    id: 'pixverse', name: 'PixVerse', url: 'https://pixverse.ai/',
    category: 'Video', categories: ['Video'],
    icon: 'https://pixverse.ai/favicon.ico',
    description: 'AI video generation platform creating high-quality videos from text and images with anime and realistic styles.',
    tags: ['video-generation', 'anime', 'text-to-video', 'styles'],
    pricing: 'Freemium', use_cases: ['Video Generation', 'Anime Content', 'Creative Videos']
  },
  // ── Audio ──
  {
    id: 'wellsaid-labs', name: 'WellSaid Labs', url: 'https://wellsaidlabs.com/',
    category: 'Audio', categories: ['Audio'],
    icon: 'https://wellsaidlabs.com/favicon.ico',
    description: 'Enterprise AI voice generation with studio-quality voices. Used for e-learning, marketing, and corporate training.',
    tags: ['voice-generation', 'enterprise', 'studio-quality', 'training'],
    pricing: 'Paid', use_cases: ['Enterprise Voiceovers', 'E-learning', 'Corporate Training']
  },
  {
    id: 'respeecher', name: 'Respeecher', url: 'https://www.respeecher.com/',
    category: 'Audio', categories: ['Audio'],
    icon: 'https://www.respeecher.com/favicon.ico',
    description: 'Voice cloning technology for film, gaming, and media production. Used in Hollywood productions.',
    tags: ['voice-cloning', 'film', 'gaming', 'production'],
    pricing: 'Paid', use_cases: ['Film Production', 'Voice Cloning', 'Game Development']
  },
  {
    id: 'altered', name: 'Altered', url: 'https://www.altered.ai/',
    category: 'Audio', categories: ['Audio'],
    icon: 'https://www.altered.ai/favicon.ico',
    description: 'AI voice changing and performance tool. Transform your voice into any character or style in real-time.',
    tags: ['voice-changing', 'performance', 'real-time', 'characters'],
    pricing: 'Freemium', use_cases: ['Voice Acting', 'Content Creation', 'Gaming']
  },
  // ── Coding ──
  {
    id: 'amazon-q', name: 'Amazon Q Developer', url: 'https://aws.amazon.com/q/developer/',
    category: 'Coding', categories: ['Coding'],
    icon: 'https://a0.awsstatic.com/libra-css/images/site/fav/favicon.ico',
    description: 'AWS AI coding assistant (formerly CodeWhisperer). Code completion, security scanning, and AWS integration.',
    tags: ['code-completion', 'aws', 'security', 'cloud'],
    pricing: 'Freemium', use_cases: ['Code Completion', 'Security Scanning', 'AWS Development']
  },
  {
    id: 'askcodi', name: 'AskCodi', url: 'https://www.askcodi.com/',
    category: 'Coding', categories: ['Coding'],
    icon: 'https://www.askcodi.com/favicon.ico',
    description: 'AI coding assistant for generating code, tests, and documentation across multiple frameworks.',
    tags: ['code-generation', 'testing', 'documentation', 'frameworks'],
    pricing: 'Freemium', use_cases: ['Code Generation', 'Test Writing', 'Documentation']
  },
  {
    id: 'trae', name: 'Trae', url: 'https://www.trae.ai/',
    category: 'Coding', categories: ['Coding'],
    icon: 'https://www.trae.ai/favicon.ico',
    description: 'AI-powered IDE by ByteDance with built-in AI chat, code completion, and multi-file editing capabilities.',
    tags: ['ide', 'ai-assistant', 'code-completion', 'bytedance'],
    pricing: 'Free', use_cases: ['Code Editing', 'AI Pair Programming', 'Multi-file Editing']
  },
  // ── Agent ──
  {
    id: 'openai-agents', name: 'OpenAI Agents SDK', url: 'https://platform.openai.com/',
    category: 'Agent', categories: ['Agent', 'Coding'],
    icon: 'https://openai.com/favicon.ico',
    description: 'Official OpenAI toolkit for building AI agents with tool use, function calling, and multi-step reasoning.',
    tags: ['agents', 'sdk', 'openai', 'function-calling'],
    pricing: 'Paid', use_cases: ['Agent Development', 'Tool Integration', 'Automation']
  },
  {
    id: 'autogen', name: 'Microsoft AutoGen', url: 'https://microsoft.github.io/autogen/',
    category: 'Agent', categories: ['Agent', 'Coding'],
    icon: 'https://microsoft.github.io/autogen/favicon.ico',
    description: 'Microsoft framework for building multi-agent conversations. Agents collaborate to solve complex tasks.',
    tags: ['multi-agent', 'framework', 'microsoft', 'conversations'],
    pricing: 'Free', use_cases: ['Multi-Agent Systems', 'Research', 'Complex Problem Solving']
  },
  {
    id: 'taskade-ai', name: 'Taskade AI', url: 'https://www.taskade.com/',
    category: 'Agent', categories: ['Agent', 'Productivity'],
    icon: 'https://www.taskade.com/favicon.ico',
    description: 'AI agents for project management. Automate tasks, generate workflows, and collaborate with AI teammates.',
    tags: ['project-management', 'agents', 'workflows', 'collaboration'],
    pricing: 'Freemium', use_cases: ['Project Management', 'Task Automation', 'Team Collaboration']
  },
  {
    id: 'relevance-ai', name: 'Relevance AI', url: 'https://relevanceai.com/',
    category: 'Agent', categories: ['Agent'],
    icon: 'https://relevanceai.com/favicon.ico',
    description: 'No-code platform to build and deploy AI agents and workflows. Connect to APIs and automate business processes.',
    tags: ['no-code', 'agents', 'workflows', 'business'],
    pricing: 'Freemium', use_cases: ['Business Automation', 'Agent Building', 'API Integration']
  },
  {
    id: 'bland-ai', name: 'Bland AI', url: 'https://www.bland.ai/',
    category: 'Agent', categories: ['Agent', 'Business'],
    icon: 'https://www.bland.ai/favicon.ico',
    description: 'AI phone calling agent that handles inbound and outbound calls. Human-like conversations at scale.',
    tags: ['phone-calls', 'voice-agent', 'sales', 'customer-service'],
    pricing: 'Paid', use_cases: ['Sales Calls', 'Customer Support', 'Appointment Scheduling']
  },
  // ── Writing ──
  {
    id: 'sudowrite', name: 'Sudowrite', url: 'https://www.sudowrite.com/',
    category: 'Writing', categories: ['Writing'],
    icon: 'https://www.sudowrite.com/favicon.ico',
    description: 'AI writing tool designed for fiction authors. Helps with brainstorming, prose expansion, and story development.',
    tags: ['fiction', 'creative-writing', 'storytelling', 'novels'],
    pricing: 'Paid', use_cases: ['Fiction Writing', 'Story Development', 'Creative Brainstorming']
  },
  {
    id: 'anyword', name: 'Anyword', url: 'https://anyword.com/',
    category: 'Writing', categories: ['Writing', 'Business'],
    icon: 'https://anyword.com/favicon.ico',
    description: 'AI copywriting platform with performance prediction. Scores content before publishing based on engagement data.',
    tags: ['copywriting', 'performance', 'marketing', 'prediction'],
    pricing: 'Paid', use_cases: ['Ad Copy', 'Email Marketing', 'Landing Pages']
  },
  {
    id: 'hemingway-editor', name: 'Hemingway Editor', url: 'https://hemingwayapp.com/',
    category: 'Writing', categories: ['Writing'],
    icon: 'https://hemingwayapp.com/favicon.ico',
    description: 'Writing tool that highlights complex sentences, passive voice, and readability issues. Makes writing bold and clear.',
    tags: ['readability', 'clarity', 'editing', 'simplicity'],
    pricing: 'Freemium', use_cases: ['Readability Check', 'Editing', 'Clear Writing']
  },
  // ── Design ──
  {
    id: 'designs-ai', name: 'Designs.ai', url: 'https://designs.ai/',
    category: 'Design', categories: ['Design'],
    icon: 'https://designs.ai/favicon.ico',
    description: 'AI design suite for logos, videos, mockups, and social media graphics. All-in-one creative platform.',
    tags: ['design', 'logos', 'mockups', 'social-media'],
    pricing: 'Paid', use_cases: ['Logo Design', 'Video Creation', 'Social Media Graphics']
  },
  {
    id: 'khroma', name: 'Khroma', url: 'https://www.khroma.co/',
    category: 'Design', categories: ['Design'],
    icon: 'https://www.khroma.co/favicon.ico',
    description: 'AI color palette generator that learns your preferences. Generates infinite palettes tailored to your taste.',
    tags: ['color', 'palette', 'design', 'personalized'],
    pricing: 'Free', use_cases: ['Color Selection', 'Brand Colors', 'UI Design']
  },
  {
    id: 'galileo-ai', name: 'Galileo AI', url: 'https://www.usegalileo.ai/',
    category: 'Design', categories: ['Design', 'Coding'],
    icon: 'https://www.usegalileo.ai/favicon.ico',
    description: 'AI UI design generator. Describe an interface and get editable, high-fidelity designs instantly.',
    tags: ['ui-design', 'generation', 'high-fidelity', 'prototyping'],
    pricing: 'Freemium', use_cases: ['UI Generation', 'Rapid Prototyping', 'Design Exploration']
  },
  {
    id: 'uizard', name: 'Uizard', url: 'https://uizard.io/',
    category: 'Design', categories: ['Design'],
    icon: 'https://uizard.io/favicon.ico',
    description: 'AI wireframe and prototype generator. Turn hand-drawn sketches or text descriptions into digital designs.',
    tags: ['wireframe', 'prototype', 'sketch-to-design', 'no-code'],
    pricing: 'Freemium', use_cases: ['Wireframing', 'Prototyping', 'Sketch to Design']
  },
  // ── Productivity ──
  {
    id: 'clockwise', name: 'Clockwise', url: 'https://www.getclockwise.com/',
    category: 'Productivity', categories: ['Productivity'],
    icon: 'https://www.getclockwise.com/favicon.ico',
    description: 'AI calendar management for teams. Automatically optimizes schedules to create focus time blocks.',
    tags: ['calendar', 'scheduling', 'focus-time', 'teams'],
    pricing: 'Freemium', use_cases: ['Calendar Optimization', 'Focus Time', 'Team Scheduling']
  },
  {
    id: 'asana-ai', name: 'Asana AI', url: 'https://asana.com/',
    category: 'Productivity', categories: ['Productivity'],
    icon: 'https://asana.com/favicon.ico',
    description: 'AI-powered project management with smart status updates, task prioritization, and workflow recommendations.',
    tags: ['project-management', 'tasks', 'workflows', 'teams'],
    pricing: 'Freemium', use_cases: ['Project Management', 'Task Prioritization', 'Status Updates']
  },
  {
    id: 'taskade', name: 'Taskade', url: 'https://www.taskade.com/',
    category: 'Productivity', categories: ['Productivity', 'Agent'],
    icon: 'https://www.taskade.com/favicon.ico',
    description: 'AI-powered workspace combining tasks, notes, and mind maps. Build custom AI agents for team workflows.',
    tags: ['workspace', 'tasks', 'mind-maps', 'ai-agents'],
    pricing: 'Freemium', use_cases: ['Task Management', 'Note Taking', 'Mind Mapping']
  },
  // ── Research ──
  {
    id: 'semantic-scholar', name: 'Semantic Scholar', url: 'https://www.semanticscholar.org/',
    category: 'Research', categories: ['Research'],
    icon: 'https://www.semanticscholar.org/favicon.ico',
    description: 'AI-powered academic search engine by Allen Institute. Finds relevant papers and extracts key insights.',
    tags: ['academic', 'papers', 'search', 'citations'],
    pricing: 'Free', use_cases: ['Paper Discovery', 'Citation Analysis', 'Literature Review']
  },
  {
    id: 'frase', name: 'Frase.io', url: 'https://www.frase.io/',
    category: 'Research', categories: ['Research', 'Writing'],
    icon: 'https://www.frase.io/favicon.ico',
    description: 'AI content briefs and SEO research tool. Analyzes top search results to help create optimized content.',
    tags: ['seo', 'content-briefs', 'research', 'optimization'],
    pricing: 'Paid', use_cases: ['Content Briefs', 'SEO Research', 'Content Optimization']
  },
  {
    id: 'marketmuse', name: 'MarketMuse', url: 'https://www.marketmuse.com/',
    category: 'Research', categories: ['Research', 'Writing'],
    icon: 'https://www.marketmuse.com/favicon.ico',
    description: 'AI content strategy and gap analysis platform. Identifies content opportunities and competitive advantages.',
    tags: ['content-strategy', 'gap-analysis', 'seo', 'competitive'],
    pricing: 'Paid', use_cases: ['Content Strategy', 'Gap Analysis', 'SEO Planning']
  },
  {
    id: 'ahrefs-ai', name: 'Ahrefs AI', url: 'https://ahrefs.com/',
    category: 'Research', categories: ['Research'],
    icon: 'https://ahrefs.com/favicon.ico',
    description: 'AI-powered SEO toolkit for keyword research, backlink analysis, and content exploration at scale.',
    tags: ['seo', 'keywords', 'backlinks', 'competitive-analysis'],
    pricing: 'Paid', use_cases: ['Keyword Research', 'Backlink Analysis', 'Competitor Research']
  },
  // ── 3D ──
  {
    id: 'rodin', name: 'Rodin (Deemos)', url: 'https://hyperhuman.deemos.com/',
    category: '3D', categories: ['3D'],
    icon: 'https://hyperhuman.deemos.com/favicon.ico',
    description: 'High-fidelity 3D generation from text and images. Creates detailed characters and objects for games and film.',
    tags: ['3d-generation', 'characters', 'high-fidelity', 'games'],
    pricing: 'Freemium', use_cases: ['Character Creation', '3D Assets', 'Film Production']
  },
  {
    id: 'kaedim', name: 'Kaedim', url: 'https://www.kaedim3d.com/',
    category: '3D', categories: ['3D'],
    icon: 'https://www.kaedim3d.com/favicon.ico',
    description: '2D to 3D model conversion using AI. Upload images and get production-ready 3D models.',
    tags: ['2d-to-3d', 'conversion', 'production-ready', 'models'],
    pricing: 'Paid', use_cases: ['2D to 3D Conversion', 'Game Assets', 'Product Visualization']
  },
  // ── Social Media (NEW CATEGORY) ──
  {
    id: 'buffer', name: 'Buffer', url: 'https://buffer.com/',
    category: 'Social Media', categories: ['Social Media', 'Productivity'],
    icon: 'https://buffer.com/favicon.ico',
    description: 'AI-powered social media scheduling and analytics. Generate captions, optimize posting times, and track performance.',
    tags: ['social-media', 'scheduling', 'analytics', 'captions'],
    pricing: 'Freemium', use_cases: ['Social Scheduling', 'Caption Generation', 'Analytics']
  },
  {
    id: 'hootsuite', name: 'Hootsuite', url: 'https://www.hootsuite.com/',
    category: 'Social Media', categories: ['Social Media', 'Business'],
    icon: 'https://www.hootsuite.com/favicon.ico',
    description: 'Enterprise social media management with AI content suggestions, best time to post, and team collaboration.',
    tags: ['social-media', 'enterprise', 'management', 'collaboration'],
    pricing: 'Paid', use_cases: ['Social Media Management', 'Team Collaboration', 'Enterprise Social']
  },
  {
    id: 'feedhive', name: 'FeedHive', url: 'https://www.feedhive.com/',
    category: 'Social Media', categories: ['Social Media'],
    icon: 'https://www.feedhive.com/favicon.ico',
    description: 'AI content repurposing for social media. Turn one piece of content into posts for multiple platforms.',
    tags: ['content-repurposing', 'social-media', 'multi-platform', 'ai'],
    pricing: 'Freemium', use_cases: ['Content Repurposing', 'Multi-Platform Posting', 'Scheduling']
  },
  {
    id: 'vista-social', name: 'Vista Social', url: 'https://vistasocial.com/',
    category: 'Social Media', categories: ['Social Media'],
    icon: 'https://vistasocial.com/favicon.ico',
    description: 'Modern social media management for multi-brand teams. AI caption writer and smart scheduling.',
    tags: ['social-media', 'multi-brand', 'scheduling', 'captions'],
    pricing: 'Freemium', use_cases: ['Multi-Brand Management', 'Smart Scheduling', 'Caption Writing']
  },
  {
    id: 'predis-ai', name: 'Predis.ai', url: 'https://predis.ai/',
    category: 'Social Media', categories: ['Social Media', 'Design'],
    icon: 'https://predis.ai/favicon.ico',
    description: 'AI visual content generator for social media. Creates branded posts, carousels, and videos from text prompts.',
    tags: ['social-media', 'visual-content', 'carousels', 'branded'],
    pricing: 'Freemium', use_cases: ['Social Media Graphics', 'Carousel Posts', 'Video Content']
  },
  {
    id: 'socialpilot', name: 'SocialPilot', url: 'https://www.socialpilot.co/',
    category: 'Social Media', categories: ['Social Media'],
    icon: 'https://www.socialpilot.co/favicon.ico',
    description: 'SMB social media management with AI content assistant, bulk scheduling, and white-label reports.',
    tags: ['social-media', 'smb', 'bulk-scheduling', 'reports'],
    pricing: 'Freemium', use_cases: ['SMB Social Management', 'Bulk Scheduling', 'Client Reports']
  },
  {
    id: 'publer', name: 'Publer', url: 'https://publer.io/',
    category: 'Social Media', categories: ['Social Media'],
    icon: 'https://publer.io/favicon.ico',
    description: 'Multi-platform social media posting with AI text and image generation, scheduling, and link-in-bio pages.',
    tags: ['social-media', 'multi-platform', 'ai-generation', 'link-in-bio'],
    pricing: 'Freemium', use_cases: ['Multi-Platform Posting', 'Content Generation', 'Link in Bio']
  },
  // ── Education ──
  {
    id: 'socratic', name: 'Socratic by Google', url: 'https://socratic.org/',
    category: 'Education', categories: ['Education'],
    icon: 'https://socratic.org/favicon.ico',
    description: 'AI homework helper by Google. Take a photo of a question and get step-by-step explanations.',
    tags: ['homework', 'math', 'science', 'step-by-step'],
    pricing: 'Free', use_cases: ['Homework Help', 'Math Solutions', 'Science Explanations']
  },
  {
    id: 'photomath', name: 'Photomath', url: 'https://photomath.com/',
    category: 'Education', categories: ['Education'],
    icon: 'https://photomath.com/favicon.ico',
    description: 'AI math problem solver. Scan problems with your camera and get animated step-by-step solutions.',
    tags: ['math', 'camera', 'step-by-step', 'solver'],
    pricing: 'Freemium', use_cases: ['Math Problem Solving', 'Step-by-Step Learning', 'Homework']
  },
  {
    id: 'proprofs-lms', name: 'ProProfs LMS', url: 'https://www.proprofs.com/training/',
    category: 'Education', categories: ['Education', 'Business'],
    icon: 'https://www.proprofs.com/favicon.ico',
    description: 'AI-powered learning management system for creating courses, quizzes, and training programs.',
    tags: ['lms', 'courses', 'training', 'quizzes'],
    pricing: 'Paid', use_cases: ['Employee Training', 'Course Creation', 'Compliance Training']
  },
  // ── Business ──
  {
    id: 'gong', name: 'Gong.io', url: 'https://www.gong.io/',
    category: 'Business', categories: ['Business'],
    icon: 'https://www.gong.io/favicon.ico',
    description: 'AI revenue intelligence platform. Analyzes sales calls and meetings to surface insights and coach reps.',
    tags: ['sales', 'revenue-intelligence', 'call-analysis', 'coaching'],
    pricing: 'Paid', use_cases: ['Sales Coaching', 'Deal Intelligence', 'Revenue Forecasting']
  },
  {
    id: 'tidio', name: 'Tidio', url: 'https://www.tidio.com/',
    category: 'Business', categories: ['Business'],
    icon: 'https://www.tidio.com/favicon.ico',
    description: 'AI chatbot for customer service and e-commerce. Automates up to 70% of customer inquiries.',
    tags: ['chatbot', 'customer-service', 'e-commerce', 'automation'],
    pricing: 'Freemium', use_cases: ['Customer Support', 'E-commerce Chat', 'Lead Generation']
  },
  {
    id: 'drift', name: 'Drift', url: 'https://www.salesloft.com/platform/drift/',
    category: 'Business', categories: ['Business'],
    icon: 'https://www.salesloft.com/favicon.ico',
    description: 'AI conversational marketing and sales platform. Engages website visitors with intelligent chatbots.',
    tags: ['conversational-marketing', 'chatbot', 'sales', 'engagement'],
    pricing: 'Paid', use_cases: ['Conversational Marketing', 'Lead Qualification', 'Sales Engagement']
  },
  {
    id: 'salesforce-einstein', name: 'Salesforce Einstein', url: 'https://www.salesforce.com/einstein/',
    category: 'Business', categories: ['Business'],
    icon: 'https://www.salesforce.com/favicon.ico',
    description: 'AI layer built into Salesforce CRM. Predictive analytics, automated insights, and AI-powered recommendations.',
    tags: ['crm', 'predictive-analytics', 'salesforce', 'enterprise'],
    pricing: 'Paid', use_cases: ['CRM Intelligence', 'Sales Predictions', 'Customer Insights']
  },
  {
    id: 'lavender', name: 'Lavender', url: 'https://www.lavender.ai/',
    category: 'Business', categories: ['Business', 'Writing'],
    icon: 'https://www.lavender.ai/favicon.ico',
    description: 'AI email coaching for sales teams. Scores emails in real-time and suggests improvements to boost reply rates.',
    tags: ['email', 'sales', 'coaching', 'reply-rates'],
    pricing: 'Freemium', use_cases: ['Sales Emails', 'Email Coaching', 'Reply Rate Optimization']
  },
];

async function run() {
  let client;
  try {
    client = await tryConnect();

    let inserted = 0;
    let skipped = 0;
    for (const tool of newTools) {
      const { rows } = await client.query('SELECT id FROM tools WHERE id = $1', [tool.id]);
      if (rows.length > 0) {
        skipped++;
        continue;
      }
      await client.query(
        `INSERT INTO tools (id, name, url, category, categories, icon, description, tags, pricing, use_cases, added_date)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9, $10, CURRENT_DATE)`,
        [tool.id, tool.name, tool.url, tool.category, JSON.stringify(tool.categories),
         tool.icon, tool.description, tool.tags, tool.pricing, tool.use_cases]
      );
      inserted++;
    }

    console.log('Inserted:', inserted, '| Skipped (already exist):', skipped);

    const { rows: countRows } = await client.query('SELECT count(*) as total FROM tools');
    const { rows: catRows } = await client.query(
      "SELECT category, count(*) as c FROM tools GROUP BY category ORDER BY c DESC"
    );
    console.log('\nTotal tools:', countRows[0].total);
    console.log('\nBy category:');
    catRows.forEach(r => console.log(' ', r.category + ':', r.c));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    if (client) await client.end();
  }
}

run();
