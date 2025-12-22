-- Update Module 1 with Rich, Interactive Content
UPDATE learning_modules
SET content = '
# Introduction to AI Chat Tools

Welcome to your first step into the world of AI! In this module, we won''t just read about AI; we''ll explore how it actually "thinks" and how you can work with it.

> **Key Takeaway:** AI Chat tools are not search engines. They are **engines of creation and reasoning**. They don''t just find existing answers; they generate new ones word by word.

## 1. What is an LLM?
You''ll often hear the term **Large Language Model (LLM)**. This is the technology under the hood of ChatGPT, Claude, and Gemini.

Imagine a machine that has read almost everything on the internet. It hasn''t just memorized it; it has learned the *patterns* of language. It knows that "Once upon a..." is usually followed by "time".

```flashcard
Large Language Model (LLM)
---
An AI system trained on vast amounts of text data to understand, generate, and manipulate human language. It predicts the next word in a sequence based on context.
```

### The "Stochastic Parrot" Debate
Some critics call LLMs "stochastic parrots"—meaning they just repeat patterns randomly. However, modern LLMs show signs of **reasoning**. They can solve puzzles they''ve never seen before and write code for unique problems.

## 2. The Art of the Prompt
The text you send to an AI is called a **Prompt**. The quality of your output depends entirely on the quality of your prompt.

*   **Bad Prompt:** "Write an email."
*   **Good Prompt:** "Write a professional email to my boss, Sarah, asking for a deadline extension on the Phoenix Project because I''m waiting for data from the marketing team."

### Try It Yourself
Let''s see the difference. Use the playground below to try a vague prompt vs. a specific one.

```interactive
Write a short poem about a robot.
```

## 3. Iteration: The Secret Sauce
Rarely does the AI give you the *perfect* answer on the first try. The secret to mastery is **iteration**. Treat it like an intern. If the draft is too formal, say "Make it more casual."

```flashcard
Context Window
---
The limit on how much text an AI can "remember" in a single conversation. If you exceed this limit, it forgets the beginning of the chat.
```

## 4. Common Pitfalls: Hallucinations
AI can be confidently wrong. This is called **Hallucination**. It might invent facts, legal cases, or historical events because they *sound* plausible.

> **Warning:** Never use AI for uncited medical advice, legal documents, or fact-checking without verifying the source yourself.

## 5. Your First Workflow
Here is a simple workflow you can use today:
1.  **Drafting:** Get past the "blank page" syndrome. Ask AI to "Create an outline for a report on X."
2.  **Refining:** Paste your own rough notes and ask, "Polish this and make it professional."
3.  **Brainstorming:** "Give me 10 alternative titles for this article."

### Final Challenge
Before you take the quiz, try one last complex prompt.

```interactive
Explain the concept of "Machine Learning" to a 5-year-old using an analogy about baking cookies.
```

Ready to test your knowledge? Click the button below!
'
WHERE title = 'Introduction to AI Chat Tools';
