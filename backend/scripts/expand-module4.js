const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const MODULE_TITLE = 'AI Coding Assistants';

const EXPANDED_CONTENT = `
# Master AI Coding Assistants

AI has revolutionized software development. Tools like **GitHub Copilot**, **Cursor**, and **ChatGPT** act as "pair programmers," checking your work, suggesting fixes, and even writing entire functions.

## 1. The Landscape of AI Coding Tools

| Tool | Type | Best For |
| :--- | :--- | :--- |
| **GitHub Copilot** | IDE Extension | Autocomplete, predicting next lines in VS Code/IntelliJ. |
| **Cursor** | Standalone IDE | "AI-native" editor fork of VS Code. deeply integrated codebase chat. |
| **ChatGPT / Claude** | Chat Interface | System design, explaining complex bugs, generating starter boilerplate. |
| **CodeWhisperer** | IDE Extension | AWS-optimized, good for cloud infrastructure code. |

## 2. How to "Prompt" for Code

Prompting for code is different than image generation. Precision is paramount.

### The Context Principle
AI cannot see what you don't show it.
*   **Bad:** "Fix this function."
*   **Good:** "Here is the \`loginUser\` function and the \`User\` schema. The password validation is failing for special characters. Please fix the regex."

### Specific Instructions
*   **Language:** "Write this in Python 3.11 using type hints."
*   **Libraries:** "Use \`pandas\` appropriately, do not use loops for data manipulation."
*   **Style:** "Follow PEP8 standards."

---

## 3. Key Features & Workflows

### Autocomplete (Ghost Text)
As you type, the AI suggests the next few lines.
*   *Tip:* Write a comment describing what you want *before* you code.
    *   \`// Function to calculate fibonacci using memoization\`
    *   *Result:* AI suggests the exact implementation.

### Chat with Codebase
Tools like Cursor allow you to ask: *"Where is the authentication logic defined?"*
The AI scans your files and points you to the right place.

### Refactoring & Testing
*   **Refactor:** Highlight messy code and ask: "Simplify this logic and extract the math into a helper function."
*   **Tests:** "Write Jest unit tests for this component, covering edge cases like empty arrays."

---

## 4. Pitfalls & "Hallucinations"

### 1. Hallucinated Libraries
AI sometimes invents packages that *sound* real but don't exist (e.g., \`react-pdf-magic-viewer\`).
*   **Rule:** Always verify the import exists on npm/pip before running \`install\`.

### 2. Security Risks
*   **Secrets:** Never paste API keys or passwords into an AI chat.
*   **Vulnerabilities:** AI learns from public code, which includes *vulnerable* code. It might suggest using \`eval()\` or weak encryption if you aren't careful.

### 3. Loop logic errors
AI is bad at heavy math or complex recursion without "Chain of Thought" prompting.

---

## 5. Security & Privacy

*   **Training Data:** By default, some tools (like free ChatGPT) may train on your data.
*   **Enterprise Mode:** Companies often use "Enterprise" versions (e.g., Copilot for Business) which guarantees your code is *not* used for training.

\`\`\`flashcard
Hallucination (Code)---When an AI suggests a library, function, or syntax that looks plausible but does not actually exist in the programming language.
\`\`\`

## Interactive Exercise
Try this in your IDE (or imagine it):
Write a comment: \`// Regex to validate email, must allow "+" aliases\`
See what the AI suggests.

\`\`\`interactive
Write a prompt to ask an AI to refactor a legacy 'var' Javascript loop into modern ES6 'map/reduce'.
\`\`\`
`;

const NEW_QUESTIONS = [
    // --- TOPIC: TOOLS & ECOSYSTEM (10) ---
    {
        question_text: 'Which tool is a "fork" of VS Code designed specifically for AI integration?',
        options: [
            { text: 'Sublime Text', is_correct: false },
            { text: 'Cursor', is_correct: true },
            { text: 'Notepad++', is_correct: false },
            { text: 'Atom', is_correct: false }
        ],
        explanation: 'Cursor is an IDE built on top of VS Code with deep AI integration (Command+K).',
        difficulty: 'medium',
        topic_tag: 'Tools'
    },
    {
        question_text: 'GitHub Copilot is best described as:',
        options: [
            { text: 'A replacement for developers', is_correct: false },
            { text: 'An AI-powered autocomplete/pair programmer', is_correct: true },
            { text: 'A database manager', is_correct: false },
            { text: 'A virus scanner', is_correct: false }
        ],
        explanation: 'Copilot acts as an intelligent autocomplete tool, suggesting code as you type.',
        difficulty: 'easy',
        topic_tag: 'Tools'
    },
    {
        question_text: 'Which company developed the "CodeWhisperer" tool?',
        options: [
            { text: 'Microsoft', is_correct: false },
            { text: 'Amazon (AWS)', is_correct: true },
            { text: 'Google', is_correct: false },
            { text: 'Meta', is_correct: false }
        ],
        explanation: 'CodeWhisperer is Amazon\'s AI coding companion, optimized for AWS APIs.',
        difficulty: 'medium',
        topic_tag: 'Tools'
    },
    {
        question_text: 'What is the main benefit of using AI for writing Unit Tests?',
        options: [
            { text: 'It creates tests that never fail', is_correct: false },
            { text: 'It can quickly generate boilerplate for edge cases you might miss', is_correct: true },
            { text: 'It slows down the process', is_correct: false },
            { text: 'It deletes the original code', is_correct: false }
        ],
        explanation: 'AI is excellent at generating repetitive test boilerplate and suggesting edge cases.',
        difficulty: 'easy',
        topic_tag: 'Workflow'
    },
    {
        question_text: 'What does "Context Window" mean for a coding AI?',
        options: [
            { text: 'The size of your monitor', is_correct: false },
            { text: 'How much of your code/files the AI can "see" at once', is_correct: true },
            { text: 'The compilation speed', is_correct: false },
            { text: 'The number of colors available', is_correct: false }
        ],
        explanation: 'The context window limits how many lines of code or files the AI can analyze to give an answer.',
        difficulty: 'medium',
        topic_tag: 'Technical'
    },
    {
        question_text: 'True or False: GitHub Copilot uploads your code to the cloud to generate suggestions.',
        options: [
            { text: 'True', is_correct: true },
            { text: 'False', is_correct: false },
            { text: 'Only on WiFi', is_correct: false },
            { text: 'Never', is_correct: false }
        ],
        explanation: 'Copilot sends context snippets to OpenAI/GitHub servers to generate predictions.',
        difficulty: 'medium',
        topic_tag: 'Privacy'
    },
    {
        question_text: 'Which is NOT a popular AI coding feature?',
        options: [
            { text: 'Chat with codebase', is_correct: false },
            { text: 'Explain this code', is_correct: false },
            { text: 'Auto-deploy to production without testing', is_correct: true },
            { text: 'Generate unit tests', is_correct: false }
        ],
        explanation: 'AI tools suggest code, but auto-deploying without testing is unsafe and not a standard feature.',
        difficulty: 'easy',
        topic_tag: 'Workflow'
    },
    {
        question_text: 'What is "Ghost Text"?',
        options: [
            { text: 'A scary story', is_correct: false },
            { text: 'Greyed-out code suggestions that appear ahead of your cursor', is_correct: true },
            { text: 'Deleted code', is_correct: false },
            { text: 'Invisible comments', is_correct: false }
        ],
        explanation: 'Ghost text is the UI pattern used by Copilot to show a suggested completion before you accept it.',
        difficulty: 'easy',
        topic_tag: 'Tools'
    },
    {
        question_text: 'Which underlying model powers GitHub Copilot (as of late 2023)?',
        options: [
            { text: 'Llama 2', is_correct: false },
            { text: 'OpenAI Codex / GPT-4', is_correct: true },
            { text: 'BERT', is_correct: false },
            { text: 'Stable Diffusion', is_correct: false }
        ],
        explanation: 'Copilot relies on OpenAI models (Codex/GPT) optimized for code.',
        difficulty: 'medium',
        topic_tag: 'Technical'
    },
    {
        question_text: 'What is a "Chat with Codebase" feature?',
        options: [
            { text: 'A social network for coders', is_correct: false },
            { text: 'Asking questions like "How does auth work?" and getting answers based on your specific files', is_correct: true },
            { text: 'Voice command coding', is_correct: false },
            { text: 'Video calling', is_correct: false }
        ],
        explanation: 'This feature uses embeddings to let the AI "read" your entire project context.',
        difficulty: 'medium',
        topic_tag: 'Tools'
    },

    // --- TOPIC: BEST PRACTICES & PROMPTING (10) ---
    {
        question_text: 'When asking AI to refactor code, what should you verify?',
        options: [
            { text: 'Nothing, it is always right', is_correct: false },
            { text: 'That the logic remains correct and no bugs were introduced', is_correct: true },
            { text: 'That the code is longer', is_correct: false },
            { text: 'That the colors changed', is_correct: false }
        ],
        explanation: 'Refactoring can introduce regression bugs. Always verify the logic functionality.',
        difficulty: 'easy',
        topic_tag: 'Best Practices'
    },
    {
        question_text: 'A good comment-prompt to generate a function would be:',
        options: [
            { text: '// Do math', is_correct: false },
            { text: '// Function to calculate monthly mortgage payment given principal, rate, and term', is_correct: true },
            { text: '// Help', is_correct: false },
            { text: 'Click button', is_correct: false }
        ],
        explanation: 'Specific comments detailing inputs, outputs, and logic give the best "Ghost Text" results.',
        difficulty: 'easy',
        topic_tag: 'Prompting'
    },
    {
        question_text: 'Why should you NOT paste production API keys into ChatGPT?',
        options: [
            { text: 'It might crash', is_correct: false },
            { text: 'Your conversation history might be stored/reviewed, leaking the secret', is_correct: true },
            { text: 'Keys are too long', is_correct: false },
            { text: 'ChatGPT does not like numbers', is_correct: false }
        ],
        explanation: 'Public AI interfaces are generally not secure vaults for secrets. Data retention policies vary.',
        difficulty: 'medium',
        topic_tag: 'Security'
    },
    {
        question_text: 'If AI suggests a library import, what should you check?',
        options: [
            { text: 'If the name sounds cool', is_correct: false },
            { text: 'If the library actually exists and is secure (check npm/pypi)', is_correct: true },
            { text: 'Nothing', is_correct: false },
            { text: 'If it rhymes', is_correct: false }
        ],
        explanation: 'AI frequently "hallucinates" packages (e.g., `react-easy-pdf-viewer`) that do not exist or are malware.',
        difficulty: 'hard',
        topic_tag: 'Hallucinations'
    },
    {
        question_text: 'How can you help the AI write better code for a specific file?',
        options: [
            { text: 'Open relevant related files in your IDE tabs (providing context)', is_correct: true },
            { text: 'Close all files', is_correct: false },
            { text: 'Turn off the internet', is_correct: false },
            { text: 'Yell at the screen', is_correct: false }
        ],
        explanation: 'Many tools (like Copilot) use open tabs as "context" to understand variables and types defined elsewhere.',
        difficulty: 'medium',
        topic_tag: 'Best Practices'
    },
    {
        question_text: 'What is "Boilerplate code"?',
        options: [
            { text: 'Hot water code', is_correct: false },
            { text: 'Repetitive, standard code required for setup (e.g. API fetch wrappers)', is_correct: true },
            { text: 'Virus code', is_correct: false },
            { text: 'High level logic', is_correct: false }
        ],
        explanation: 'AI excels at writing boilerplate—repetitive structural code that is tedious for humans.',
        difficulty: 'easy',
        topic_tag: 'Terminology'
    },
    {
        question_text: 'When the AI writes a Regular Expression (Regex) for you, you should:',
        options: [
            { text: 'Assume it works perfectly', is_correct: false },
            { text: 'Test it with valid and invalid strings to ensure it matches correctly', is_correct: true },
            { text: 'Memorize it', is_correct: false },
            { text: 'Delete it', is_correct: false }
        ],
        explanation: 'Regex is tricky even for AI. It often misses edge cases or allows too much.',
        difficulty: 'medium',
        topic_tag: 'Verification'
    },
    {
        question_text: 'Which coding task is AI currently LEAST reliable at?',
        options: [
            { text: 'Writing a simple Python script', is_correct: false },
            { text: 'Architecting a massive, complex distributed system from scratch', is_correct: true },
            { text: 'Explaining what a function does', is_correct: false },
            { text: 'Converting Java to C#', is_correct: false }
        ],
        explanation: 'AI struggles with high-level, large-scale system architecture that requires deep cohesiveness and forethought.',
        difficulty: 'hard',
        topic_tag: 'limitations'
    },
    {
        question_text: 'What implies "Code Injection" vulnerability in an AI suggestion?',
        options: [
            { text: 'Using `console.log`', is_correct: false },
            { text: 'Using `eval()` or unsanitized SQL queries', is_correct: true },
            { text: 'Using `import`', is_correct: false },
            { text: 'Using comments', is_correct: false }
        ],
        explanation: 'AI learns from the internet, including bad practices. It might suggest `eval()` or SQL injection-prone code.',
        difficulty: 'hard',
        topic_tag: 'Security'
    },
    {
        question_text: 'How does "Enterprise" AI differ from free/public versions?',
        options: [
            { text: 'It is slower', is_correct: false },
            { text: 'It usually guarantees your code is NOT used for model training', is_correct: true },
            { text: 'It has more ads', is_correct: false },
            { text: 'It only writes Java', is_correct: false }
        ],
        explanation: 'Enterprise plans (like Copilot Business) have strict privacy agreements preventing data usage for training.',
        difficulty: 'medium',
        topic_tag: 'Privacy'
    },

    // --- TOPIC: LANGUAGES & ADVANCED (10) ---
    {
        question_text: 'Which language is typically "easiest" for AI due to vast training data?',
        options: [
            { text: 'Python / JavaScript', is_correct: true },
            { text: 'Assembly', is_correct: false },
            { text: 'Haskell', is_correct: false },
            { text: 'Fortran', is_correct: false }
        ],
        explanation: 'Python and JS have the largest representation on GitHub, making AI very proficient in them.',
        difficulty: 'medium',
        topic_tag: 'Languages'
    },
    {
        question_text: 'What means "Docstring" generation?',
        options: [
            { text: 'Generating documentation comments for functions', is_correct: true },
            { text: 'Creating a doctor avatar', is_correct: false },
            { text: 'Stringing wires', is_correct: false },
            { text: 'Deleting comments', is_correct: false }
        ],
        explanation: 'AI is great at reading code and generating standard documentation (JSDoc, PyDoc).',
        difficulty: 'easy',
        topic_tag: 'Workflow'
    },
    {
        question_text: 'If you want to translate code from Python to C++, you should:',
        options: [
            { text: 'Retype it manually', is_correct: false },
            { text: 'Ask the AI to "Convert this Python code to C++"', is_correct: true },
            { text: 'Use Google Translate', is_correct: false },
            { text: 'Give up', is_correct: false }
        ],
        explanation: 'Code translation (transpilation) is a strong use case for LLMs.',
        difficulty: 'easy',
        topic_tag: 'Workflow'
    },
    {
        question_text: 'What is a "Knowledge Cutoff"?',
        options: [
            { text: 'The date an AI stops functioning', is_correct: false },
            { text: 'The date up to which the AI has training data (it may not know new frameworks released after)', is_correct: true },
            { text: 'A limit on file size', is_correct: false },
            { text: 'A type of knife', is_correct: false }
        ],
        explanation: 'If a framework (React 19) came out last week, the AI might not know it existed.',
        difficulty: 'medium',
        topic_tag: 'Limitations'
    },
    {
        question_text: 'Why naturally checking AI generated code is important?',
        options: [
            { text: 'To feel superior', is_correct: false },
            { text: 'Because you are ultimately responsible for the code functionality and security', is_correct: true },
            { text: 'To pass time', is_correct: false },
            { text: 'The AI gets sad if you don\'t', is_correct: false }
        ],
        explanation: 'The developer remains the pilot. AI is just the co-pilot.',
        difficulty: 'easy',
        topic_tag: 'Best Practices'
    },
    {
        question_text: 'Which feature helps you understand a cryptic error message?',
        options: [
            { text: 'Paste the error into AI and ask "Explain this fix"', is_correct: true },
            { text: 'Delete the file', is_correct: false },
            { text: 'Ignore it', is_correct: false },
            { text: 'Reinstall Windows', is_correct: false }
        ],
        explanation: 'Detailed error explanation is one of the most popular uses of chat assistants.',
        difficulty: 'easy',
        topic_tag: 'Debugging'
    },
    {
        question_text: 'What is "Prompt Injection" in the context of code apps?',
        options: [
            { text: 'A medical procedure', is_correct: false },
            { text: 'A security attack where user input tricks the AI into revealing secrets or ignoring rules', is_correct: true },
            { text: 'Buying prompts', is_correct: false },
            { text: 'Faster typing', is_correct: false }
        ],
        explanation: 'Building apps on LLMs requires guarding against Prompt Injection attacks.',
        difficulty: 'hard',
        topic_tag: 'Security'
    },
    {
        question_text: 'If Copilot suggests a loop that never ends, it is an example of:',
        options: [
            { text: 'A logical bug', is_correct: true },
            { text: 'A feature', is_correct: false },
            { text: 'Cloud computing', is_correct: false },
            { text: 'Quantum physics', is_correct: false }
        ],
        explanation: 'AI often suggests logical bugs like infinite loops if not prompted carefully.',
        difficulty: 'medium',
        topic_tag: 'Debugging'
    },
    {
        question_text: 'Can AI generally execute the code for you?',
        options: [
            { text: 'Yes, it accesses your CPU directly', is_correct: false },
            { text: 'No, it generates text. You must compile/run it yourself (usually)', is_correct: true },
            { text: 'Yes, it is a virus', is_correct: false },
            { text: 'Only in VR', is_correct: false }
        ],
        explanation: 'Most AI tools generate text/scripts. The execution happens in your environment (though "Agents" are changing this).',
        difficulty: 'medium',
        topic_tag: 'Technical'
    },
    {
        question_text: 'What is the "Rubber Duck" debugging method with AI?',
        options: [
            { text: 'Throwing ducks at the screen', is_correct: false },
            { text: 'Explaining your problem line-by-line to the AI to clarify your own thinking', is_correct: true },
            { text: 'Buying a toy duck', is_correct: false },
            { text: 'Eating crackers', is_correct: false }
        ],
        explanation: 'talking through a problem with an AI (Rubber Ducking) is highly effective for debugging.',
        difficulty: 'easy',
        topic_tag: 'Debugging'
    }
];

async function expandModule4() {
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

        // 3. Clear old questions to prevent duplicates (if any)
        const { error: deleteError } = await supabase
            .from('quiz_questions')
            .delete()
            .eq('module_id', module.id);

        if (deleteError) console.error('Warning: could not clear old questions, might duplicate');
        console.log('🧹 Cleared old questions');

        // 4. Insert New Questions
        const questionsToInsert = NEW_QUESTIONS.map(q => ({ ...q, module_id: module.id }));

        const { error: insertError } = await supabase
            .from('quiz_questions')
            .insert(questionsToInsert);

        if (insertError) throw new Error(`Insert questions failed: ${insertError.message}`);
        console.log(`✅ Inserted ${questionsToInsert.length} new quiz questions`);

        console.log(`\n✨ Module 4 is now COMPLETE! (Content + ${questionsToInsert.length} Questions)`);

    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

expandModule4();
