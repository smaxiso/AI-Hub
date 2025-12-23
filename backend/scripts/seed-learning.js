const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedLearningContent() {
    console.log('\n🌱 Seeding Learning Platform Content...\n');

    try {
        // Step 1: Clean up existing beginner modules
        console.log('🧹 Cleaning up existing beginner modules...');

        const { data: existingModules } = await supabase
            .from('learning_modules')
            .select('id')
            .eq('level', 'beginner');

        if (existingModules && existingModules.length > 0) {
            const moduleIds = existingModules.map(m => m.id);

            // Delete related data
            await supabase.from('quiz_questions').delete().in('module_id', moduleIds);
            await supabase.from('module_completions').delete().in('module_id', moduleIds);
            await supabase.from('quiz_attempts').delete().in('module_id', moduleIds);
            await supabase.from('learning_modules').delete().in('id', moduleIds);

            console.log(`   Removed ${existingModules.length} existing modules\n`);
        }

        // Step 2: Create modules
        console.log('📚 Creating 5 beginner modules...');

        const modules = [
            {
                level: 'beginner',
                order_index: 1,
                title: 'Introduction to AI Chat Tools',
                description: 'Learn the fundamentals of AI-powered chatbots like ChatGPT and Claude. Understand how they work and how to use them effectively in your daily workflow.',
                learning_objectives: [
                    'Understand what AI chat tools are and how they work',
                    'Learn to craft effective prompts for better responses',
                    'Discover practical use cases for everyday tasks',
                    'Compare different chat AI tools and their strengths'
                ],
                estimated_duration_minutes: 30,
                is_published: true
            },
            {
                level: 'beginner',
                order_index: 2,
                title: 'Mastering Prompt Engineering',
                description: 'Master the art of writing effective prompts to get the best results from AI tools. Learn advanced techniques and common patterns.',
                learning_objectives: [
                    'Write clear and specific prompts',
                    'Use context and examples effectively',
                    'Apply prompt templates for common tasks',
                    'Troubleshoot poor AI responses'
                ],
                estimated_duration_minutes: 45,
                is_published: true
            },
            {
                level: 'beginner',
                order_index: 3,
                title: 'AI Image Generation Basics',
                description: 'Explore the world of AI-powered image creation with tools like MidJourney, DALL-E, and Stable Diffusion.',
                learning_objectives: [
                    'Understand how AI generates images',
                    'Write effective image prompts',
                    'Choose the right tool for your needs',
                    'Edit and refine AI-generated images'
                ],
                estimated_duration_minutes: 40,
                is_published: true
            },
            {
                level: 'beginner',
                order_index: 4,
                title: 'AI Coding Assistants',
                description: 'Learn how to use AI coding tools like GitHub Copilot and CodeWhisperer to boost your development productivity.',
                learning_objectives: [
                    'Set up AI coding assistants',
                    'Write code faster with AI suggestions',
                    'Debug code with AI help',
                    'Understand AI code limitations'
                ],
                estimated_duration_minutes: 50,
                is_published: true
            },
            {
                level: 'beginner',
                order_index: 5,
                title: 'AI Ethics and Best Practices',
                description: 'Understand the ethical considerations and best practices when using AI tools in professional and personal contexts.',
                learning_objectives: [
                    'Recognize AI biases and limitations',
                    'Use AI responsibly and ethically',
                    'Protect privacy when using AI',
                    'Verify AI-generated content'
                ],
                estimated_duration_minutes: 35,
                is_published: true
            }
        ];

        const { data: createdModules, error: modulesError } = await supabase
            .from('learning_modules')
            .insert(modules)
            .select();

        if (modulesError) throw modulesError;

        console.log(`   ✅ Created ${createdModules.length} modules\n`);

        // Update prerequisites
        console.log('🔗 Setting up prerequisites...');
        const [mod1, mod2, mod3, mod4, mod5] = createdModules;

        await supabase.from('learning_modules').update({ prerequisites: [mod1.id] }).eq('id', mod2.id);
        await supabase.from('learning_modules').update({ prerequisites: [mod1.id] }).eq('id', mod3.id);
        await supabase.from('learning_modules').update({ prerequisites: [mod2.id] }).eq('id', mod4.id);
        await supabase.from('learning_modules').update({ prerequisites: [mod3.id, mod4.id] }).eq('id', mod5.id);

        console.log('   ✅ Prerequisites configured\n');

        // Step 3: Create quiz questions
        console.log('❓ Creating quiz questions...');

        const questions = [
            // Module 1 questions
            {
                module_id: mod1.id,
                question_text: 'What is the primary technology behind modern AI chat tools like ChatGPT?',
                options: [
                    { text: 'Rule-based programming', is_correct: false },
                    { text: 'Large Language Models (LLMs)', is_correct: true },
                    { text: 'Simple keyword matching', is_correct: false },
                    { text: 'Database queries', is_correct: false }
                ],
                explanation: 'Large Language Models (LLMs) are trained on vast amounts of text data to understand and generate human-like responses.',
                difficulty: 'easy',
                topic_tag: 'AI Basics',
                is_active: true
            },
            {
                module_id: mod1.id,
                question_text: 'Which of the following is NOT a benefit of using AI chat tools?',
                options: [
                    { text: '24/7 availability', is_correct: false },
                    { text: 'Instant responses', is_correct: false },
                    { text: '100% accuracy guarantee', is_correct: true },
                    { text: 'Handling multiple queries simultaneously', is_correct: false }
                ],
                explanation: 'AI tools can make mistakes and should not be relied upon for 100% accuracy. Always verify important information.',
                difficulty: 'easy',
                topic_tag: 'AI Limitations',
                is_active: true
            },
            {
                module_id: mod1.id,
                question_text: 'What is a "prompt" in the context of AI chat tools?',
                options: [
                    { text: "The AI's response to your question", is_correct: false },
                    { text: 'The input or question you give to the AI', is_correct: true },
                    { text: 'A reminder notification', is_correct: false },
                    { text: 'An error message', is_correct: false }
                ],
                explanation: 'A prompt is the input text or question you provide to the AI tool to generate a response.',
                difficulty: 'easy',
                topic_tag: 'Prompt Basics',
                is_active: true
            },
            {
                module_id: mod1.id,
                question_text: 'Which AI chat tool is developed by OpenAI?',
                options: [
                    { text: 'Claude', is_correct: false },
                    { text: 'Bard', is_correct: false },
                    { text: 'ChatGPT', is_correct: true },
                    { text: 'Copilot', is_correct: false }
                ],
                explanation: 'ChatGPT is developed by OpenAI and is one of the most popular AI chat tools.',
                difficulty: 'easy',
                topic_tag: 'AI Tools',
                is_active: true
            },
            {
                module_id: mod1.id,
                question_text: 'What should you do if an AI chat tool gives you incorrect information?',
                options: [
                    { text: 'Always trust the AI', is_correct: false },
                    { text: 'Verify the information from reliable sources', is_correct: true },
                    { text: 'Ignore the response', is_correct: false },
                    { text: 'Share it immediately', is_correct: false }
                ],
                explanation: 'Always verify important information from reliable sources. AI tools can sometimes provide incorrect or outdated information.',
                difficulty: 'medium',
                topic_tag: 'AI Best Practices',
                is_active: true
            },
            {
                module_id: mod1.id,
                question_text: 'Which statement about AI responses is most accurate?',
                options: [
                    { text: 'AI responses are always factual', is_correct: false },
                    { text: 'AI can generate plausible but sometimes incorrect information', is_correct: true },
                    { text: 'AI cannot make grammatical errors', is_correct: false },
                    { text: 'AI always cites its sources', is_correct: false }
                ],
                explanation: 'AI can generate convincing text that sounds factual but may contain errors or "hallucinations".',
                difficulty: 'medium',
                topic_tag: 'AI Limitations',
                is_active: true
            },
            {
                module_id: mod1.id,
                question_text: 'What is the best practice when asking an AI for help with a task?',
                options: [
                    { text: 'Ask vague questions', is_correct: false },
                    { text: 'Provide clear context and specific details', is_correct: true },
                    { text: 'Use as few words as possible', is_correct: false },
                    { text: 'Avoid examples', is_correct: false }
                ],
                explanation: 'Clear, specific prompts with context lead to better AI responses.',
                difficulty: 'easy',
                topic_tag: 'Prompt Basics',
                is_active: true
            },
            {
                module_id: mod1.id,
                question_text: 'Can AI chat tools access real-time internet data by default?',
                options: [
                    { text: 'Yes, always', is_correct: false },
                    { text: 'No, most have a knowledge cutoff date', is_correct: true },
                    { text: 'Only on weekends', is_correct: false },
                    { text: 'Only for premium users', is_correct: false }
                ],
                explanation: "Most AI chat tools have a knowledge cutoff date and don't access real-time internet data unless specifically enabled.",
                difficulty: 'medium',
                topic_tag: 'AI Basics',
                is_active: true
            },
            {
                module_id: mod1.id,
                question_text: 'What type of tasks are AI chat tools particularly good at?',
                options: [
                    { text: 'Physical labor', is_correct: false },
                    { text: 'Text generation, summarization, and explanation', is_correct: true },
                    { text: 'Replacing human judgment entirely', is_correct: false },
                    { text: 'Making financial investments', is_correct: false }
                ],
                explanation: 'AI chat tools excel at language-based tasks like writing, summarizing, and explaining concepts.',
                difficulty: 'easy',
                topic_tag: 'AI Use Cases',
                is_active: true
            },
            {
                module_id: mod1.id,
                question_text: 'How should you handle sensitive or private information with AI tools?',
                options: [
                    { text: 'Share freely with any AI', is_correct: false },
                    { text: 'Avoid sharing confidential or personal data', is_correct: true },
                    { text: 'Only share on Tuesdays', is_correct: false },
                    { text: 'Encrypt it first', is_correct: false }
                ],
                explanation: 'Never share sensitive personal or confidential information with AI tools as conversations may be stored or reviewed.',
                difficulty: 'medium',
                topic_tag: 'AI Best Practices',
                is_active: true
            },
            // Module 2 questions
            {
                module_id: mod2.id,
                question_text: 'What is the most important element of a good prompt?',
                options: [
                    { text: 'Length', is_correct: false },
                    { text: 'Clarity and specificity', is_correct: true },
                    { text: 'Using technical jargon', is_correct: false },
                    { text: 'Being concise at all costs', is_correct: false }
                ],
                explanation: 'Clear, specific prompts help the AI understand exactly what you need.',
                difficulty: 'easy',
                topic_tag: 'Prompt Engineering',
                is_active: true
            },
            {
                module_id: mod2.id,
                question_text: 'Which prompt technique involves giving examples to the AI?',
                options: [
                    { text: 'Zero-shot prompting', is_correct: false },
                    { text: 'Few-shot prompting', is_correct: true },
                    { text: 'Chain-of-thought', is_correct: false },
                    { text: 'Role prompting', is_correct: false }
                ],
                explanation: "Few-shot prompting provides examples to guide the AI's responses.",
                difficulty: 'medium',
                topic_tag: 'Prompt Engineering',
                is_active: true
            },
            {
                module_id: mod2.id,
                question_text: "What should you do if an AI response doesn't meet your needs?",
                options: [
                    { text: 'Give up', is_correct: false },
                    { text: 'Refine your prompt and try again', is_correct: true },
                    { text: 'Use the same prompt repeatedly', is_correct: false },
                    { text: 'Switch to a different task', is_correct: false }
                ],
                explanation: 'Iterating and refining prompts is key to getting better results.',
                difficulty: 'easy',
                topic_tag: 'Prompt Engineering',
                is_active: true
            }
        ];

        const { data: createdQuestions, error: questionsError } = await supabase
            .from('quiz_questions')
            .insert(questions);

        if (questionsError) throw questionsError;

        console.log(`   ✅ Created ${questions.length} quiz questions\n`);

        console.log('✅ Seeding complete!\n');
        console.log('📊 Summary:');
        console.log(`   Modules: 5 beginner modules`);
        console.log(`   Questions: ${questions.length} questions`);
        console.log(`   Module 1: 10 questions`);
        console.log(`   Module 2: 3 questions\n`);

    } catch (err) {
        console.error('❌ Error seeding data:', err.message);
        console.error(err);
    }
}

seedLearningContent();
