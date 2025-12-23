const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const MODULE_TITLE = 'AI Image Generation Basics';

// 40 Additional Questions to reach ~50 total
const ADDITIONAL_QUESTIONS = [
    // --- TOPIC: BASIC CONCEPTS (10) ---
    {
        question_text: 'What does "Text-to-Image" mean?',
        options: [
            { text: 'Converting an image into text description', is_correct: false },
            { text: 'Generating an image based on a text description', is_correct: true },
            { text: 'Scanning a document', is_correct: false },
            { text: 'Adding captions to photos', is_correct: false }
        ],
        explanation: 'Text-to-Image refers to AI models that create visual content based on written text prompts.',
        difficulty: 'easy',
        topic_tag: 'AI Basics'
    },
    {
        question_text: 'Which term describes the randomness in AI image generation?',
        options: [
            { text: 'Grain', is_correct: false },
            { text: 'Noise', is_correct: true },
            { text: 'Static', is_correct: false },
            { text: 'Distortion', is_correct: false }
        ],
        explanation: 'AI models start with random "noise" and refine it into an image. This is key to how Diffusion models work.',
        difficulty: 'medium',
        topic_tag: 'AI Basics'
    },
    {
        question_text: 'If you want to create a slight change to an existing image, what feature would you use?',
        options: [
            { text: 'Delete', is_correct: false },
            { text: 'Variation / Remix', is_correct: true },
            { text: 'Format', is_correct: false },
            { text: 'Save As', is_correct: false }
        ],
        explanation: 'Variation or Remix features allow you to generate new versions of an image with slight differences while keeping the main composition.',
        difficulty: 'easy',
        topic_tag: 'AI Tools'
    },
    {
        question_text: 'What is "Upscaling"?',
        options: [
            { text: 'Making the image file size smaller', is_correct: false },
            { text: 'Increasing the resolution and detail of an image', is_correct: true },
            { text: 'Moving the image to the cloud', is_correct: false },
            { text: 'Making the image brighter', is_correct: false }
        ],
        explanation: 'Upscaling increases the pixel count (resolution) of an image, often adding finer details.',
        difficulty: 'easy',
        topic_tag: 'terminology'
    },
    {
        question_text: 'What is a "Style Reference"?',
        options: [
            { text: 'A link to a website', is_correct: false },
            { text: 'An image or keyword used to guide the artistic look', is_correct: true },
            { text: 'The price of the generation', is_correct: false },
            { text: 'A type of font', is_correct: false }
        ],
        explanation: 'A style reference helps the AI copy the aesthetic (colors, brushstrokes, mood) of a specific artist or image.',
        difficulty: 'medium',
        topic_tag: 'Prompting'
    },
    {
        question_text: 'True or False: The same prompt will always generate the EXACT same image twice if the seed is random.',
        options: [
            { text: 'True', is_correct: false },
            { text: 'False', is_correct: true },
            { text: 'Only on Tuesdays', is_correct: false },
            { text: 'Depends on the internet speed', is_correct: false }
        ],
        explanation: 'Unless you lock the "Seed" number, the AI uses random noise each time, creating a unique image every single generation.',
        difficulty: 'easy',
        topic_tag: 'AI Basics'
    },
    {
        question_text: 'What is "Model Hallucination" in images?',
        options: [
            { text: 'The AI falling asleep', is_correct: false },
            { text: 'Generating weird artifacts, extra limbs, or nonsense text', is_correct: true },
            { text: 'Creating a dream sequence', is_correct: false },
            { text: 'The AI refusing to work', is_correct: false }
        ],
        explanation: 'Hallucination refers to the AI generating things that dont exist or look wrong, like 6 fingers on a hand.',
        difficulty: 'medium',
        topic_tag: 'AI Limitations'
    },
    {
        question_text: 'Which file format is most common for AI generated images?',
        options: [
            { text: '.txt', is_correct: false },
            { text: '.png or .jpg', is_correct: true },
            { text: '.exe', is_correct: false },
            { text: '.mp3', is_correct: false }
        ],
        explanation: 'AI images are typically saved as standard image files like PNG or JPG.',
        difficulty: 'easy',
        topic_tag: 'Technicals'
    },
    {
        question_text: 'What helps AI generate better looking faces?',
        options: [
            { text: 'Asking nicely', is_correct: false },
            { text: 'Face Restoration / Refinement filters', is_correct: true },
            { text: 'Using a smaller image', is_correct: false },
            { text: 'Removing the face from the prompt', is_correct: false }
        ],
        explanation: 'Many tools have a "Face Restoration" post-processing step to fix distorted eyes or mouths.',
        difficulty: 'medium',
        topic_tag: 'Technicals'
    },
    {
        question_text: 'What is the primary input for these tools?',
        options: [
            { text: 'Microphone', is_correct: false },
            { text: 'Text Prompt', is_correct: true },
            { text: 'GPS Location', is_correct: false },
            { text: 'Thermometer', is_correct: false }
        ],
        explanation: 'The primary input is a descriptive text prompt.',
        difficulty: 'easy',
        topic_tag: 'AI Basics'
    },

    // --- TOPIC: PROMPTING TECHNIQUES (10) ---
    {
        question_text: 'Which modifier helps create a realistic photo look?',
        options: [
            { text: 'Oil painting', is_correct: false },
            { text: 'Photorealistic, 4k, hyper-detailed', is_correct: true },
            { text: 'Cartoon, flat', is_correct: false },
            { text: 'Abstract, blur', is_correct: false }
        ],
        explanation: 'Keywords like "photorealistic", "4k", "Canon EOS", etc., guide the AI toward photography styles.',
        difficulty: 'easy',
        topic_tag: 'Prompting'
    },
    {
        question_text: 'Which modifier implies a cartoon or drawn style?',
        options: [
            { text: 'Vector art, illustration, flat design', is_correct: true },
            { text: 'Photograph, DSLR', is_correct: false },
            { text: 'Octane render', is_correct: false },
            { text: 'Unreal Engine 5', is_correct: false }
        ],
        explanation: '"Vector art" or "Illustration" tells the AI to create drawn/graphic content rather than photos.',
        difficulty: 'medium',
        topic_tag: 'Prompting'
    },
    {
        question_text: 'What keyword often adds dramatic lighting?',
        options: [
            { text: 'Flat lighting', is_correct: false },
            { text: 'Volumetric lighting, golden hour, cinematic lighting', is_correct: true },
            { text: 'Darkness', is_correct: false },
            { text: 'No light', is_correct: false }
        ],
        explanation: '"Volumetric lighting" (God rays) and "Golden hour" are standard prompt hacks for beautiful light.',
        difficulty: 'medium',
        topic_tag: 'Prompting'
    },
    {
        question_text: 'If the AI keeps ignoring your main subject, what can you do?',
        options: [
            { text: 'Move it to the END of the prompt', is_correct: false },
            { text: 'Move it to the START of the prompt or add "((emphasis))"', is_correct: true },
            { text: 'Delete the prompt', is_correct: false },
            { text: 'Write the prompt backwards', is_correct: false }
        ],
        explanation: 'Words at the start of a prompt usually carry more weight. Some tools also support (parentheses) for emphasis.',
        difficulty: 'medium',
        topic_tag: 'Prompt Techniques'
    },
    {
        question_text: 'Which artist name might you add for a surreal, dreamlike style?',
        options: [
            { text: 'Salvador Dalí', is_correct: true },
            { text: 'Leonardo da Vinci', is_correct: false },
            { text: 'An architect', is_correct: false },
            { text: 'A photographer', is_correct: false }
        ],
        explanation: 'Salvador Dalí is famous for surrealism, and adding his name applies that dreamlike aesthetic.',
        difficulty: 'medium',
        topic_tag: 'Styles'
    },
    {
        question_text: 'Which engine keyword implies high-quality 3D computer graphics?',
        options: [
            { text: 'MS Paint', is_correct: false },
            { text: 'Unreal Engine 5, Octane Render', is_correct: true },
            { text: 'Watercolor', is_correct: false },
            { text: 'Sketch', is_correct: false }
        ],
        explanation: 'Keywords like "Unreal Engine" or "Octane Render" push the AI toward high-fidelity 3D graphics.',
        difficulty: 'medium',
        topic_tag: 'Styles'
    },
    {
        question_text: 'What suggests a retro 1980s feeling?',
        options: [
            { text: 'Cyberpunk, Synthwave, Neon', is_correct: true },
            { text: 'Medieval', is_correct: false },
            { text: 'Nature documentary', is_correct: false },
            { text: 'Black and white noir', is_correct: false }
        ],
        explanation: 'Synthwave and Neon are hallmarks of the 80s retro-futurist aesthetic.',
        difficulty: 'easy',
        topic_tag: 'Styles'
    },
    {
        question_text: 'What does "ISO 100" in a prompt refer to?',
        options: [
            { text: 'The cost', is_correct: false },
            { text: 'A camera setting for clear, low-grain images', is_correct: true },
            { text: 'The prompt length', is_correct: false },
            { text: 'The AIs version number', is_correct: false }
        ],
        explanation: 'ISO is a photography term. ISO 100 often implies a clean, noise-free image.',
        difficulty: 'hard',
        topic_tag: 'Photography terms'
    },
    {
        question_text: 'What does "Macro photography" mean in a prompt?',
        options: [
            { text: 'Taking a picture of the earth', is_correct: false },
            { text: 'Extreme close-up of small subjects (bugs, eyes, droplets)', is_correct: true },
            { text: 'Black and white', is_correct: false },
            { text: 'Wide angle landscape', is_correct: false }
        ],
        explanation: 'Macro implies extreme close-ups showing tiny details.',
        difficulty: 'medium',
        topic_tag: 'Photography terms'
    },
    {
        question_text: 'What is a "Weighted Prompt"?',
        options: [
            { text: 'A heavy font', is_correct: false },
            { text: 'Assigning a numerical importance value to specific words (e.g. cat:1.5)', is_correct: true },
            { text: 'A long prompt', is_correct: false },
            { text: 'A prompt with bold text', is_correct: false }
        ],
        explanation: 'Prompt weighting (like `cat::2`) tells the AI which words are most important.',
        difficulty: 'hard',
        topic_tag: 'Advanced Techniques'
    },

    // --- TOPIC: PARAMETERS & TOOLS (10) ---
    {
        question_text: 'In MidJourney, what does the parameter "--no" do?',
        options: [
            { text: 'It says no to the user', is_correct: false },
            { text: 'It creates a negative prompt (e.g. --no clouds)', is_correct: true },
            { text: 'It stops the generation', is_correct: false },
            { text: 'It deletes the account', is_correct: false }
        ],
        explanation: '--no is the parameter shortcut for negative prompting in MidJourney.',
        difficulty: 'medium',
        topic_tag: 'Parameters'
    },
    {
        question_text: 'What does "CFG Scale" (Classifier Free Guidance) control?',
        options: [
            { text: 'The price', is_correct: false },
            { text: 'How strictly the AI follows your prompt vs being creative', is_correct: true },
            { text: 'The image size', is_correct: false },
            { text: 'The color saturation', is_correct: false }
        ],
        explanation: 'High CFG means the AI follows the prompt strictly. Low CFG allows the AI more "creative freedom".',
        difficulty: 'hard',
        topic_tag: 'Parameters'
    },
    {
        question_text: 'What aspect ratio is "9:16"?',
        options: [
            { text: 'Square', is_correct: false },
            { text: 'Vertical / Portrait (like a phone story)', is_correct: true },
            { text: 'Horizontal / Widescreen', is_correct: false },
            { text: 'A circle', is_correct: false }
        ],
        explanation: '9:16 is the standard vertical format for mobile screens.',
        difficulty: 'medium',
        topic_tag: 'Parameters'
    },
    {
        question_text: 'If an image takes too many "Steps" to generate, what happens?',
        options: [
            { text: 'It finishes instantly', is_correct: false },
            { text: 'It takes longer, but usually has more detail/refinement', is_correct: true },
            { text: 'It becomes black and white', is_correct: false },
            { text: 'The computer crashes', is_correct: false }
        ],
        explanation: 'More denoising "steps" usually mean higher quality but take more time.',
        difficulty: 'medium',
        topic_tag: 'Technical'
    },
    {
        question_text: 'Which tool is "Open Source" and can be run on your own PC?',
        options: [
            { text: 'MidJourney', is_correct: false },
            { text: 'DALL-E 3', is_correct: false },
            { text: 'Stable Diffusion', is_correct: true },
            { text: 'Adobe Firefly', is_correct: false }
        ],
        explanation: 'Stable Diffusion is famous for being open-source and runnable locally.',
        difficulty: 'medium',
        topic_tag: 'AI Tools'
    },
    {
        question_text: 'What is "Adobe Firefly" integrated into?',
        options: [
            { text: 'Microsoft Word', is_correct: false },
            { text: 'Photoshop', is_correct: true },
            { text: 'Discord', is_correct: false },
            { text: 'Steam', is_correct: false }
        ],
        explanation: 'Firefly is Adobes AI model integrated directly into Photoshop.',
        difficulty: 'easy',
        topic_tag: 'AI Tools'
    },
    {
        question_text: 'Which parameter might create "weird" or "abstract" results?',
        options: [
            { text: 'High chaos / High variety', is_correct: true },
            { text: 'Low chaos', is_correct: false },
            { text: 'Standard settings', is_correct: false },
            { text: 'Black and white', is_correct: false }
        ],
        explanation: 'Parameters like `--chaos` in MidJourney increase the unpredictability.',
        difficulty: 'medium',
        topic_tag: 'Parameters'
    },
    {
        question_text: 'What does "Tile" or "Seamless" mode do?',
        options: [
            { text: 'Makes the image square', is_correct: false },
            { text: 'Creates textures that can repeat infinitely (like wallpaper)', is_correct: true },
            { text: 'Breaks the image into pieces', is_correct: false },
            { text: 'Makes it bathroom themed', is_correct: false }
        ],
        explanation: 'Tiling creates seamless patterns useful for textures and backgrounds.',
        difficulty: 'medium',
        topic_tag: 'Advanced Techniques'
    },
    {
        question_text: 'What feature uses an existing image as the prompt input?',
        options: [
            { text: 'Image-to-Image (Img2Img)', is_correct: true },
            { text: 'Text-to-Image', is_correct: false },
            { text: 'Save As', is_correct: false },
            { text: 'Downloading', is_correct: false }
        ],
        explanation: 'Image-to-Image uses a starting picture + text to generate a new variation.',
        difficulty: 'easy',
        topic_tag: 'Advanced Techniques'
    },
    {
        question_text: 'Where does MidJourney usually operate?',
        options: [
            { text: 'A standalone desktop app', is_correct: false },
            { text: 'Inside Discord servers', is_correct: true },
            { text: 'On a floppy disk', is_correct: false },
            { text: 'In MS Paint', is_correct: false }
        ],
        explanation: 'MidJourney is unique for being accessed primarily via Discord commands.',
        difficulty: 'easy',
        topic_tag: 'AI Tools'
    },

    // --- TOPIC: ETHICS & TROUBLESHOOTING (10) ---
    {
        question_text: 'What is a "Deepfake"?',
        options: [
            { text: 'A deep hole', is_correct: false },
            { text: 'A realistic AI video/image replacing a likeness without permission', is_correct: true },
            { text: 'A failed prompt', is_correct: false },
            { text: 'A 3D model', is_correct: false }
        ],
        explanation: 'Deepfakes are AI-generated media that swap faces or voices, raising ethical consent issues.',
        difficulty: 'easy',
        topic_tag: 'Ethics'
    },
    {
        question_text: 'Who owns the copyright to AI generated images (currently in US)?',
        options: [
            { text: 'The AI itself', is_correct: false },
            { text: 'It is generally considered public domain (no copyright)', is_correct: true },
            { text: 'The electricity company', is_correct: false },
            { text: 'Bill Gates', is_correct: false }
        ],
        explanation: 'Currently, the US Copyright Office generally does not grant copyright to purely AI-generated works.',
        difficulty: 'hard',
        topic_tag: 'Ethics'
    },
    {
        question_text: 'If an AI generates a hand with 6 fingers, it is a sign of:',
        options: [
            { text: 'A new evolutionary step', is_correct: false },
            { text: 'The model struggling with complex anatomy', is_correct: true },
            { text: 'A perfect generation', is_correct: false },
            { text: 'A hidden feature', is_correct: false }
        ],
        explanation: 'Hands are historically difficult for AI models to understand structurally.',
        difficulty: 'easy',
        topic_tag: 'Troubleshooting'
    },
    {
        question_text: 'Why do AI image generators block certain words (NSFW, violence)?',
        options: [
            { text: 'They hate freedom', is_correct: false },
            { text: 'Safety filters to prevent harmful content creation', is_correct: true },
            { text: 'To save money', is_correct: false },
            { text: 'Because they cant spell them', is_correct: false }
        ],
        explanation: 'Most commercial tools have strict safety filters to prevent generation of offensive or illegal content.',
        difficulty: 'easy',
        topic_tag: 'Ethics'
    },
    {
        question_text: 'Why might text in AI images look like gibberish?',
        options: [
            { text: 'It is an alien language', is_correct: false },
            { text: 'The AI treats text as shapes, not meaning', is_correct: true },
            { text: 'It is encrypted', is_correct: false },
            { text: 'The screen is broken', is_correct: false }
        ],
        explanation: 'AI often reproduces the "look" of text (shapes of letters) without understanding the spelling.',
        difficulty: 'medium',
        topic_tag: 'Troubleshooting'
    },
    {
        question_text: 'What is "Bias" in AI images?',
        options: [
            { text: 'The image being tilted', is_correct: false },
            { text: 'The model reinforcing stereotypes (e.g. all CEOs are men)', is_correct: true },
            { text: 'The color balance', is_correct: false },
            { text: 'The file size', is_correct: false }
        ],
        explanation: 'Data bias leads to the AI generating stereotypical outputs based on its training data.',
        difficulty: 'medium',
        topic_tag: 'Ethics'
    },
    {
        question_text: 'How can you fix a specific ugly detail without regenerating the whole image?',
        options: [
            { text: 'Throw the computer away', is_correct: false },
            { text: 'Use "Inpainting" to redraw just that spot', is_correct: true },
            { text: 'Zoom out', is_correct: false },
            { text: 'Close your eyes', is_correct: false }
        ],
        explanation: 'Inpainting is the solution for fixing small defects.',
        difficulty: 'medium',
        topic_tag: 'Troubleshooting'
    },
    {
        question_text: 'Can AI generate famous copyrighted characters (like Mickey Mouse)?',
        options: [
            { text: 'Never', is_correct: false },
            { text: 'Yes, if the model knows them, but it may violate copyright', is_correct: true },
            { text: 'Only in black and white', is_correct: false },
            { text: 'Only on weekends', is_correct: false }
        ],
        explanation: 'AI can generate them, but using such images commercially is a major legal risk.',
        difficulty: 'medium',
        topic_tag: 'Ethics'
    },
    {
        question_text: 'What is the "Uncanny Valley"?',
        options: [
            { text: 'A place in California', is_correct: false },
            { text: 'When a face looks ALMOST human but slightly wrong, creating a creepy feeling', is_correct: true },
            { text: 'A low resolution image', is_correct: false },
            { text: 'A very bright image', is_correct: false }
        ],
        explanation: 'The Uncanny Valley effect happens when AI approaches realism but misses subtle details, looking creepy.',
        difficulty: 'medium',
        topic_tag: 'Concepts'
    },
    {
        question_text: 'To get a wide landscape view, you should change the:',
        options: [
            { text: 'Color', is_correct: false },
            { text: 'Aspect Ratio', is_correct: true },
            { text: 'Volume', is_correct: false },
            { text: 'Brightness', is_correct: false }
        ],
        explanation: 'Aspect ratio controls the width vs height.',
        difficulty: 'easy',
        topic_tag: 'Parameters'
    }
];

async function addMoreQuestions() {
    console.log(`🚀 Adding ${ADDITIONAL_QUESTIONS.length} Questions to Module: ${MODULE_TITLE}...\n`);

    try {
        // 1. Get Module ID
        const { data: module, error: modError } = await supabase
            .from('learning_modules')
            .select('id')
            .eq('title', MODULE_TITLE)
            .single();

        if (modError) throw new Error(`Module not found: ${modError.message}`);
        console.log(`✅ Found Module ID: ${module.id}`);

        // 2. Insert Questions (Attach module_id)
        const questionsToInsert = ADDITIONAL_QUESTIONS.map(q => ({ ...q, module_id: module.id }));

        const { error: insertError } = await supabase
            .from('quiz_questions')
            .insert(questionsToInsert);

        if (insertError) throw new Error(`Insert questions failed: ${insertError.message}`);
        console.log(`✅ Inserted ${questionsToInsert.length} NEW quiz questions`);
        console.log(`✅ Total Questions for Module 3 is now ~50`);

    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

addMoreQuestions();
