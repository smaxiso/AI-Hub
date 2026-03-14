// src/data/tools.js
import { enhanceTool } from '../utils/toolHelpers.js';

const rawTools = [
  // ═══════════════════════════════════════════
  // CHAT
  // ═══════════════════════════════════════════
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    url: 'https://chat.openai.com/chat',
    category: 'Chat',
    categories: ['Chat', 'Coding', 'Writing', 'Research'],
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
    categories: ['Chat', 'Coding', 'Research'],
    icon: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/gemini-color.png',
    description: "Google's advanced AI chatbot powered by Gemini, offering multimodal capabilities for conversations, analysis, and creative tasks.",
    tags: ['multimodal', 'google', 'analysis'],
    pricing: 'Freemium',
    useCases: ['Data Analysis', 'Creative Writing', 'Coding']
  },
  {
    id: 'claude',
    name: 'Claude',
    url: 'https://claude.ai/',
    category: 'Chat',
    categories: ['Chat', 'Coding', 'Writing'],
    icon: 'https://logo.clearbit.com/anthropic.com',
    description: "Anthropic's AI assistant designed for helpful, harmless, and honest conversations with advanced reasoning capabilities.",
    tags: ['reasoning', 'coding', 'writing'],
    pricing: 'Freemium',
    useCases: ['Complex Reasoning', 'Coding', 'Creative Writing']
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    url: 'https://chat.deepseek.com/',
    category: 'Chat',
    categories: ['Chat', 'Coding'],
    icon: 'https://chat.deepseek.com/favicon.ico',
    description: 'A powerful open-model LLM that excels in coding and mathematics, offering performance comparable to top proprietary models.',
    tags: ['coding', 'math', 'open-model'],
    pricing: 'Free',
    useCases: ['Complex Coding', 'Math Problems'],
    addedDate: '2025-01-01'
  },
  {
    id: 'grok-3',
    name: 'Grok 3',
    url: 'https://grok.x.ai/',
    category: 'Chat',
    categories: ['Chat', 'Research'],
    icon: 'https://grok.x.ai/favicon.ico',
    description: "xAI's latest model featuring \"Think\" mode for deep reasoning and real-time access to X (Twitter) data.",
    tags: ['real-time', 'uncensored', 'reasoning'],
    pricing: 'Paid',
    useCases: ['Real-time Research', 'Unfiltered Answers', 'Data Analysis'],
    addedDate: '2025-02-15'
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    url: 'https://www.perplexity.ai/',
    category: 'Research',
    categories: ['Research', 'Chat'],
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
    categories: ['Chat', 'Productivity'],
    icon: 'https://store-images.s-microsoft.com/image/apps.21661.9007199267161390.afb6b8cd-d194-4a99-b633-03cd80118a21.e9a094be-ee73-4e19-8cdf-49a27b0974ed',
    description: "Microsoft's AI assistant integrated with Bing, providing intelligent answers, creative content, and web search capabilities.",
    tags: ['productivity', 'search', 'microsoft'],
    pricing: 'Freemium',
    useCases: ['Office Productivity', 'Web Search', 'Content Creation']
  },
  {
    id: 'you-com',
    name: 'You.com',
    url: 'https://you.com/?chatMode=default',
    category: 'Research',
    categories: ['Research', 'Chat'],
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
    categories: ['Chat'],
    icon: 'https://logo.clearbit.com/poe.com',
    description: "Quora's AI platform providing access to multiple AI chatbots including GPT-4, Claude, and custom bots in one interface.",
    tags: ['chatbot', 'multi-model', 'conversation'],
    pricing: 'Freemium',
    useCases: ['Multi-Model Chat', 'AI Comparison']
  },
  {
    id: 'character-ai',
    name: 'Character.AI',
    url: 'https://character.ai/',
    category: 'Chat',
    categories: ['Chat'],
    icon: 'https://logo.clearbit.com/character.ai',
    description: 'Conversational AI platform for chatting with AI characters, including historical figures, fictional characters, and custom personalities.',
    tags: ['chatbot', 'roleplay', 'entertainment'],
    pricing: 'Freemium',
    useCases: ['Entertainment', 'Roleplay', 'Creative Writing']
  },
  {
    id: 'mistral-le-chat',
    name: 'Mistral Le Chat',
    url: 'https://chat.mistral.ai/',
    category: 'Chat',
    categories: ['Chat', 'Coding'],
    icon: 'https://chat.mistral.ai/favicon.ico',
    description: 'Privacy-focused AI chatbot from Mistral AI, a leading European AI company. Strong at coding and reasoning with 128K context window.',
    tags: ['privacy', 'european', 'coding', 'reasoning'],
    pricing: 'Free',
    useCases: ['Privacy-First Chat', 'Coding', 'Research'],
    addedDate: '2025-03-01'
  },
  {
    id: 'meta-ai',
    name: 'Meta AI',
    url: 'https://www.meta.ai/',
    category: 'Chat',
    categories: ['Chat'],
    icon: 'https://logo.clearbit.com/meta.com',
    description: "Meta's free AI assistant powered by Llama models, integrated across Facebook, Instagram, WhatsApp, and the web.",
    tags: ['meta', 'llama', 'social', 'free'],
    pricing: 'Free',
    useCases: ['General Chat', 'Social Media', 'Creative Tasks'],
    addedDate: '2025-02-01'
  },
  {
    id: 'huggingchat',
    name: 'HuggingChat',
    url: 'https://huggingface.co/chat/',
    category: 'Chat',
    categories: ['Chat'],
    icon: 'https://logo.clearbit.com/huggingface.co',
    description: 'Open-source chatbot by Hugging Face, offering access to various open models like Llama, Mistral, and more.',
    tags: ['open-source', 'community', 'multi-model'],
    pricing: 'Free',
    useCases: ['Open-Source Chat', 'Model Testing', 'Research'],
    addedDate: '2025-01-15'
  },

  // ═══════════════════════════════════════════
  // IMAGE
  // ═══════════════════════════════════════════
  {
    id: 'midjourney',
    name: 'Midjourney',
    url: 'https://www.midjourney.com/',
    category: 'Image',
    categories: ['Image', 'Design'],
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
    categories: ['Image', 'Design'],
    icon: 'https://openai.com/favicon.ico',
    description: "OpenAI's advanced image generation model that creates realistic and artistic images from natural language descriptions.",
    tags: ['image-generation', 'openai', 'art'],
    pricing: 'Paid',
    useCases: ['Image Generation', 'Marketing Assets']
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    url: 'https://stablediffusionweb.com/#demo',
    category: 'Image',
    categories: ['Image'],
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
    categories: ['Image', 'Design'],
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
    categories: ['Image', 'Design'],
    icon: 'https://www.adobe.com/favicon.ico',
    description: "Adobe's creative AI platform for generating images, text effects, and design elements, integrated with Creative Cloud.",
    tags: ['design', 'adobe', 'creative'],
    pricing: 'Freemium',
    useCases: ['Graphic Design', 'Commercial Art']
  },
  {
    id: 'bing-image-creator',
    name: 'Bing Image Creator',
    url: 'https://www.bing.com/create',
    category: 'Image',
    categories: ['Image'],
    icon: 'https://st1.techlusive.in/wp-content/uploads/2023/05/Bing.jpg',
    description: "Microsoft's AI image generator powered by DALL-E, creating images from text descriptions.",
    tags: ['image-generation', 'microsoft', 'dall-e'],
    pricing: 'Free',
    useCases: ['Quick Image Generation', 'Social Media']
  },
  {
    id: 'nvidia-canvas',
    name: 'NVIDIA Canvas',
    url: 'https://www.nvidia.com/en-us/studio/canvas/',
    category: 'Image',
    categories: ['Image'],
    icon: 'https://logo.clearbit.com/nvidia.com',
    description: 'Turn simple brushstrokes into realistic landscape images with the power of AI.',
    tags: ['landscape', 'painting', 'real-time'],
    pricing: 'Free',
    useCases: ['Concept Art', 'Background Creation']
  },
  {
    id: 'recraft',
    name: 'Recraft V3',
    url: 'https://www.recraft.ai/',
    category: 'Image',
    categories: ['Image', 'Design'],
    icon: 'https://www.recraft.ai/favicon.ico',
    description: 'The first AI image generator for professionals that creates editable vector art (SVG) and brand-consistent graphics.',
    tags: ['vector-art', 'graphic-design', 'svg'],
    pricing: 'Freemium',
    useCases: ['Logo Design', 'Icon Sets', 'Vector Illustration'],
    addedDate: '2025-03-01'
  },
  {
    id: 'ideogram',
    name: 'Ideogram',
    url: 'https://ideogram.ai/',
    category: 'Image',
    categories: ['Image', 'Design'],
    icon: 'https://ideogram.ai/favicon.ico',
    description: 'AI image generator with best-in-class text rendering inside images. Excels at posters, logos, and typography-heavy visuals.',
    tags: ['text-in-image', 'typography', 'poster-design'],
    pricing: 'Freemium',
    useCases: ['Poster Design', 'Logo Mockups', 'Social Media Graphics'],
    addedDate: '2025-03-10'
  },
  {
    id: 'flux',
    name: 'Flux',
    url: 'https://blackforestlabs.ai/',
    category: 'Image',
    categories: ['Image'],
    icon: 'https://blackforestlabs.ai/favicon.ico',
    description: 'By Black Forest Labs, Flux models offer top prompt adherence and character consistency. The go-to for creators needing visual storytelling.',
    tags: ['prompt-adherence', 'character-consistency', 'photorealism'],
    pricing: 'Freemium',
    useCases: ['Brand Campaigns', 'Visual Storytelling', 'Rapid Prototyping'],
    addedDate: '2025-03-10'
  },
  {
    id: 'playground-ai',
    name: 'Playground AI',
    url: 'https://playground.com/',
    category: 'Image',
    categories: ['Image'],
    icon: 'https://playground.com/favicon.ico',
    description: 'Free AI image generation platform with a community gallery, multiple models, and an intuitive canvas editor.',
    tags: ['free', 'community', 'canvas-editor'],
    pricing: 'Freemium',
    useCases: ['Free Image Generation', 'Community Art', 'Experimentation'],
    addedDate: '2025-03-10'
  },
  {
    id: 'krea-ai',
    name: 'Krea AI',
    url: 'https://www.krea.ai/',
    category: 'Image',
    categories: ['Image'],
    icon: 'https://www.krea.ai/favicon.ico',
    description: 'Real-time AI image generation and enhancement tool. Draw rough sketches and watch them transform into polished visuals instantly.',
    tags: ['real-time', 'enhancement', 'sketch-to-image'],
    pricing: 'Freemium',
    useCases: ['Real-Time Generation', 'Image Enhancement', 'Concept Sketching'],
    addedDate: '2025-03-10'
  },

  // ═══════════════════════════════════════════
  // VIDEO
  // ═══════════════════════════════════════════
  {
    id: 'sora',
    name: 'Sora',
    url: 'https://openai.com/sora',
    category: 'Video',
    categories: ['Video'],
    icon: 'https://openai.com/favicon.ico',
    description: "OpenAI's text-to-video model capable of generating minute-long videos with high visual quality and adherence to the user's prompt.",
    tags: ['video-generation', 'openai', 'cinematic', 'realistic'],
    pricing: 'Paid',
    useCases: ['Creative Video', 'Storytelling', 'Simulation'],
    addedDate: '2025-02-20'
  },
  {
    id: 'runway',
    name: 'Runway',
    url: 'https://runwayml.com/',
    category: 'Video',
    categories: ['Video'],
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
    categories: ['Video'],
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
    categories: ['Video', 'Education', 'Business'],
    icon: 'https://logo.clearbit.com/synthesia.io',
    description: 'Professional AI video creation platform with realistic avatars and voices in 140+ languages.',
    tags: ['avatars', 'presentation', 'corporate'],
    pricing: 'Paid',
    useCases: ['Training Videos', 'Corporate Comms']
  },
  {
    id: 'd-id-video',
    name: 'D-ID',
    url: 'https://studio.d-id.com/',
    category: 'Video',
    categories: ['Video', 'Business'],
    icon: 'https://logo.clearbit.com/d-id.com',
    description: 'Create AI-powered talking avatar videos from photos and text.',
    tags: ['talking-head', 'animation', 'photos'],
    pricing: 'Freemium',
    useCases: ['Marketing', 'Personalized Video']
  },
  {
    id: 'kling-ai',
    name: 'Kling AI',
    url: 'https://klingai.com/',
    category: 'Video',
    categories: ['Video'],
    icon: 'https://klingai.com/favicon.ico',
    description: 'High-fidelity AI video generator capable of producing realistic 5-second clips with advanced motion physics.',
    tags: ['video-generation', 'realistic-motion', 'cinematic'],
    pricing: 'Freemium',
    useCases: ['Commercial Ads', 'Social Media Clips'],
    addedDate: '2024-12-20'
  },
  {
    id: 'hailuo',
    name: 'Hailuo (MiniMax)',
    url: 'https://hailuoai.video/',
    category: 'Video',
    categories: ['Video'],
    icon: 'https://hailuoai.video/favicon.ico',
    description: 'Video generation model known for exceptional prompt adherence and fluid human movement.',
    tags: ['video-generation', 'character-animation', 'creative'],
    pricing: 'Free',
    useCases: ['Character Animation', 'Storytelling', 'Music Videos'],
    addedDate: '2025-01-05'
  },
  {
    id: 'heygen',
    name: 'HeyGen',
    url: 'https://www.heygen.com/',
    category: 'Video',
    categories: ['Video', 'Business'],
    icon: 'https://www.heygen.com/favicon.ico',
    description: 'AI avatar video creation platform for marketing, sales, and training. Create professional presenter videos without a camera.',
    tags: ['avatars', 'marketing', 'sales-video'],
    pricing: 'Freemium',
    useCases: ['Marketing Videos', 'Sales Outreach', 'Training'],
    addedDate: '2025-03-10'
  },
  {
    id: 'descript',
    name: 'Descript',
    url: 'https://www.descript.com/',
    category: 'Video',
    categories: ['Video', 'Audio', 'Productivity'],
    icon: 'https://logo.clearbit.com/descript.com',
    description: 'AI video and audio editing tool where you edit media by editing text. Includes transcription, screen recording, and filler word removal.',
    tags: ['video-editing', 'transcription', 'podcast'],
    pricing: 'Freemium',
    useCases: ['Podcast Editing', 'Video Editing', 'Transcription'],
    addedDate: '2025-03-10'
  },
  {
    id: 'opus-clip',
    name: 'OpusClip',
    url: 'https://www.opus.pro/',
    category: 'Video',
    categories: ['Video'],
    icon: 'https://www.opus.pro/favicon.ico',
    description: 'AI short-form video clipper that turns long videos into viral shorts for TikTok, Reels, and YouTube Shorts with auto-captions.',
    tags: ['short-form', 'clipping', 'social-media'],
    pricing: 'Freemium',
    useCases: ['Content Repurposing', 'Social Media Clips', 'YouTube Shorts'],
    addedDate: '2025-03-10'
  },
  {
    id: 'luma-dream-machine',
    name: 'Luma Dream Machine',
    url: 'https://lumalabs.ai/dream-machine',
    category: 'Video',
    categories: ['Video'],
    icon: 'https://lumalabs.ai/favicon.ico',
    description: 'High-quality AI video generation from text and images. Known for realistic physics and cinematic output.',
    tags: ['video-generation', 'cinematic', 'realistic'],
    pricing: 'Freemium',
    useCases: ['Creative Video', 'Cinematic Clips', 'Concept Videos'],
    addedDate: '2025-03-10'
  },
  {
    id: 'invideo-ai',
    name: 'InVideo AI',
    url: 'https://invideo.io/',
    category: 'Video',
    categories: ['Video'],
    icon: 'https://logo.clearbit.com/invideo.io',
    description: 'Text-to-video platform that generates complete videos with stock footage, voiceover, and subtitles from a single prompt.',
    tags: ['text-to-video', 'stock-footage', 'voiceover'],
    pricing: 'Freemium',
    useCases: ['Social Media Videos', 'Marketing Content', 'YouTube Videos'],
    addedDate: '2025-03-10'
  },

  // ═══════════════════════════════════════════
  // AUDIO
  // ═══════════════════════════════════════════
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    url: 'https://elevenlabs.io/',
    category: 'Audio',
    categories: ['Audio'],
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
    categories: ['Audio'],
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
    categories: ['Audio'],
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
    categories: ['Audio', 'Productivity'],
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
    categories: ['Audio'],
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
    categories: ['Audio'],
    icon: 'https://logo.clearbit.com/pixabay.com',
    description: 'Free royalty-free music library with thousands of tracks for videos and projects.',
    tags: ['stock-music', 'royalty-free'],
    pricing: 'Free',
    useCases: ['Video Background', 'Podcasts']
  },
  {
    id: 'wispr-flow',
    name: 'Wispr Flow',
    url: 'https://www.wisprflow.ai/',
    category: 'Audio',
    categories: ['Audio', 'Productivity'],
    icon: 'https://logo.clearbit.com/wisprflow.ai',
    description: 'A dictation tool that types what you speak instantly across any app on your computer. Used for writing emails and prompts 3x faster.',
    tags: ['dictation', 'productivity', 'voice-to-text', 'writing'],
    pricing: 'Paid',
    useCases: ['Writing Emails', 'Drafting Content', 'Voice Commands'],
    addedDate: '2025-02-20'
  },
  {
    id: 'murf-ai',
    name: 'Murf AI',
    url: 'https://murf.ai/',
    category: 'Audio',
    categories: ['Audio'],
    icon: 'https://murf.ai/favicon.ico',
    description: 'Professional AI voiceover platform with 120+ natural-sounding voices in 20+ languages for videos, e-learning, and ads.',
    tags: ['voiceover', 'text-to-speech', 'multilingual'],
    pricing: 'Freemium',
    useCases: ['Voiceovers', 'E-Learning', 'Ads'],
    addedDate: '2025-03-10'
  },
  {
    id: 'otter-ai',
    name: 'Otter.ai',
    url: 'https://otter.ai/',
    category: 'Audio',
    categories: ['Audio', 'Productivity'],
    icon: 'https://logo.clearbit.com/otter.ai',
    description: 'AI meeting transcription and note-taking assistant. Records, transcribes, and summarizes meetings in real time.',
    tags: ['transcription', 'meeting-notes', 'productivity'],
    pricing: 'Freemium',
    useCases: ['Meeting Notes', 'Transcription', 'Collaboration'],
    addedDate: '2025-03-10'
  },
  {
    id: 'speechify',
    name: 'Speechify',
    url: 'https://speechify.com/',
    category: 'Audio',
    categories: ['Audio', 'Productivity'],
    icon: 'https://logo.clearbit.com/speechify.com',
    description: 'Text-to-speech app that reads any text aloud with natural AI voices. Great for consuming articles, PDFs, and books on the go.',
    tags: ['text-to-speech', 'reading', 'accessibility'],
    pricing: 'Freemium',
    useCases: ['Reading Aloud', 'Accessibility', 'Learning'],
    addedDate: '2025-03-10'
  },

  // ═══════════════════════════════════════════
  // CODING
  // ═══════════════════════════════════════════
  {
    id: 'cursor',
    name: 'Cursor',
    url: 'https://cursor.sh/',
    category: 'Coding',
    categories: ['Coding'],
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
    categories: ['Coding'],
    icon: 'https://logo.clearbit.com/github.com',
    description: 'AI pair programmer by GitHub and OpenAI that suggests code completions, entire functions, and helps developers code faster.',
    tags: ['coding', 'development', 'github', 'programming'],
    pricing: 'Paid',
    useCases: ['Code Completion', 'Programming', 'Software Development', 'Code Suggestions']
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    url: 'https://codeium.com/windsurf',
    category: 'Coding',
    categories: ['Coding'],
    icon: 'https://windsurf.com/favicon.ico',
    description: 'The first agentic IDE that acts as a pair programmer. Its "Cascade" flow predicts your next move and edits multiple files deeply.',
    tags: ['coding', 'ide', 'agentic', 'development'],
    pricing: 'Freemium',
    useCases: ['Full Stack Development', 'Code Refactoring', 'Bug Fixing'],
    addedDate: '2025-01-15'
  },
  {
    id: 'bolt-new',
    name: 'Bolt.new',
    url: 'https://bolt.new/',
    category: 'Coding',
    categories: ['Coding', 'Design'],
    icon: 'https://bolt.new/favicon.ico',
    description: 'Prompt-to-production web development environment. Build, run, and deploy full-stack applications directly in your browser.',
    tags: ['web-development', 'app-builder', 'deployment'],
    pricing: 'Freemium',
    useCases: ['Rapid Prototyping', 'MVP Creation', 'Web Apps'],
    addedDate: '2025-02-01'
  },
  {
    id: 'lovable',
    name: 'Lovable',
    url: 'https://lovable.dev/',
    category: 'Coding',
    categories: ['Coding', 'Design'],
    icon: 'https://lovable.dev/favicon.ico',
    description: 'AI app builder that turns text into beautiful, production-ready web apps. Specializes in generating high-quality UI/UX designs.',
    tags: ['app-builder', 'ui-design', 'no-code'],
    pricing: 'Paid',
    useCases: ['Dashboard Creation', 'SaaS MVP', 'UI Generation'],
    addedDate: '2025-02-10'
  },
  {
    id: 'antigravity',
    name: 'Antigravity',
    url: 'https://antigravity.google/',
    category: 'Coding',
    categories: ['Coding', 'Agent'],
    icon: '/logos/antigravity.png',
    description: 'A powerful agentic AI coding assistant designed by the Google DeepMind team working on Advanced Agentic Coding.',
    tags: ['coding', 'agent', 'google', 'deepmind'],
    pricing: 'Free',
    useCases: ['Pair Programming', 'Complex Refactoring', 'Agentic Workflows'],
    addedDate: '2025-11-18'
  },
  {
    id: 'phcode',
    name: 'PHCode',
    url: 'https://phcode.dev/',
    category: 'Coding',
    categories: ['Coding'],
    icon: 'https://logo.clearbit.com/phcode.dev',
    description: 'A powerful web-based code editor for frontend development.',
    tags: ['editor', 'web-dev', 'coding'],
    pricing: 'Free',
    useCases: ['Web Development', 'Quick Edits']
  },
  {
    id: 'tabnine',
    name: 'Tabnine',
    url: 'https://www.tabnine.com/',
    category: 'Coding',
    categories: ['Coding'],
    icon: 'https://logo.clearbit.com/tabnine.com',
    description: 'Privacy-first AI code assistant that runs locally or in the cloud. Supports all major languages and IDEs with personalized suggestions.',
    tags: ['code-completion', 'privacy', 'ide-plugin'],
    pricing: 'Freemium',
    useCases: ['Code Completion', 'Privacy-First Development', 'Team Coding'],
    addedDate: '2025-03-10'
  },
  {
    id: 'codeium',
    name: 'Codeium',
    url: 'https://codeium.com/',
    category: 'Coding',
    categories: ['Coding'],
    icon: 'https://codeium.com/favicon.ico',
    description: 'Free AI code completion tool supporting 70+ languages. A popular GitHub Copilot alternative with generous free tier.',
    tags: ['code-completion', 'free', 'multi-language'],
    pricing: 'Freemium',
    useCases: ['Code Completion', 'Free Alternative', 'Multi-Language Development'],
    addedDate: '2025-03-10'
  },
  {
    id: 'v0-vercel',
    name: 'v0',
    url: 'https://v0.dev/',
    category: 'Coding',
    categories: ['Coding', 'Design'],
    icon: 'https://v0.dev/favicon.ico',
    description: 'AI UI component generator by Vercel. Describe a UI and get production-ready React/Tailwind code instantly.',
    tags: ['ui-generation', 'react', 'tailwind', 'vercel'],
    pricing: 'Freemium',
    useCases: ['UI Prototyping', 'Component Generation', 'Frontend Development'],
    addedDate: '2025-03-10'
  },
  {
    id: 'replit-ai',
    name: 'Replit AI',
    url: 'https://replit.com/',
    category: 'Coding',
    categories: ['Coding'],
    icon: 'https://logo.clearbit.com/replit.com',
    description: 'Browser-based IDE with AI coding assistant (Ghostwriter). Write, run, and deploy code with AI help, all in the browser.',
    tags: ['browser-ide', 'ghostwriter', 'deployment'],
    pricing: 'Freemium',
    useCases: ['Browser Coding', 'Learning', 'Quick Prototyping'],
    addedDate: '2025-03-10'
  },

  // ═══════════════════════════════════════════
  // AGENT
  // ═══════════════════════════════════════════
  {
    id: 'devin',
    name: 'Devin',
    url: 'https://devin.ai/',
    category: 'Agent',
    categories: ['Agent', 'Coding'],
    icon: 'https://devin.ai/favicon.ico',
    description: 'The first fully autonomous AI software engineer. Devin can plan, code, debug, and deploy entire software projects on its own.',
    tags: ['autonomous', 'software-engineer', 'agent'],
    pricing: 'Paid',
    useCases: ['End-to-End Development', 'Autonomous Coding', 'Legacy Migration'],
    addedDate: '2025-01-05'
  },
  {
    id: 'agentgpt',
    name: 'AgentGPT',
    url: 'https://agentgpt.reworkd.ai/',
    category: 'Agent',
    categories: ['Agent'],
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
    categories: ['Agent'],
    icon: 'https://news.agpt.co/favicon.ico',
    description: 'An experimental open-source attempt to make GPT-4 fully autonomous, capable of chaining thoughts to achieve broad goals.',
    tags: ['autonomous', 'open-source', 'experimental'],
    pricing: 'Free',
    useCases: ['Complex Task Automation', 'Internet Research', 'Goal Execution'],
    addedDate: '2025-01-20'
  },
  {
    id: 'genspark',
    name: 'Genspark',
    url: 'https://www.genspark.ai/',
    category: 'Agent',
    categories: ['Agent', 'Research'],
    icon: 'https://genspark.ai/favicon.ico',
    description: 'An AI agent for deep research. It reads multiple sources, cross-checks facts, and generates consolidated reports or "Sparkpages" autonomously.',
    tags: ['research', 'agent', 'deep-search', 'autonomous'],
    pricing: 'Free',
    useCases: ['Market Research', 'Fact Checking', 'Topic Deep Dives'],
    addedDate: '2025-02-20'
  },
  {
    id: 'crewai',
    name: 'CrewAI',
    url: 'https://www.crewai.com/',
    category: 'Agent',
    categories: ['Agent', 'Coding'],
    icon: 'https://www.crewai.com/favicon.ico',
    description: 'Multi-agent orchestration framework for building teams of AI agents that collaborate on complex tasks with role-based delegation.',
    tags: ['multi-agent', 'orchestration', 'framework'],
    pricing: 'Free',
    useCases: ['Agent Orchestration', 'Workflow Automation', 'Multi-Agent Systems'],
    addedDate: '2025-03-10'
  },
  {
    id: 'langchain',
    name: 'LangChain',
    url: 'https://www.langchain.com/',
    category: 'Agent',
    categories: ['Agent', 'Coding'],
    icon: 'https://www.langchain.com/favicon.ico',
    description: 'The leading framework for building LLM-powered applications and agents. Includes LangGraph for complex agent orchestration with DAG-based flows.',
    tags: ['framework', 'llm', 'orchestration', 'langgraph'],
    pricing: 'Free',
    useCases: ['LLM Applications', 'Agent Building', 'RAG Pipelines'],
    addedDate: '2025-03-10'
  },
  {
    id: 'lindy-ai',
    name: 'Lindy AI',
    url: 'https://www.lindy.ai/',
    category: 'Agent',
    categories: ['Agent', 'Productivity'],
    icon: 'https://www.lindy.ai/favicon.ico',
    description: 'No-code AI agent builder. Create custom agents for email, scheduling, CRM, and more without writing a single line of code.',
    tags: ['no-code', 'automation', 'custom-agents'],
    pricing: 'Freemium',
    useCases: ['Email Automation', 'Custom Agents', 'Business Workflows'],
    addedDate: '2025-03-10'
  },

  // ═══════════════════════════════════════════
  // WRITING (new category)
  // ═══════════════════════════════════════════
  {
    id: 'grammarly',
    name: 'Grammarly',
    url: 'https://www.grammarly.com/',
    category: 'Writing',
    categories: ['Writing', 'Productivity'],
    icon: 'https://logo.clearbit.com/grammarly.com',
    description: 'AI writing assistant for grammar, tone, clarity, and style. Includes plagiarism and AI content detection.',
    tags: ['grammar', 'writing', 'tone', 'plagiarism'],
    pricing: 'Freemium',
    useCases: ['Grammar Checking', 'Tone Adjustment', 'Plagiarism Detection'],
    addedDate: '2025-03-10'
  },
  {
    id: 'jasper',
    name: 'Jasper',
    url: 'https://www.jasper.ai/',
    category: 'Writing',
    categories: ['Writing', 'Business'],
    icon: 'https://logo.clearbit.com/jasper.ai',
    description: 'AI content creation platform specializing in marketing copy, blog posts, and business content at scale.',
    tags: ['marketing', 'copywriting', 'business'],
    pricing: 'Paid',
    useCases: ['Marketing Copy', 'Blog Posts', 'Ad Copy']
  },
  {
    id: 'copy-ai',
    name: 'Copy.ai',
    url: 'https://www.copy.ai/',
    category: 'Writing',
    categories: ['Writing', 'Business'],
    icon: 'https://logo.clearbit.com/copy.ai',
    description: 'AI-powered copywriting tool that generates marketing content and descriptions in seconds.',
    tags: ['copywriting', 'marketing', 'social-media'],
    pricing: 'Freemium',
    useCases: ['Social Media Posts', 'Ad Copy', 'Product Descriptions']
  },
  {
    id: 'rytr',
    name: 'Rytr',
    url: 'https://rytr.me/',
    category: 'Writing',
    categories: ['Writing'],
    icon: 'https://logo.clearbit.com/rytr.me',
    description: 'Budget-friendly AI writing assistant with 20+ tones and templates for blogs, emails, and social media.',
    tags: ['writing', 'templates', 'budget-friendly'],
    pricing: 'Freemium',
    useCases: ['Blog Posts', 'Emails', 'Social Media Content'],
    addedDate: '2025-03-10'
  },
  {
    id: 'writesonic',
    name: 'Writesonic',
    url: 'https://writesonic.com/',
    category: 'Writing',
    categories: ['Writing', 'Research'],
    icon: 'https://logo.clearbit.com/writesonic.com',
    description: 'AI writing platform with built-in SEO mode for blog posts, landing pages, and marketing content.',
    tags: ['seo', 'blog-writing', 'marketing'],
    pricing: 'Freemium',
    useCases: ['SEO Blog Writing', 'Landing Pages', 'Marketing Content'],
    addedDate: '2025-03-10'
  },
  {
    id: 'wordtune',
    name: 'Wordtune',
    url: 'https://www.wordtune.com/',
    category: 'Writing',
    categories: ['Writing'],
    icon: 'https://logo.clearbit.com/wordtune.com',
    description: 'AI rewriting and paraphrasing tool. Rewrites sentences for better fluency, tone, and clarity.',
    tags: ['paraphrasing', 'rewriting', 'fluency'],
    pricing: 'Freemium',
    useCases: ['Sentence Rewriting', 'Tone Adjustment', 'Content Polishing'],
    addedDate: '2025-03-10'
  },
  {
    id: 'prowritingaid',
    name: 'ProWritingAid',
    url: 'https://prowritingaid.com/',
    category: 'Writing',
    categories: ['Writing'],
    icon: 'https://logo.clearbit.com/prowritingaid.com',
    description: 'Deep writing analysis tool for long-form content. Checks grammar, style, structure, pacing, and readability.',
    tags: ['writing-analysis', 'style', 'long-form'],
    pricing: 'Freemium',
    useCases: ['Novel Writing', 'Blog Editing', 'Academic Writing'],
    addedDate: '2025-03-10'
  },
  {
    id: 'quillbot',
    name: 'QuillBot',
    url: 'https://quillbot.com/',
    category: 'Writing',
    categories: ['Writing'],
    icon: 'https://logo.clearbit.com/quillbot.com',
    description: 'AI paraphrasing and grammar tool with multiple rewriting modes. Popular with students and content creators.',
    tags: ['paraphrasing', 'grammar', 'summarizer'],
    pricing: 'Freemium',
    useCases: ['Paraphrasing', 'Grammar Checking', 'Summarizing'],
    addedDate: '2025-03-10'
  },
  {
    id: 'notion-ai',
    name: 'Notion AI',
    url: 'https://www.notion.so/product/ai',
    category: 'Productivity',
    categories: ['Productivity', 'Writing'],
    icon: 'https://logo.clearbit.com/notion.so',
    description: 'AI writing assistant integrated into Notion workspace, helping with brainstorming, content creation, and summarization.',
    tags: ['productivity', 'writing', 'workspace'],
    pricing: 'Paid',
    useCases: ['Writing', 'Note Taking', 'Task Management']
  },

  // ═══════════════════════════════════════════
  // DESIGN (new category)
  // ═══════════════════════════════════════════
  {
    id: 'canva-magic',
    name: 'Canva Magic Studio',
    url: 'https://www.canva.com/magic/',
    category: 'Design',
    categories: ['Design', 'Image'],
    icon: 'https://logo.clearbit.com/canva.com',
    description: 'All-in-one AI design platform with Magic Design, Magic Write, Magic Edit, and Magic Animate for instant visual creation.',
    tags: ['design', 'templates', 'social-media', 'branding'],
    pricing: 'Freemium',
    useCases: ['Social Media Graphics', 'Presentations', 'Marketing Materials'],
    addedDate: '2025-03-10'
  },
  {
    id: 'figma-ai',
    name: 'Figma AI',
    url: 'https://www.figma.com/',
    category: 'Design',
    categories: ['Design'],
    icon: 'https://logo.clearbit.com/figma.com',
    description: 'AI features inside Figma for UI/UX design. Generate layouts, tweak components, and prototype with AI assistance.',
    tags: ['ui-ux', 'prototyping', 'collaboration'],
    pricing: 'Freemium',
    useCases: ['UI Design', 'Prototyping', 'Design Systems'],
    addedDate: '2025-03-10'
  },
  {
    id: 'framer',
    name: 'Framer',
    url: 'https://www.framer.com/',
    category: 'Design',
    categories: ['Design', 'Coding'],
    icon: 'https://logo.clearbit.com/framer.com',
    description: 'AI website builder with design tools. Create interactive, high-fidelity websites with native React components.',
    tags: ['website-builder', 'interactive', 'react'],
    pricing: 'Freemium',
    useCases: ['Website Design', 'Landing Pages', 'Portfolios'],
    addedDate: '2025-03-10'
  },
  {
    id: 'gamma',
    name: 'Gamma',
    url: 'https://gamma.app/',
    category: 'Design',
    categories: ['Design'],
    icon: 'https://logo.clearbit.com/gamma.app',
    description: 'AI-powered medium for presenting ideas, creating decks, documents, and webpages instantly from prompts.',
    tags: ['presentation', 'design', 'productivity'],
    pricing: 'Freemium',
    useCases: ['Presentations', 'Docs', 'Webpages']
  },
  {
    id: 'tome',
    name: 'Tome',
    url: 'https://beta.tome.app/',
    category: 'Design',
    categories: ['Design'],
    icon: 'https://logo.clearbit.com/tome.app',
    description: 'AI storytelling format that helps you create polished presentations and documents.',
    tags: ['storytelling', 'presentation', 'business'],
    pricing: 'Freemium',
    useCases: ['Pitch Decks', 'Storytelling']
  },
  {
    id: 'chronicle',
    name: 'Chronicle',
    url: 'https://chroniclehq.com/',
    category: 'Design',
    categories: ['Design'],
    icon: 'https://chroniclehq.com/favicon.ico',
    description: 'A modern presentation tool focused on storytelling and design. Often called "The Apple of presentation design".',
    tags: ['presentation', 'design', 'storytelling', 'deck'],
    pricing: 'Paid',
    useCases: ['Pitch Decks', 'High-Stakes Presentations'],
    addedDate: '2025-02-20'
  },
  {
    id: 'looka',
    name: 'Looka',
    url: 'https://looka.com/',
    category: 'Design',
    categories: ['Design'],
    icon: 'https://logo.clearbit.com/looka.com',
    description: 'AI logo and brand identity generator. Enter your business name and style preferences to get instant logo designs.',
    tags: ['logo', 'branding', 'identity'],
    pricing: 'Paid',
    useCases: ['Logo Design', 'Brand Identity', 'Business Cards'],
    addedDate: '2025-03-10'
  },
  {
    id: 'beautiful-ai',
    name: 'Beautiful.ai',
    url: 'https://www.beautiful.ai/',
    category: 'Design',
    categories: ['Design'],
    icon: 'https://logo.clearbit.com/beautiful.ai',
    description: 'AI-powered presentation design tool that automatically formats and beautifies your slides as you build them.',
    tags: ['presentation', 'auto-design', 'templates'],
    pricing: 'Freemium',
    useCases: ['Presentations', 'Team Decks', 'Reports'],
    addedDate: '2025-03-10'
  },

  // ═══════════════════════════════════════════
  // PRODUCTIVITY (new category)
  // ═══════════════════════════════════════════
  {
    id: 'zapier-ai',
    name: 'Zapier',
    url: 'https://zapier.com/',
    category: 'Productivity',
    categories: ['Productivity'],
    icon: 'https://logo.clearbit.com/zapier.com',
    description: 'AI workflow automation platform connecting 7,000+ apps. Build automations in plain language with the AI Copilot.',
    tags: ['automation', 'workflow', 'integration'],
    pricing: 'Freemium',
    useCases: ['Workflow Automation', 'App Integration', 'Task Automation'],
    addedDate: '2025-03-10'
  },
  {
    id: 'make-com',
    name: 'Make.com',
    url: 'https://www.make.com/',
    category: 'Productivity',
    categories: ['Productivity'],
    icon: 'https://logo.clearbit.com/make.com',
    description: 'Visual automation platform for building complex workflows with AI. Drag-and-drop interface with 1,500+ app integrations.',
    tags: ['automation', 'visual-builder', 'integration'],
    pricing: 'Freemium',
    useCases: ['Complex Automations', 'Data Pipelines', 'Marketing Workflows'],
    addedDate: '2025-03-10'
  },
  {
    id: 'reclaim-ai',
    name: 'Reclaim.ai',
    url: 'https://reclaim.ai/',
    category: 'Productivity',
    categories: ['Productivity'],
    icon: 'https://reclaim.ai/favicon.ico',
    description: 'AI calendar and schedule optimizer that protects focus time, auto-schedules habits, and manages meetings intelligently.',
    tags: ['calendar', 'scheduling', 'focus-time'],
    pricing: 'Freemium',
    useCases: ['Calendar Management', 'Focus Time', 'Meeting Scheduling'],
    addedDate: '2025-03-10'
  },
  {
    id: 'fireflies-ai',
    name: 'Fireflies.ai',
    url: 'https://fireflies.ai/',
    category: 'Productivity',
    categories: ['Productivity', 'Audio'],
    icon: 'https://logo.clearbit.com/fireflies.ai',
    description: 'AI meeting assistant that records, transcribes, and summarizes meetings. Integrates with Zoom, Teams, and Google Meet.',
    tags: ['meeting-notes', 'transcription', 'collaboration'],
    pricing: 'Freemium',
    useCases: ['Meeting Notes', 'Action Items', 'Team Collaboration'],
    addedDate: '2025-03-10'
  },
  {
    id: 'clickup-ai',
    name: 'ClickUp AI',
    url: 'https://clickup.com/',
    category: 'Productivity',
    categories: ['Productivity'],
    icon: 'https://logo.clearbit.com/clickup.com',
    description: 'AI project management platform that drafts plans, summarizes docs, and automates task workflows with built-in AI.',
    tags: ['project-management', 'task-automation', 'docs'],
    pricing: 'Freemium',
    useCases: ['Project Management', 'Task Automation', 'Document Drafting'],
    addedDate: '2025-03-10'
  },
  {
    id: 'pdfgear',
    name: 'PDFgear',
    url: 'https://www.pdfgear.com/chat-pdf/',
    category: 'Productivity',
    categories: ['Productivity', 'Research'],
    icon: 'https://logo.clearbit.com/pdfgear.com',
    description: 'Interact with your PDF documents using AI chat to summarize and extract info.',
    tags: ['pdf', 'productivity', 'analysis'],
    pricing: 'Free',
    useCases: ['Document Analysis', 'Summarization']
  },

  // ═══════════════════════════════════════════
  // RESEARCH (new category)
  // ═══════════════════════════════════════════
  {
    id: 'elicit',
    name: 'Elicit',
    url: 'https://elicit.com/',
    category: 'Research',
    categories: ['Research'],
    icon: 'https://elicit.com/favicon.ico',
    description: 'AI research assistant that finds relevant academic papers, extracts key findings, and synthesizes information across studies.',
    tags: ['academic', 'papers', 'synthesis'],
    pricing: 'Freemium',
    useCases: ['Literature Review', 'Academic Research', 'Evidence Synthesis'],
    addedDate: '2025-03-10'
  },
  {
    id: 'consensus',
    name: 'Consensus',
    url: 'https://consensus.app/',
    category: 'Research',
    categories: ['Research'],
    icon: 'https://consensus.app/favicon.ico',
    description: 'AI-powered academic search engine that finds and summarizes scientific research with evidence-based answers.',
    tags: ['academic', 'science', 'evidence-based'],
    pricing: 'Freemium',
    useCases: ['Scientific Research', 'Evidence-Based Answers', 'Academic Search'],
    addedDate: '2025-03-10'
  },
  {
    id: 'ask-your-pdf',
    name: 'Ask Your PDF',
    url: 'https://askyourpdf.com/',
    category: 'Research',
    categories: ['Research', 'Productivity'],
    icon: 'https://logo.clearbit.com/askyourpdf.com',
    description: 'Turn your PDF documents into a chatbot to answer questions and find information.',
    tags: ['pdf', 'chat', 'research'],
    pricing: 'Freemium',
    useCases: ['Research', 'Document Q&A']
  },
  {
    id: 'surfer-seo',
    name: 'Surfer SEO',
    url: 'https://surferseo.com/',
    category: 'Research',
    categories: ['Research', 'Writing'],
    icon: 'https://logo.clearbit.com/surferseo.com',
    description: 'AI SEO content optimization tool. Analyzes top results and gives real-time content scores as you write.',
    tags: ['seo', 'content-optimization', 'serp-analysis'],
    pricing: 'Paid',
    useCases: ['SEO Optimization', 'Content Scoring', 'Competitor Analysis'],
    addedDate: '2025-03-10'
  },

  // ═══════════════════════════════════════════
  // 3D (new category)
  // ═══════════════════════════════════════════
  {
    id: 'meshy-ai',
    name: 'Meshy AI',
    url: 'https://www.meshy.ai/',
    category: '3D',
    categories: ['3D'],
    icon: 'https://www.meshy.ai/favicon.ico',
    description: 'Text and image to 3D model generation. Create game-ready 3D assets, characters, and objects from prompts.',
    tags: ['3d-generation', 'game-assets', 'text-to-3d'],
    pricing: 'Freemium',
    useCases: ['Game Assets', '3D Prototyping', 'Product Visualization'],
    addedDate: '2025-03-10'
  },
  {
    id: 'tripo-ai',
    name: 'Tripo AI',
    url: 'https://www.tripo3d.ai/',
    category: '3D',
    categories: ['3D'],
    icon: 'https://www.tripo3d.ai/favicon.ico',
    description: 'Industry-leading AI 3D generation focused on game-ready assets with clean meshes and seamless pipeline integration.',
    tags: ['3d-generation', 'game-ready', 'pipeline'],
    pricing: 'Freemium',
    useCases: ['Game Development', '3D Asset Creation', 'AR/VR Content'],
    addedDate: '2025-03-10'
  },
  {
    id: 'luma-ai',
    name: 'Luma AI',
    url: 'https://lumalabs.ai/',
    category: '3D',
    categories: ['3D'],
    icon: 'https://lumalabs.ai/favicon.ico',
    description: '3D capture and generation platform. Turn photos into 3D models or generate new ones from text with Genie.',
    tags: ['3d-capture', 'photogrammetry', 'genie'],
    pricing: 'Freemium',
    useCases: ['3D Scanning', '3D Generation', 'Product Photography'],
    addedDate: '2025-03-10'
  },

  // ═══════════════════════════════════════════
  // BUSINESS (new category)
  // ═══════════════════════════════════════════
  {
    id: 'crystal-knows',
    name: 'Crystal Knows',
    url: 'https://www.crystalknows.com/',
    category: 'Business',
    categories: ['Business'],
    icon: 'https://logo.clearbit.com/crystalknows.com',
    description: 'A "personality AI" that analyzes LinkedIn profiles to tell you how to communicate, sell to, or negotiate with anyone.',
    tags: ['sales', 'psychology', 'linkedin', 'communication'],
    pricing: 'Freemium',
    useCases: ['Sales Calls', 'Hiring', 'Negotiations'],
    addedDate: '2025-02-20'
  },
  {
    id: 'happenstance',
    name: 'Happenstance',
    url: 'https://happenstance.ai/',
    category: 'Business',
    categories: ['Business'],
    icon: 'https://happenstance.ai/favicon.ico',
    description: 'A deep search engine for people that connects your email and socials to find the best warm introduction path.',
    tags: ['networking', 'connections', 'email', 'social-graph'],
    pricing: 'Paid',
    useCases: ['Networking', 'Fundraising', 'Job Hunting'],
    addedDate: '2025-02-20'
  },
  {
    id: 'hubspot-ai',
    name: 'HubSpot AI',
    url: 'https://www.hubspot.com/',
    category: 'Business',
    categories: ['Business'],
    icon: 'https://logo.clearbit.com/hubspot.com',
    description: 'AI-powered CRM and marketing automation platform. Includes AI email writing, content generation, and sales forecasting.',
    tags: ['crm', 'marketing', 'sales', 'automation'],
    pricing: 'Freemium',
    useCases: ['CRM', 'Email Marketing', 'Sales Automation'],
    addedDate: '2025-03-10'
  },
  {
    id: 'intercom-fin',
    name: 'Intercom Fin',
    url: 'https://www.intercom.com/fin',
    category: 'Business',
    categories: ['Business'],
    icon: 'https://logo.clearbit.com/intercom.com',
    description: 'AI customer support chatbot that resolves issues instantly using your knowledge base. Handles complex queries with human-like responses.',
    tags: ['customer-support', 'chatbot', 'knowledge-base'],
    pricing: 'Paid',
    useCases: ['Customer Support', 'Help Desk', 'Self-Service'],
    addedDate: '2025-03-10'
  },

  // ═══════════════════════════════════════════
  // EDUCATION (new category)
  // ═══════════════════════════════════════════
  {
    id: 'wisdolia',
    name: 'Wisdolia',
    url: 'https://www.wisdolia.com/',
    category: 'Education',
    categories: ['Education'],
    icon: 'https://logo.clearbit.com/wisdolia.com',
    description: 'AI that generates flashcards and quizzes from any article, PDF, or YouTube video.',
    tags: ['education', 'study', 'flashcards'],
    pricing: 'Freemium',
    useCases: ['Studying', 'Learning']
  },
  {
    id: 'khanmigo',
    name: 'Khanmigo',
    url: 'https://www.khanacademy.org/khan-labs',
    category: 'Education',
    categories: ['Education'],
    icon: 'https://logo.clearbit.com/khanacademy.org',
    description: 'AI tutor by Khan Academy powered by GPT-4. Guides students through problems with Socratic questioning instead of giving answers.',
    tags: ['tutoring', 'math', 'socratic', 'k-12'],
    pricing: 'Free',
    useCases: ['Math Tutoring', 'Science Learning', 'Test Prep'],
    addedDate: '2025-03-10'
  },
  {
    id: 'quizlet-ai',
    name: 'Quizlet AI',
    url: 'https://quizlet.com/',
    category: 'Education',
    categories: ['Education'],
    icon: 'https://logo.clearbit.com/quizlet.com',
    description: 'AI-powered study platform with smart flashcards, practice tests, and personalized learning paths.',
    tags: ['flashcards', 'study', 'personalized-learning'],
    pricing: 'Freemium',
    useCases: ['Flashcard Study', 'Test Preparation', 'Language Learning'],
    addedDate: '2025-03-10'
  },
  {
    id: 'duolingo-max',
    name: 'Duolingo Max',
    url: 'https://www.duolingo.com/',
    category: 'Education',
    categories: ['Education'],
    icon: 'https://logo.clearbit.com/duolingo.com',
    description: 'AI-powered language learning with GPT-4 features: Explain My Answer and Roleplay for conversational practice.',
    tags: ['language-learning', 'gamification', 'gpt-4'],
    pricing: 'Freemium',
    useCases: ['Language Learning', 'Conversational Practice', 'Grammar'],
    addedDate: '2025-03-10'
  },

  // ═══════════════════════════════════════════
  // REMAINING (previously Other, now rehomed)
  // ═══════════════════════════════════════════
  {
    id: 'hugging-face',
    name: 'Hugging Face',
    url: 'https://huggingface.co/',
    category: 'Coding',
    categories: ['Coding', 'Research'],
    icon: 'https://logo.clearbit.com/huggingface.co',
    description: 'Leading AI community platform hosting thousands of pre-trained models, datasets, and demos.',
    tags: ['open-source', 'models', 'community'],
    pricing: 'Free',
    useCases: ['Model Discovery', 'Hosting', 'Testing']
  },
  {
    id: 'promptbase',
    name: 'PromptBase',
    url: 'https://promptbase.com/',
    category: 'Coding',
    categories: ['Coding'],
    icon: 'https://logo.clearbit.com/promptbase.com',
    description: 'Marketplace for buying and selling quality prompts for DALL-E, GPT, Midjourney, and more.',
    tags: ['marketplace', 'prompts', 'resources'],
    pricing: 'Paid',
    useCases: ['Finding Prompts', 'Selling Prompts']
  },
];

// Enhance all tools with default metadata
export const aiTools = rawTools.map(tool => enhanceTool(tool));

// Category colors for all 14 categories
export const categoryColors = {
  Chat: '#6BB6FF',       // Sky Blue
  Image: '#A78BFA',      // Lavender
  Audio: '#34D399',      // Mint Green
  Video: '#FB7185',      // Coral Pink
  Coding: '#00C2CB',     // Teal
  Agent: '#FFB020',      // Amber
  Writing: '#F472B6',    // Pink
  Design: '#C084FC',     // Bright Purple
  Productivity: '#60A5FA',// Blue
  Research: '#FBBF24',   // Yellow
  '3D': '#F97316',       // Orange
  Business: '#14B8A6',   // Teal Green
  Education: '#8B5CF6',  // Violet
  'Social Media': '#EC4899', // Hot Pink
};
