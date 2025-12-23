const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const MODULE_TITLE = 'AI Ethics and Best Practices';

const EXPANDED_CONTENT = `
# AI Ethics & Best Practices

As AI becomes more powerful, using it **responsibly** is just as important as using it effectively. This module covers the critical "Rules of the Road" for the AI age.

## 1. The "Black Box" Problem & Explainability
AI models (especially Deep Learning) are often "Black Boxes". We know the input and the output, but the internal decision-making process is a tangle of billions of parameters.
*   **Risk:** If an AI loan system rejects an applicant, it might not be able to explain *why*.
*   **Best Practice:** Always keep a "Human in the Loop" (HITL) for critical decisions (hiring, finance, medical).

## 2. Bias in AI
AI models are trained on internet data, which mirrors human prejudices.
*   **Stereotyping:** An image generator might default to showing "Doctors" as men and "Nurses" as women.
*   **Cultural Bias:** Models often perform improved in English and Western cultural contexts.
*   **Mitigation:** Be keenly aware of this. Actively prompt against stereotypes (e.g., "A diverse group of doctors").

## 3. Data Privacy & Security
**Rule #1: If it's free, you are the product.**
*   **Training Data:** Public AI tools (like free ChatGPT) often use your conversations to train future models.
*   **Confidentiality:** NEVER paste:
    *   Passwords / API Keys
    *   Customer PII (Personally Identifiable Information)
    *   Company Trade Secrets
*   **Enterprise Solutions:** Business versions (e.g., ChatGPT Enterprise, Copilot Business) contractually guarantee data privacy.

## 4. Deepfakes & Misinformation
AI can generate hyper-realistic fake images, audio, and video.
*   **The Threat:** Deepfakes can harm reputations, spread fake news, or facilitate scams (e.g., a fake audio clip of a CEO ordering a money transfer).
*   **Verification:**
    *   Check sources.
    *   Look for visual glitches (weird hands, mismatched earrings, text artifacts).
    *   Use provenance tools (C2PA content credentials) when available.

## 5. Copyright & Ownership
*   **Current Reality:** In many jurisdictions (like the US), purely AI-generated content **cannot be copyrighted**. It belongs to the public domain.
*   **Modification:** If a human significantly modifies the AI output, copyright *may* apply to the human changes.
*   **Liability:** Be careful generating images of trademarked characters (e.g., Mickey Mouse). You can be sued for trademark infringement even if the AI made it.

\`\`\`flashcard
Hallucination---When an AI confidently presents false information as fact. Always verify AI claims against trusted sources.
\`\`\`

## Interactive Scenario
**Scenario:** You are a manager. You want to use AI to write performance reviews for your team to save time.
*   **Risk:** Pasteing employee names and specific performance issues into a public AI violates privacy. The AI might also be harsh or biased.
*   **Safe Approach:** Anonymize the data first. Use the AI to *rewrite* your draft for clarity, rather than generating the review from scratch.
`;

const NEW_QUESTIONS = [
    // --- TOPIC: PRIVACY & SECURITY (8) ---
    {
        question_text: 'Why should you generally avoid plotting sensitive company data into a free public AI chatbot?',
        options: [
            { text: 'The AI might get confused', is_correct: false },
            { text: 'The data might be used to train future models and could leak', is_correct: true },
            { text: 'It creates a virus', is_correct: false },
            { text: 'The internet is too slow', is_correct: false }
        ],
        explanation: 'Public models often retain data for training. Sensitive info could theoretically resurface in future responses.',
        difficulty: 'easy',
        topic_tag: 'Privacy'
    },
    {
        question_text: 'What is PII?',
        options: [
            { text: 'Personal AI Interface', is_correct: false },
            { text: 'Personally Identifiable Information (like names, SSNs)', is_correct: true },
            { text: 'Primary Input Instruction', is_correct: false },
            { text: 'Public Internet Index', is_correct: false }
        ],
        explanation: 'PII stands for Personally Identifiable Information, which must be protected under laws like GDPR.',
        difficulty: 'medium',
        topic_tag: 'Terminology'
    },
    {
        question_text: 'Which version of AI tools is usually safest for business use?',
        options: [
            { text: 'The free version', is_correct: false },
            { text: 'The Enterprise / Business tier', is_correct: true },
            { text: 'A beta version', is_correct: false },
            { text: 'A leaked version', is_correct: false }
        ],
        explanation: 'Enterprise tiers typically come with logical data privacy contracts (Data Processing Addendums).',
        difficulty: 'easy',
        topic_tag: 'Security'
    },
    {
        question_text: 'What is "Prompt Injection"?',
        options: [
            { text: 'A medical shot', is_correct: false },
            { text: 'Tricking an AI into ignoring its safety rules to produce harmful output', is_correct: true },
            { text: 'Writing a prompt very fast', is_correct: false },
            { text: 'Installing a prompt plugin', is_correct: false }
        ],
        explanation: 'Prompt injection is a security exploit where malicious inputs override the AI\'s original instructions.',
        difficulty: 'hard',
        topic_tag: 'Security'
    },
    {
        question_text: 'True or False: Deleting a chat history on a free AI tool always deletes the training data immediately.',
        options: [
            { text: 'True, instantly', is_correct: false },
            { text: 'False, retention policies vary and data may already be processed', is_correct: true },
            { text: 'Only on Mondays', is_correct: false },
            { text: 'True if you ask nicely', is_correct: false }
        ],
        explanation: 'Data removal is complex. Once data is used to train a model weights, it is very hard to "unlearn".',
        difficulty: 'medium',
        topic_tag: 'Privacy'
    },

    // --- TOPIC: BIAS & ETHICS (8) ---
    {
        question_text: 'Why do AI models exhibit bias?',
        options: [
            { text: 'They are inherently evil', is_correct: false },
            { text: 'They reflect the biases present in the human execution data they were trained on', is_correct: true },
            { text: 'Programmers hard-code it', is_correct: false },
            { text: 'It is a random bug', is_correct: false }
        ],
        explanation: 'Models mirrors the internet data they consume, which contains historical and societal biases.',
        difficulty: 'medium',
        topic_tag: 'Bias'
    },
    {
        question_text: 'What is "Algorithmic Bias"?',
        options: [
            { text: 'When an algorithm performs better for some groups than others', is_correct: true },
            { text: 'When code runs slowly', is_correct: false },
            { text: 'When AI refuses to answer', is_correct: false },
            { text: 'A bias towards math', is_correct: false }
        ],
        explanation: 'This occurs when AI systems create unfair outcomes, such as facial recognition working poorly for certain skin tones.',
        difficulty: 'medium',
        topic_tag: 'Bias'
    },
    {
        question_text: 'How can you mitigate bias in image generation?',
        options: [
            { text: 'You cannot', is_correct: false },
            { text: 'Be specific in your prompt about diversity (e.g. "female doctor")', is_correct: true },
            { text: 'Use a black and white filter', is_correct: false },
            { text: 'Ask the AI to stop', is_correct: false }
        ],
        explanation: 'Explicit prompting is the most direct user-side way to counter default biases.',
        difficulty: 'easy',
        topic_tag: 'Prompting'
    },
    {
        question_text: 'The "Black Box" problem refers to:',
        options: [
            { text: 'A flight recorder', is_correct: false },
            { text: 'The inability to explain exactly HOW an AI arrived at a specific decision', is_correct: true },
            { text: 'A dark computer case', is_correct: false },
            { text: 'Secret code', is_correct: false }
        ],
        explanation: 'Deep learning models are often opaque; we see the result but can\'t trace the exact logic path.',
        difficulty: 'hard',
        topic_tag: 'Concepts'
    },

    // --- TOPIC: COPYRIGHT & DEEPFAKES (8) ---
    {
        question_text: 'In the US, who owns the copyright to a raw image generated entirely by AI?',
        options: [
            { text: 'The prompter', is_correct: false },
            { text: 'MidJourney/OpenAI', is_correct: false },
            { text: 'No one (Public Domain)', is_correct: true },
            { text: 'The computer manufacturer', is_correct: false }
        ],
        explanation: 'The US Copyright Office has ruled that works without human authorship (pure AI gen) are not copyrightable.',
        difficulty: 'medium',
        topic_tag: 'Legal'
    },
    {
        question_text: 'What is a "Deepfake"?',
        options: [
            { text: 'A philosophical idea', is_correct: false },
            { text: 'Synthetic media where a person\'s likeness is swapped or manipulated', is_correct: true },
            { text: 'Deep learning code', is_correct: false },
            { text: 'A fake account', is_correct: false }
        ],
        explanation: 'Deepfakes use AI to manipulate video/audio to make people appear to say/do things they didn\'t.',
        difficulty: 'easy',
        topic_tag: 'Terminology'
    },
    {
        question_text: 'Why is "Provenance" important for AI content?',
        options: [
            { text: 'It creates NFT value', is_correct: false },
            { text: 'It helps verify the origin and history of a piece of content (fake vs real)', is_correct: true },
            { text: 'It makes it load faster', is_correct: false },
            { text: 'It improves colors', is_correct: false }
        ],
        explanation: 'Provenance tools (like C2PA) help track if an image was generated by a camera or an AI.',
        difficulty: 'hard',
        topic_tag: 'Verification'
    },
    {
        question_text: 'What is the "Human in the Loop" (HITL) approach?',
        options: [
            { text: 'A gymnastic move', is_correct: false },
            { text: 'Ensuring a human reviews AI decisions before they are finalized', is_correct: true },
            { text: 'Using humans as batteries', is_correct: false },
            { text: 'Asking AI to act like a human', is_correct: false }
        ],
        explanation: 'HITL is a critical safety practice, especially in high-stakes areas like medicine or law.',
        difficulty: 'medium',
        topic_tag: 'Strategy'
    },

    // --- TOPIC: RELIABILITY & HALLUCINATIONS (8) ---
    {
        question_text: 'What is an AI "Hallucination"?',
        options: [
            { text: 'The AI having a dream', is_correct: false },
            { text: 'Confidently stating incorrect facts as true', is_correct: true },
            { text: 'A graphical glitch', is_correct: false },
            { text: 'The AI crashing', is_correct: false }
        ],
        explanation: 'Hallucination is the tendency of LLMs to invent facts while sounding authoritative.',
        difficulty: 'easy',
        topic_tag: 'Limitations'
    },
    {
        question_text: 'Which is a sign that an image might be AI-generated?',
        options: [
            { text: 'Perfect lighting', is_correct: false },
            { text: 'Nonsensical text, distorted hands, or logic errors (e.g. mismatched shadows)', is_correct: true },
            { text: 'It is a png file', is_correct: false },
            { text: 'It has a watermark', is_correct: false }
        ],
        explanation: 'Visual artifacts like gibberish text or anatomy errors are common tell-tale signs.',
        difficulty: 'medium',
        topic_tag: 'Verification'
    },
    {
        question_text: 'Why should you verify AI code suggestions?',
        options: [
            { text: 'To be polite', is_correct: false },
            { text: 'Because AI can suggest insecure patterns or non-existent libraries', is_correct: true },
            { text: 'Because AI is always wrong', is_correct: false },
            { text: 'To train your typing', is_correct: false }
        ],
        explanation: 'Blindly trusting AI code can verify security vulnerabilities or dependency issues.',
        difficulty: 'easy',
        topic_tag: 'Coding'
    },
    {
        question_text: 'Can AI replace human judgment effectively in moral dilemmas?',
        options: [
            { text: 'Yes, it is perfectly objective', is_correct: false },
            { text: 'No, it lacks consciousness, empathy, and moral agency', is_correct: true },
            { text: 'Only GPT-4 can', is_correct: false },
            { text: 'Yes, if programmed correctly', is_correct: false }
        ],
        explanation: 'AI makes statistical predictions, not moral judgments. It cannot replace human ethics.',
        difficulty: 'medium',
        topic_tag: 'Concepts'
    }
];

async function expandModule5() {
    console.log(`🚀 Expanding Content for Module: ${MODULE_TITLE}...\n`);

    try {
        // 1. Get Module ID
        const { data: module, error: modError } = await supabase
            .from('learning_modules')
            .select('id')
            .eq('title', MODULE_TITLE)
            .single();

        if (modError) {
            console.error('Available modules:');
            const { data: allMods } = await supabase.from('learning_modules').select('title');
            console.log(allMods.map(m => m.title));
            throw new Error(`Module '${MODULE_TITLE}' not found: ${modError.message}`);
        }
        console.log(`✅ Found Module ID: ${module.id}`);

        // 2. Update Content
        const { error: updateError } = await supabase
            .from('learning_modules')
            .update({ content: EXPANDED_CONTENT })
            .eq('id', module.id);

        if (updateError) throw new Error(`Update content failed: ${updateError.message}`);
        console.log('✅ Updated Lesson Content (Markdown)');

        // 3. Clear old questions
        const { error: deleteError } = await supabase
            .from('quiz_questions')
            .delete()
            .eq('module_id', module.id);

        console.log('🧹 Cleared old questions');

        // 4. Insert New Questions
        const questionsToInsert = NEW_QUESTIONS.map(q => ({ ...q, module_id: module.id }));

        const { error: insertError } = await supabase
            .from('quiz_questions')
            .insert(questionsToInsert);

        if (insertError) throw new Error(`Insert questions failed: ${insertError.message}`);
        console.log(`✅ Inserted ${questionsToInsert.length} new quiz questions`);

        console.log(`\n✨ Module 5 is now COMPLETE! (Content + ${questionsToInsert.length} Questions)`);

    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

expandModule5();
