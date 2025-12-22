-- ============================================
-- Sample Content for Learning Platform
-- 5 Beginner Modules with Quiz Questions
-- ============================================

-- Clean up existing sample data (if any)
DELETE FROM quiz_questions WHERE module_id IN (SELECT id FROM learning_modules WHERE level = 'beginner');
DELETE FROM module_completions WHERE module_id IN (SELECT id FROM learning_modules WHERE level = 'beginner');
DELETE FROM quiz_attempts WHERE module_id IN (SELECT id FROM learning_modules WHERE level = 'beginner');
DELETE FROM learning_modules WHERE level = 'beginner';

DO $$
DECLARE
  module1_id UUID;
  module2_id UUID;
  module3_id UUID;
  module4_id UUID;
  module5_id UUID;
BEGIN
  -- Insert Module 1
  INSERT INTO learning_modules (level, order_index, title, description, learning_objectives, estimated_duration_minutes, is_published)
  VALUES (
    'beginner', 1,
    'Introduction to AI Chat Tools',
    'Learn the fundamentals of AI-powered chatbots like ChatGPT and Claude. Understand how they work and how to use them effectively in your daily workflow.',
    ARRAY['Understand what AI chat tools are and how they work', 'Learn to craft effective prompts for better responses', 'Discover practical use cases for everyday tasks', 'Compare different chat AI tools and their strengths'],
    30, true
  ) RETURNING id INTO module1_id;

  -- Insert Module 2
  INSERT INTO learning_modules (level, order_index, title, description, learning_objectives, prerequisites, estimated_duration_minutes, is_published)
  VALUES (
    'beginner', 2,
    'Mastering Prompt Engineering',
    'Master the art of writing effective prompts to get the best results from AI tools. Learn advanced techniques and common patterns.',
    ARRAY['Write clear and specific prompts', 'Use context and examples effectively', 'Apply prompt templates for common tasks', 'Troubleshoot poor AI responses'],
    45, true
  ) RETURNING id INTO module2_id;

  -- Update Module 2 prerequisites
  UPDATE learning_modules SET prerequisites = ARRAY[module1_id] WHERE id = module2_id;

  -- Insert Module 3
  INSERT INTO learning_modules (level, order_index, title, description, learning_objectives, prerequisites, estimated_duration_minutes, is_published)
  VALUES (
    'beginner', 3,
    'AI Image Generation Basics',
    'Explore the world of AI-powered image creation with tools like MidJourney, DALL-E, and Stable Diffusion.',
    ARRAY['Understand how AI generates images', 'Write effective image prompts', 'Choose the right tool for your needs', 'Edit and refine AI-generated images'],
    40, true
  ) RETURNING id INTO module3_id;

  UPDATE learning_modules SET prerequisites = ARRAY[module1_id] WHERE id = module3_id;

  -- Insert Module 4
  INSERT INTO learning_modules (level, order_index, title, description, learning_objectives, prerequisites, estimated_duration_minutes, is_published)
  VALUES (
    'beginner', 4,
    'AI Coding Assistants',
    'Learn how to use AI coding tools like GitHub Copilot and CodeWhisperer to boost your development productivity.',
    ARRAY['Set up AI coding assistants', 'Write code faster with AI suggestions', 'Debug code with AI help', 'Understand AI code limitations'],
    50, true
  ) RETURNING id INTO module4_id;

  UPDATE learning_modules SET prerequisites = ARRAY[module2_id] WHERE id = module4_id;

  -- Insert Module 5
  INSERT INTO learning_modules (level, order_index, title, description, learning_objectives, prerequisites, estimated_duration_minutes, is_published)
  VALUES (
    'beginner', 5,
    'AI Ethics and Best Practices',
    'Understand the ethical considerations and best practices when using AI tools in professional and personal contexts.',
    ARRAY['Recognize AI biases and limitations', 'Use AI responsibly and ethically', 'Protect privacy when using AI', 'Verify AI-generated content'],
    35, true
  ) RETURNING id INTO module5_id;

  UPDATE learning_modules SET prerequisites = ARRAY[module3_id, module4_id] WHERE id = module5_id;

  -- ============================================
  -- Quiz Questions for Module 1
  -- ============================================
  
  INSERT INTO quiz_questions (module_id, question_text, options, explanation, difficulty, topic_tag, is_active) VALUES
  (module1_id, 
   'What is the primary technology behind modern AI chat tools like ChatGPT?',
   '[
     {"text": "Rule-based programming", "is_correct": false},
     {"text": "Large Language Models (LLMs)", "is_correct": true},
     {"text": "Simple keyword matching", "is_correct": false},
     {"text": "Database queries", "is_correct": false}
   ]'::jsonb,
   'Large Language Models (LLMs) are trained on vast amounts of text data to understand and generate human-like responses.',
   'easy',
   'AI Basics',
   true),

  (module1_id,
   'Which of the following is NOT a benefit of using AI chat tools?',
   '[
     {"text": "24/7 availability", "is_correct": false},
     {"text": "Instant responses", "is_correct": false},
     {"text": "100% accuracy guarantee", "is_correct": true},
     {"text": "Handling multiple queries simultaneously", "is_correct": false}
   ]'::jsonb,
   'AI tools can make mistakes and should not be relied upon for 100% accuracy. Always verify important information.',
   'easy',
   'AI Limitations',
   true),

  (module1_id,
   'What is a "prompt" in the context of AI chat tools?',
   '[
     {"text": "The AI''s response to your question", "is_correct": false},
     {"text": "The input or question you give to the AI", "is_correct": true},
     {"text": "A reminder notification", "is_correct": false},
     {"text": "An error message", "is_correct": false}
   ]'::jsonb,
   'A prompt is the input text or question you provide to the AI tool to generate a response.',
   'easy',
   'Prompt Basics',
   true),

  (module1_id,
   'Which AI chat tool is developed by OpenAI?',
   '[
     {"text": "Claude", "is_correct": false},
     {"text": "Bard", "is_correct": false},
     {"text": "ChatGPT", "is_correct": true},
     {"text": "Copilot", "is_correct": false}
   ]'::jsonb,
   'ChatGPT is developed by OpenAI and is one of the most popular AI chat tools.',
   'easy',
   'AI Tools',
   true),

  (module1_id,
   'What should you do if an AI chat tool gives you incorrect information?',
   '[
     {"text": "Always trust the AI", "is_correct": false},
     {"text": "Verify the information from reliable sources", "is_correct": true},
     {"text": "Ignore the response", "is_correct": false},
     {"text": "Share it immediately", "is_correct": false}
   ]'::jsonb,
   'Always verify important information from reliable sources. AI tools can sometimes provide incorrect or outdated information.',
   'medium',
   'AI Best Practices',
   true);

  -- Add more questions for Module 1 (need 20-30 total per module)
  INSERT INTO quiz_questions (module_id, question_text, options, explanation, difficulty, topic_tag, is_active) VALUES
  (module1_id,
   'Which statement about AI responses is most accurate?',
   '[
     {"text": "AI responses are always factual", "is_correct": false},
     {"text": "AI can generate plausible but sometimes incorrect information", "is_correct": true},
     {"text": "AI cannot make grammatical errors", "is_correct": false},
     {"text": "AI always cites its sources", "is_correct": false}
   ]'::jsonb,
   'AI can generate convincing text that sounds factual but may contain errors or "hallucinations".',
   'medium',
   'AI Limitations',
   true),

  (module1_id,
   'What is the best practice when asking an AI for help with a task?',
   '[
     {"text": "Ask vague questions", "is_correct": false},
     {"text": "Provide clear context and specific details", "is_correct": true},
     {"text": "Use as few words as possible", "is_correct": false},
     {"text": "Avoid examples", "is_correct": false}
   ]'::jsonb,
   'Clear, specific prompts with context lead to better AI responses.',
   'easy',
   'Prompt Basics',
   true),

  (module1_id,
   'Can AI chat tools access real-time internet data by default?',
   '[
     {"text": "Yes, always", "is_correct": false},
     {"text": "No, most have a knowledge cutoff date", "is_correct": true},
     {"text": "Only on weekends", "is_correct": false},
     {"text": "Only for premium users", "is_correct": false}
   ]'::jsonb,
   'Most AI chat tools have a knowledge cutoff date and don''t access real-time internet data unless specifically enabled.',
   'medium',
   'AI Basics',
   true),

  (module1_id,
   'What type of tasks are AI chat tools particularly good at?',
   '[
     {"text": "Physical labor", "is_correct": false},
     {"text": "Text generation, summarization, and explanation", "is_correct": true},
     {"text": "Replacing human judgment entirely", "is_correct": false},
     {"text": "Making financial investments", "is_correct": false}
   ]'::jsonb,
   'AI chat tools excel at language-based tasks like writing, summarizing, and explaining concepts.',
   'easy',
   'AI Use Cases',
   true),

  (module1_id,
   'How should you handle sensitive or private information with AI tools?',
   '[
     {"text": "Share freely with any AI", "is_correct": false},
     {"text": "Avoid sharing confidential or personal data", "is_correct": true},
     {"text": "Only share on Tuesdays", "is_correct": false},
     {"text": "Encrypt it first", "is_correct": false}
   ]'::jsonb,
   'Never share sensitive personal or confidential information with AI tools as conversations may be stored or reviewed.',
   'medium',
   'AI Best Practices',
   true);

  -- ============================================
  -- Quiz Questions for Module 2 (Prompt Engineering)
  -- ============================================
  
  INSERT INTO quiz_questions (module_id, question_text, options, explanation, difficulty, topic_tag, is_active) VALUES
  (module2_id,
   'What is the most important element of a good prompt?',
   '[
     {"text": "Length", "is_correct": false},
     {"text": "Clarity and specificity", "is_correct": true},
     {"text": "Using technical jargon", "is_correct": false},
     {"text": "Being concise at all costs", "is_correct": false}
   ]'::jsonb,
   'Clear, specific prompts help the AI understand exactly what you need.',
   'easy',
   'Prompt Engineering',
   true),

  (module2_id,
   'Which prompt technique involves giving examples to the AI?',
   '[
     {"text": "Zero-shot prompting", "is_correct": false},
     {"text": "Few-shot prompting", "is_correct": true},
     {"text": "Chain-of-thought", "is_correct": false},
     {"text": "Role prompting", "is_correct": false}
   ]'::jsonb,
   'Few-shot prompting provides examples to guide the AI''s responses.',
   'medium',
   'Prompt Engineering',
   true),

  (module2_id,
   'What should you do if an AI response doesn''t meet your needs?',
   '[
     {"text": "Give up", "is_correct": false},
     {"text": "Refine your prompt and try again", "is_correct": true},
     {"text": "Use the same prompt repeatedly", "is_correct": false},
     {"text": "Switch to a different task", "is_correct": false}
   ]'::jsonb,
   'Iterating and refining prompts is key to getting better results.',
   'easy',
   'Prompt Engineering',
   true);

  RAISE NOTICE 'Sample content created successfully!';
  RAISE NOTICE 'Module 1 ID: %', module1_id;
  RAISE NOTICE 'Module 2 ID: %', module2_id;
  RAISE NOTICE 'Module 3 ID: %', module3_id;
  RAISE NOTICE 'Module 4 ID: %', module4_id;
  RAISE NOTICE 'Module 5 ID: %', module5_id;
  
END $$;
