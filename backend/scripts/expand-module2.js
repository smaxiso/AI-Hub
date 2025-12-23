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

const EXPANDED_CONTENT = `
# The Art of Prompt Engineering

Prompt engineering is the practice of designing inputs for AI tools to produce optimal outputs. It is less about "coding" and more about **clear communication**.

## 1. Core Principles (The "Triangle of Clarity")

To get the best results, every prompt should try to hit these three notes:

1.  **Specificity**: Vague instructions lead to vague answers. Don't say "Write a story." Say "Write a 500-word sci-fi story about a robot who loves gardening."
2.  **Context**: Who is the AI acting as? What is the goal? Who is the audience?
3.  **Constraints**: What should the AI *not* do? What format should it use?

> **Key Takeaway:** The quality of the output is directly proportional to the quality of the input. This is often summarized as "Garbage In, Garbage Out".

---

## 2. The Universal Prompt Framework (Templates)

One of the most effective ways to prompt is using a reusable structure. Here is a "Master Template" you can adapt for almost any task:

### The "RTF" Framework (Role, Task, Format)

*   **Role**: "Act as a [Role]..."
*   **Task**: "Create/Write/Explain [The Task]..."
*   **Format**: "Present the answer as [Format]..."

### Example Table
| Component | Poor Prompt | Master Prompt |
| :--- | :--- | :--- |
| **Role** | (None) | "Act as a Senior Marketing Manager." |
| **Task** | "Write an email." | "Write a persuasive cold email to potential B2B clients introducing our new CRM software." |
| **Format** | (None) | "Use concise professional language and bullet points for key features." |

\`\`\`flashcard
RTF Framework---A prompt structure standing for Role, Task, Format. Example: "Act as a Teacher (Role), explain gravity (Task), using an analogy (Format)."
\`\`\`

---

## 3. Advanced Techniques

Once you master the basics, use these techniques for complex problems.

### A. Few-Shot Prompting (Giving Examples)
Instead of just asking, show the AI exactly what you want.

**Prompt:**
\`\`\`text
Convert these movie titles into emojis.
input: "Star Wars" -> ⭐️⚔️
input: "The Lion King" -> 🦁👑
input: "Harry Potter" ->
\`\`\`
**AI Output:** ⚡️🧙🏻

### B. Chain of Thought
For math or logic, ask the AI to "think step-by-step". This forces the model to show its work, reducing errors.
*   *Prompt:* "If I have 3 apples, buy 2 more, and eat 1, how many do I have? Let's think step by step."

### C. Delimiters
Use punctuation to separate your instructions from the data you want processed. This prevents the AI from getting confused.
*   Triple quotes \`"""\`
*   Dashes \`---\`
*   XML tags \`<data>...</data>\`

---

## 4. Troubleshooting Poor Responses

Even the best prompts sometimes fail. Here is how to debug them:

### Problem: The AI is hallucinating facts.
*   **Fix:** Explicitly tell it: "If you do not know the answer, say 'I don't know', do not make it up."
*   **Fix:** Ask it to "Quote the text" if you provided a source document.

### Problem: The AI is lazy or answers too briefly.
*   **Fix:** Add length constraints: "Write at least 300 words."
*   **Fix:** Ask it to "Be comprehensive and detailed."

### Problem: The AI ignores your style.
*   **Fix:** Give it a "Style Reference" (e.g., "Write in the style of Ernest Hemingway" or "Use a professional, empathetic tone").

---

## Interactive Exercise

Let's practice the **RTF Framework**. Rewrite this vague prompt: *"Help me with my resume."*

\`\`\`interactive
Act as a professional career coach (Role). Review my resume summary for clarity and impact (Task). Provide 3 specific bullet points for improvement and rewrite the summary to be more action-oriented (Format).
\`\`\`
`;

async function expandModule2() {
    console.log(`🚀 Expanding Content for Module: ${MODULE_TITLE}...\n`);

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
            .update({ content: EXPANDED_CONTENT })
            .eq('id', module.id);

        if (updateError) throw new Error(`Update content failed: ${updateError.message}`);
        console.log('✅ Updated Lesson Content with Extended Guide');
        console.log(`   New Content Length: ${EXPANDED_CONTENT.length} characters`);

    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

expandModule2();
