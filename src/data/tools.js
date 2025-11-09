// AI Tools data extracted from bookmarks
import { enhanceTool } from '../utils/toolHelpers.js';

const rawTools = [
  // Chat Tools
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    url: 'https://chat.openai.com/chat',
    category: 'Chat',
    icon: 'https://logo.clearbit.com/openai.com',
    description: 'Advanced AI chatbot by OpenAI for conversations, coding, analysis, and creative tasks.',
    tags: ['conversation', 'coding', 'analysis', 'writing', 'research'],
    pricing: 'Freemium',
    useCases: ['Content Writing', 'Code Generation', 'Research', 'Problem Solving'],
    addedDate: '2022-11-30',
    isNew: false
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    url: 'https://chat.deepseek.com/',
    category: 'Chat',
    icon: 'https://images.seeklogo.com/logo-png/61/2/deepseek-ai-icon-logo-png_seeklogo-611473.png',
    description: 'Advanced AI assistant focused on deep reasoning, coding, and complex problem-solving tasks with enhanced mathematical capabilities.'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    url: 'https://gemini.google.com/',
    category: 'Chat',
    icon: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/gemini-color.png',
    description: 'Google\'s advanced AI chatbot powered by Gemini, offering multimodal capabilities for conversations, analysis, and creative tasks.'
  },
  {
    id: 'you-com',
    name: 'You.com',
    url: 'https://you.com/?chatMode=default',
    category: 'Chat',
    icon: 'https://home.you.com/hs-fs/hubfs/Blog%20Posts/You_Com_Font.gif?width=900&height=506&name=You_Com_Font.gif',
    description: 'AI-powered search engine and chatbot that provides real-time web results and conversational answers to your queries.'
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    url: 'https://www.perplexity.ai/?login-source=floatingSignup',
    category: 'Chat',
    icon: 'https://logo.clearbit.com/perplexity.ai',
    description: 'AI-powered research assistant that combines search and chat to provide accurate, cited answers from the web.'
  },
  {
    id: 'claude',
    name: 'Claude',
    url: 'https://claude.ai/onboarding?returnTo=%2F%3F',
    category: 'Chat',
    icon: 'https://logo.clearbit.com/anthropic.com',
    description: 'Anthropic\'s AI assistant designed for helpful, harmless, and honest conversations with advanced reasoning capabilities.'
  },
  {
    id: 'microsoft-copilot',
    name: 'Microsoft Copilot',
    url: 'https://copilot.microsoft.com/',
    category: 'Chat',
    icon: 'https://store-images.s-microsoft.com/image/apps.21661.9007199267161390.afb6b8cd-d194-4a99-b633-03cd80118a21.e9a094be-ee73-4e19-8cdf-49a27b0974ed',
    description: 'Microsoft\'s AI assistant integrated with Bing, providing intelligent answers, creative content, and web search capabilities.'
  },
  
  // Image Tools
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    url: 'https://stablediffusionweb.com/#demo',
    category: 'Image',
    icon: 'https://stablediffusionweb.com/favicon.ico',
    description: 'Open-source AI image generation model that creates high-quality images from text prompts with fine-grained control.'
  },
  {
    id: 'bing-image-creator',
    name: 'Bing Image Creator',
    url: 'https://www.bing.com/create',
    category: 'Image',
    icon: 'https://st1.techlusive.in/wp-content/uploads/2023/05/Bing.jpg',
    description: 'Microsoft\'s AI image generator powered by DALL-E, creating images from text descriptions with creative freedom.'
  },
  {
    id: 'leonardo-ai',
    name: 'Leonardo.ai',
    url: 'https://app.leonardo.ai/ai-generations',
    category: 'Image',
    icon: 'https://logo.clearbit.com/leonardo.ai',
    description: 'Professional AI image generation platform with advanced models, fine-tuning capabilities, and creative tools for artists and designers.'
  },
  
  // Audio Tools
  {
    id: 'pixabay-music',
    name: 'Pixabay Music',
    url: 'https://pixabay.com/music/',
    category: 'Audio',
    icon: 'https://logo.clearbit.com/pixabay.com',
    description: 'Free royalty-free music library with thousands of tracks for videos, podcasts, and creative projects.'
  },
  {
    id: 'uberduck',
    name: 'Uberduck',
    url: 'https://uberduck.ai/',
    category: 'Audio',
    icon: 'https://logo.clearbit.com/uberduck.ai',
    description: 'AI voice synthesis platform with thousands of voices, including celebrity voices, for text-to-speech and voice cloning.'
  },
  {
    id: 'adobe-enhance',
    name: 'Adobe Enhance Speech',
    url: 'https://podcast.adobe.com/enhance',
    category: 'Audio',
    icon: 'https://www.adobe.com/favicon.ico',
    description: 'AI-powered tool that automatically removes background noise and enhances speech quality in audio recordings for podcasts and videos.'
  },
  
  // Video Tools
  {
    id: 'runway',
    name: 'Runway',
    url: 'https://app.runwayml.com/video-tools/teams/sumit749284/ai-tools',
    category: 'Video',
    icon: 'https://logo.clearbit.com/runwayml.com',
    description: 'Creative AI suite for video editing, generation, and manipulation with advanced tools for filmmakers and content creators.'
  },
  {
    id: 'd-id-video',
    name: 'D-ID Create Video',
    url: 'https://studio.d-id.com/editor',
    category: 'Video',
    icon: 'https://logo.clearbit.com/d-id.com',
    description: 'Create AI-powered talking avatar videos from text, turning photos into realistic speaking presenters for training, marketing, and content creation.',
    tags: ['video-generation', 'avatars', 'presentations', 'talking-head'],
    pricing: 'Freemium',
    useCases: ['Training Videos', 'Marketing', 'Presentations', 'Content Creation']
  },
  
  // Other Tools
  {
    id: 'agentgpt',
    name: 'AgentGPT',
    url: 'https://agentgpt.reworkd.ai/',
    category: 'Chat',
    icon: 'https://agentgpt.reworkd.ai/favicon.ico',
    description: 'Autonomous AI agents that can accomplish complex goals by breaking them down into smaller tasks and executing them independently.'
  },
  {
    id: 'wisdolia',
    name: 'Wisdolia',
    url: 'https://www.wisdolia.com/',
    category: 'Other',
    icon: 'https://logo.clearbit.com/wisdolia.com',
    name: 'Tome',
    url: 'https://tome.app/smaxiso',
    category: 'Other',
      },
  {
    id: 'pdfgear',
    name: 'PDFgear Chat',
    url: 'https://www.pdfgear.com/chat-pdf/',
    category: 'Other',
    icon: 'https://logo.clearbit.com/pdfgear.com',
    name: 'Simplified',
    url: 'https://app.simplified.com/home',
    category: 'Other',
      },
  {
    id: 'chat-d-id',
    name: 'Chat D-ID',
    url: 'https://chat.d-id.com/',
    category: 'Chat',
    icon: 'https://logo.clearbit.com/d-id.com',
    name: 'PromptBase',
    url: 'https://promptbase.com/',
    category: 'Other',
      },
  {
    id: 'phcode',
    name: 'PHCode',
    url: 'https://phcode.dev/',
    category: 'Other',
    icon: 'https://logo.clearbit.com/phcode.dev',
    name: 'NVIDIA Canvas',
    url: 'https://www.nvidia.com/en-us/studio/canvas/',
    category: 'Image',
      },
  {
    id: 'ask-your-pdf',
    name: 'Ask Your PDF',
    url: 'https://askyourpdf.com/',
    category: 'Other',
    icon: 'https://logo.clearbit.com/gamma.app',
    name: 'Gamma',
    url: 'https://gamma.app/docs/Untitled-pb9o4ohy1eg3fdu?mode=doc',
    category: 'Other',
      },
  
  // Additional Popular AI Tools
  {
    id: 'midjourney',
    name: 'Midjourney',
    url: 'https://www.midjourney.com/',
    category: 'Image',
    icon: 'https://logo.clearbit.com/midjourney.com',
    description: 'Leading AI art generator creating stunning, highly-detailed images from text descriptions through Discord, popular among artists and designers.',
    tags: ['art', 'image-generation', 'discord', 'creative'],
    pricing: 'Paid',
    useCases: ['Digital Art', 'Concept Art', 'Illustrations', 'Creative Design']
  },
  {
    id: 'dalle',
    name: 'DALL-E',
    url: 'https://openai.com/dall-e-3',
    category: 'Image',
    icon: 'https://openai.com/favicon.ico',
    description: 'OpenAI\'s advanced image generation model that creates realistic and artistic images from natural language descriptions with high accuracy.',
    tags: ['image-generation', 'openai', 'art', 'creative'],
    pricing: 'Paid',
    useCases: ['Image Generation', 'Creative Content', 'Marketing Assets', 'Concept Visualization']
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    url: 'https://elevenlabs.io/',
    category: 'Audio',
    icon: 'https://logo.clearbit.com/elevenlabs.io',
    description: 'State-of-the-art AI voice synthesis platform with realistic text-to-speech, voice cloning, and multilingual support for content creators.',
    tags: ['voice-synthesis', 'text-to-speech', 'voice-cloning', 'audio'],
    pricing: 'Freemium',
    useCases: ['Voice Over', 'Audiobooks', 'Podcasts', 'Video Narration']
  },
  {
    id: 'suno',
    name: 'Suno',
    url: 'https://www.suno.ai/',
    category: 'Audio',
    icon: 'https://logo.clearbit.com/suno.ai',
    description: 'AI music generation platform that creates complete songs with vocals and instrumentals from text prompts, revolutionizing music creation.',
    tags: ['music-generation', 'songwriting', 'ai-music', 'audio'],
    pricing: 'Freemium',
    useCases: ['Music Creation', 'Songwriting', 'Background Music', 'Audio Production']
  },
  {
    id: 'pika-labs',
    name: 'Pika Labs',
    url: 'https://pika.art/',
    category: 'Video',
    icon: 'https://pika.art/favicon.ico',
    description: 'AI video generation platform that creates and edits videos from text prompts, enabling easy video creation and manipulation.',
    tags: ['video-generation', 'video-editing', 'ai-video', 'creative'],
    pricing: 'Freemium',
    useCases: ['Video Creation', 'Video Editing', 'Social Media Content', 'Creative Projects']
  },
  {
    id: 'synthesia',
    name: 'Synthesia',
    url: 'https://www.synthesia.io/',
    category: 'Video',
    icon: 'https://logo.clearbit.com/synthesia.io',
    description: 'Professional AI video creation platform with realistic avatars and voices, perfect for training videos, presentations, and marketing content.',
    tags: ['video-generation', 'avatars', 'presentations', 'training'],
    pricing: 'Paid',
    useCases: ['Training Videos', 'Corporate Communications', 'Marketing', 'Presentations']
  },
  {
    id: 'notion-ai',
    name: 'Notion AI',
    url: 'https://www.notion.so/product/ai',
    category: 'Chat',
    icon: 'https://logo.clearbit.com/notion.so',
    description: 'AI writing assistant integrated into Notion workspace, helping with brainstorming, content creation, summarization, and task automation.',
    tags: ['writing', 'productivity', 'workspace', 'note-taking'],
    pricing: 'Paid',
    useCases: ['Writing', 'Note Taking', 'Task Management', 'Content Creation']
  },
  {
    id: 'cursor',
    name: 'Cursor',
    url: 'https://cursor.sh/',
    category: 'Other',
    icon: 'https://logo.clearbit.com/cursor.com',
    description: 'AI-powered code editor built for pair programming with AI, offering intelligent code completion, refactoring, and generation.',
    tags: ['coding', 'development', 'ide', 'programming'],
    pricing: 'Freemium',
    useCases: ['Code Development', 'Programming', 'Software Engineering', 'Code Review']
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    url: 'https://github.com/copilot',
    category: 'Other',
    icon: 'https://logo.clearbit.com/github.com',
    description: 'AI pair programmer by GitHub and OpenAI that suggests code completions, entire functions, and helps developers code faster.',
    tags: ['coding', 'development', 'github', 'programming'],
    pricing: 'Paid',
    useCases: ['Code Completion', 'Programming', 'Software Development', 'Code Suggestions']
  },
  {
    id: 'adobe-firefly',
    name: 'Adobe Firefly',
    url: 'https://firefly.adobe.com/',
    category: 'Image',
    icon: 'https://www.adobe.com/favicon.ico',
    description: 'Adobe\'s creative AI platform for generating images, text effects, and design elements, integrated with Adobe Creative Cloud.',
    tags: ['image-generation', 'adobe', 'design', 'creative'],
    pricing: 'Freemium',
    useCases: ['Graphic Design', 'Marketing Materials', 'Creative Content', 'Digital Art']
  },
  {
    id: 'jasper',
    name: 'Jasper',
    url: 'https://www.jasper.ai/',
    category: 'Other',
    icon: 'https://logo.clearbit.com/jasper.ai',
    description: 'AI content creation platform specializing in marketing copy, blog posts, social media content, and business communications.',
    tags: ['writing', 'marketing', 'content-creation', 'copywriting'],
    pricing: 'Paid',
    useCases: ['Marketing Copy', 'Blog Writing', 'Social Media', 'Content Marketing']
  },
  {
    id: 'copy-ai',
    name: 'Copy.ai',
    url: 'https://www.copy.ai/',
    category: 'Other',
    icon: 'https://logo.clearbit.com/copy.ai',
    description: 'AI-powered copywriting tool that generates marketing content, product descriptions, social posts, and creative copy in seconds.',
    tags: ['copywriting', 'marketing', 'content-creation', 'writing'],
    pricing: 'Freemium',
    useCases: ['Copywriting', 'Marketing Content', 'Product Descriptions', 'Social Media']
  },
  {
    id: 'poe',
    name: 'Poe',
    url: 'https://poe.com/',
    category: 'Chat',
    icon: 'https://logo.clearbit.com/poe.com',
    description: 'Quora\'s AI platform providing access to multiple AI chatbots including GPT-4, Claude, and custom bots in one interface.',
    tags: ['chatbot', 'multi-model', 'conversation', 'ai-access'],
    pricing: 'Freemium',
    useCases: ['Multi-Model Chat', 'AI Comparison', 'Conversations', 'Custom Bots']
  },
  {
    id: 'character-ai',
    name: 'Character.AI',
    url: 'https://character.ai/',
    category: 'Chat',
    icon: 'https://logo.clearbit.com/character.ai',
    description: 'Conversational AI platform for chatting with AI characters, including historical figures, fictional characters, and custom personalities.',
    tags: ['chatbot', 'roleplay', 'conversation', 'entertainment'],
    pricing: 'Freemium',
    useCases: ['Entertainment', 'Roleplay', 'Learning', 'Creative Writing']
  },
  {
    id: 'hugging-face',
    name: 'Hugging Face',
    url: 'https://huggingface.co/',
    category: 'Other',
    icon: 'https://logo.clearbit.com/huggingface.co',
    description: 'Leading AI community platform hosting thousands of pre-trained models, datasets, and tools for machine learning and NLP tasks.',
    tags: ['ml-platform', 'models', 'datasets', 'development'],
    pricing: 'Freemium',
    useCases: ['Model Hosting', 'ML Development', 'Research', 'AI Deployment']
  }
];

// Enhance all tools with default metadata
export const aiTools = rawTools.map(tool => enhanceTool(tool));

// Category colors for visual distinction - Enhanced with more vibrant but subtle colors
export const categoryColors = {
  Chat: '#6BB6FF',      // Vibrant sky blue
  Image: '#A78BFA',     // Rich lavender purple
  Audio: '#34D399',     // Fresh mint green
  Video: '#FB7185',     // Soft coral pink
  Other: '#C084FC'      // Bright purple
};

