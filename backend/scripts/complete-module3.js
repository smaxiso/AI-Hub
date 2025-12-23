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

const LESSON_CONTENT = `
# AI Image Generation Basics

Welcome to the visual revolution! AI image generators like MidJourney, DALL-E 3, and Stable Diffusion can turn text descriptions into stunning visuals in seconds.

## How It Works: Diffusion Models

Most modern AI image tools use **Diffusion Models**. Imagine taking a clear photo and slowly adding noise (static) until it's unrecognizable. The AI is trained to reverse this process—starting with pure noise and "denoising" it step-by-step to match your prompt.

## Popular Tools

| Tool | Best For | Pros |
| :--- | :--- | :--- |
| **MidJourney** | Artistic, high-quality visuals | Best aesthetics, great lighting/texture |
| **DALL-E 3** | Accuracy, following complex instructions | integrated with ChatGPT, easy to talk to |
| **Stable Diffusion** | Control & Customization | Open source, runs locally, huge ecosystem |

## The Structure of an Image Prompt

A good image prompt often follows this structure:

> **[Subject]** + **[Medium/Style]** + **[Lighting/Color]** + **[Composition]** + **[Parameters]**

### Example
*   **Subject**: A futuristic city skyline
*   **Medium**: Cyberpunk digital art
*   **Lighting**: Neon purple and blue glow
*   **Parameter**: --ar 16:9 (Aspect Ratio)

## Key Concepts

### 1. Aspect Ratio
The shape of your image.
*   Square (1:1) - Default for many models
*   Portrait (9:16) - Good for phone screens
*   Landscape (16:9) - Cinematic

### 2. Negative Prompts
Telling the AI what you **don't** want.
*   *Example:* "no text, no blurry, no distorted hands, no watermark"

### 3. Inpainting & Outpainting
*   **Inpainting**: Fixing a small part inside an image (e.g., changing a dog's hat).
*   **Outpainting**: Extending the image beyond its original borders.

\`\`\`flashcard
Diffusion Model---A type of AI model that generates images by learning to reverse the process of adding noise to data, effectively "denoising" random static into a coherent image.
\`\`\`

## Interactive Exercise

Try describing an image in detail.

\`\`\`interactive
Describe an image of a cat astronaut. Include the style (e.g., oil painting), lighting (e.g., golden hour), and setting (e.g., Mars surface).
\`\`\`
`;

const NEW_QUESTIONS = [
    {
        question_text: 'What technology do most modern AI image generators use?',
        options: [
            { text: 'Diffusion Models', is_correct: true },
            { text: 'Excel Spreadsheets', is_correct: false },
            { text: 'Simple Filters', is_correct: false },
            { text: 'Manual Drawing', is_correct: false }
        ],
        explanation: 'Diffusion models work by learning to remove noise from an image to construct a clear picture from random static.',
        difficulty: 'easy',
        topic_tag: 'AI Basics'
    },
    {
        question_text: 'Which tool is known for its high artistic aesthetic and runs via Discord?',
        options: [
            { text: 'DALL-E 2', is_correct: false },
            { text: 'MidJourney', is_correct: true },
            { text: 'Paint', is_correct: false },
            { text: 'Notepad', is_correct: false }
        ],
        explanation: 'MidJourney is famous for its artistic style and texture, and it is primarily accessed through a Discord bot.',
        difficulty: 'easy',
        topic_tag: 'AI Tools'
    },
    {
        question_text: 'What is a "Negative Prompt"?',
        options: [
            { text: 'A prompt that insults the AI', is_correct: false },
            { text: 'A list of things you want to EXCLUDE from the image', is_correct: true },
            { text: 'A prompt written in red text', is_correct: false },
            { text: 'A prompt that generates black and white images', is_correct: false }
        ],
        explanation: 'Negative prompts tell the AI what to avoid, such as "blurry", "text", or "bad anatomy".',
        difficulty: 'medium',
        topic_tag: 'Prompt Techniques'
    },
    {
        question_text: 'What does "Inpainting" allow you to do?',
        options: [
            { text: 'Paint a wall', is_correct: false },
            { text: 'Edit or replace a specific area INSIDE an image', is_correct: true },
            { text: 'Make the image larger', is_correct: false },
            { text: 'Delete the image', is_correct: false }
        ],
        explanation: 'Inpainting is the process of editing specific regions within an image while keeping the rest consistent.',
        difficulty: 'medium',
        topic_tag: 'Advanced Techniques'
    },
    {
        question_text: 'Which prompt structure is most likely to give a good result?',
        options: [
            { text: 'Cool picture', is_correct: false },
            { text: 'Subject + Style + Lighting + Composition', is_correct: true },
            { text: 'Just the subject', is_correct: false },
            { text: 'Random words', is_correct: false }
        ],
        explanation: 'A structured prompt that defines the subject, style, lighting, and composition gives the AI the most guidance.',
        difficulty: 'easy',
        topic_tag: 'Prompt Basics'
    },
    {
        question_text: 'What is "Outpainting"?',
        options: [
            { text: 'Painting outside', is_correct: false },
            { text: 'Extending the image beyond its original borders', is_correct: true },
            { text: 'Exporting the image', is_correct: false },
            { text: 'Removing paint', is_correct: false }
        ],
        explanation: 'Outpainting generates new content to extend the canvas beyond the original image boundaries.',
        difficulty: 'medium',
        topic_tag: 'Advanced Techniques'
    },
    {
        question_text: 'If you want a cinematic widescreen image, what aspect ratio might you use?',
        options: [
            { text: '1:1', is_correct: false },
            { text: '9:16', is_correct: false },
            { text: '16:9', is_correct: true },
            { text: '1:100', is_correct: false }
        ],
        explanation: '16:9 is the standard aspect ratio for widescreen cinematic content.',
        difficulty: 'easy',
        topic_tag: 'Parameters'
    },
    {
        question_text: 'Which tool is integrated directly into ChatGPT (Plus)?',
        options: [
            { text: 'Stable Diffusion', is_correct: false },
            { text: 'MidJourney', is_correct: false },
            { text: 'DALL-E 3', is_correct: true },
            { text: 'Photoshop', is_correct: false }
        ],
        explanation: 'DALL-E 3 is developed by OpenAI and is integrated directly into ChatGPT.',
        difficulty: 'easy',
        topic_tag: 'AI Tools'
    },
    {
        question_text: 'Common artifacts (mistakes) in AI images often include:',
        options: [
            { text: 'Perfect spelling', is_correct: false },
            { text: 'Identify theft', is_correct: false },
            { text: 'Too many fingers or distorted text', is_correct: true },
            { text: 'Perfect symmetry', is_correct: false }
        ],
        explanation: 'Current AI models often struggle with fine details like hands (too many fingers) and rendering readable text.',
        difficulty: 'medium',
        topic_tag: 'AI Limitations'
    },
    {
        question_text: 'What is a "Seed" in AI image generation?',
        options: [
            { text: 'A plant', is_correct: false },
            { text: 'A random number used to initialize the generation', is_correct: true },
            { text: 'The file size', is_correct: false },
            { text: 'The cost of the image', is_correct: false }
        ],
        explanation: 'The seed is the starting noise pattern. Using the same seed with the same settings will produce the same image.',
        difficulty: 'hard',
        topic_tag: 'Parameters'
    }
];

async function completeModule3() {
    console.log(`🚀 Completing Module: ${MODULE_TITLE}...\n`);

    try {
        // 1. Get Module ID
        const { data: module, error: modError } = await supabase
            .from('learning_modules')
            .select('id')
            .eq('title', MODULE_TITLE)
            .single();

        if (modError) throw new Error(`Module not found: ${modError.message}`);
        console.log(`✅ Found Module ID: ${module.id}`);

        // 2. Update Content
        const { error: updateError } = await supabase
            .from('learning_modules')
            .update({ content: LESSON_CONTENT })
            .eq('id', module.id);

        if (updateError) throw new Error(`Update content failed: ${updateError.message}`);
        console.log('✅ Updated Lesson Content (Markdown)');

        // 3. Insert Questions (Attach module_id)
        const questionsToInsert = NEW_QUESTIONS.map(q => ({ ...q, module_id: module.id }));

        const { error: insertError } = await supabase
            .from('quiz_questions')
            .insert(questionsToInsert);

        if (insertError) throw new Error(`Insert questions failed: ${insertError.message}`);
        console.log(`✅ Inserted ${questionsToInsert.length} new quiz questions`);

        console.log('\n✨ Module 3 is now COMPLETE! (Content + 10 Questions)');

    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

completeModule3();
