-- Add content column if it doesn't exist
ALTER TABLE learning_modules ADD COLUMN IF NOT EXISTS content TEXT;

-- Update content for Module 1: Introduction to AI Chat Tools
UPDATE learning_modules
SET content = '
# Introduction to AI Chat Tools

## What are AI Chat Tools?
AI chat tools, also known as Large Language Models (LLMs), are advanced artificial intelligence systems designed to understand and generate human-like text. They are trained on vast amounts of data from the internet, books, and articles, allowing them to answer questions, write creative content, debug code, and much more.

### How Do They Work?
At their core, these models predict the next word in a sequence based on the context of the previous words. However, due to their massive scale and training techniques (like Reinforcement Learning from Human Feedback), they exhibit sophisticated reasoning and problem-solving capabilities.

## Popular Tools
*   **ChatGPT (OpenAI):** The most widely known tool, great for general purpose tasks, coding, and creative writing.
*   **Claude (Anthropic):** Known for its large context window (can read whole books) and safe, nuanced responses.
*   **Gemini (Google):** deeply integrated with Google''s ecosystem and capable of multimodal understanding (text, images, video).

## Best Practices
1.  **Be Specific:** The more details you provide, the better the answer.
2.  **Iterate:** Don''t settle for the first response. Ask for changes or clarifications.
3.  **Verify:** AI can make mistakes ("hallucinations"). always double-check important facts.

## Common Use Cases
*   **Drafting Emails:** "Write a polite email declining this invitation..."
*   **Summarizing Text:** Paste a long article and ask for a 3-point summary.
*   **Brainstorming:** "Give me 10 ideas for a blog post about..."
*   **Learning:** "Explain quantum computing like I''m 5 years old."
'
WHERE title = 'Introduction to AI Chat Tools';
