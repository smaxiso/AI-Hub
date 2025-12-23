# Module Content Guide & Schema

This document details the exact data structure used for **Module 1** and provides the template/requirements to fully flesh out **Module 2**.

---

## 🏗️ Data Structure

The platform requires data in two main tables: `learning_modules` (the lesson) and `quiz_questions` (the assessment).

### 1. `learning_modules` Table
| Field | Type | Description |
| :--- | :--- | :--- |
| `level` | `text` | 'beginner', 'intermediate', 'advanced' |
| `order_index` | `int` | Position in the learning path (e.g., 1, 2, 3) |
| `title` | `text` | Title of the module |
| `description` | `text` | Short summary (displayed on card) |
| `content` | `text` | **Main Lesson Body** (Markdown Format) |
| `learning_objectives`| `text[]` | Array of 3-5 key takeaways |
| `estimated_duration_minutes` | `int` | Time calculation |

### 2. `quiz_questions` Table
| Field | Type | Description |
| :--- | :--- | :--- |
| `question_text` | `text` | The question itself |
| `options` | `jsonb` | Array of 4 options: `[{ "text": "...", "is_correct": true/false }]` |
| `explanation` | `text` | Text shown after answering (feedback) |
| `difficulty` | `text` | 'easy', 'medium', 'hard' |
| `topic_tag` | `text` | Assessment category (e.g., "Prompt Basics") |

---

## 🛑 The Issue with Module 2

Currently, **Module 2: Mastering Prompt Engineering** exists in the database, but:
1.  The `content` field is `NULL` (Displaying "*Content coming soon...*").
2.  It only has **3 Quiz Questions** (Needs 10+).

To fix this, you need to run **two** SQL operations: one to add the text content, and one to add the questions.

---

## 🛠️ Step 1: Add Lesson Content (Markdown)

Use this SQL template to update the main lesson body. You can use standard Markdown (`# Headers`, `**Bold**`, `- Lists`) and our custom components:
- `> Blockquote` for **Key Takeaways**.
- ````language-flashcard` for **Flashcards** (Front---Back).
- ````language-interactive` for **Interactive Prompts**.

```sql
UPDATE learning_modules
SET content = '
# The Art of Prompt Engineering

Prompt engineering is the practice of designing inputs for AI tools to produce optimal outputs. It is less about "coding" and more about **clear communication**.

## Key Principles

1. **Be Specific**: Vague instructions lead to vague answers.
2. **Provide Context**: Who is the AI acting as? What is the goal?
3. **Use Examples**: Show the AI what you want (Few-Shot Prompting).

> **Key Takeaway:** The quality of the output is directly proportional to the quality of the input (Garbage In, Garbage Out).

## Interactive Exercise

Try rewriting this vague prompt: "Write a blog post about dogs." to be more specific.

```interactive
Act as a professional veterinarian writer. Write a 500-word blog post about the benefits of adopting senior dogs for first-time owners. Include 3 health tips.
```
'
WHERE title = 'Mastering Prompt Engineering';
```

---

## 🛠️ Step 2: Add Missing Quiz Questions

Use this SQL template to add the remaining 7 questions.

```sql
DO $$
DECLARE
    mod2_id UUID;
BEGIN
    SELECT id INTO mod2_id FROM learning_modules WHERE title = 'Mastering Prompt Engineering' LIMIT 1;

    -- Insert Questions
    INSERT INTO quiz_questions (module_id, question_text, options, explanation, difficulty, topic_tag)
    VALUES 
    (
        mod2_id,
        'What is "Zero-Shot" prompting?',
        '[
            {"text": "Asking the AI without providing examples", "is_correct": true},
            {"text": "Asking the AI with 0 words", "is_correct": false},
            {"text": "Restarting the AI", "is_correct": false},
            {"text": "Giving the AI 0 confidence", "is_correct": false}
        ]'::jsonb,
        'Zero-shot prompting means asking the model to perform a task without giving it any examples of completed tasks.',
        'medium',
        'Prompt Techniques'
    ),
    (
        mod2_id,
        'Why is context important in a prompt?',
        '[
            {"text": "It makes the prompt longer", "is_correct": false},
            {"text": "It helps the AI understand the intent and constraints", "is_correct": true},
            {"text": "It confuses the AI", "is_correct": false},
            {"text": "It costs more money", "is_correct": false}
        ]'::jsonb,
        'Context provides the necessary background and boundaries for the AI to generate a relevant and accurate response.',
        'easy',
        'Prompt Basics'
    );
    -- Add more tuples as needed...

END $$;
```
