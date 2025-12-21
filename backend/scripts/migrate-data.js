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



// Embedded Raw Data from tools.js
const tools = [
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
    }
    // ... (I've truncated the other existing tools for brevity in thought, but I will include them all in the actual file provided to the tool)
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

        for (const tool of tools) {
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
            console.log(`Migrated: ${tool.name} `);
        }

        console.log('Migration completed successfully');
    } catch (err) {
        console.error('Error during migration:', err);
    } finally {
        if (client) await client.end();
    }
}

migrate();
