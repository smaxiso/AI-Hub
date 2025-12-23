const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const MODULE_TITLE = 'Mastering Prompt Engineering';

const LESSON_CONTENT = `
# The Art of Prompt Engineering

Prompt engineering is the practice of designing inputs for AI tools to produce optimal outputs. It is less about "coding" and more about **clear communication**.

## Key Principles

1.  **Be Specific**: Vague instructions lead to vague answers.
2.  **Provide Context**: Who is the AI acting as? What is the goal?
3.  **Use Examples**: Show the AI what you want (this is called *Few-Shot Prompting*).

> **Key Takeaway:** The quality of the output is directly proportional to the quality of the input. This is often summarized as "Garbage In, Garbage Out".

## Advanced Techniques

### 1. Zero-Shot vs. Few-Shot
*   **Zero-Shot**: Asking the AI to do something without any examples.
*   **Few-Shot**: Providing 1-3 examples of "Input -> Output" to guide the style and format.

### 2. Chain of Thought
For complex logic, ask the AI to "think step-by-step".
\`\`\`text
Q: If I have 3 apples and buy 2 more, then eat 1, how many do I have?
A: Let's think step by step.
1. Start with 3 apples.
2. Buy 2 more -> 3 + 2 = 5.
3. Eat 1 -> 5 - 1 = 4.
Answer: 4.
\`\`\`

### 3. Using Delimiters
Use punctuation to separate instructions from data.
*   Triple quotes: \`"""\`
*   Dashes: \`---\`
*   XML tags: \`<text>...</text>\`

## Interactive Exercise

Try rewriting this vague prompt: "Write a blog post about dogs." to be more specific.

\`\`\`interactive
Act as a professional veterinarian writer. Write a 500-word blog post about the benefits of adopting senior dogs for first-time owners. Include 3 health tips.
\`\`\`
`;

const NEW_QUESTIONS = [
    {
        question_text: 'What is "Zero-Shot" prompting?',
        options: [
            { text: "Asking the AI without providing examples", is_correct: true },
            { text: "Asking the AI with 0 words", is_correct: false },
            { text: "Restarting the AI", is_correct: false },
            { text: "Giving the AI 0 confidence", is_correct: false }
        ],
        explanation: 'Zero-shot prompting means asking the model to perform a task without giving it any examples of completed tasks.',
        difficulty: 'medium',
        topic_tag: 'Prompt Techniques'
    },
    {
        question_text: 'Why is context important in a prompt?',
        options: [
            { text: "It makes the prompt longer", is_correct: false },
            { text: "It helps the AI understand intent and constraints", is_correct: true },
            { text: "It confuses the AI", is_correct: false },
            { text: "It costs more money", is_correct: false }
        ],
        explanation: 'Context provides the necessary background and boundaries for the AI to generate a relevant and accurate response.',
        difficulty: 'easy',
        topic_tag: 'Prompt Basics'
    },
    {
        question_text: 'What does "Chain of Thought" prompting encourage the AI to do?',
        options: [
            { text: "Respond as fast as possible", is_correct: false },
            { text: "Break down reasoning step-by-step", is_correct: true },
            { text: "Connect to the blockchain", is_correct: false },
            { text: "Repeat the user's input", is_correct: false }
        ],
        explanation: 'Chain of Thought prompting encourages the model to explain its reasoning step-by-step, often improving accuracy on complex tasks.',
        difficulty: 'medium',
        topic_tag: 'Advanced Techniques'
    },
    {
        question_text: 'Which of the following is an example of a "Delimiter"?',
        options: [
            { text: 'Triple quotes (""")', is_correct: true },
            { text: 'The letter A', is_correct: false },
            { text: 'A space character', is_correct: false },
            { text: 'The enter key', is_correct: false }
        ],
        explanation: 'Delimiters like triple quotes (""") or dashes (---) help the AI separate instructions from the text it needs to process.',
        difficulty: 'easy',
        topic_tag: 'Prompt Formatting'
    },
    {
        question_text: 'What is "Role Prompting"?',
        options: [
            { text: 'Asking the AI to play a game', is_correct: false },
            { text: 'Assigning a specific persona (e.g., "Act as a lawyer")', is_correct: true },
            { text: 'Rolling dice', is_correct: false },
            { text: 'Asking about movie roles', is_correct: false }
        ],
        explanation: 'Role prompting involves assigning a persona to the AI (e.g., "Act as an expert copywriter") to influence the tone and style of the output.',
        difficulty: 'easy',
        topic_tag: 'Prompt Techniques'
    },
    {
        question_text: 'Which prompt is likely to yield the BEST results?',
        options: [
            { text: 'Write a poem.', is_correct: false },
            { text: 'Write a haiku about summer in the style of Matsuo Basho.', is_correct: true },
            { text: 'Do poetry.', is_correct: false },
            { text: 'Poem regarding seasons.', is_correct: false }
        ],
        explanation: 'The more specific prompt (specifying format, topic, and style) will consistently yield better results.',
        difficulty: 'medium',
        topic_tag: 'Prompt Basics'
    },
    {
        question_text: 'How can you specify the desired output format?',
        options: [
            { text: 'Hope for the best', is_correct: false },
            { text: 'Explicitly ask for it (e.g., "Return as JSON")', is_correct: true },
            { text: 'Use all caps', is_correct: false },
            { text: 'It is not possible', is_correct: false }
        ],
        explanation: 'You can explicitly instruct the AI to format its output in JSON, Markdown, HTML, CSV, etc.',
        difficulty: 'medium',
        topic_tag: 'Prompt Formatting'
    }
];

async function completeModule2() {
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

        console.log('\n✨ Module 2 is now COMPLETE! (Content + 10 Questions)');

    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

completeModule2();
