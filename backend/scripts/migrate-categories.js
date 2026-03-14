/**
 * Migration: Add categories column and sync tools from tools.js
 * 
 * This script:
 * 1. Adds a 'categories' jsonb column to the tools table
 * 2. Updates categories for all existing tools
 * 3. Inserts new tools that don't exist in the DB yet
 * 
 * Run from backend/: node scripts/migrate-categories.js
 */
const { Client } = require('pg');
require('dotenv').config();

const tryConnect = async () => {
  const connectionStrings = [
    process.env.DATABASE_URL_IPV6,
    process.env.DATABASE_URL_IPV4_SESSION_POOLER,
    process.env.DATABASE_URL_IPV4_TRANSACTION_POOLER
  ].filter(Boolean);

  for (const connectionString of connectionStrings) {
    console.log('Trying connection...');
    const client = new Client({ connectionString });
    try {
      await client.connect();
      console.log('Connected successfully!');
      return client;
    } catch (err) {
      console.warn(`Connection failed: ${err.message}. Retrying...`);
    }
  }
  throw new Error('All connection attempts failed.');
};

// ── Category mappings for existing tools ──
const categoryMappings = {
  'chatgpt': ['Chat', 'Coding', 'Writing', 'Research'],
  'gemini': ['Chat', 'Coding', 'Research'],
  'claude': ['Chat', 'Coding', 'Writing'],
  'deepseek': ['Chat', 'Coding'],
  'grok-3': ['Chat', 'Research'],
  'perplexity': ['Research', 'Chat'],
  'microsoft-copilot': ['Chat', 'Productivity'],
  'you-com': ['Research', 'Chat'],
  'poe': ['Chat'],
  'character-ai': ['Chat'],
  'mistral-le-chat': ['Chat', 'Coding'],
  'meta-ai': ['Chat'],
  'huggingchat': ['Chat'],
  'midjourney': ['Image', 'Design'],
  'dalle': ['Image', 'Design'],
  'stable-diffusion': ['Image'],
  'leonardo-ai': ['Image', 'Design'],
  'adobe-firefly': ['Image', 'Design'],
  'bing-image-creator': ['Image'],
  'nvidia-canvas': ['Image'],
  'recraft': ['Image', 'Design'],
  'ideogram': ['Image', 'Design'],
  'flux': ['Image'],
  'playground-ai': ['Image'],
  'krea-ai': ['Image'],
  'sora': ['Video'],
  'runway': ['Video'],
  'pika-labs': ['Video'],
  'synthesia': ['Video', 'Education', 'Business'],
  'd-id-video': ['Video', 'Business'],
  'kling-ai': ['Video'],
  'hailuo': ['Video'],
  'heygen': ['Video', 'Business'],
  'descript': ['Video', 'Audio', 'Productivity'],
  'opus-clip': ['Video'],
  'luma-dream-machine': ['Video'],
  'invideo-ai': ['Video'],
  'elevenlabs': ['Audio'],
  'suno': ['Audio'],
  'udio': ['Audio'],
  'adobe-enhance': ['Audio', 'Productivity'],
  'uberduck': ['Audio'],
  'pixabay-music': ['Audio'],
  'wispr-flow': ['Audio', 'Productivity'],
  'murf-ai': ['Audio'],
  'otter-ai': ['Audio', 'Productivity'],
  'speechify': ['Audio', 'Productivity'],
  'cursor': ['Coding'],
  'github-copilot': ['Coding'],
  'windsurf': ['Coding'],
  'bolt-new': ['Coding', 'Design'],
  'lovable': ['Coding', 'Design'],
  'antigravity': ['Coding', 'Agent'],
  'phcode': ['Coding'],
  'tabnine': ['Coding'],
  'codeium': ['Coding'],
  'v0-vercel': ['Coding', 'Design'],
  'replit-ai': ['Coding'],
  'devin': ['Agent', 'Coding'],
  'agentgpt': ['Agent'],
  'auto-gpt': ['Agent'],
  'genspark': ['Agent', 'Research'],
  'crewai': ['Agent', 'Coding'],
  'langchain': ['Agent', 'Coding'],
  'lindy-ai': ['Agent', 'Productivity'],
  'grammarly': ['Writing', 'Productivity'],
  'jasper': ['Writing', 'Business'],
  'copy-ai': ['Writing', 'Business'],
  'rytr': ['Writing'],
  'writesonic': ['Writing', 'Research'],
  'wordtune': ['Writing'],
  'prowritingaid': ['Writing'],
  'quillbot': ['Writing'],
  'notion-ai': ['Productivity', 'Writing'],
  'canva-magic': ['Design', 'Image'],
  'figma-ai': ['Design'],
  'framer': ['Design', 'Coding'],
  'gamma': ['Design'],
  'tome': ['Design'],
  'chronicle': ['Design'],
  'looka': ['Design'],
  'beautiful-ai': ['Design'],
  'zapier-ai': ['Productivity'],
  'make-com': ['Productivity'],
  'reclaim-ai': ['Productivity'],
  'fireflies-ai': ['Productivity', 'Audio'],
  'clickup-ai': ['Productivity'],
  'pdfgear': ['Productivity', 'Research'],
  'elicit': ['Research'],
  'consensus': ['Research'],
  'ask-your-pdf': ['Research', 'Productivity'],
  'surfer-seo': ['Research', 'Writing'],
  'meshy-ai': ['3D'],
  'tripo-ai': ['3D'],
  'luma-ai': ['3D'],
  'crystal-knows': ['Business'],
  'happenstance': ['Business'],
  'hubspot-ai': ['Business'],
  'intercom-fin': ['Business'],
  'wisdolia': ['Education'],
  'khanmigo': ['Education'],
  'quizlet-ai': ['Education'],
  'duolingo-max': ['Education'],
  'hugging-face': ['Coding', 'Research'],
  'promptbase': ['Coding'],
};

// ── New tools to insert (not in original DB) ──
const newTools = [
  {
    id: 'mistral-le-chat', name: 'Mistral Le Chat', url: 'https://chat.mistral.ai/',
    category: 'Chat', categories: ['Chat', 'Coding'],
    icon: 'https://chat.mistral.ai/favicon.ico',
    description: 'Privacy-focused AI chatbot from Mistral AI, a leading European AI company. Strong at coding and reasoning with 128K context window.',
    tags: ['chatbot', 'open-source', 'european', 'coding', 'privacy'],
    pricing: 'Free', use_cases: ['Conversations', 'Code Generation', 'Analysis']
  },
  {
    id: 'meta-ai', name: 'Meta AI', url: 'https://www.meta.ai/',
    category: 'Chat', categories: ['Chat'],
    icon: 'https://logo.clearbit.com/meta.com',
    description: "Meta's free AI assistant powered by Llama models, integrated across Facebook, Instagram, WhatsApp, and the web.",
    tags: ['chatbot', 'meta', 'llama', 'social-media', 'free'],
    pricing: 'Free', use_cases: ['Conversations', 'Creative Writing', 'Social Media']
  },
  {
    id: 'huggingchat', name: 'HuggingChat', url: 'https://huggingface.co/chat/',
    category: 'Chat', categories: ['Chat'],
    icon: 'https://logo.clearbit.com/huggingface.co',
    description: 'Open-source chatbot by Hugging Face, offering access to various open models like Llama, Mistral, and more.',
    tags: ['chatbot', 'open-source', 'hugging-face', 'multi-model'],
    pricing: 'Free', use_cases: ['Conversations', 'Research', 'Model Testing']
  },
  {
    id: 'ideogram', name: 'Ideogram', url: 'https://ideogram.ai/',
    category: 'Image', categories: ['Image', 'Design'],
    icon: 'https://ideogram.ai/favicon.ico',
    description: 'AI image generator with best-in-class text rendering inside images. Excels at posters, logos, and typography-heavy visuals.',
    tags: ['image-generation', 'typography', 'text-in-image', 'design'],
    pricing: 'Freemium', use_cases: ['Poster Design', 'Logo Creation', 'Typography Art']
  },
  {
    id: 'flux', name: 'Flux', url: 'https://blackforestlabs.ai/',
    category: 'Image', categories: ['Image'],
    icon: 'https://blackforestlabs.ai/favicon.ico',
    description: 'By Black Forest Labs, Flux models offer top prompt adherence and character consistency. The go-to for creators needing visual storytelling.',
    tags: ['image-generation', 'open-source', 'prompt-adherence', 'storytelling'],
    pricing: 'Freemium', use_cases: ['Character Design', 'Visual Storytelling', 'Art Creation']
  },
  {
    id: 'playground-ai', name: 'Playground AI', url: 'https://playground.com/',
    category: 'Image', categories: ['Image'],
    icon: 'https://playground.com/favicon.ico',
    description: 'Free AI image generation platform with a community gallery, multiple models, and an intuitive canvas editor.',
    tags: ['image-generation', 'free', 'community', 'canvas-editor'],
    pricing: 'Freemium', use_cases: ['Image Generation', 'Photo Editing', 'Creative Design']
  },
  {
    id: 'krea-ai', name: 'Krea AI', url: 'https://www.krea.ai/',
    category: 'Image', categories: ['Image'],
    icon: 'https://www.krea.ai/favicon.ico',
    description: 'Real-time AI image generation and enhancement tool. Draw rough sketches and watch them transform into polished visuals instantly.',
    tags: ['image-generation', 'real-time', 'sketch-to-image', 'enhancement'],
    pricing: 'Freemium', use_cases: ['Real-time Generation', 'Image Enhancement', 'Sketch to Art']
  },
  {
    id: 'heygen', name: 'HeyGen', url: 'https://www.heygen.com/',
    category: 'Video', categories: ['Video', 'Business'],
    icon: 'https://www.heygen.com/favicon.ico',
    description: 'AI avatar video creation platform for marketing, sales, and training. Create professional presenter videos without a camera.',
    tags: ['video-generation', 'avatars', 'marketing', 'training'],
    pricing: 'Freemium', use_cases: ['Marketing Videos', 'Sales Outreach', 'Training Content']
  },
  {
    id: 'descript', name: 'Descript', url: 'https://www.descript.com/',
    category: 'Video', categories: ['Video', 'Audio', 'Productivity'],
    icon: 'https://www.descript.com/favicon.ico',
    description: 'All-in-one video and podcast editor. Edit media by editing text transcripts. Includes AI voice cloning and screen recording.',
    tags: ['video-editing', 'podcast', 'transcription', 'voice-cloning'],
    pricing: 'Freemium', use_cases: ['Video Editing', 'Podcast Production', 'Transcription']
  },
  {
    id: 'opus-clip', name: 'OpusClip', url: 'https://www.opus.pro/',
    category: 'Video', categories: ['Video'],
    icon: 'https://www.opus.pro/favicon.ico',
    description: 'AI-powered tool that repurposes long videos into viral short clips. Auto-detects highlights and adds captions.',
    tags: ['video-editing', 'short-form', 'repurposing', 'captions'],
    pricing: 'Freemium', use_cases: ['Short-form Content', 'Social Media Clips', 'Video Repurposing']
  },
  {
    id: 'luma-dream-machine', name: 'Luma Dream Machine', url: 'https://lumalabs.ai/dream-machine',
    category: 'Video', categories: ['Video'],
    icon: 'https://lumalabs.ai/favicon.ico',
    description: 'High-quality text-to-video and image-to-video generation by Luma Labs. Creates realistic 5-second clips with smooth motion.',
    tags: ['video-generation', 'text-to-video', 'image-to-video', 'realistic'],
    pricing: 'Freemium', use_cases: ['Video Generation', 'Creative Projects', 'Prototyping']
  },
  {
    id: 'invideo-ai', name: 'InVideo AI', url: 'https://invideo.io/',
    category: 'Video', categories: ['Video'],
    icon: 'https://invideo.io/favicon.ico',
    description: 'Generate publish-ready videos from text prompts. AI selects stock footage, adds voiceover, music, and transitions automatically.',
    tags: ['video-generation', 'text-to-video', 'stock-footage', 'automated'],
    pricing: 'Freemium', use_cases: ['Marketing Videos', 'YouTube Content', 'Social Media']
  },
  {
    id: 'murf-ai', name: 'Murf AI', url: 'https://murf.ai/',
    category: 'Audio', categories: ['Audio'],
    icon: 'https://murf.ai/favicon.ico',
    description: 'Professional AI voice generator with 120+ realistic voices in 20+ languages. Used for e-learning, marketing, and presentations.',
    tags: ['voice-generation', 'text-to-speech', 'voiceover', 'multilingual'],
    pricing: 'Freemium', use_cases: ['Voiceovers', 'E-learning', 'Presentations']
  },
  {
    id: 'otter-ai', name: 'Otter.ai', url: 'https://otter.ai/',
    category: 'Audio', categories: ['Audio', 'Productivity'],
    icon: 'https://otter.ai/favicon.ico',
    description: 'AI meeting assistant that records, transcribes, and summarizes meetings in real-time. Integrates with Zoom, Teams, and Google Meet.',
    tags: ['transcription', 'meetings', 'notes', 'collaboration'],
    pricing: 'Freemium', use_cases: ['Meeting Notes', 'Transcription', 'Collaboration']
  },
  {
    id: 'speechify', name: 'Speechify', url: 'https://speechify.com/',
    category: 'Audio', categories: ['Audio', 'Productivity'],
    icon: 'https://speechify.com/favicon.ico',
    description: 'Text-to-speech app that reads any text aloud with natural AI voices. Supports PDFs, web pages, docs, and ebooks.',
    tags: ['text-to-speech', 'reading', 'accessibility', 'productivity'],
    pricing: 'Freemium', use_cases: ['Reading Assistance', 'Accessibility', 'Learning']
  },
  {
    id: 'tabnine', name: 'Tabnine', url: 'https://www.tabnine.com/',
    category: 'Coding', categories: ['Coding'],
    icon: 'https://www.tabnine.com/favicon.ico',
    description: 'AI code assistant focused on privacy and security. Runs locally or on-premise, trained on permissively licensed code only.',
    tags: ['code-completion', 'privacy', 'on-premise', 'enterprise'],
    pricing: 'Freemium', use_cases: ['Code Completion', 'Enterprise Development', 'Secure Coding']
  },
  {
    id: 'codeium', name: 'Codeium', url: 'https://codeium.com/',
    category: 'Coding', categories: ['Coding'],
    icon: 'https://codeium.com/favicon.ico',
    description: 'Free AI code completion and chat for 70+ languages. Fast autocomplete with support for all major IDEs.',
    tags: ['code-completion', 'free', 'multi-language', 'ide-extension'],
    pricing: 'Free', use_cases: ['Code Completion', 'Code Search', 'Multi-IDE Support']
  },
  {
    id: 'v0-vercel', name: 'v0 by Vercel', url: 'https://v0.dev/',
    category: 'Coding', categories: ['Coding', 'Design'],
    icon: 'https://v0.dev/favicon.ico',
    description: 'AI-powered UI generation tool by Vercel. Describe a component and get production-ready React code with Tailwind CSS and shadcn/ui.',
    tags: ['ui-generation', 'react', 'tailwind', 'frontend'],
    pricing: 'Freemium', use_cases: ['UI Prototyping', 'Component Generation', 'Frontend Development']
  },
  {
    id: 'replit-ai', name: 'Replit AI', url: 'https://replit.com/',
    category: 'Coding', categories: ['Coding'],
    icon: 'https://replit.com/favicon.ico',
    description: 'Cloud IDE with built-in AI assistant. Code, debug, and deploy from your browser with AI pair programming.',
    tags: ['cloud-ide', 'ai-assistant', 'deployment', 'collaborative'],
    pricing: 'Freemium', use_cases: ['Cloud Development', 'Learning to Code', 'Rapid Prototyping']
  },
  {
    id: 'crewai', name: 'CrewAI', url: 'https://www.crewai.com/',
    category: 'Agent', categories: ['Agent', 'Coding'],
    icon: 'https://www.crewai.com/favicon.ico',
    description: 'Framework for orchestrating role-playing AI agents. Build teams of agents that collaborate to accomplish complex tasks.',
    tags: ['ai-agents', 'framework', 'orchestration', 'multi-agent'],
    pricing: 'Free', use_cases: ['Agent Orchestration', 'Task Automation', 'AI Workflows']
  },
  {
    id: 'langchain', name: 'LangChain', url: 'https://www.langchain.com/',
    category: 'Agent', categories: ['Agent', 'Coding'],
    icon: 'https://www.langchain.com/favicon.ico',
    description: 'Leading framework for building LLM-powered applications. Chain together prompts, tools, and memory for complex AI workflows.',
    tags: ['framework', 'llm', 'chains', 'tools', 'developer'],
    pricing: 'Free', use_cases: ['LLM Applications', 'RAG Systems', 'AI Agent Development']
  },
  {
    id: 'lindy-ai', name: 'Lindy AI', url: 'https://www.lindy.ai/',
    category: 'Agent', categories: ['Agent', 'Productivity'],
    icon: 'https://www.lindy.ai/favicon.ico',
    description: 'No-code AI agent builder. Create custom AI employees that handle email, scheduling, CRM updates, and more.',
    tags: ['ai-agents', 'no-code', 'automation', 'productivity'],
    pricing: 'Freemium', use_cases: ['Email Management', 'Scheduling', 'Workflow Automation']
  },
  {
    id: 'grammarly', name: 'Grammarly', url: 'https://www.grammarly.com/',
    category: 'Writing', categories: ['Writing', 'Productivity'],
    icon: 'https://www.grammarly.com/favicon.ico',
    description: 'AI writing assistant for grammar, clarity, tone, and style. Works across browsers, apps, and documents.',
    tags: ['grammar', 'writing', 'proofreading', 'tone'],
    pricing: 'Freemium', use_cases: ['Grammar Check', 'Tone Adjustment', 'Professional Writing']
  },
  {
    id: 'rytr', name: 'Rytr', url: 'https://rytr.me/',
    category: 'Writing', categories: ['Writing'],
    icon: 'https://rytr.me/favicon.ico',
    description: 'Affordable AI writing assistant with 40+ use cases and 30+ languages. Great for blog posts, emails, and social media.',
    tags: ['writing', 'content-generation', 'affordable', 'multilingual'],
    pricing: 'Freemium', use_cases: ['Blog Writing', 'Email Drafting', 'Social Media Posts']
  },
  {
    id: 'writesonic', name: 'Writesonic', url: 'https://writesonic.com/',
    category: 'Writing', categories: ['Writing', 'Research'],
    icon: 'https://writesonic.com/favicon.ico',
    description: 'AI writing and content platform with built-in fact-checking via web search. Generates SEO-optimized articles and marketing copy.',
    tags: ['writing', 'seo', 'marketing', 'fact-checking'],
    pricing: 'Freemium', use_cases: ['SEO Articles', 'Marketing Copy', 'Product Descriptions']
  },
  {
    id: 'wordtune', name: 'Wordtune', url: 'https://www.wordtune.com/',
    category: 'Writing', categories: ['Writing'],
    icon: 'https://www.wordtune.com/favicon.ico',
    description: 'AI rewriting tool that helps rephrase sentences for clarity, tone, and length. Summarizes long documents instantly.',
    tags: ['rewriting', 'paraphrasing', 'summarization', 'clarity'],
    pricing: 'Freemium', use_cases: ['Rewriting', 'Summarization', 'Academic Writing']
  },
  {
    id: 'prowritingaid', name: 'ProWritingAid', url: 'https://prowritingaid.com/',
    category: 'Writing', categories: ['Writing'],
    icon: 'https://prowritingaid.com/favicon.ico',
    description: 'Comprehensive writing analysis tool with 20+ reports on style, grammar, readability, and structure.',
    tags: ['writing', 'analysis', 'style', 'readability'],
    pricing: 'Freemium', use_cases: ['Writing Analysis', 'Style Improvement', 'Book Editing']
  },
  {
    id: 'quillbot', name: 'QuillBot', url: 'https://quillbot.com/',
    category: 'Writing', categories: ['Writing'],
    icon: 'https://quillbot.com/favicon.ico',
    description: 'AI paraphrasing and summarizing tool with multiple rewriting modes. Integrates with Google Docs and Word.',
    tags: ['paraphrasing', 'summarizing', 'rewriting', 'academic'],
    pricing: 'Freemium', use_cases: ['Paraphrasing', 'Summarizing', 'Academic Writing']
  },
  {
    id: 'canva-magic', name: 'Canva Magic Studio', url: 'https://www.canva.com/magic/',
    category: 'Design', categories: ['Design', 'Image'],
    icon: 'https://www.canva.com/favicon.ico',
    description: 'AI-powered design suite within Canva. Generate images, remove backgrounds, resize designs, and create presentations with AI.',
    tags: ['design', 'image-generation', 'templates', 'presentations'],
    pricing: 'Freemium', use_cases: ['Graphic Design', 'Presentations', 'Social Media Graphics']
  },
  {
    id: 'figma-ai', name: 'Figma AI', url: 'https://www.figma.com/',
    category: 'Design', categories: ['Design'],
    icon: 'https://www.figma.com/favicon.ico',
    description: 'AI features built into Figma for auto-layout, content generation, and design suggestions. Streamlines the UI/UX workflow.',
    tags: ['design', 'ui-ux', 'prototyping', 'collaboration'],
    pricing: 'Freemium', use_cases: ['UI Design', 'Prototyping', 'Design Systems']
  },
  {
    id: 'framer', name: 'Framer', url: 'https://www.framer.com/',
    category: 'Design', categories: ['Design', 'Coding'],
    icon: 'https://www.framer.com/favicon.ico',
    description: 'AI-powered website builder. Describe your site and get a fully designed, responsive website you can publish instantly.',
    tags: ['website-builder', 'no-code', 'responsive', 'publishing'],
    pricing: 'Freemium', use_cases: ['Website Creation', 'Landing Pages', 'Portfolio Sites']
  },
  {
    id: 'looka', name: 'Looka', url: 'https://looka.com/',
    category: 'Design', categories: ['Design'],
    icon: 'https://looka.com/favicon.ico',
    description: 'AI logo maker and brand kit generator. Create professional logos, business cards, and brand guidelines in minutes.',
    tags: ['logo-design', 'branding', 'business-cards', 'brand-kit'],
    pricing: 'Freemium', use_cases: ['Logo Design', 'Brand Identity', 'Business Cards']
  },
  {
    id: 'beautiful-ai', name: 'Beautiful.ai', url: 'https://www.beautiful.ai/',
    category: 'Design', categories: ['Design'],
    icon: 'https://www.beautiful.ai/favicon.ico',
    description: 'AI presentation maker that auto-designs slides as you add content. Smart templates adapt layout in real-time.',
    tags: ['presentations', 'slides', 'auto-design', 'templates'],
    pricing: 'Paid', use_cases: ['Presentations', 'Pitch Decks', 'Team Reports']
  },
  {
    id: 'zapier-ai', name: 'Zapier AI', url: 'https://zapier.com/',
    category: 'Productivity', categories: ['Productivity'],
    icon: 'https://zapier.com/favicon.ico',
    description: 'AI-enhanced automation platform connecting 6000+ apps. Build workflows with natural language and AI-powered suggestions.',
    tags: ['automation', 'integrations', 'workflows', 'no-code'],
    pricing: 'Freemium', use_cases: ['Workflow Automation', 'App Integration', 'Data Sync']
  },
  {
    id: 'make-com', name: 'Make.com', url: 'https://www.make.com/',
    category: 'Productivity', categories: ['Productivity'],
    icon: 'https://www.make.com/favicon.ico',
    description: 'Visual automation platform with AI capabilities. Build complex workflows with a drag-and-drop interface.',
    tags: ['automation', 'visual', 'workflows', 'integrations'],
    pricing: 'Freemium', use_cases: ['Complex Automations', 'Data Processing', 'API Orchestration']
  },
  {
    id: 'reclaim-ai', name: 'Reclaim.ai', url: 'https://reclaim.ai/',
    category: 'Productivity', categories: ['Productivity'],
    icon: 'https://reclaim.ai/favicon.ico',
    description: 'AI scheduling assistant that auto-schedules tasks, habits, and meetings around your priorities in Google Calendar.',
    tags: ['scheduling', 'calendar', 'time-management', 'habits'],
    pricing: 'Freemium', use_cases: ['Smart Scheduling', 'Time Blocking', 'Meeting Optimization']
  },
  {
    id: 'fireflies-ai', name: 'Fireflies.ai', url: 'https://fireflies.ai/',
    category: 'Productivity', categories: ['Productivity', 'Audio'],
    icon: 'https://fireflies.ai/favicon.ico',
    description: 'AI meeting recorder and note-taker. Auto-joins calls, transcribes conversations, and generates action items.',
    tags: ['meetings', 'transcription', 'notes', 'action-items'],
    pricing: 'Freemium', use_cases: ['Meeting Recording', 'Transcription', 'Action Items']
  },
  {
    id: 'clickup-ai', name: 'ClickUp AI', url: 'https://clickup.com/',
    category: 'Productivity', categories: ['Productivity'],
    icon: 'https://clickup.com/favicon.ico',
    description: 'AI assistant built into ClickUp project management. Summarize tasks, generate content, and automate project workflows.',
    tags: ['project-management', 'ai-assistant', 'tasks', 'automation'],
    pricing: 'Freemium', use_cases: ['Project Management', 'Task Summaries', 'Content Drafting']
  },
  {
    id: 'elicit', name: 'Elicit', url: 'https://elicit.com/',
    category: 'Research', categories: ['Research'],
    icon: 'https://elicit.com/favicon.ico',
    description: 'AI research assistant that finds and summarizes academic papers. Extracts key findings and synthesizes across studies.',
    tags: ['research', 'academic', 'papers', 'synthesis'],
    pricing: 'Freemium', use_cases: ['Literature Review', 'Paper Summarization', 'Research Synthesis']
  },
  {
    id: 'consensus', name: 'Consensus', url: 'https://consensus.app/',
    category: 'Research', categories: ['Research'],
    icon: 'https://consensus.app/favicon.ico',
    description: 'AI search engine for scientific research. Ask questions in plain language and get evidence-based answers from peer-reviewed papers.',
    tags: ['research', 'science', 'evidence-based', 'academic'],
    pricing: 'Freemium', use_cases: ['Scientific Research', 'Evidence-Based Answers', 'Academic Writing']
  },
  {
    id: 'surfer-seo', name: 'Surfer SEO', url: 'https://surferseo.com/',
    category: 'Research', categories: ['Research', 'Writing'],
    icon: 'https://surferseo.com/favicon.ico',
    description: 'AI-powered SEO tool that analyzes top-ranking pages and provides content optimization recommendations.',
    tags: ['seo', 'content-optimization', 'ranking', 'keywords'],
    pricing: 'Paid', use_cases: ['SEO Optimization', 'Content Strategy', 'Keyword Research']
  },
  {
    id: 'meshy-ai', name: 'Meshy AI', url: 'https://www.meshy.ai/',
    category: '3D', categories: ['3D'],
    icon: 'https://www.meshy.ai/favicon.ico',
    description: 'AI 3D model generator. Create textured 3D models from text prompts or 2D images in minutes.',
    tags: ['3d-modeling', 'text-to-3d', 'texturing', 'game-assets'],
    pricing: 'Freemium', use_cases: ['3D Model Generation', 'Game Assets', 'Prototyping']
  },
  {
    id: 'tripo-ai', name: 'Tripo AI', url: 'https://www.tripo3d.ai/',
    category: '3D', categories: ['3D'],
    icon: 'https://www.tripo3d.ai/favicon.ico',
    description: 'Generate production-ready 3D models from text or images. Outputs clean meshes suitable for games and AR/VR.',
    tags: ['3d-modeling', 'text-to-3d', 'ar-vr', 'game-ready'],
    pricing: 'Freemium', use_cases: ['3D Asset Creation', 'AR/VR Content', 'Game Development']
  },
  {
    id: 'luma-ai', name: 'Luma AI (3D)', url: 'https://lumalabs.ai/',
    category: '3D', categories: ['3D'],
    icon: 'https://lumalabs.ai/favicon.ico',
    description: '3D capture and generation platform. Turn phone videos into photorealistic 3D scenes using NeRF technology.',
    tags: ['3d-capture', 'nerf', 'photogrammetry', 'scenes'],
    pricing: 'Freemium', use_cases: ['3D Scanning', 'Scene Capture', 'Virtual Tours']
  },
  {
    id: 'hubspot-ai', name: 'HubSpot AI', url: 'https://www.hubspot.com/',
    category: 'Business', categories: ['Business'],
    icon: 'https://www.hubspot.com/favicon.ico',
    description: 'AI tools built into HubSpot CRM. Generate emails, blog posts, and reports. AI chatbot for customer support.',
    tags: ['crm', 'marketing', 'sales', 'customer-support'],
    pricing: 'Freemium', use_cases: ['CRM Automation', 'Email Marketing', 'Customer Support']
  },
  {
    id: 'intercom-fin', name: 'Intercom Fin', url: 'https://www.intercom.com/',
    category: 'Business', categories: ['Business'],
    icon: 'https://www.intercom.com/favicon.ico',
    description: 'AI customer service agent by Intercom. Resolves support tickets automatically using your knowledge base.',
    tags: ['customer-support', 'chatbot', 'helpdesk', 'automation'],
    pricing: 'Paid', use_cases: ['Customer Support', 'Ticket Resolution', 'Knowledge Base']
  },
  {
    id: 'khanmigo', name: 'Khanmigo', url: 'https://www.khanacademy.org/khan-labs',
    category: 'Education', categories: ['Education'],
    icon: 'https://www.khanacademy.org/favicon.ico',
    description: 'AI tutor by Khan Academy. Guides students through problems with Socratic questioning instead of giving answers directly.',
    tags: ['education', 'tutoring', 'math', 'socratic-method'],
    pricing: 'Freemium', use_cases: ['Tutoring', 'Homework Help', 'Test Prep']
  },
  {
    id: 'quizlet-ai', name: 'Quizlet AI', url: 'https://quizlet.com/',
    category: 'Education', categories: ['Education'],
    icon: 'https://quizlet.com/favicon.ico',
    description: 'AI-enhanced study platform. Generates flashcards, practice tests, and personalized study plans from your notes.',
    tags: ['education', 'flashcards', 'study', 'personalized'],
    pricing: 'Freemium', use_cases: ['Flashcard Generation', 'Practice Tests', 'Study Planning']
  },
  {
    id: 'duolingo-max', name: 'Duolingo Max', url: 'https://www.duolingo.com/',
    category: 'Education', categories: ['Education'],
    icon: 'https://www.duolingo.com/favicon.ico',
    description: 'AI-powered language learning with GPT-4. Practice conversations with AI characters and get detailed explanations of mistakes.',
    tags: ['language-learning', 'ai-tutor', 'conversations', 'gamified'],
    pricing: 'Paid', use_cases: ['Language Learning', 'Conversation Practice', 'Grammar Explanations']
  },
];

async function migrate() {
  let client;
  try {
    client = await tryConnect();

    // Step 1: Add categories column if it doesn't exist
    console.log('\n── Step 1: Adding categories column ──');
    await client.query(`
      ALTER TABLE tools ADD COLUMN IF NOT EXISTS categories jsonb DEFAULT '[]'::jsonb;
    `);
    console.log('✓ categories column ready');

    // Step 2: Update categories for existing tools
    console.log('\n── Step 2: Updating categories for existing tools ──');
    let updated = 0;
    for (const [toolId, cats] of Object.entries(categoryMappings)) {
      const { rowCount } = await client.query(
        `UPDATE tools SET categories = $1::jsonb WHERE id = $2`,
        [JSON.stringify(cats), toolId]
      );
      if (rowCount > 0) updated++;
    }
    console.log(`✓ Updated categories for ${updated} existing tools`);

    // Step 3: Also update the primary category for re-categorized tools
    console.log('\n── Step 3: Updating primary categories for re-homed tools ──');
    const recategorized = {
      'jasper': 'Writing',
      'copy-ai': 'Writing',
      'notion-ai': 'Productivity',
      'gamma': 'Design',
      'tome': 'Design',
      'chronicle': 'Design',
      'crystal-knows': 'Business',
      'happenstance': 'Business',
      'pdfgear': 'Productivity',
      'wisdolia': 'Education',
      'ask-your-pdf': 'Research',
      'hugging-face': 'Coding',
      'promptbase': 'Coding',
      'perplexity': 'Research',
      'you-com': 'Research',
    };
    let rehomed = 0;
    for (const [toolId, newCategory] of Object.entries(recategorized)) {
      const { rowCount } = await client.query(
        `UPDATE tools SET category = $1 WHERE id = $2 AND category != $1`,
        [newCategory, toolId]
      );
      if (rowCount > 0) rehomed++;
    }
    console.log(`✓ Re-homed ${rehomed} tools to new primary categories`);

    // Step 4: Insert new tools
    console.log('\n── Step 4: Inserting new tools ──');
    let inserted = 0;
    let skipped = 0;
    for (const tool of newTools) {
      // Check if tool already exists
      const { rows } = await client.query('SELECT id FROM tools WHERE id = $1', [tool.id]);
      if (rows.length > 0) {
        skipped++;
        continue;
      }

      await client.query(
        `INSERT INTO tools (id, name, url, category, categories, icon, description, tags, pricing, use_cases, added_date)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9, $10, CURRENT_DATE)`,
        [
          tool.id, tool.name, tool.url, tool.category,
          JSON.stringify(tool.categories),
          tool.icon, tool.description,
          tool.tags, tool.pricing, tool.use_cases
        ]
      );
      inserted++;
    }
    console.log(`✓ Inserted ${inserted} new tools (${skipped} already existed)`);

    // Step 5: Summary
    const { rows: countRows } = await client.query('SELECT count(*) as total FROM tools');
    const { rows: catRows } = await client.query(
      "SELECT count(*) as with_cats FROM tools WHERE categories IS NOT NULL AND categories != '[]'::jsonb"
    );
    console.log(`\n── Summary ──`);
    console.log(`Total tools in DB: ${countRows[0].total}`);
    console.log(`Tools with categories: ${catRows[0].with_cats}`);
    console.log('\nMigration complete!');

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    if (client) await client.end();
  }
}

migrate();
