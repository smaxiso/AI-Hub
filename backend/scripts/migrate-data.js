const { Client } = require('pg');
require('dotenv').config();

const tryConnect = async () => {
    const connectionStrings = [
        process.env.DATABASE_URL_IPV6,
        process.env.DATABASE_URL_IPV4_SESSION_POOLER,
        process.env.DATABASE_URL_IPV4_TRANSACTION_POOLER
    ].filter(Boolean);

    for (const connectionString of connectionStrings) {
        console.log(`Trying connection...`);
        const client = new Client({ connectionString });
        try {
            await client.connect();
            console.log('Connected successfully!');
            return client;
        } catch (err) {
            console.warn(`Connection failed: ${err.message}. Retrying with next URL...`);
        }
    }
    throw new Error('All connection attempts failed.');
};

const rawTools = [
    // --- TRENDING FROM VIDEO (Raj Shamani x Vaibhav Sisinty) ---
    {
        id: 'genspark',
        name: 'Genspark',
        url: 'https://www.genspark.ai/',
        category: 'Agent',
        icon: 'https://genspark.ai/favicon.ico',
        description: 'An AI agent for deep research. It reads multiple sources, cross-checks facts, and generates consolidated reports or "Sparkpages" autonomously.',
        tags: ['research', 'agent', 'deep-search', 'autonomous'],
        pricing: 'Free',
        useCases: ['Market Research', 'Fact Checking', 'Topic Deep Dives'],
        addedDate: '2025-02-20',
        isNew: true
    },
    {
        id: 'crystal-knows',
        name: 'Crystal Knows',
        url: 'https://www.crystalknows.com/',
        category: 'Other',
        icon: 'https://logo.clearbit.com/crystalknows.com',
        description: 'A "personality AI" that analyzes LinkedIn profiles to tell you exactly how to communicate, sell to, or negotiate with anyone.',
        tags: ['sales', 'psychology', 'linkedin', 'communication'],
        pricing: 'Freemium',
        useCases: ['Sales Calls', 'Hiring', 'Negotiations'],
        addedDate: '2025-02-20',
        isNew: true
    },
    {
        id: 'happenstance',
        name: 'Happenstance',
        url: 'https://happenstance.ai/',
        category: 'Other',
        icon: 'https://happenstance.ai/favicon.ico',
        description: 'A deep search engine for people that connects your email and socials to find the best warm introduction path to anyone you want to meet.',
        tags: ['networking', 'connections', 'email', 'social-graph'],
        pricing: 'Paid',
        useCases: ['Networking', 'Fundraising', 'Job Hunting'],
        addedDate: '2025-02-20',
        isNew: true
    },
    {
        id: 'wispr-flow',
        name: 'Wispr Flow',
        url: 'https://www.wisprflow.ai/',
        category: 'Audio',
        icon: 'https://logo.clearbit.com/wisprflow.ai',
        description: 'A dictation tool that types what you speak instantly across any app on your computer. Used for writing emails and prompts 3x faster.',
        tags: ['dictation', 'productivity', 'voice-to-text', 'writing'],
        pricing: 'Paid',
        useCases: ['Writing Emails', 'Drafting Content', 'Voice Commands'],
        addedDate: '2025-02-20',
        isNew: true
    },
    {
        id: 'chronicle',
        name: 'Chronicle',
        url: 'https://chroniclehq.com/',
        category: 'Other',
        icon: 'https://chroniclehq.com/favicon.ico',
        description: 'A modern presentation tool focused on storytelling and design. Often called "The Apple of presentation design" for its high-end aesthetic.',
        tags: ['presentation', 'design', 'storytelling', 'deck'],
        pricing: 'Paid',
        useCases: ['Pitch Decks', 'High-Stakes Presentations'],
        addedDate: '2025-02-20',
        isNew: true
    },
    {
        id: 'sora',
        name: 'Sora',
        url: 'https://openai.com/sora',
        category: 'Video',
        icon: 'https://openai.com/favicon.ico',
        description: 'OpenAI\'s text-to-video model capable of generating minute-long videos with high visual quality and adherence to the user\'s prompt.',
        tags: ['video-generation', 'openai', 'cinematic', 'realistic'],
        pricing: 'Paid',
        useCases: ['Creative Video', 'Storytelling', 'Simulation'],
        addedDate: '2025-02-20',
        isNew: true
    },

    // --- NEW 2025 ADDITIONS (Agents & Coding) ---
    {
        id: 'windsurf',
        name: 'Windsurf',
        url: 'https://codeium.com/windsurf',
        category: 'Coding',
        icon: 'https://windsurf.com/favicon.ico',
        description: 'The first agentic IDE that acts as a pair programmer. Its "Cascade" flow predicts your next move and edits multiple files deeply.',
        tags: ['coding', 'ide', 'agentic', 'development'],
        pricing: 'Freemium',
        useCases: ['Full Stack Development', 'Code Refactoring', 'Bug Fixing'],
        addedDate: '2025-01-15',
        isNew: true
    },
    {
        id: 'antigravity',
        name: 'Antigravity',
        url: 'https://antigravity.google/',
        category: 'Coding',
        icon: '/logos/antigravity.png',
        description: 'A powerful agentic AI coding assistant designed by the Google DeepMind team working on Advanced Agentic Coding.',
        tags: ['coding', 'agent', 'google', 'deepmind'],
        pricing: 'Free',
        useCases: ['Pair Programming', 'Complex Refactoring', 'Agentic Workflows'],
        addedDate: '2025-11-18',
        isNew: true
    },
    {
        id: 'bolt-new',
        name: 'Bolt.new',
        url: 'https://bolt.new/',
        category: 'Coding',
        icon: 'https://bolt.new/favicon.ico',
        description: 'Prompt-to-production web development environment. Build, run, and deploy full-stack applications directly in your browser.',
        tags: ['web-development', 'app-builder', 'deployment'],
        pricing: 'Freemium',
        useCases: ['Rapid Prototyping', 'MVP Creation', 'Web Apps'],
        addedDate: '2025-02-01',
        isNew: true
    },
    {
        id: 'lovable',
        name: 'Lovable',
        url: 'https://lovable.dev/',
        category: 'Coding',
        icon: 'https://lovable.dev/favicon.ico',
        description: 'AI app builder that turns text into beautiful, production-ready web apps. Specializes in generating high-quality UI/UX designs.',
        tags: ['app-builder', 'ui-design', 'no-code'],
        pricing: 'Paid',
        useCases: ['Dashboard Creation', 'SaaS MVP', 'UI Generation'],
        addedDate: '2025-02-10',
        isNew: true
    },
    {
        id: 'devin',
        name: 'Devin',
        url: 'https://devin.ai/',
        category: 'Agent',
        icon: 'https://devin.ai/favicon.ico',
        description: 'The first fully autonomous AI software engineer. Devin can plan, code, debug, and deploy entire software projects on its own.',
        tags: ['autonomous', 'software-engineer', 'agent'],
        pricing: 'Paid',
        useCases: ['End-to-End Development', 'Autonomous Coding', 'Legacy Migration'],
        addedDate: '2025-01-05',
        isNew: true
    },
    {
        id: 'cursor',
        name: 'Cursor',
        url: 'https://cursor.sh/',
        category: 'Coding',
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
        category: 'Coding',
        icon: 'https://logo.clearbit.com/github.com',
        description: 'AI pair programmer by GitHub and OpenAI that suggests code completions, entire functions, and helps developers code faster.',
        tags: ['coding', 'development', 'github', 'programming'],
        pricing: 'Paid',
        useCases: ['Code Completion', 'Programming', 'Software Development', 'Code Suggestions']
    },
    {
        id: 'agentgpt',
        name: 'AgentGPT',
        url: 'https://agentgpt.reworkd.ai/',
        category: 'Agent',
        icon: 'https://agentgpt.reworkd.ai/favicon.ico',
        description: 'Autonomous AI agents that can accomplish complex goals by breaking them down into smaller tasks and executing them independently.',
        tags: ['autonomous', 'task-runner', 'agent', 'productivity'],
        pricing: 'Freemium',
        useCases: ['Project Planning', 'Research Automation', 'Task Execution']
    },
    {
        id: 'auto-gpt',
        name: 'AutoGPT',
        url: 'https://news.agpt.co/',
        category: 'Agent',
        icon: 'https://news.agpt.co/favicon.ico',
        description: 'An experimental open-source attempt to make GPT-4 fully autonomous, capable of chaining thoughts to achieve broad goals.',
        tags: ['autonomous', 'open-source', 'experimental'],
        pricing: 'Free',
        useCases: ['Complex Task Automation', 'Internet Research', 'Goal Execution'],
        addedDate: '2025-01-20'
    },

    // --- MEDIA & CHAT ---
    {
        id: 'kling-ai',
        name: 'Kling AI',
        url: 'https://klingai.com/',
        category: 'Video',
        icon: 'https://klingai.com/favicon.ico',
        description: 'High-fidelity AI video generator capable of producing realistic 5-second clips with advanced motion physics.',
        tags: ['video-generation', 'realistic-motion', 'cinematic'],
        pricing: 'Freemium',
        useCases: ['Commercial Ads', 'Social Media Clips'],
        addedDate: '2024-12-20',
        isNew: true
    },
    {
        id: 'hailuo',
        name: 'Hailuo (MiniMax)',
        url: 'https://hailuoai.video/',
        category: 'Video',
        icon: 'https://hailuoai.video/favicon.ico',
        description: 'Video generation model known for exceptional prompt adherence and fluid human movement.',
        tags: ['video-generation', 'character-animation', 'creative'],
        pricing: 'Free',
        useCases: ['Character Animation', 'Storytelling', 'Music Videos'],
        addedDate: '2025-01-05',
        isNew: true
    },
    {
        id: 'recraft',
        name: 'Recraft V3',
        url: 'https://www.recraft.ai/',
        category: 'Image',
        icon: 'https://www.recraft.ai/favicon.ico',
        description: 'The first AI image generator for professionals that creates editable vector art (SVG) and brand-consistent graphics.',
        tags: ['vector-art', 'graphic-design', 'svg'],
        pricing: 'Freemium',
        useCases: ['Logo Design', 'Icon Sets', 'Vector Illustration'],
        addedDate: '2025-03-01',
        isNew: true
    },
    {
        id: 'deepseek',
        name: 'DeepSeek',
        url: 'https://chat.deepseek.com/',
        category: 'Chat',
        icon: 'https://chat.deepseek.com/favicon.ico',
        description: 'A powerful open-model LLM that excels in coding and mathematics, offering performance comparable to top proprietary models.',
        tags: ['coding', 'math', 'open-model'],
        pricing: 'Free',
        useCases: ['Complex Coding', 'Math Problems'],
        addedDate: '2025-01-01',
        isNew: true
    },
    {
        id: 'grok-3',
        name: 'Grok 3',
        url: 'https://grok.x.ai/',
        category: 'Chat',
        icon: 'https://grok.x.ai/favicon.ico',
        description: 'xAI\'s latest model featuring "Think" mode for deep reasoning and real-time access to X (Twitter) data.',
        tags: ['real-time', 'uncensored', 'reasoning'],
        pricing: 'Paid',
        useCases: ['Real-time Research', 'Unfiltered Answers', 'Data Analysis'],
        addedDate: '2025-02-15',
        isNew: true
    },

    // --- EXISTING TOOLS ---
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
        addedDate: '2022-11-30'
    },
    {
        id: 'gemini',
        name: 'Gemini',
        url: 'https://gemini.google.com/',
        category: 'Chat',
        icon: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/gemini-color.png',
        description: 'Google\'s advanced AI chatbot powered by Gemini, offering multimodal capabilities for conversations, analysis, and creative tasks.',
        tags: ['multimodal', 'google', 'analysis'],
        pricing: 'Freemium',
        useCases: ['Data Analysis', 'Creative Writing', 'Coding']
    },
    {
        id: 'claude',
        name: 'Claude',
        url: 'https://claude.ai/',
        category: 'Chat',
        icon: 'https://logo.clearbit.com/anthropic.com',
        description: 'Anthropic\'s AI assistant designed for helpful, harmless, and honest conversations with advanced reasoning capabilities.',
        tags: ['reasoning', 'coding', 'writing'],
        pricing: 'Freemium',
        useCases: ['Complex Reasoning', 'Coding', 'Creative Writing']
    },
    {
        id: 'perplexity',
        name: 'Perplexity',
        url: 'https://www.perplexity.ai/',
        category: 'Chat',
        icon: 'https://logo.clearbit.com/perplexity.ai',
        description: 'AI-powered research assistant that combines search and chat to provide accurate, cited answers from the web.',
        tags: ['search', 'research', 'citations'],
        pricing: 'Freemium',
        useCases: ['Web Research', 'Fact Checking', 'Academic Search']
    },
    {
        id: 'microsoft-copilot',
        name: 'Microsoft Copilot',
        url: 'https://copilot.microsoft.com/',
        category: 'Chat',
        icon: 'https://store-images.s-microsoft.com/image/apps.21661.9007199267161390.afb6b8cd-d194-4a99-b633-03cd80118a21.e9a094be-ee73-4e19-8cdf-49a27b0974ed',
        description: 'Microsoft\'s AI assistant integrated with Bing, providing intelligent answers, creative content, and web search capabilities.',
        tags: ['productivity', 'search', 'microsoft'],
        pricing: 'Freemium',
        useCases: ['Office Productivity', 'Web Search', 'Content Creation']
    },
    {
        id: 'you-com',
        name: 'You.com',
        url: 'https://you.com/?chatMode=default',
        category: 'Chat',
        icon: 'https://home.you.com/hs-fs/hubfs/Blog%20Posts/You_Com_Font.gif?width=900&height=506&name=You_Com_Font.gif',
        description: 'AI-powered search engine and chatbot that provides real-time web results and conversational answers.',
        tags: ['search', 'privacy', 'chat'],
        pricing: 'Freemium',
        useCases: ['Private Search', 'Quick Answers']
    },
    {
        id: 'poe',
        name: 'Poe',
        url: 'https://poe.com/',
        category: 'Chat',
        icon: 'https://logo.clearbit.com/poe.com',
        description: 'Quora\'s AI platform providing access to multiple AI chatbots including GPT-4, Claude, and custom bots in one interface.',
        tags: ['chatbot', 'multi-model', 'conversation'],
        pricing: 'Freemium',
        useCases: ['Multi-Model Chat', 'AI Comparison']
    },
    {
        id: 'character-ai',
        name: 'Character.AI',
        url: 'https://character.ai/',
        category: 'Chat',
        icon: 'https://logo.clearbit.com/character.ai',
        description: 'Conversational AI platform for chatting with AI characters, including historical figures, fictional characters, and custom personalities.',
        tags: ['chatbot', 'roleplay', 'entertainment'],
        pricing: 'Freemium',
        useCases: ['Entertainment', 'Roleplay', 'Creative Writing']
    },
    {
        id: 'notion-ai',
        name: 'Notion AI',
        url: 'https://www.notion.so/product/ai',
        category: 'Chat',
        icon: 'https://logo.clearbit.com/notion.so',
        description: 'AI writing assistant integrated into Notion workspace, helping with brainstorming, content creation, and summarization.',
        tags: ['productivity', 'writing', 'workspace'],
        pricing: 'Paid',
        useCases: ['Writing', 'Note Taking', 'Task Management']
    },

    // Image Tools
    {
        id: 'midjourney',
        name: 'Midjourney',
        url: 'https://www.midjourney.com/',
        category: 'Image',
        icon: 'https://logo.clearbit.com/midjourney.com',
        description: 'Leading AI art generator creating stunning, highly-detailed images from text descriptions through Discord.',
        tags: ['art', 'image-generation', 'discord'],
        pricing: 'Paid',
        useCases: ['Digital Art', 'Concept Art', 'Illustrations']
    },
    {
        id: 'dalle',
        name: 'DALL-E 3',
        url: 'https://openai.com/dall-e-3',
        category: 'Image',
        icon: 'https://openai.com/favicon.ico',
        description: 'OpenAI\'s advanced image generation model that creates realistic and artistic images from natural language descriptions.',
        tags: ['image-generation', 'openai', 'art'],
        pricing: 'Paid',
        useCases: ['Image Generation', 'Marketing Assets']
    },
    {
        id: 'stable-diffusion',
        name: 'Stable Diffusion',
        url: 'https://stablediffusionweb.com/#demo',
        category: 'Image',
        icon: 'https://stablediffusionweb.com/favicon.ico',
        description: 'Open-source AI image generation model that creates high-quality images from text prompts with fine-grained control.',
        tags: ['image-generation', 'open-source', 'art'],
        pricing: 'Free',
        useCases: ['Custom Art', 'Local Generation']
    },
    {
        id: 'leonardo-ai',
        name: 'Leonardo.ai',
        url: 'https://leonardo.ai/',
        category: 'Image',
        icon: 'https://logo.clearbit.com/leonardo.ai',
        description: 'Professional AI image generation platform with advanced models, fine-tuning capabilities, and creative tools.',
        tags: ['art', 'game-assets', 'design'],
        pricing: 'Freemium',
        useCases: ['Game Assets', 'Character Design']
    },
    {
        id: 'adobe-firefly',
        name: 'Adobe Firefly',
        url: 'https://firefly.adobe.com/',
        category: 'Image',
        icon: 'https://www.adobe.com/favicon.ico',
        description: 'Adobe\'s creative AI platform for generating images, text effects, and design elements, integrated with Creative Cloud.',
        tags: ['design', 'adobe', 'creative'],
        pricing: 'Freemium',
        useCases: ['Graphic Design', 'Commercial Art']
    },
    {
        id: 'bing-image-creator',
        name: 'Bing Image Creator',
        url: 'https://www.bing.com/create',
        category: 'Image',
        icon: 'https://st1.techlusive.in/wp-content/uploads/2023/05/Bing.jpg',
        description: 'Microsoft\'s AI image generator powered by DALL-E, creating images from text descriptions.',
        tags: ['image-generation', 'microsoft', 'dall-e'],
        pricing: 'Free',
        useCases: ['Quick Image Generation', 'Social Media']
    },
    {
        id: 'nvidia-canvas',
        name: 'NVIDIA Canvas',
        url: 'https://www.nvidia.com/en-us/studio/canvas/',
        category: 'Image',
        icon: 'https://logo.clearbit.com/nvidia.com',
        description: 'Turn simple brushstrokes into realistic landscape images with the power of AI.',
        tags: ['landscape', 'painting', 'real-time'],
        pricing: 'Free',
        useCases: ['Concept Art', 'Background Creation']
    },

    // Audio Tools
    {
        id: 'elevenlabs',
        name: 'ElevenLabs',
        url: 'https://elevenlabs.io/',
        category: 'Audio',
        icon: 'https://logo.clearbit.com/elevenlabs.io',
        description: 'State-of-the-art AI voice synthesis platform with realistic text-to-speech and voice cloning.',
        tags: ['voice-synthesis', 'text-to-speech', 'voice-cloning'],
        pricing: 'Freemium',
        useCases: ['Voice Over', 'Audiobooks', 'Video Narration']
    },
    {
        id: 'suno',
        name: 'Suno',
        url: 'https://www.suno.ai/',
        category: 'Audio',
        icon: 'https://logo.clearbit.com/suno.ai',
        description: 'AI music generation platform that creates complete songs with vocals and instrumentals from text prompts.',
        tags: ['music-generation', 'songwriting', 'audio'],
        pricing: 'Freemium',
        useCases: ['Music Creation', 'Background Music']
    },
    {
        id: 'udio',
        name: 'Udio',
        url: 'https://www.udio.com/',
        category: 'Audio',
        icon: 'https://www.udio.com/favicon.ico',
        description: 'High-fidelity AI music generator known for emotional vocals and complex musical structures.',
        tags: ['music-generation', 'vocals', 'songwriting'],
        pricing: 'Freemium',
        useCases: ['Song Production', 'Creative Inspiration'],
        addedDate: '2024-12-10'
    },
    {
        id: 'adobe-enhance',
        name: 'Adobe Enhance Speech',
        url: 'https://podcast.adobe.com/enhance',
        category: 'Audio',
        icon: 'https://www.adobe.com/favicon.ico',
        description: 'AI-powered tool that automatically removes background noise and enhances speech quality in audio recordings.',
        tags: ['audio-enhancement', 'podcast', 'cleaning'],
        pricing: 'Free',
        useCases: ['Podcasting', 'Voice Fixing']
    },
    {
        id: 'uberduck',
        name: 'Uberduck',
        url: 'https://uberduck.ai/',
        category: 'Audio',
        icon: 'https://logo.clearbit.com/uberduck.ai',
        description: 'AI voice synthesis platform with thousands of celebrity and custom voices.',
        tags: ['voice-synthesis', 'rap', 'celebrity-voices'],
        pricing: 'Freemium',
        useCases: ['Creative Audio', 'Memes']
    },
    {
        id: 'pixabay-music',
        name: 'Pixabay Music',
        url: 'https://pixabay.com/music/',
        category: 'Audio',
        icon: 'https://logo.clearbit.com/pixabay.com',
        description: 'Free royalty-free music library with thousands of tracks for videos and projects.',
        tags: ['stock-music', 'royalty-free'],
        pricing: 'Free',
        useCases: ['Video Background', 'Podcasts']
    },

    // Video Tools
    {
        id: 'runway',
        name: 'Runway',
        url: 'https://runwayml.com/',
        category: 'Video',
        icon: 'https://logo.clearbit.com/runwayml.com',
        description: 'Creative AI suite for video editing, generation, and manipulation with advanced tools like Gen-2.',
        tags: ['video-generation', 'editing', 'vfx'],
        pricing: 'Freemium',
        useCases: ['Filmmaking', 'Video Editing', 'VFX']
    },
    {
        id: 'pika-labs',
        name: 'Pika Labs',
        url: 'https://pika.art/',
        category: 'Video',
        icon: 'https://pika.art/favicon.ico',
        description: 'AI video generation platform that creates and edits videos from text prompts.',
        tags: ['video-generation', 'animation', 'creative'],
        pricing: 'Freemium',
        useCases: ['Animation', 'Social Media Content']
    },
    {
        id: 'synthesia',
        name: 'Synthesia',
        url: 'https://www.synthesia.io/',
        category: 'Video',
        icon: 'https://logo.clearbit.com/synthesia.io',
        description: 'Professional AI video creation platform with realistic avatars and voices.',
        tags: ['avatars', 'presentation', 'corporate'],
        pricing: 'Paid',
        useCases: ['Training Videos', 'Corporate Comms']
    },
    {
        id: 'd-id-video',
        name: 'D-ID',
        url: 'https://studio.d-id.com/',
        category: 'Video',
        icon: 'https://logo.clearbit.com/d-id.com',
        description: 'Create AI-powered talking avatar videos from photos and text.',
        tags: ['talking-head', 'animation', 'photos'],
        pricing: 'Freemium',
        useCases: ['Marketing', 'Personalized Video']
    },

    // Other Tools
    {
        id: 'hugging-face',
        name: 'Hugging Face',
        url: 'https://huggingface.co/',
        category: 'Other',
        icon: 'https://logo.clearbit.com/huggingface.co',
        description: 'Leading AI community platform hosting thousands of pre-trained models, datasets, and demos.',
        tags: ['open-source', 'models', 'community'],
        pricing: 'Free',
        useCases: ['Model Discovery', 'Hosting', 'Testing']
    },
    {
        id: 'jasper',
        name: 'Jasper',
        url: 'https://www.jasper.ai/',
        category: 'Other',
        icon: 'https://logo.clearbit.com/jasper.ai',
        description: 'AI content creation platform specializing in marketing copy and business content.',
        tags: ['marketing', 'copywriting', 'business'],
        pricing: 'Paid',
        useCases: ['Marketing Copy', 'Blog Posts']
    },
    {
        id: 'copy-ai',
        name: 'Copy.ai',
        url: 'https://www.copy.ai/',
        category: 'Other',
        icon: 'https://logo.clearbit.com/copy.ai',
        description: 'AI-powered copywriting tool that generates marketing content and descriptions in seconds.',
        tags: ['copywriting', 'marketing', 'social-media'],
        pricing: 'Freemium',
        useCases: ['Social Media Posts', 'Ad Copy']
    },
    {
        id: 'phcode',
        name: 'PHCode',
        url: 'https://phcode.dev/',
        category: 'Coding',
        icon: 'https://logo.clearbit.com/phcode.dev',
        description: 'A powerful web-based code editor for frontend development.',
        tags: ['editor', 'web-dev', 'coding'],
        pricing: 'Free',
        useCases: ['Web Development', 'Quick Edits']
    },
    {
        id: 'gamma',
        name: 'Gamma',
        url: 'https://gamma.app/',
        category: 'Other',
        icon: 'https://logo.clearbit.com/gamma.app',
        description: 'AI-powered medium for presenting ideas, creating decks, documents, and webpages.',
        tags: ['presentation', 'design', 'productivity'],
        pricing: 'Freemium',
        useCases: ['Presentations', 'Docs', 'Webpages']
    },
    {
        id: 'tome',
        name: 'Tome',
        url: 'https://beta.tome.app/',
        category: 'Other',
        icon: 'https://logo.clearbit.com/tome.app',
        description: 'AI storytelling format that helps you create polished presentations and documents.',
        tags: ['storytelling', 'presentation', 'business'],
        pricing: 'Freemium',
        useCases: ['Pitch Decks', 'Storytelling']
    },
    {
        id: 'pdfgear',
        name: 'PDFgear',
        url: 'https://www.pdfgear.com/chat-pdf/',
        category: 'Other',
        icon: 'https://logo.clearbit.com/pdfgear.com',
        description: 'Interact with your PDF documents using AI chat to summarize and extract info.',
        tags: ['pdf', 'productivity', 'analysis'],
        pricing: 'Free',
        useCases: ['Document Analysis', 'Summarization']
    },
    {
        id: 'wisdolia',
        name: 'Wisdolia',
        url: 'https://www.wisdolia.com/',
        category: 'Other',
        icon: 'https://logo.clearbit.com/wisdolia.com',
        description: 'AI that generates flashcards and quizzes from any article, PDF, or YouTube video.',
        tags: ['education', 'study', 'flashcards'],
        pricing: 'Freemium',
        useCases: ['Studying', 'Learning']
    },
    {
        id: 'ask-your-pdf',
        name: 'Ask Your PDF',
        url: 'https://askyourpdf.com/',
        category: 'Other',
        icon: 'https://logo.clearbit.com/askyourpdf.com',
        description: 'Turn your PDF documents into a chatbot to answer questions and find information.',
        tags: ['pdf', 'chat', 'research'],
        pricing: 'Freemium',
        useCases: ['Research', 'Document Q&A']
    },
    {
        id: 'promptbase',
        name: 'PromptBase',
        url: 'https://promptbase.com/',
        category: 'Other',
        icon: 'https://logo.clearbit.com/promptbase.com',
        description: 'Marketplace for buying and selling quality prompts for DALL-E, GPT, Midjourney, etc.',
        tags: ['marketplace', 'prompts', 'resources'],
        pricing: 'Paid',
        useCases: ['Finding Prompts', 'Selling Prompts']
    }
];

const insertQuery = `
  INSERT INTO tools(id, name, url, category, icon, description, tags, pricing, use_cases, added_date)
  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  ON CONFLICT(id) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    category = EXCLUDED.category,
    icon = EXCLUDED.icon,
    description = EXCLUDED.description,
    tags = EXCLUDED.tags,
    pricing = EXCLUDED.pricing,
    use_cases = EXCLUDED.use_cases,
    added_date = EXCLUDED.added_date;
`;

async function migrate() {
    let client;
    try {
        client = await tryConnect();

        console.log(`Starting migration for ${rawTools.length} tools...`);

        for (const tool of rawTools) {
            // Determine added_date: Use existing, or default to old date (2023-01-01) if missing
            const addedDate = tool.addedDate || '2023-01-01';

            const values = [
                tool.id,
                tool.name,
                tool.url,
                tool.category,
                tool.icon || null,
                tool.description,
                tool.tags || [],
                tool.pricing || 'Freemium',
                tool.useCases || [],
                addedDate
            ];

            await client.query(insertQuery, values);
            // console.log(`Migrated: ${tool.name} `); // Commented out to reduce noise
        }

        console.log('Migration completed successfully');

        // Verification Step
        const res = await client.query('SELECT COUNT(*) FROM tools');
        const dbCount = parseInt(res.rows[0].count);
        const listCount = rawTools.length;

        console.log(`\n--- Verification ---`);
        console.log(`Tools in List: ${listCount}`);
        console.log(`Tools in DB:   ${dbCount}`);

        if (dbCount === listCount) {
            console.log(`✅ MATCH! Database is perfectly synced.`);
        } else {
            console.log(`⚠️ MISMATCH! List has ${listCount} but DB has ${dbCount}.`);
        }

    } catch (err) {
        console.error('Error during migration:', err);
    } finally {
        if (client) await client.end();
    }
}

migrate();
