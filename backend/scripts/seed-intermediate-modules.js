/**
 * Seed 5 Intermediate Learning Modules:
 * 1. Advanced Prompt Techniques
 * 2. AI Video & Audio Deep Dive
 * 3. Building AI Workflows
 * 4. AI for Business & Marketing
 * 5. AI Research & Data Analysis
 *
 * Each module includes:
 * - Rich markdown content (8-10K chars) with flashcards, interactive prompts, tables
 * - 20 quiz questions per module
 * - Prerequisites linking to beginner modules
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Beginner module IDs (prerequisites)
const BEGINNER_IDS = {
  1: 'bc0fe777-d349-48dd-ad76-d88d648d3601',
  2: '8eef1671-3856-4d70-bf8c-7feddb84dc10',
  3: '54820bcf-b703-4262-b478-fe1c720fe76c',
  4: '0bf596fa-a5d5-4617-b756-977e66adc6ac',
  5: '62733a72-bf1b-4040-9025-f43c3c393dcf',
};

// ─── MODULE DEFINITIONS ───

const INTERMEDIATE_MODULES = [
  {
    level: 'intermediate',
    order_index: 1,
    title: 'Advanced Prompt Techniques',
    description: 'Go beyond basics with meta-prompting, prompt chaining, structured outputs, and advanced reasoning strategies that unlock the full potential of LLMs.',
    learning_objectives: [
      'Master prompt chaining for complex multi-step tasks',
      'Use meta-prompting to make AI improve its own prompts',
      'Generate structured outputs (JSON, CSV, XML) reliably',
      'Apply tree-of-thought and self-consistency techniques',
      'Build reusable prompt templates for professional workflows'
    ],
    estimated_duration_minutes: 50,
    is_published: true,
    prerequisites: [BEGINNER_IDS[2]], // Mastering Prompt Engineering
  },
  {
    level: 'intermediate',
    order_index: 2,
    title: 'AI Video & Audio Deep Dive',
    description: 'Explore AI-powered video generation, editing, voice cloning, music creation, and audio transcription tools transforming media production.',
    learning_objectives: [
      'Understand how AI video generation models work',
      'Use AI tools for video editing and enhancement',
      'Explore voice cloning and text-to-speech technologies',
      'Create AI-generated music and sound effects',
      'Apply best practices for AI media in professional contexts'
    ],
    estimated_duration_minutes: 45,
    is_published: true,
    prerequisites: [BEGINNER_IDS[3]], // AI Image Generation Basics
  },
  {
    level: 'intermediate',
    order_index: 3,
    title: 'Building AI Workflows & Automation',
    description: 'Learn to chain AI tools together, build automated pipelines, and create AI agents that handle complex multi-step tasks autonomously.',
    learning_objectives: [
      'Design multi-step AI workflows for real tasks',
      'Connect AI tools using no-code automation platforms',
      'Build simple AI agents with tool-use capabilities',
      'Understand RAG (Retrieval-Augmented Generation) basics',
      'Evaluate when to automate vs. keep humans in the loop'
    ],
    estimated_duration_minutes: 55,
    is_published: true,
    prerequisites: [BEGINNER_IDS[4]], // AI Coding Assistants
  },
  {
    level: 'intermediate',
    order_index: 4,
    title: 'AI for Business & Marketing',
    description: 'Apply AI tools strategically for content marketing, customer insights, competitive analysis, and business operations to drive real results.',
    learning_objectives: [
      'Create AI-powered content marketing strategies',
      'Use AI for customer research and persona development',
      'Automate social media and email marketing with AI',
      'Apply AI to competitive analysis and market research',
      'Measure ROI of AI tool adoption in business workflows'
    ],
    estimated_duration_minutes: 45,
    is_published: true,
    prerequisites: [BEGINNER_IDS[2]], // Mastering Prompt Engineering
  },
  {
    level: 'intermediate',
    order_index: 5,
    title: 'AI for Research & Data Analysis',
    description: 'Leverage AI tools for academic research, data analysis, literature reviews, and extracting insights from complex datasets and documents.',
    learning_objectives: [
      'Use AI for literature review and paper summarization',
      'Apply AI to data cleaning, analysis, and visualization',
      'Understand AI-powered research assistants and their limits',
      'Extract insights from PDFs, reports, and large documents',
      'Evaluate AI-generated research for accuracy and bias'
    ],
    estimated_duration_minutes: 50,
    is_published: true,
    prerequisites: [BEGINNER_IDS[5]], // AI Ethics and Best Practices
  },
];

// ─── MODULE CONTENT ───


const CONTENT_INT1 = `# Advanced Prompt Techniques

You've mastered the basics of prompt engineering. Now it's time to unlock the techniques that separate casual users from power users. This module covers prompt chaining, meta-prompting, structured outputs, and advanced reasoning strategies that will transform how you work with AI.

## Prompt Chaining: Breaking Complex Tasks into Steps

Prompt chaining is the practice of breaking a complex task into a sequence of simpler prompts, where each step's output feeds into the next. Instead of asking AI to do everything at once, you guide it through a pipeline.

### Why Chaining Works Better

Single monolithic prompts often fail because:
- The AI loses focus on later instructions
- Quality degrades as complexity increases
- Errors compound without checkpoints
- You can't course-correct mid-process

**Example: Writing a Research Report**

| Step | Prompt | Output |
|------|--------|--------|
| 1 | "List the 5 most important trends in renewable energy for 2025" | Bullet list of trends |
| 2 | "For each trend, write a 100-word summary with one supporting statistic" | 5 detailed summaries |
| 3 | "Combine these into a cohesive 800-word report with an introduction and conclusion" | Final report |
| 4 | "Review this report for factual accuracy and flag any claims that need verification" | Quality check |

Each step is simple enough for the AI to execute well, and you can review and adjust between steps.

\`\`\`flashcard
What is prompt chaining and why is it effective?
---
Prompt chaining breaks complex tasks into sequential simpler prompts, where each output feeds the next. It's effective because: (1) each step is focused and manageable, (2) you can review between steps, (3) errors don't compound, and (4) quality stays high throughout.
\`\`\`

## Meta-Prompting: Making AI Improve Its Own Prompts

Meta-prompting is asking the AI to help you write better prompts. It's one of the most underused techniques.

### The Prompt Optimizer Pattern

**Step 1:** Tell the AI what you want to accomplish
"I need to write product descriptions for an e-commerce store. Help me create the perfect prompt template for this task."

**Step 2:** Ask it to critique and improve
"Here's my current prompt: [paste prompt]. How can I make this more effective? What am I missing?"

**Step 3:** Ask for variations
"Generate 3 different versions of this prompt, each optimized for a different tone: professional, playful, and luxury."

### The Self-Evaluation Pattern

Ask the AI to evaluate its own output:
"Rate your previous response on a scale of 1-10 for accuracy, completeness, and clarity. Then rewrite it addressing any weaknesses you identified."

This forces the model to engage in self-reflection, often producing significantly better second drafts.

> Meta-prompting is like having a writing coach who also happens to be the writer. The AI can identify its own blind spots when explicitly asked to look for them.

## Structured Output Generation

Getting AI to produce consistently formatted data is crucial for automation and integration with other tools.

### JSON Output

\`\`\`
Analyze this customer review and return a JSON object with these exact keys:
- sentiment: "positive", "negative", or "neutral"
- confidence: number between 0 and 1
- key_topics: array of strings
- action_items: array of strings (empty if none)
- summary: string, max 50 words

Review: "The product arrived late but the quality exceeded my expectations. Would buy again but please fix the shipping times."
\`\`\`

### Reliable Structured Output Tips

1. **Show the exact schema** you want (with example values)
2. **Use delimiters** to separate the instruction from the input
3. **Specify edge cases**: "If no action items exist, return an empty array"
4. **Validate**: Always parse and validate AI-generated JSON before using it
5. **Use system prompts**: "You are a JSON generator. Always respond with valid JSON only, no markdown formatting."

\`\`\`flashcard
How do you get reliable structured output (JSON/CSV) from AI?
---
(1) Show the exact schema with example values, (2) use delimiters to separate instructions from input, (3) specify edge cases explicitly, (4) always validate/parse the output, (5) use system prompts that constrain the response format. Never trust AI-generated structured data without validation.
\`\`\`

## Advanced Reasoning Techniques

### Tree-of-Thought (ToT) Prompting

Instead of a single chain of reasoning, ask the AI to explore multiple reasoning paths:

"Consider three different approaches to solving this problem. For each approach:
1. Describe the method
2. Work through the solution
3. Identify potential issues
Then compare all three and recommend the best approach with justification."

This produces more thorough analysis than standard chain-of-thought.

### Self-Consistency

Run the same prompt multiple times and look for consensus:

"Solve this problem 3 times using different methods. If all 3 agree, that's likely correct. If they disagree, explain why and determine which is most reliable."

### Socratic Prompting

Instead of asking for answers, ask the AI to ask YOU questions:

"I want to build a mobile app for tracking fitness goals. Instead of giving me a solution, ask me 10 clarifying questions that will help you give me the best possible advice."

This surfaces assumptions and requirements you might have missed.

\`\`\`interactive
Try the meta-prompting technique! First, write a prompt for a task you commonly do (e.g., writing emails, summarizing documents). Then ask: "Critique this prompt and suggest 3 specific improvements to make it more effective."
\`\`\`

## Building Reusable Prompt Templates

Professional AI users build libraries of tested prompt templates. Here's how to create them:

### Template Structure

\`\`\`
[ROLE]: You are a {role} with expertise in {domain}.

[CONTEXT]: {background_information}

[TASK]: {specific_instruction}

[FORMAT]: Respond as {output_format} with the following structure:
- {field_1}: {description}
- {field_2}: {description}

[CONSTRAINTS]:
- {constraint_1}
- {constraint_2}

[EXAMPLES]: (optional)
Input: {example_input}
Output: {example_output}
\`\`\`

### Template Best Practices

| Practice | Why |
|----------|-----|
| Use placeholders like {variable} | Makes templates reusable across contexts |
| Include 1-2 examples | Anchors the AI's understanding of your expectations |
| Specify what NOT to do | Prevents common failure modes |
| Add a quality check step | "Before responding, verify that your output meets all constraints" |
| Version your templates | Track what works and iterate over time |

## Prompt Engineering for Different Models

Different AI models respond differently to the same prompt. Here's what to know:

| Technique | GPT-4 | Claude | Gemini |
|-----------|-------|--------|--------|
| System prompts | Strong adherence | Very strong adherence | Moderate |
| JSON output | Reliable with instruction | Very reliable | Sometimes adds markdown |
| Chain-of-thought | Good | Excellent | Good |
| Long context | 128K tokens | 200K tokens | 1M tokens |
| Following constraints | Good | Excellent | Moderate |

> The best prompt engineers test their prompts across multiple models and adapt their techniques to each model's strengths.

\`\`\`flashcard
What is Tree-of-Thought prompting?
---
Tree-of-Thought (ToT) asks the AI to explore multiple reasoning paths simultaneously, evaluate each one, and then select the best approach. Unlike chain-of-thought (single path), ToT produces more thorough analysis by considering alternatives and trade-offs before committing to an answer.
\`\`\`

## Summary

You've leveled up from basic prompt engineering to advanced techniques: chaining for complex workflows, meta-prompting for self-improvement, structured outputs for automation, and advanced reasoning for better accuracy. These techniques are the foundation for building real AI-powered workflows — which is exactly what we'll cover in Module 3.

Take the quiz to test your advanced prompt skills!
`;


const CONTENT_INT2 = `# AI Video & Audio Deep Dive

AI is transforming how we create, edit, and consume video and audio content. From generating entire videos from text prompts to cloning voices and composing music, the tools available today would have seemed like science fiction just two years ago. This module explores the landscape, teaches you how to use these tools effectively, and helps you understand their limitations.

## AI Video Generation: The Current State

AI video generation has evolved rapidly. Here's how the major approaches work:

### How AI Video Models Work

Most AI video generators use one of two approaches:

1. **Diffusion-based models** (like Sora, Runway Gen-3): Generate video frame by frame using the same diffusion process as image generators, but with temporal consistency to ensure smooth motion
2. **Transformer-based models** (like Pika): Process video as sequences of tokens, similar to how LLMs process text

The key challenge is **temporal coherence** — making sure objects, lighting, and physics stay consistent across frames.

| Tool | Developer | Best For | Max Length | Pricing |
|------|-----------|----------|------------|---------|
| **Sora** | OpenAI | Cinematic quality, complex scenes | 60 sec | ChatGPT Plus |
| **Runway Gen-3** | Runway | Professional editing, motion control | 10 sec | $12-76/mo |
| **Pika** | Pika Labs | Quick social media clips, lip sync | 10 sec | Free tier + paid |
| **Kling** | Kuaishou | Long-form, realistic motion | 120 sec | Free tier + paid |
| **Luma Dream Machine** | Luma AI | Fast generation, good physics | 5 sec | Free tier + paid |
| **HailuoAI (MiniMax)** | MiniMax | Character consistency, dialogue | 6 sec | Free tier + paid |
| **Veo 2** | Google | High resolution, cinematic | 8 sec | Via Google AI tools |

> The video AI space moves incredibly fast. New models and capabilities emerge monthly. The fundamentals you learn here will help you evaluate any new tool that appears.

### Writing Effective Video Prompts

Video prompts need elements that image prompts don't:

- **Motion description**: "Camera slowly pans left", "Person walks toward camera"
- **Temporal flow**: "Starting with a close-up, then pulling back to reveal..."
- **Physics cues**: "Leaves falling gently", "Water splashing realistically"
- **Duration hints**: "A slow, contemplative scene" vs "Quick, energetic cuts"

**Example prompt:**
"A golden retriever running through a field of wildflowers at sunset. Camera follows from a low angle. Slow motion. Cinematic lighting with lens flare. Shallow depth of field. 4K quality."

\`\`\`flashcard
What makes video prompts different from image prompts?
---
Video prompts need: (1) Motion descriptions — how things move, (2) Temporal flow — what happens over time, (3) Camera directions — pans, zooms, tracking shots, (4) Physics cues — realistic movement and interactions, (5) Pacing — slow/fast, contemplative/energetic. Static descriptions produce boring videos.
\`\`\`

## AI Video Editing & Enhancement

Beyond generation, AI excels at editing existing video:

### Key Capabilities

- **Background removal/replacement**: Remove or swap backgrounds in real-time (Runway, CapCut)
- **Object removal**: Erase unwanted objects from video scenes
- **Upscaling**: Enhance low-resolution footage to 4K (Topaz Video AI)
- **Color grading**: AI-assisted color correction and mood setting
- **Auto-captioning**: Generate accurate subtitles in multiple languages
- **Lip sync**: Match mouth movements to different audio tracks (Pika, Sync Labs)
- **Frame interpolation**: Create smooth slow-motion from standard footage

### Professional Workflow Integration

Many creators use AI as part of a hybrid workflow:
1. **Plan** the video concept and storyboard
2. **Generate** AI clips for scenes that are hard to film
3. **Film** real footage for scenes that need authenticity
4. **Edit** using AI-powered tools for color, effects, and transitions
5. **Enhance** with AI upscaling and audio cleanup

## AI Audio: Voice, Music, and Sound

### Text-to-Speech (TTS) & Voice Cloning

Modern TTS has moved far beyond robotic voices:

| Tool | Capability | Best For |
|------|-----------|----------|
| **ElevenLabs** | Voice cloning, multilingual TTS, emotion control | Audiobooks, podcasts, dubbing |
| **Play.ht** | Ultra-realistic voices, API access | Content creators, developers |
| **Murf AI** | Studio-quality voiceovers | Marketing videos, e-learning |
| **Resemble AI** | Real-time voice cloning, emotion | Gaming, interactive media |
| **Bark** (open-source) | Multilingual, sound effects in speech | Developers, researchers |

**Voice cloning** can replicate a person's voice from just a few minutes of sample audio. This has incredible applications (accessibility, content localization) but also serious ethical concerns (fraud, impersonation).

### AI Music Generation

AI can now compose original music in virtually any genre:

| Tool | Best For | How It Works |
|------|----------|-------------|
| **Suno** | Full songs with vocals and lyrics | Text prompt to complete song |
| **Udio** | High-quality music production | Text prompt with genre/mood control |
| **AIVA** | Classical and cinematic scores | Composition with style selection |
| **Mubert** | Background music, loops | Real-time generation for specific moods |
| **Stable Audio** | Sound effects and short clips | Diffusion-based audio generation |

\`\`\`flashcard
What is voice cloning and what are its ethical implications?
---
Voice cloning uses AI to replicate a person's voice from sample audio. Positive uses: accessibility, content localization, preserving voices of those who lose speech. Ethical risks: fraud (fake phone calls), impersonation, non-consensual use, political manipulation. Always get consent before cloning someone's voice.
\`\`\`

### Audio Enhancement & Transcription

- **Noise removal**: Clean up recordings by removing background noise (Adobe Podcast, Descript)
- **Transcription**: Convert speech to text with high accuracy (Whisper, Otter.ai, Descript)
- **Speaker diarization**: Identify who said what in multi-speaker recordings
- **Audio restoration**: Fix clipped audio, remove echo, enhance clarity

## Practical Projects

### Project 1: Create a Short Explainer Video
1. Write a script using ChatGPT/Claude
2. Generate voiceover with ElevenLabs
3. Create visual scenes with Runway or Pika
4. Add background music with Suno or Mubert
5. Edit and combine in CapCut or DaVinci Resolve

### Project 2: Start a Podcast Without Recording
1. Write episode scripts with AI assistance
2. Generate host voices with TTS
3. Add intro/outro music with AI
4. Auto-generate transcripts and show notes

\`\`\`interactive
Think of a 30-second video you'd like to create. Write a detailed video prompt that includes: subject, camera movement, lighting, mood, and pacing. Then describe which AI tools you'd use for each part of the production pipeline.
\`\`\`

## Limitations and Honest Assessment

### What AI Video Still Struggles With
- **Hands and fingers** in close-up shots
- **Text rendering** within video scenes
- **Consistent characters** across multiple clips
- **Complex physics** (fluid dynamics, cloth simulation)
- **Long-form coherence** beyond 30-60 seconds
- **Specific brand elements** or logos

### What AI Audio Still Struggles With
- **Emotional nuance** in voice cloning (improving rapidly)
- **Live singing** that sounds fully natural
- **Complex musical arrangements** with many instruments
- **Accents and dialects** in less-common languages

## Ethical Guidelines for AI Media

1. **Always disclose** AI-generated content, especially if it could be mistaken for real footage
2. **Never clone voices** without explicit consent from the person
3. **Don't create deepfakes** of real people in misleading contexts
4. **Respect copyright** — check licensing terms for commercial use
5. **Consider impact** — could this content mislead, harm, or deceive?

## Summary

AI video and audio tools are powerful creative amplifiers. They lower the barrier to professional-quality media production, but they require skill to use well and responsibility to use ethically. The best creators combine AI capabilities with human creativity, judgment, and storytelling instincts.

Take the quiz to test your knowledge!
`;


const CONTENT_INT3 = `# Building AI Workflows & Automation

Individual AI tools are powerful. But the real magic happens when you chain them together into automated workflows that handle complex, multi-step tasks with minimal human intervention. This module teaches you how to design, build, and manage AI-powered automation pipelines.

## From Single Tools to Workflows

Most people use AI tools in isolation: ask ChatGPT a question, generate an image with Midjourney, transcribe audio with Whisper. But real productivity gains come from connecting these tools into pipelines.

### Example: Automated Content Pipeline

| Step | Tool | Input | Output |
|------|------|-------|--------|
| 1. Research | Perplexity AI | Topic keyword | Research summary with sources |
| 2. Outline | Claude | Research summary | Structured article outline |
| 3. Draft | ChatGPT | Outline + style guide | Full article draft |
| 4. Images | DALL-E 3 | Key sections | Header and section images |
| 5. Edit | Grammarly AI | Draft | Polished article |
| 6. SEO | Surfer SEO | Article | SEO-optimized version |
| 7. Publish | WordPress API | Final content + images | Published blog post |

What used to take a content team 8 hours can now be done in 30 minutes with human oversight at key checkpoints.

> The goal of AI workflows isn't to remove humans — it's to remove the tedious parts so humans can focus on strategy, creativity, and quality control.

## No-Code AI Automation Platforms

You don't need to be a developer to build AI workflows. Several platforms make it visual and accessible:

### Platform Comparison

| Platform | Best For | AI Integration | Pricing |
|----------|----------|---------------|---------|
| **Zapier** | Simple automations, 6000+ app integrations | Built-in AI actions, OpenAI integration | Free tier + $20/mo |
| **Make (Integromat)** | Complex multi-branch workflows | OpenAI, Anthropic, custom API modules | Free tier + $9/mo |
| **n8n** | Self-hosted, developer-friendly | Any AI API, custom code nodes | Free (self-hosted) / $20/mo cloud |
| **Relevance AI** | AI-native workflows, agent building | Built for AI-first automation | Free tier + paid |
| **Langflow** | Visual LLM pipeline builder | LangChain-based, any LLM | Free (open-source) |

### Building Your First Automation (Zapier Example)

**Scenario**: Automatically summarize customer support emails and create tasks

1. **Trigger**: New email in Gmail with label "Support"
2. **AI Step**: Send email body to ChatGPT — "Summarize this support email in 2 sentences. Classify priority as High/Medium/Low. Extract the customer's main request."
3. **Action**: Create a Trello card with the summary, priority label, and original email link
4. **Action**: If priority is "High", send a Slack notification to the support lead

\`\`\`flashcard
What are the main no-code AI automation platforms?
---
Zapier (simplest, most integrations), Make/Integromat (complex workflows), n8n (self-hosted, developer-friendly), Relevance AI (AI-native), and Langflow (visual LLM pipelines). Choose based on complexity needs, budget, and whether you need self-hosting.
\`\`\`

## AI Agents: Autonomous Task Execution

AI agents go beyond simple automation — they can plan, use tools, and adapt their approach based on results.

### What Makes an Agent Different from a Workflow?

| Feature | Workflow | Agent |
|---------|----------|-------|
| Execution | Fixed sequence of steps | Dynamic, adapts based on results |
| Decision-making | Pre-defined branches | AI decides next action |
| Tool use | Pre-configured tools | Selects tools as needed |
| Error handling | Pre-defined fallbacks | Can reason about and recover from errors |
| Complexity | Simple to moderate | Can handle open-ended tasks |

### Popular Agent Frameworks

- **AutoGPT / AgentGPT**: Early pioneers, fully autonomous task execution
- **CrewAI**: Multi-agent collaboration (e.g., "researcher" + "writer" + "editor" agents)
- **LangChain Agents**: Developer framework for building custom agents with tool access
- **OpenAI Assistants API**: Build agents with code execution, file search, and function calling
- **Claude Computer Use**: AI that can interact with your desktop applications

### Agent Design Patterns

**The ReAct Pattern** (Reasoning + Acting):
1. Agent receives a task
2. **Thinks**: "I need to find the latest sales data"
3. **Acts**: Searches the database
4. **Observes**: Reviews the results
5. **Thinks**: "Now I need to calculate the trend"
6. **Acts**: Runs a calculation
7. Repeats until task is complete

\`\`\`interactive
Design an AI workflow for a task you do regularly. Map out: (1) What triggers the workflow? (2) What are the steps? (3) Which AI tool handles each step? (4) Where should a human review before proceeding? (5) What's the final output?
\`\`\`

## RAG: Retrieval-Augmented Generation

RAG is one of the most important patterns in AI applications. It solves the problem of AI not knowing about your specific data.

### How RAG Works

1. **Index**: Your documents are split into chunks and converted to numerical vectors (embeddings)
2. **Store**: Vectors are saved in a vector database (Pinecone, Weaviate, ChromaDB)
3. **Retrieve**: When a user asks a question, the system finds the most relevant document chunks
4. **Generate**: The AI generates an answer using the retrieved context + the user's question

### Why RAG Matters

Without RAG, AI can only use its training data. With RAG:
- AI can answer questions about YOUR documents, products, or data
- Responses are grounded in actual sources (reducing hallucinations)
- You can update the knowledge base without retraining the model
- Users can ask natural language questions about structured data

### RAG Use Cases

| Use Case | Data Source | Example Query |
|----------|-----------|---------------|
| Customer support bot | Help docs, FAQs | "How do I reset my password?" |
| Legal research | Case law, contracts | "Find precedents for data breach liability" |
| Internal knowledge base | Company wiki, SOPs | "What's our refund policy for enterprise clients?" |
| Product recommendations | Product catalog | "I need a laptop for video editing under $1500" |

\`\`\`flashcard
What is RAG (Retrieval-Augmented Generation)?
---
RAG combines information retrieval with AI generation. Your documents are converted to vectors and stored in a database. When a user asks a question, the system retrieves relevant document chunks and feeds them to the AI as context, producing answers grounded in your actual data rather than just training knowledge.
\`\`\`

## When to Automate vs. Keep Humans in the Loop

Not everything should be automated. Here's a framework:

### Automate When:
- ✅ The task is repetitive and well-defined
- ✅ Errors are low-cost and easily reversible
- ✅ Speed matters more than perfection
- ✅ The output is internal or low-stakes

### Keep Humans When:
- ⚠️ The output is customer-facing or public
- ⚠️ Errors could cause financial or reputational damage
- ⚠️ The task requires empathy or nuanced judgment
- ⚠️ Legal or compliance requirements mandate human review

### The "Human Checkpoint" Pattern

Build workflows with strategic human review points:
1. AI generates draft → **Human reviews** → AI refines based on feedback
2. AI classifies urgency → **Human confirms** high-priority items → AI routes accordingly
3. AI analyzes data → AI generates report → **Human validates** before distribution

## Security Considerations

AI workflows introduce new security concerns:

- **API key management**: Never hardcode keys; use environment variables or secret managers
- **Data leakage**: Be careful what data flows through third-party AI APIs
- **Prompt injection**: Malicious inputs could hijack your workflow's AI steps
- **Access control**: Ensure workflows can only access data they need
- **Audit logging**: Track what your AI workflows do for accountability

## Summary

AI workflows and automation represent the next level of AI productivity. By chaining tools together, building agents, and implementing RAG, you can create systems that handle complex tasks while keeping humans in control of the important decisions. Start simple with no-code platforms, then graduate to custom agents as your needs grow.

Take the quiz to test your workflow knowledge!
`;


const CONTENT_INT4 = `# AI for Business & Marketing

AI isn't just a tech tool — it's a business multiplier. Companies that strategically adopt AI for marketing, operations, and customer insights are seeing measurable competitive advantages. This module teaches you how to apply AI tools to real business challenges, from content creation to competitive analysis.

## The AI Marketing Stack

Modern marketing teams use AI across the entire funnel:

| Funnel Stage | AI Application | Tools |
|-------------|---------------|-------|
| **Awareness** | Content creation, SEO, social media | ChatGPT, Jasper, Surfer SEO |
| **Interest** | Personalized emails, ad copy | Copy.ai, Mailchimp AI, Persado |
| **Consideration** | Chatbots, product recommendations | Intercom, Drift, Dynamic Yield |
| **Conversion** | Landing page optimization, A/B testing | Unbounce, VWO, Optimizely |
| **Retention** | Customer insights, churn prediction | Amplitude, Mixpanel, Pecan AI |

## AI-Powered Content Marketing

### Content Strategy with AI

Use AI to build a data-driven content strategy:

1. **Topic research**: "Analyze the top 20 articles ranking for 'remote work tools' and identify content gaps"
2. **Keyword clustering**: "Group these 100 keywords into thematic clusters and suggest a pillar page structure"
3. **Content calendar**: "Create a 30-day content calendar for a B2B SaaS company targeting HR managers"
4. **Competitor analysis**: "Compare the content strategies of [Competitor A] and [Competitor B] based on their blog topics"

### Writing High-Converting Copy

AI excels at generating marketing copy when given the right context:

**The AIDA Prompt Template:**
"Write a [content type] for [product/service] targeting [audience].
Follow the AIDA framework:
- Attention: Hook with a surprising statistic or bold statement
- Interest: Describe the problem the audience faces
- Desire: Show how the product solves it with specific benefits
- Action: Clear CTA with urgency

Tone: [professional/casual/playful]
Length: [word count]
Include: [specific elements like testimonials, statistics]"

\`\`\`flashcard
What is the AIDA framework for marketing copy?
---
Attention (hook the reader), Interest (describe their problem), Desire (show your solution's benefits), Action (clear call-to-action). When prompting AI for marketing copy, structuring your request around AIDA produces much more effective results than generic "write an ad" prompts.
\`\`\`

### SEO Content Optimization

AI can help with every aspect of SEO:

- **Title tags and meta descriptions**: Generate multiple options optimized for click-through rate
- **Content briefs**: Analyze top-ranking pages and create comprehensive outlines
- **Internal linking suggestions**: Identify opportunities to link between your content
- **Schema markup**: Generate structured data for rich search results
- **Content refresh**: Identify outdated content and suggest updates

## Customer Research & Persona Development

### AI-Powered Customer Insights

Instead of spending weeks on market research, use AI to accelerate the process:

**Prompt for persona creation:**
"Based on these customer support tickets [paste samples], create a detailed buyer persona including:
- Demographics and job title
- Top 3 pain points
- Decision-making factors
- Preferred communication channels
- Common objections to purchasing
- Quotes that represent their mindset"

### Sentiment Analysis at Scale

AI can analyze thousands of customer reviews, social media mentions, and support tickets to identify:
- Overall sentiment trends over time
- Specific features customers love or hate
- Emerging complaints before they become crises
- Competitive positioning based on customer language

| Analysis Type | What It Reveals | Business Action |
|--------------|----------------|-----------------|
| Review sentiment | Product strengths/weaknesses | Prioritize product improvements |
| Social listening | Brand perception trends | Adjust messaging strategy |
| Support ticket analysis | Common pain points | Create self-service resources |
| Competitor reviews | Market gaps | Position against competitor weaknesses |

\`\`\`interactive
Create a marketing prompt for your business or a hypothetical product. Include: target audience, product benefits, desired tone, content format, and at least two specific constraints (word count, CTA style, etc.). Compare the output quality with and without these specifics.
\`\`\`

## Social Media & Email Marketing Automation

### AI Social Media Workflow

1. **Content ideation**: Generate 20 post ideas based on trending topics in your industry
2. **Copy creation**: Write platform-specific versions (LinkedIn professional, Twitter concise, Instagram visual)
3. **Hashtag research**: Generate relevant hashtags with estimated reach
4. **Scheduling**: Use AI to determine optimal posting times based on audience data
5. **Response management**: Draft replies to common comments and DMs

### Email Marketing with AI

| Task | AI Application | Impact |
|------|---------------|--------|
| Subject lines | Generate and A/B test multiple options | 20-40% higher open rates |
| Personalization | Dynamic content based on user behavior | 2-3x higher click rates |
| Send time optimization | Predict best time for each recipient | 15-25% more engagement |
| Segmentation | AI-driven audience clustering | More relevant messaging |
| Win-back campaigns | Predict churn and trigger re-engagement | Recover 5-15% of churning users |

## Competitive Analysis with AI

### The AI Competitive Intelligence Framework

**Step 1: Data Collection**
- Feed competitor websites, pricing pages, and feature lists to AI
- Analyze their job postings to understand strategic direction
- Review their customer reviews and social media presence

**Step 2: Analysis Prompts**
- "Compare these two pricing pages and identify the key differentiators"
- "Based on these job postings, what technology investments is [Competitor] making?"
- "Analyze these customer reviews and identify the top 5 complaints about [Competitor]"

**Step 3: Strategic Recommendations**
- "Based on this competitive analysis, suggest 3 positioning strategies for our product"
- "Identify market gaps that none of these competitors are addressing"

\`\`\`flashcard
How can AI help with competitive analysis?
---
AI can: (1) Analyze competitor websites, pricing, and features at scale, (2) Extract insights from customer reviews and social media, (3) Identify market gaps and positioning opportunities, (4) Monitor competitor job postings for strategic signals, (5) Generate actionable recommendations based on the analysis.
\`\`\`

## Measuring ROI of AI Adoption

### The AI ROI Framework

Track these metrics before and after AI adoption:

| Metric | How to Measure | Typical Improvement |
|--------|---------------|-------------------|
| **Time saved** | Hours per task before vs. after AI | 40-70% reduction |
| **Content output** | Pieces published per week | 2-5x increase |
| **Quality scores** | Engagement rates, conversion rates | 10-30% improvement |
| **Cost per piece** | Total cost / content pieces produced | 50-80% reduction |
| **Employee satisfaction** | Survey scores on tedious task reduction | Significant improvement |

### Common Pitfalls

- **Over-automation**: Removing the human touch from customer-facing content
- **Quality drift**: Not reviewing AI output leads to generic, bland content
- **Brand voice erosion**: AI defaults to generic tone without strong style guides
- **Data privacy**: Feeding customer data into public AI tools
- **Dependency**: Building workflows that break when AI tools change their APIs

> The companies winning with AI aren't the ones using it the most — they're the ones using it most strategically, with clear quality standards and human oversight at the right points.

## Summary

AI transforms business and marketing by accelerating content creation, deepening customer insights, automating repetitive tasks, and enabling competitive intelligence at scale. The key is strategic adoption: start with high-impact, low-risk use cases, measure results, and expand from there. Always maintain human oversight for brand voice, quality, and customer-facing communications.

Take the quiz to test your business AI knowledge!
`;


const CONTENT_INT5 = `# AI for Research & Data Analysis

AI is transforming how researchers, analysts, and knowledge workers extract insights from information. From summarizing hundreds of papers to analyzing complex datasets, AI tools can compress weeks of work into hours. This module teaches you how to leverage AI for research and data analysis — and how to avoid the pitfalls.

## AI-Powered Research Assistants

A new category of tools is purpose-built for research workflows:

| Tool | Best For | Key Feature |
|------|----------|-------------|
| **Perplexity AI** | General research with citations | Real-time web search + AI synthesis |
| **Elicit** | Academic paper discovery and analysis | Extracts claims, methods, and findings from papers |
| **Consensus** | Evidence-based answers from research | Searches 200M+ academic papers |
| **Semantic Scholar** | Academic literature discovery | AI-powered paper recommendations |
| **Scite.ai** | Citation analysis | Shows how papers cite each other (supporting/contrasting) |
| **Connected Papers** | Visual literature mapping | Graph visualization of related papers |
| **ChatGPT / Claude** | General analysis and synthesis | Long context for document analysis |

### How AI Research Tools Differ from Google

Traditional search gives you links. AI research tools give you synthesized answers with citations:

- **Google**: "Here are 10 pages about climate change effects on agriculture"
- **Perplexity**: "Climate change is projected to reduce global crop yields by 2-6% per decade (Source: IPCC 2023). The most affected crops are... [with inline citations]"

> AI research tools don't replace critical thinking — they accelerate the gathering phase so you can spend more time on analysis and synthesis.

\`\`\`flashcard
How do AI research tools differ from traditional search engines?
---
Traditional search returns links you must read yourself. AI research tools synthesize information across multiple sources, provide direct answers with citations, extract specific data points from papers, and can analyze relationships between findings. They accelerate gathering but still require human judgment for interpretation.
\`\`\`

## Literature Review with AI

### The AI-Assisted Literature Review Process

1. **Scope definition**: Use AI to refine your research question
   - "Help me narrow down 'AI in healthcare' to a specific, researchable question"

2. **Paper discovery**: Cast a wide net
   - Use Semantic Scholar or Elicit to find relevant papers
   - Ask AI: "Find the 20 most-cited papers on [topic] from the last 5 years"

3. **Screening**: Quickly assess relevance
   - Feed abstracts to AI: "Rate these 50 abstracts on relevance to [research question] on a scale of 1-5"

4. **Extraction**: Pull key information
   - "From this paper, extract: methodology, sample size, key findings, limitations, and how it relates to [your question]"

5. **Synthesis**: Connect the dots
   - "Based on these 15 paper summaries, identify: (a) areas of consensus, (b) contradictions, (c) gaps in the literature"

### Prompt Templates for Research

**Paper summarization:**
"Summarize this research paper in a structured format:
- Research question
- Methodology (study type, sample size, duration)
- Key findings (with specific numbers/statistics)
- Limitations acknowledged by the authors
- Implications for [your field]
Maximum 300 words."

**Cross-paper analysis:**
"I'm providing summaries of 5 papers on [topic]. For each pair of papers, identify:
1. Where they agree
2. Where they contradict
3. What one covers that the other doesn't
Present as a comparison matrix."

## AI for Data Analysis

### The Data Analysis Workflow

AI can assist at every stage of data analysis:

| Stage | AI Application | Example Prompt |
|-------|---------------|----------------|
| **Data cleaning** | Identify anomalies, suggest fixes | "Review this CSV and flag rows with missing values, outliers, or inconsistent formats" |
| **Exploration** | Generate summary statistics, spot patterns | "Describe this dataset: distributions, correlations, and interesting patterns" |
| **Visualization** | Generate chart code | "Create a Python matplotlib chart showing sales trends by region over time" |
| **Analysis** | Statistical tests, modeling | "What statistical test should I use to compare these two groups?" |
| **Interpretation** | Explain results in plain language | "Explain these regression results to a non-technical stakeholder" |
| **Reporting** | Generate narrative from data | "Write an executive summary of these quarterly metrics" |

### Using AI with Code for Data Analysis

AI coding assistants are particularly powerful for data work:

**Python + Pandas example prompt:**
"I have a CSV with columns: date, product_name, units_sold, revenue, region.
Write Python code using pandas to:
1. Load the CSV and handle missing values
2. Calculate monthly revenue by region
3. Find the top 5 products by total revenue
4. Create a pivot table of monthly revenue by product and region
5. Generate a line chart of revenue trends
Include comments explaining each step."

**SQL analysis prompt:**
"Write a SQL query that:
- Joins the orders and customers tables
- Calculates customer lifetime value (total spend)
- Segments customers into High/Medium/Low value tiers
- Shows the count and average order value per tier
- Orders by total spend descending"

\`\`\`interactive
Think of a dataset you work with (or a hypothetical one). Write a prompt asking AI to help you analyze it. Include: what the data contains, what question you want to answer, what format you want the output in, and any constraints (tools, libraries, visualization preferences).
\`\`\`

## Working with Documents and PDFs

### AI Document Analysis

Modern AI tools can process entire documents and extract structured information:

**Use cases:**
- **Contract review**: "Extract all obligations, deadlines, and penalty clauses from this contract"
- **Financial reports**: "Summarize the key metrics from this 10-K filing and compare to last year"
- **Technical documentation**: "Create a quick-reference guide from this 200-page API documentation"
- **Meeting transcripts**: "Extract action items, decisions made, and unresolved questions"

### Tips for Document Analysis

1. **Use models with large context windows**: Claude (200K tokens) or Gemini (1M tokens) for long documents
2. **Be specific about what to extract**: Don't just say "summarize" — specify exactly what information you need
3. **Process in sections**: For very long documents, analyze section by section and then synthesize
4. **Cross-reference**: Ask the AI to check for internal contradictions within the document
5. **Verify critical details**: Always verify numbers, dates, and specific claims against the source

\`\`\`flashcard
What's the best approach for analyzing long documents with AI?
---
(1) Use large-context models (Claude 200K, Gemini 1M tokens), (2) Be specific about what to extract rather than asking for generic summaries, (3) Process very long documents in sections then synthesize, (4) Ask AI to check for internal contradictions, (5) Always verify critical numbers and claims against the original source.
\`\`\`

## Evaluating AI-Generated Research

### The CRAAP Test for AI Outputs

Apply the same critical evaluation framework used for traditional sources:

| Criterion | Questions to Ask |
|-----------|-----------------|
| **Currency** | Is the AI's training data recent enough for this topic? |
| **Relevance** | Does the output actually address your specific question? |
| **Authority** | Are the cited sources credible? Do they actually exist? |
| **Accuracy** | Can you verify the key claims from the original sources? |
| **Purpose** | Is the AI presenting balanced information or showing bias? |

### Common AI Research Pitfalls

1. **Phantom citations**: AI may cite papers that don't exist — always verify
2. **Outdated information**: Training data has a cutoff date
3. **Oversimplification**: AI may miss nuances that experts would catch
4. **Confirmation bias**: AI tends to agree with the framing of your question
5. **Statistical errors**: AI can misinterpret or miscalculate statistics
6. **Missing context**: AI may not understand field-specific conventions

### Verification Checklist

Before using any AI-generated research finding:
- [ ] Verify the source exists (check DOI, URL, or title)
- [ ] Confirm the specific claim matches the original source
- [ ] Check if the statistic is current or outdated
- [ ] Look for contradicting evidence the AI may have missed
- [ ] Assess whether the AI's interpretation is reasonable

## Advanced Research Techniques

### Systematic Review Assistance

AI can help with the most rigorous form of literature review:

1. **PRISMA flow**: Use AI to help document your search and screening process
2. **Data extraction forms**: AI can populate standardized extraction templates
3. **Risk of bias assessment**: AI can flag potential bias indicators in studies
4. **Meta-analysis prep**: AI can help organize data for statistical synthesis

### Multi-Source Triangulation

For important findings, verify across multiple AI tools:
- Ask the same question to Perplexity, Claude, and ChatGPT
- Compare their answers and citations
- Where they agree, confidence is higher
- Where they disagree, dig deeper into the primary sources

> The best researchers use AI as a force multiplier, not a replacement for expertise. AI handles the volume; you provide the judgment.

\`\`\`flashcard
What is the CRAAP test and how does it apply to AI research outputs?
---
CRAAP stands for Currency, Relevance, Authority, Accuracy, and Purpose. Apply it to AI outputs by checking: Is the data current enough? Does it address your question? Are cited sources real and credible? Can claims be verified? Is the information balanced? This prevents relying on AI hallucinations or outdated information.
\`\`\`

## Summary

AI tools are transforming research and data analysis by accelerating literature discovery, enabling rapid document analysis, and making data exploration more accessible. The key skills are knowing which tool to use for each task, writing precise prompts that extract exactly what you need, and always verifying AI-generated findings against primary sources. AI handles the volume; you provide the critical thinking.

Take the quiz to test your research AI knowledge!
`;


// ─── QUIZ QUESTIONS ───

const QUESTIONS_INT1 = [
  { question_text: 'What is prompt chaining?', options: [{ text: 'Using multiple AI tools simultaneously', is_correct: false }, { text: 'Breaking a complex task into sequential simpler prompts where each output feeds the next', is_correct: true }, { text: 'Repeating the same prompt multiple times', is_correct: false }, { text: 'Connecting prompts with special syntax', is_correct: false }], explanation: 'Prompt chaining breaks complex tasks into a pipeline of simpler steps, where each step\'s output becomes the next step\'s input.', difficulty: 'easy', topic_tag: 'Prompt Chaining' },
  { question_text: 'Why does prompt chaining produce better results than a single complex prompt?', options: [{ text: 'It uses more tokens', is_correct: false }, { text: 'Each step is focused, errors don\'t compound, and you can review between steps', is_correct: true }, { text: 'It costs less money', is_correct: false }, { text: 'AI models prefer shorter prompts', is_correct: false }], explanation: 'Chaining keeps each step simple and focused, allows human review between steps, and prevents error accumulation.', difficulty: 'medium', topic_tag: 'Prompt Chaining' },
  { question_text: 'What is meta-prompting?', options: [{ text: 'Prompting about metadata', is_correct: false }, { text: 'Asking the AI to help you write or improve prompts', is_correct: true }, { text: 'Using prompts in a meta-analysis', is_correct: false }, { text: 'A deprecated prompting technique', is_correct: false }], explanation: 'Meta-prompting is asking the AI to critique, improve, or generate prompts — using AI to optimize your communication with AI.', difficulty: 'easy', topic_tag: 'Meta-Prompting' },
  { question_text: 'What is the "self-evaluation pattern" in meta-prompting?', options: [{ text: 'Having the AI grade student work', is_correct: false }, { text: 'Asking the AI to rate its own response and rewrite it addressing weaknesses', is_correct: true }, { text: 'Evaluating AI tools against each other', is_correct: false }, { text: 'A testing methodology for prompts', is_correct: false }], explanation: 'The self-evaluation pattern asks AI to critique its own output on specific criteria and then produce an improved version.', difficulty: 'medium', topic_tag: 'Meta-Prompting' },
  { question_text: 'What is the most important tip for getting reliable JSON output from AI?', options: [{ text: 'Use the longest possible prompt', is_correct: false }, { text: 'Show the exact schema with example values and validate the output', is_correct: true }, { text: 'Always use GPT-4', is_correct: false }, { text: 'Ask politely', is_correct: false }], explanation: 'Showing the exact schema, specifying edge cases, and always validating/parsing the output are key to reliable structured generation.', difficulty: 'medium', topic_tag: 'Structured Output' },
  { question_text: 'What is Tree-of-Thought (ToT) prompting?', options: [{ text: 'A nature-themed prompt style', is_correct: false }, { text: 'Exploring multiple reasoning paths simultaneously and selecting the best one', is_correct: true }, { text: 'A single linear chain of reasoning', is_correct: false }, { text: 'Asking the AI to draw a tree diagram', is_correct: false }], explanation: 'ToT asks the AI to consider multiple approaches, evaluate each, and select the best — producing more thorough analysis than single-path reasoning.', difficulty: 'hard', topic_tag: 'Advanced Reasoning' },
  { question_text: 'What is the self-consistency technique?', options: [{ text: 'Making sure your prompts are consistent', is_correct: false }, { text: 'Running the same prompt multiple times and looking for consensus in the answers', is_correct: true }, { text: 'Using the same AI model for all tasks', is_correct: false }, { text: 'A way to check grammar', is_correct: false }], explanation: 'Self-consistency runs the same problem through multiple reasoning paths and uses agreement between them as a signal of correctness.', difficulty: 'medium', topic_tag: 'Advanced Reasoning' },
  { question_text: 'What is Socratic prompting?', options: [{ text: 'Asking the AI to answer in ancient Greek', is_correct: false }, { text: 'Asking the AI to ask YOU clarifying questions before giving a solution', is_correct: true }, { text: 'A philosophy-focused prompt style', is_correct: false }, { text: 'Prompting with rhetorical questions', is_correct: false }], explanation: 'Socratic prompting reverses the dynamic — the AI asks you questions to surface assumptions and requirements before providing advice.', difficulty: 'easy', topic_tag: 'Advanced Reasoning' },
  { question_text: 'What does the "R" stand for in the CRISP prompt framework?', options: [{ text: 'Results', is_correct: false }, { text: 'Role', is_correct: true }, { text: 'Requirements', is_correct: false }, { text: 'Reasoning', is_correct: false }], explanation: 'CRISP stands for Context, Role, Instruction, Specifics, Purpose — a structured approach to writing effective prompts.', difficulty: 'easy', topic_tag: 'Prompt Frameworks' },
  { question_text: 'Why should you version your prompt templates?', options: [{ text: 'To increase the token count', is_correct: false }, { text: 'To track what works and iterate over time', is_correct: true }, { text: 'AI requires version numbers', is_correct: false }, { text: 'It\'s a legal requirement', is_correct: false }], explanation: 'Versioning templates lets you track improvements, compare results across versions, and build a library of proven prompts.', difficulty: 'easy', topic_tag: 'Prompt Templates' },
  { question_text: 'Which AI model is noted for having the largest context window?', options: [{ text: 'GPT-4 (128K tokens)', is_correct: false }, { text: 'Claude (200K tokens)', is_correct: false }, { text: 'Gemini (1M tokens)', is_correct: true }, { text: 'Mistral (32K tokens)', is_correct: false }], explanation: 'Gemini 1.5 Pro supports up to 1 million tokens, the largest context window among major models.', difficulty: 'medium', topic_tag: 'Model Comparison' },
  { question_text: 'What is the delimiter technique used for in prompts?', options: [{ text: 'To make prompts look prettier', is_correct: false }, { text: 'To clearly separate instructions from content the AI should process', is_correct: true }, { text: 'To limit the response length', is_correct: false }, { text: 'To encrypt the prompt', is_correct: false }], explanation: 'Delimiters (triple quotes, XML tags, dashes) prevent the AI from confusing your instructions with the content it should process.', difficulty: 'medium', topic_tag: 'Prompt Techniques' },
  { question_text: 'What is "constraint stacking"?', options: [{ text: 'Adding too many constraints causing the AI to fail', is_correct: false }, { text: 'Layering multiple specific constraints for precise control over output', is_correct: true }, { text: 'Stacking prompts on top of each other', is_correct: false }, { text: 'A memory management technique', is_correct: false }], explanation: 'Constraint stacking layers requirements like word count, tone, format, inclusions, and exclusions to precisely control AI output.', difficulty: 'medium', topic_tag: 'Prompt Techniques' },
  { question_text: 'When building a reusable prompt template, what should you use for variable parts?', options: [{ text: 'Random words', is_correct: false }, { text: 'Placeholders like {variable_name}', is_correct: true }, { text: 'Blank spaces', is_correct: false }, { text: 'Asterisks', is_correct: false }], explanation: 'Using clear placeholders like {role}, {topic}, {audience} makes templates reusable across different contexts.', difficulty: 'easy', topic_tag: 'Prompt Templates' },
  { question_text: 'Which model is noted for the strongest adherence to system prompts?', options: [{ text: 'GPT-4', is_correct: false }, { text: 'Claude', is_correct: true }, { text: 'Gemini', is_correct: false }, { text: 'They are all identical', is_correct: false }], explanation: 'Claude is noted for very strong adherence to system prompts and constraints, making it particularly good for structured tasks.', difficulty: 'hard', topic_tag: 'Model Comparison' },
  { question_text: 'What is the main advantage of the "prompt optimizer" meta-prompting pattern?', options: [{ text: 'It makes prompts shorter', is_correct: false }, { text: 'It uses AI expertise to identify gaps and improvements in your prompts', is_correct: true }, { text: 'It translates prompts to other languages', is_correct: false }, { text: 'It reduces API costs', is_correct: false }], explanation: 'The prompt optimizer pattern leverages the AI\'s understanding of what makes effective prompts to improve yours.', difficulty: 'medium', topic_tag: 'Meta-Prompting' },
  { question_text: 'What should you always do with AI-generated JSON before using it in code?', options: [{ text: 'Print it to the console', is_correct: false }, { text: 'Parse and validate it', is_correct: true }, { text: 'Send it directly to the database', is_correct: false }, { text: 'Convert it to XML first', is_correct: false }], explanation: 'AI-generated JSON can contain formatting errors, extra text, or invalid structures. Always parse and validate before use.', difficulty: 'easy', topic_tag: 'Structured Output' },
  { question_text: 'In a prompt chain for writing a research report, why is the final "review" step important?', options: [{ text: 'It makes the report longer', is_correct: false }, { text: 'It catches factual errors and flags claims needing verification', is_correct: true }, { text: 'It adds a bibliography automatically', is_correct: false }, { text: 'It\'s not important', is_correct: false }], explanation: 'A review step acts as quality control, catching hallucinations and flagging claims that need human verification.', difficulty: 'medium', topic_tag: 'Prompt Chaining' },
  { question_text: 'What is the key difference between Tree-of-Thought and Chain-of-Thought prompting?', options: [{ text: 'ToT is faster', is_correct: false }, { text: 'CoT follows one reasoning path; ToT explores multiple paths and compares them', is_correct: true }, { text: 'They are the same thing', is_correct: false }, { text: 'CoT is more advanced', is_correct: false }], explanation: 'Chain-of-Thought follows a single reasoning path step by step. Tree-of-Thought explores multiple paths simultaneously and selects the best.', difficulty: 'hard', topic_tag: 'Advanced Reasoning' },
  { question_text: 'What is the best approach when the same prompt gives different quality results across models?', options: [{ text: 'Only use one model', is_correct: false }, { text: 'Adapt your prompting technique to each model\'s strengths', is_correct: true }, { text: 'Use the cheapest model', is_correct: false }, { text: 'Add more words to the prompt', is_correct: false }], explanation: 'Different models respond differently to prompting techniques. The best approach is to learn each model\'s strengths and adapt accordingly.', difficulty: 'medium', topic_tag: 'Model Comparison' },
];


const QUESTIONS_INT2 = [
  { question_text: 'How do most AI video generators create videos from text?', options: [{ text: 'By stitching together stock footage clips', is_correct: false }, { text: 'Using diffusion models that generate frames from noise guided by text descriptions', is_correct: true }, { text: 'By recording real actors', is_correct: false }, { text: 'By converting text to animation scripts', is_correct: false }], explanation: 'Most AI video generators use diffusion-based models that start with noise and gradually denoise it into video frames matching the text prompt.', difficulty: 'medium', topic_tag: 'Video Generation' },
  { question_text: 'What is "temporal coherence" in AI video generation?', options: [{ text: 'The video plays at the right speed', is_correct: false }, { text: 'Objects, lighting, and physics stay consistent across frames', is_correct: true }, { text: 'The audio syncs with the video', is_correct: false }, { text: 'The video has a consistent color palette', is_correct: false }], explanation: 'Temporal coherence ensures that elements remain consistent from frame to frame, preventing flickering, morphing, or physics-breaking artifacts.', difficulty: 'medium', topic_tag: 'Video Generation' },
  { question_text: 'What makes video prompts different from image prompts?', options: [{ text: 'They need to be shorter', is_correct: false }, { text: 'They need motion descriptions, temporal flow, and camera directions', is_correct: true }, { text: 'They must be in a specific language', is_correct: false }, { text: 'There is no difference', is_correct: false }], explanation: 'Video prompts require motion, timing, camera movement, and pacing information that static image prompts don\'t need.', difficulty: 'easy', topic_tag: 'Video Prompting' },
  { question_text: 'Which AI video tool is known for the longest generation length (up to 120 seconds)?', options: [{ text: 'Runway Gen-3', is_correct: false }, { text: 'Pika', is_correct: false }, { text: 'Kling', is_correct: true }, { text: 'Luma Dream Machine', is_correct: false }], explanation: 'Kling by Kuaishou supports video generation up to 120 seconds, significantly longer than most competitors.', difficulty: 'medium', topic_tag: 'Video Tools' },
  { question_text: 'What is "inpainting" in the context of AI video editing?', options: [{ text: 'Adding paint effects to video', is_correct: false }, { text: 'Editing specific parts of an existing video while keeping the rest unchanged', is_correct: true }, { text: 'Converting video to paintings', is_correct: false }, { text: 'A video compression technique', is_correct: false }], explanation: 'Inpainting allows you to select and modify specific regions of a video frame (like removing objects or changing backgrounds) while preserving everything else.', difficulty: 'medium', topic_tag: 'Video Editing' },
  { question_text: 'What is voice cloning?', options: [{ text: 'Recording someone\'s voice multiple times', is_correct: false }, { text: 'Using AI to replicate a person\'s voice from sample audio', is_correct: true }, { text: 'Copying audio files', is_correct: false }, { text: 'A type of audio compression', is_correct: false }], explanation: 'Voice cloning uses AI to learn the characteristics of a person\'s voice from sample recordings and then generate new speech in that voice.', difficulty: 'easy', topic_tag: 'Audio AI' },
  { question_text: 'Which tool is best known for AI music generation with full vocals and lyrics?', options: [{ text: 'AIVA', is_correct: false }, { text: 'Mubert', is_correct: false }, { text: 'Suno', is_correct: true }, { text: 'Stable Audio', is_correct: false }], explanation: 'Suno can generate complete songs with vocals, lyrics, and instrumentation from text prompts.', difficulty: 'easy', topic_tag: 'Audio AI' },
  { question_text: 'What is the biggest ethical concern with voice cloning technology?', options: [{ text: 'It sounds too robotic', is_correct: false }, { text: 'Potential for fraud, impersonation, and non-consensual use', is_correct: true }, { text: 'It\'s too expensive', is_correct: false }, { text: 'It only works in English', is_correct: false }], explanation: 'Voice cloning can be used for phone scams, impersonation, and creating fake audio of real people without their consent.', difficulty: 'easy', topic_tag: 'AI Ethics' },
  { question_text: 'What is "speaker diarization"?', options: [{ text: 'Recording a speaker\'s diary', is_correct: false }, { text: 'Identifying who said what in multi-speaker recordings', is_correct: true }, { text: 'A type of microphone technology', is_correct: false }, { text: 'Converting speech to text', is_correct: false }], explanation: 'Speaker diarization segments audio by speaker, labeling which person said which parts of a conversation.', difficulty: 'medium', topic_tag: 'Audio AI' },
  { question_text: 'In a hybrid video production workflow, what role does AI typically play?', options: [{ text: 'It replaces all human involvement', is_correct: false }, { text: 'It generates clips for hard-to-film scenes and enhances real footage', is_correct: true }, { text: 'It only handles audio', is_correct: false }, { text: 'It writes the script only', is_correct: false }], explanation: 'Professional creators use AI for scenes that are difficult or expensive to film, while shooting real footage for scenes needing authenticity.', difficulty: 'medium', topic_tag: 'Video Production' },
  { question_text: 'What does AI video still commonly struggle with?', options: [{ text: 'Generating any video at all', is_correct: false }, { text: 'Hands, fingers, text rendering, and consistent characters across clips', is_correct: true }, { text: 'Color grading', is_correct: false }, { text: 'Audio synchronization', is_correct: false }], explanation: 'AI video generators still commonly produce artifacts with hands/fingers, struggle with text in scenes, and have difficulty maintaining character consistency.', difficulty: 'easy', topic_tag: 'Video Limitations' },
  { question_text: 'What is "frame interpolation" in AI video?', options: [{ text: 'Removing frames from video', is_correct: false }, { text: 'Creating smooth slow-motion by generating intermediate frames between existing ones', is_correct: true }, { text: 'Changing the frame rate', is_correct: false }, { text: 'Adding borders to video frames', is_correct: false }], explanation: 'Frame interpolation uses AI to generate new frames between existing ones, creating smooth slow-motion from standard footage.', difficulty: 'medium', topic_tag: 'Video Editing' },
  { question_text: 'Which tool is recommended for commercially-safe AI images due to being trained on licensed content?', options: [{ text: 'Stable Diffusion', is_correct: false }, { text: 'Midjourney', is_correct: false }, { text: 'Adobe Firefly', is_correct: true }, { text: 'DALL-E 3', is_correct: false }], explanation: 'Adobe Firefly is trained on Adobe Stock and licensed content, making it safer for commercial use regarding copyright.', difficulty: 'medium', topic_tag: 'AI Ethics' },
  { question_text: 'What is Whisper primarily used for?', options: [{ text: 'Voice cloning', is_correct: false }, { text: 'Music generation', is_correct: false }, { text: 'Speech-to-text transcription', is_correct: true }, { text: 'Video generation', is_correct: false }], explanation: 'Whisper is OpenAI\'s open-source speech recognition model, widely used for accurate audio transcription.', difficulty: 'easy', topic_tag: 'Audio AI' },
  { question_text: 'What should you always do when sharing AI-generated video content?', options: [{ text: 'Add a watermark', is_correct: false }, { text: 'Disclose that it is AI-generated, especially if it could be mistaken for real footage', is_correct: true }, { text: 'Convert it to a lower resolution', is_correct: false }, { text: 'Nothing special is needed', is_correct: false }], explanation: 'Transparency about AI-generated content is essential to prevent misinformation and maintain trust.', difficulty: 'easy', topic_tag: 'AI Ethics' },
  { question_text: 'What is "lip sync" in AI video tools?', options: [{ text: 'Adding subtitles to video', is_correct: false }, { text: 'Matching mouth movements to a different audio track', is_correct: true }, { text: 'Synchronizing multiple video tracks', is_correct: false }, { text: 'A type of video compression', is_correct: false }], explanation: 'AI lip sync technology modifies mouth movements in video to match a different audio track, useful for dubbing and localization.', difficulty: 'easy', topic_tag: 'Video Editing' },
  { question_text: 'Which approach to AI video generation processes video as sequences of tokens?', options: [{ text: 'Diffusion-based models', is_correct: false }, { text: 'Transformer-based models', is_correct: true }, { text: 'GAN-based models', is_correct: false }, { text: 'Rule-based models', is_correct: false }], explanation: 'Transformer-based video models process video as sequences of tokens, similar to how LLMs process text.', difficulty: 'hard', topic_tag: 'Video Generation' },
  { question_text: 'What is the purpose of a "seed" number in AI generation?', options: [{ text: 'To plant ideas in the AI', is_correct: false }, { text: 'To reproduce or create variations of a specific result', is_correct: true }, { text: 'To limit the output length', is_correct: false }, { text: 'To authenticate the user', is_correct: false }], explanation: 'A seed number controls the randomness. Same prompt + same seed = same result. Different seed = variation on the theme.', difficulty: 'medium', topic_tag: 'AI Techniques' },
  { question_text: 'What is "outpainting" in AI image/video editing?', options: [{ text: 'Removing the outer edges of an image', is_correct: false }, { text: 'Extending an image or video beyond its original borders', is_correct: true }, { text: 'Painting over mistakes', is_correct: false }, { text: 'Exporting to an external tool', is_correct: false }], explanation: 'Outpainting uses AI to generate new content that extends an image or video beyond its original boundaries.', difficulty: 'medium', topic_tag: 'AI Techniques' },
  { question_text: 'What is the recommended approach for creating a short explainer video with AI?', options: [{ text: 'Generate the entire video in one prompt', is_correct: false }, { text: 'Use a pipeline: script (LLM) → voiceover (TTS) → visuals (video AI) → music (audio AI) → edit', is_correct: true }, { text: 'Only use one AI tool for everything', is_correct: false }, { text: 'Record everything manually and use AI for subtitles only', is_correct: false }], explanation: 'A multi-tool pipeline leverages each AI tool\'s strengths: LLMs for scripts, TTS for voice, video AI for visuals, and audio AI for music.', difficulty: 'medium', topic_tag: 'Video Production' },
];


const QUESTIONS_INT3 = [
  { question_text: 'What is the main benefit of chaining AI tools into workflows?', options: [{ text: 'It looks more impressive', is_correct: false }, { text: 'Complex multi-step tasks can be automated with minimal human intervention', is_correct: true }, { text: 'It reduces the cost of AI tools', is_correct: false }, { text: 'It makes AI more accurate', is_correct: false }], explanation: 'AI workflows connect multiple tools into pipelines that handle complex tasks end-to-end, with human oversight at key checkpoints.', difficulty: 'easy', topic_tag: 'AI Workflows' },
  { question_text: 'Which platform is best for simple automations with the most app integrations?', options: [{ text: 'n8n', is_correct: false }, { text: 'Langflow', is_correct: false }, { text: 'Zapier', is_correct: true }, { text: 'Relevance AI', is_correct: false }], explanation: 'Zapier offers the simplest interface and integrates with over 6,000 apps, making it ideal for straightforward automations.', difficulty: 'easy', topic_tag: 'Automation Platforms' },
  { question_text: 'What is the key difference between an AI workflow and an AI agent?', options: [{ text: 'Workflows are more expensive', is_correct: false }, { text: 'Workflows follow fixed steps; agents dynamically decide their next action based on results', is_correct: true }, { text: 'Agents are simpler than workflows', is_correct: false }, { text: 'There is no difference', is_correct: false }], explanation: 'Workflows execute pre-defined sequences. Agents can plan, adapt, and choose tools dynamically based on intermediate results.', difficulty: 'medium', topic_tag: 'AI Agents' },
  { question_text: 'What does RAG stand for?', options: [{ text: 'Random Access Generation', is_correct: false }, { text: 'Retrieval-Augmented Generation', is_correct: true }, { text: 'Rapid AI Growth', is_correct: false }, { text: 'Recursive Algorithm Generation', is_correct: false }], explanation: 'RAG stands for Retrieval-Augmented Generation — combining information retrieval with AI text generation.', difficulty: 'easy', topic_tag: 'RAG' },
  { question_text: 'How does RAG reduce AI hallucinations?', options: [{ text: 'By using a faster model', is_correct: false }, { text: 'By grounding AI responses in actual retrieved documents rather than just training data', is_correct: true }, { text: 'By limiting response length', is_correct: false }, { text: 'By using multiple models', is_correct: false }], explanation: 'RAG retrieves relevant documents and provides them as context, so the AI generates answers based on actual sources rather than guessing.', difficulty: 'medium', topic_tag: 'RAG' },
  { question_text: 'What is a vector database used for in RAG systems?', options: [{ text: 'Storing images', is_correct: false }, { text: 'Storing numerical representations (embeddings) of documents for similarity search', is_correct: true }, { text: 'Running SQL queries', is_correct: false }, { text: 'Hosting websites', is_correct: false }], explanation: 'Vector databases store document embeddings and enable fast similarity search to find the most relevant chunks for a given query.', difficulty: 'medium', topic_tag: 'RAG' },
  { question_text: 'What is the ReAct pattern in AI agents?', options: [{ text: 'A JavaScript framework', is_correct: false }, { text: 'A cycle of Reasoning (thinking) and Acting (using tools), then observing results', is_correct: true }, { text: 'A way to make AI respond faster', is_correct: false }, { text: 'A user interface pattern', is_correct: false }], explanation: 'ReAct (Reasoning + Acting) is an agent pattern where the AI thinks about what to do, takes an action, observes the result, and repeats.', difficulty: 'medium', topic_tag: 'AI Agents' },
  { question_text: 'Which framework enables multi-agent collaboration with specialized roles?', options: [{ text: 'Zapier', is_correct: false }, { text: 'CrewAI', is_correct: true }, { text: 'Make', is_correct: false }, { text: 'Stable Diffusion', is_correct: false }], explanation: 'CrewAI enables multi-agent systems where different agents have specialized roles (researcher, writer, editor) and collaborate on tasks.', difficulty: 'medium', topic_tag: 'AI Agents' },
  { question_text: 'When should you keep humans in the loop rather than fully automating?', options: [{ text: 'Always — never automate anything', is_correct: false }, { text: 'When outputs are customer-facing, high-stakes, or require empathy and nuanced judgment', is_correct: true }, { text: 'Only when the AI is broken', is_correct: false }, { text: 'Never — full automation is always better', is_correct: false }], explanation: 'Human oversight is critical for customer-facing content, high-stakes decisions, and situations requiring empathy or nuanced judgment.', difficulty: 'easy', topic_tag: 'Automation Best Practices' },
  { question_text: 'What is the "human checkpoint" pattern?', options: [{ text: 'A security authentication step', is_correct: false }, { text: 'Strategic points in an AI workflow where a human reviews before the process continues', is_correct: true }, { text: 'A way to pause AI generation', is_correct: false }, { text: 'A testing methodology', is_correct: false }], explanation: 'Human checkpoints are built into workflows at critical points where human review ensures quality before the AI continues.', difficulty: 'easy', topic_tag: 'Automation Best Practices' },
  { question_text: 'What security concern does "prompt injection" pose in AI workflows?', options: [{ text: 'It slows down the workflow', is_correct: false }, { text: 'Malicious inputs could hijack the AI steps to perform unintended actions', is_correct: true }, { text: 'It increases API costs', is_correct: false }, { text: 'It causes the AI to crash', is_correct: false }], explanation: 'In automated workflows, malicious user inputs could manipulate AI steps to bypass rules, leak data, or perform unauthorized actions.', difficulty: 'hard', topic_tag: 'Security' },
  { question_text: 'What is the first step in the RAG process?', options: [{ text: 'Generate an answer', is_correct: false }, { text: 'Index documents by splitting them into chunks and converting to vector embeddings', is_correct: true }, { text: 'Ask the user a question', is_correct: false }, { text: 'Train a new model', is_correct: false }], explanation: 'RAG starts by indexing: documents are split into chunks, converted to numerical vectors (embeddings), and stored in a vector database.', difficulty: 'medium', topic_tag: 'RAG' },
  { question_text: 'Which is NOT a popular vector database for RAG?', options: [{ text: 'Pinecone', is_correct: false }, { text: 'ChromaDB', is_correct: false }, { text: 'MySQL', is_correct: true }, { text: 'Weaviate', is_correct: false }], explanation: 'MySQL is a traditional relational database. Pinecone, ChromaDB, and Weaviate are purpose-built vector databases for embedding storage and similarity search.', difficulty: 'medium', topic_tag: 'RAG' },
  { question_text: 'What should you never do with API keys in AI workflows?', options: [{ text: 'Store them in environment variables', is_correct: false }, { text: 'Hardcode them directly in your code or workflow configuration', is_correct: true }, { text: 'Use a secret manager', is_correct: false }, { text: 'Rotate them periodically', is_correct: false }], explanation: 'Hardcoding API keys is a major security risk. Always use environment variables or secret managers.', difficulty: 'easy', topic_tag: 'Security' },
  { question_text: 'Which no-code platform is best for self-hosted, developer-friendly AI workflows?', options: [{ text: 'Zapier', is_correct: false }, { text: 'Make', is_correct: false }, { text: 'n8n', is_correct: true }, { text: 'Relevance AI', is_correct: false }], explanation: 'n8n is open-source and can be self-hosted, giving developers full control over their automation infrastructure.', difficulty: 'easy', topic_tag: 'Automation Platforms' },
  { question_text: 'What is a good use case for RAG?', options: [{ text: 'Generating random images', is_correct: false }, { text: 'A customer support bot that answers questions based on your company\'s help documentation', is_correct: true }, { text: 'Playing music', is_correct: false }, { text: 'Sending emails', is_correct: false }], explanation: 'RAG is ideal for Q&A systems grounded in specific documents, like support bots that reference your actual help docs.', difficulty: 'easy', topic_tag: 'RAG' },
  { question_text: 'What advantage does RAG have over fine-tuning a model?', options: [{ text: 'RAG is always faster', is_correct: false }, { text: 'You can update the knowledge base without retraining the model', is_correct: true }, { text: 'RAG produces shorter responses', is_correct: false }, { text: 'RAG doesn\'t require any AI model', is_correct: false }], explanation: 'With RAG, you simply update the document index when information changes. Fine-tuning requires expensive retraining.', difficulty: 'hard', topic_tag: 'RAG' },
  { question_text: 'When is full automation appropriate?', options: [{ text: 'For all tasks', is_correct: false }, { text: 'When tasks are repetitive, well-defined, and errors are low-cost and reversible', is_correct: true }, { text: 'Only for internal tasks', is_correct: false }, { text: 'Never', is_correct: false }], explanation: 'Full automation works best for repetitive, well-defined tasks where mistakes are cheap to fix and speed matters more than perfection.', difficulty: 'easy', topic_tag: 'Automation Best Practices' },
  { question_text: 'What does "audit logging" mean in the context of AI workflows?', options: [{ text: 'Logging into an audit system', is_correct: false }, { text: 'Tracking what your AI workflows do for accountability and debugging', is_correct: true }, { text: 'Auditing the AI model\'s training data', is_correct: false }, { text: 'Logging user complaints', is_correct: false }], explanation: 'Audit logging records the actions taken by AI workflows, enabling accountability, debugging, and compliance.', difficulty: 'medium', topic_tag: 'Security' },
  { question_text: 'What is LangChain primarily used for?', options: [{ text: 'Language translation', is_correct: false }, { text: 'Building custom AI agents and chains with tool access', is_correct: true }, { text: 'Social media management', is_correct: false }, { text: 'Image generation', is_correct: false }], explanation: 'LangChain is a developer framework for building custom AI agents and chains that can use tools, access data, and reason about tasks.', difficulty: 'medium', topic_tag: 'AI Agents' },
];


const QUESTIONS_INT4 = [
  { question_text: 'What does the AIDA framework stand for in marketing?', options: [{ text: 'Artificial Intelligence Data Analysis', is_correct: false }, { text: 'Attention, Interest, Desire, Action', is_correct: true }, { text: 'Automated Intelligent Digital Advertising', is_correct: false }, { text: 'Analysis, Implementation, Design, Assessment', is_correct: false }], explanation: 'AIDA is a classic marketing framework: Attention (hook), Interest (problem), Desire (solution benefits), Action (CTA).', difficulty: 'easy', topic_tag: 'Marketing Frameworks' },
  { question_text: 'What is the primary benefit of using AI for content marketing?', options: [{ text: 'It eliminates the need for a marketing team', is_correct: false }, { text: 'It accelerates content creation while maintaining quality with human oversight', is_correct: true }, { text: 'AI content always ranks #1 on Google', is_correct: false }, { text: 'It\'s completely free', is_correct: false }], explanation: 'AI accelerates content production but still requires human oversight for brand voice, accuracy, and strategic direction.', difficulty: 'easy', topic_tag: 'Content Marketing' },
  { question_text: 'How can AI help with SEO content optimization?', options: [{ text: 'It automatically ranks your pages higher', is_correct: false }, { text: 'It can generate title tags, meta descriptions, content briefs, and internal linking suggestions', is_correct: true }, { text: 'It replaces Google\'s algorithm', is_correct: false }, { text: 'It only helps with keyword research', is_correct: false }], explanation: 'AI assists with multiple SEO tasks: title optimization, meta descriptions, content briefs based on top-ranking pages, and identifying linking opportunities.', difficulty: 'medium', topic_tag: 'SEO' },
  { question_text: 'What is sentiment analysis used for in business?', options: [{ text: 'Analyzing the sentiment of AI models', is_correct: false }, { text: 'Understanding customer opinions and emotions from reviews, social media, and support tickets', is_correct: true }, { text: 'Measuring employee productivity', is_correct: false }, { text: 'Predicting stock prices', is_correct: false }], explanation: 'Sentiment analysis uses AI to classify text as positive, negative, or neutral, revealing customer opinions at scale.', difficulty: 'easy', topic_tag: 'Customer Insights' },
  { question_text: 'What is a common pitfall of over-automating marketing with AI?', options: [{ text: 'Saving too much time', is_correct: false }, { text: 'Losing the human touch and producing generic, bland content', is_correct: true }, { text: 'Getting too many customers', is_correct: false }, { text: 'Reducing costs too much', is_correct: false }], explanation: 'Over-automation can strip away brand personality and human connection, resulting in generic content that doesn\'t resonate.', difficulty: 'medium', topic_tag: 'AI Pitfalls' },
  { question_text: 'How can AI help with competitive analysis?', options: [{ text: 'It can hack competitor websites', is_correct: false }, { text: 'It can analyze competitor content, pricing, reviews, and job postings to identify strategic insights', is_correct: true }, { text: 'It can copy competitor products', is_correct: false }, { text: 'It can only compare prices', is_correct: false }], explanation: 'AI can process large amounts of competitor data — websites, reviews, social media, job postings — to surface strategic insights.', difficulty: 'medium', topic_tag: 'Competitive Analysis' },
  { question_text: 'What metric typically improves 20-40% when using AI for email subject lines?', options: [{ text: 'Unsubscribe rate', is_correct: false }, { text: 'Open rates', is_correct: true }, { text: 'Bounce rate', is_correct: false }, { text: 'Spam score', is_correct: false }], explanation: 'AI-generated and A/B tested subject lines typically improve email open rates by 20-40%.', difficulty: 'medium', topic_tag: 'Email Marketing' },
  { question_text: 'What is the AI ROI framework\'s "time saved" metric?', options: [{ text: 'How fast the AI responds', is_correct: false }, { text: 'Hours per task before vs. after AI adoption', is_correct: true }, { text: 'Time to install AI tools', is_correct: false }, { text: 'AI model training time', is_correct: false }], explanation: 'Measuring hours spent on tasks before and after AI adoption quantifies the productivity improvement.', difficulty: 'easy', topic_tag: 'ROI Measurement' },
  { question_text: 'What is "brand voice erosion" in the context of AI marketing?', options: [{ text: 'When your brand logo fades', is_correct: false }, { text: 'When AI-generated content defaults to a generic tone that doesn\'t match your brand', is_correct: true }, { text: 'When customers forget your brand', is_correct: false }, { text: 'When competitors copy your brand', is_correct: false }], explanation: 'Without strong style guides, AI tends to produce generic content that dilutes your unique brand voice over time.', difficulty: 'medium', topic_tag: 'AI Pitfalls' },
  { question_text: 'How can analyzing competitor job postings help with competitive intelligence?', options: [{ text: 'It helps you recruit their employees', is_correct: false }, { text: 'Job postings reveal technology investments and strategic direction', is_correct: true }, { text: 'It shows their revenue', is_correct: false }, { text: 'It has no value', is_correct: false }], explanation: 'Job postings reveal what technologies, skills, and capabilities a competitor is investing in, signaling strategic direction.', difficulty: 'hard', topic_tag: 'Competitive Analysis' },
  { question_text: 'What is the typical content output improvement when adopting AI for marketing?', options: [{ text: '10% increase', is_correct: false }, { text: '2-5x increase in pieces published', is_correct: true }, { text: '100x increase', is_correct: false }, { text: 'No measurable change', is_correct: false }], explanation: 'Companies typically see a 2-5x increase in content output when strategically adopting AI for content creation.', difficulty: 'medium', topic_tag: 'ROI Measurement' },
  { question_text: 'What should you always maintain when using AI for customer-facing content?', options: [{ text: 'Maximum automation', is_correct: false }, { text: 'Human oversight for brand voice, quality, and accuracy', is_correct: true }, { text: 'The lowest possible cost', is_correct: false }, { text: 'The longest possible content', is_correct: false }], explanation: 'Customer-facing content requires human review to ensure brand consistency, accuracy, and appropriate tone.', difficulty: 'easy', topic_tag: 'AI Best Practices' },
  { question_text: 'What is the best approach to starting AI adoption in a business?', options: [{ text: 'Automate everything at once', is_correct: false }, { text: 'Start with high-impact, low-risk use cases, measure results, and expand', is_correct: true }, { text: 'Wait until AI is perfect', is_correct: false }, { text: 'Only use free tools', is_correct: false }], explanation: 'Strategic adoption starts small with measurable use cases, proves value, and then scales to more complex applications.', difficulty: 'easy', topic_tag: 'AI Strategy' },
  { question_text: 'How can AI help with customer persona development?', options: [{ text: 'It creates fictional customers', is_correct: false }, { text: 'It analyzes support tickets, reviews, and data to build data-driven personas', is_correct: true }, { text: 'It replaces customer research entirely', is_correct: false }, { text: 'It only works for B2C companies', is_correct: false }], explanation: 'AI can analyze real customer data (support tickets, reviews, behavior) to create evidence-based personas rather than assumptions.', difficulty: 'medium', topic_tag: 'Customer Insights' },
  { question_text: 'What is "send time optimization" in AI email marketing?', options: [{ text: 'Sending all emails at 9 AM', is_correct: false }, { text: 'AI predicts the best time to send emails to each individual recipient', is_correct: true }, { text: 'Scheduling emails in advance', is_correct: false }, { text: 'Sending emails faster', is_correct: false }], explanation: 'AI analyzes individual recipient behavior patterns to predict when each person is most likely to open and engage with emails.', difficulty: 'medium', topic_tag: 'Email Marketing' },
  { question_text: 'What data privacy concern should you consider when using AI for marketing?', options: [{ text: 'AI tools are always private', is_correct: false }, { text: 'Feeding customer data into public AI tools may violate privacy policies', is_correct: true }, { text: 'There are no privacy concerns', is_correct: false }, { text: 'Only European companies need to worry', is_correct: false }], explanation: 'Sharing customer data with public AI tools may violate privacy regulations (GDPR, CCPA) and your own privacy policy.', difficulty: 'medium', topic_tag: 'AI Ethics' },
  { question_text: 'What is the purpose of AI-powered A/B testing for landing pages?', options: [{ text: 'To make pages load faster', is_correct: false }, { text: 'To automatically test and optimize different page variations for higher conversion', is_correct: true }, { text: 'To create backup pages', is_correct: false }, { text: 'To translate pages', is_correct: false }], explanation: 'AI-powered A/B testing automatically generates and tests page variations, optimizing for conversion rates.', difficulty: 'easy', topic_tag: 'Conversion Optimization' },
  { question_text: 'What is "quality drift" in AI content marketing?', options: [{ text: 'When AI models get updated', is_correct: false }, { text: 'Gradual decline in content quality when AI output isn\'t regularly reviewed by humans', is_correct: true }, { text: 'When content becomes too high quality', is_correct: false }, { text: 'A type of SEO penalty', is_correct: false }], explanation: 'Without regular human review, AI-generated content can gradually become more generic and lower quality over time.', difficulty: 'medium', topic_tag: 'AI Pitfalls' },
  { question_text: 'Which funnel stage benefits from AI chatbots and product recommendations?', options: [{ text: 'Awareness', is_correct: false }, { text: 'Consideration', is_correct: true }, { text: 'Retention only', is_correct: false }, { text: 'None of them', is_correct: false }], explanation: 'The consideration stage benefits from AI chatbots that answer questions and recommendation engines that suggest relevant products.', difficulty: 'medium', topic_tag: 'Marketing Frameworks' },
  { question_text: 'What is the typical cost reduction per content piece when using AI?', options: [{ text: '5-10%', is_correct: false }, { text: '50-80%', is_correct: true }, { text: '100%', is_correct: false }, { text: 'AI increases costs', is_correct: false }], explanation: 'Companies typically see a 50-80% reduction in cost per content piece when incorporating AI into their content workflow.', difficulty: 'medium', topic_tag: 'ROI Measurement' },
];


const QUESTIONS_INT5 = [
  { question_text: 'How do AI research tools like Perplexity differ from traditional search engines?', options: [{ text: 'They are faster', is_correct: false }, { text: 'They synthesize information across sources and provide direct answers with citations', is_correct: true }, { text: 'They only search academic papers', is_correct: false }, { text: 'They don\'t use the internet', is_correct: false }], explanation: 'AI research tools synthesize information from multiple sources into direct answers with inline citations, rather than just returning links.', difficulty: 'easy', topic_tag: 'Research Tools' },
  { question_text: 'What is Elicit primarily designed for?', options: [{ text: 'Social media research', is_correct: false }, { text: 'Academic paper discovery, extracting claims, methods, and findings', is_correct: true }, { text: 'Market research', is_correct: false }, { text: 'Data visualization', is_correct: false }], explanation: 'Elicit is purpose-built for academic research, helping users find papers and extract structured information from them.', difficulty: 'easy', topic_tag: 'Research Tools' },
  { question_text: 'What is the first step in an AI-assisted literature review?', options: [{ text: 'Write the final paper', is_correct: false }, { text: 'Define and refine your research question using AI', is_correct: true }, { text: 'Download all papers on the topic', is_correct: false }, { text: 'Ask AI to write the review', is_correct: false }], explanation: 'Starting with a well-defined research question ensures your literature search is focused and productive.', difficulty: 'easy', topic_tag: 'Literature Review' },
  { question_text: 'What is "phantom citation" in AI research?', options: [{ text: 'A citation from a ghost writer', is_correct: false }, { text: 'When AI cites papers or sources that don\'t actually exist', is_correct: true }, { text: 'A citation that appears and disappears', is_correct: false }, { text: 'An anonymous citation', is_correct: false }], explanation: 'AI models can generate convincing but completely fabricated citations — papers with plausible titles, authors, and journals that don\'t exist.', difficulty: 'medium', topic_tag: 'AI Limitations' },
  { question_text: 'What does the "A" in the CRAAP test stand for?', options: [{ text: 'Automation', is_correct: false }, { text: 'Authority and Accuracy (both are separate criteria)', is_correct: true }, { text: 'Artificial', is_correct: false }, { text: 'Analysis', is_correct: false }], explanation: 'CRAAP stands for Currency, Relevance, Authority, Accuracy, Purpose — Authority and Accuracy are the two A\'s.', difficulty: 'medium', topic_tag: 'Research Evaluation' },
  { question_text: 'Which AI model has the largest context window for analyzing long documents?', options: [{ text: 'GPT-4 (128K tokens)', is_correct: false }, { text: 'Claude (200K tokens)', is_correct: false }, { text: 'Gemini (1M tokens)', is_correct: true }, { text: 'Mistral (32K tokens)', is_correct: false }], explanation: 'Gemini 1.5 Pro supports up to 1 million tokens, making it ideal for analyzing very long documents.', difficulty: 'easy', topic_tag: 'AI Tools' },
  { question_text: 'What is "multi-source triangulation" in AI research?', options: [{ text: 'Using three AI tools at once', is_correct: false }, { text: 'Verifying findings by asking the same question to multiple AI tools and comparing answers', is_correct: true }, { text: 'A mathematical technique', is_correct: false }, { text: 'Combining three datasets', is_correct: false }], explanation: 'Triangulation means checking AI findings across multiple tools. Where they agree, confidence is higher; where they disagree, deeper investigation is needed.', difficulty: 'medium', topic_tag: 'Research Methods' },
  { question_text: 'What should you always do before using an AI-generated research finding?', options: [{ text: 'Share it immediately', is_correct: false }, { text: 'Verify the source exists and the specific claim matches the original', is_correct: true }, { text: 'Convert it to a different format', is_correct: false }, { text: 'Nothing — AI research is always accurate', is_correct: false }], explanation: 'Always verify that cited sources exist, claims match the originals, and statistics are current before using AI-generated research.', difficulty: 'easy', topic_tag: 'Research Evaluation' },
  { question_text: 'How can AI help with data cleaning?', options: [{ text: 'It automatically deletes all data', is_correct: false }, { text: 'It can identify anomalies, missing values, outliers, and inconsistent formats', is_correct: true }, { text: 'It only works with spreadsheets', is_correct: false }, { text: 'It replaces the need for databases', is_correct: false }], explanation: 'AI can scan datasets to flag missing values, detect outliers, identify format inconsistencies, and suggest corrections.', difficulty: 'easy', topic_tag: 'Data Analysis' },
  { question_text: 'What is the best approach for analyzing very long documents with AI?', options: [{ text: 'Paste the entire document and ask for a summary', is_correct: false }, { text: 'Process in sections, then synthesize the section analyses', is_correct: true }, { text: 'Only read the first page', is_correct: false }, { text: 'Convert to audio first', is_correct: false }], explanation: 'For very long documents, analyzing section by section and then synthesizing produces more thorough and accurate results.', difficulty: 'medium', topic_tag: 'Document Analysis' },
  { question_text: 'What is Scite.ai primarily used for?', options: [{ text: 'Writing papers', is_correct: false }, { text: 'Showing how papers cite each other — whether supporting or contrasting', is_correct: true }, { text: 'Generating data', is_correct: false }, { text: 'Translating research', is_correct: false }], explanation: 'Scite.ai analyzes citation context, showing whether a paper\'s citations support, contrast, or merely mention the cited work.', difficulty: 'medium', topic_tag: 'Research Tools' },
  { question_text: 'What is "confirmation bias" in AI research outputs?', options: [{ text: 'The AI confirms your identity', is_correct: false }, { text: 'AI tends to agree with the framing of your question rather than challenge it', is_correct: true }, { text: 'The AI asks for confirmation before responding', is_correct: false }, { text: 'A type of data validation', is_correct: false }], explanation: 'AI models tend to agree with the assumptions embedded in your question, potentially reinforcing your existing beliefs rather than challenging them.', difficulty: 'medium', topic_tag: 'AI Limitations' },
  { question_text: 'What type of prompt is best for extracting structured information from a research paper?', options: [{ text: 'A vague request like "tell me about this paper"', is_correct: false }, { text: 'A structured template specifying exactly what to extract (methodology, sample size, findings, limitations)', is_correct: true }, { text: 'A single-word prompt', is_correct: false }, { text: 'Asking the AI to rewrite the paper', is_correct: false }], explanation: 'Structured extraction templates with specific fields produce consistent, comparable results across multiple papers.', difficulty: 'easy', topic_tag: 'Research Methods' },
  { question_text: 'How can AI assist with systematic reviews?', options: [{ text: 'It can write the entire review automatically', is_correct: false }, { text: 'It can help with screening, data extraction, and risk of bias assessment', is_correct: true }, { text: 'It replaces the need for a review protocol', is_correct: false }, { text: 'It only helps with the bibliography', is_correct: false }], explanation: 'AI can accelerate systematic review steps like abstract screening, data extraction into standardized forms, and flagging potential bias.', difficulty: 'hard', topic_tag: 'Literature Review' },
  { question_text: 'What is Connected Papers used for?', options: [{ text: 'Connecting to the internet', is_correct: false }, { text: 'Visual graph-based exploration of related academic papers', is_correct: true }, { text: 'Connecting authors to publishers', is_correct: false }, { text: 'Social networking for researchers', is_correct: false }], explanation: 'Connected Papers creates visual graphs showing how papers relate to each other, helping researchers discover relevant literature.', difficulty: 'easy', topic_tag: 'Research Tools' },
  { question_text: 'Why might AI misinterpret statistics from research papers?', options: [{ text: 'AI can\'t read numbers', is_correct: false }, { text: 'AI may not understand field-specific conventions, context, or statistical nuances', is_correct: true }, { text: 'Statistics are always wrong', is_correct: false }, { text: 'AI only works with whole numbers', is_correct: false }], explanation: 'AI may miss field-specific conventions, misinterpret confidence intervals, or confuse correlation with causation.', difficulty: 'hard', topic_tag: 'AI Limitations' },
  { question_text: 'What is the best way to use AI for data visualization?', options: [{ text: 'Let AI choose the chart type automatically', is_correct: false }, { text: 'Describe your data and analysis goal, then ask AI to generate visualization code with specific requirements', is_correct: true }, { text: 'Only use AI for pie charts', is_correct: false }, { text: 'Avoid AI for visualization entirely', is_correct: false }], explanation: 'Providing context about your data, analysis goal, and specific visualization requirements produces the most useful chart code.', difficulty: 'medium', topic_tag: 'Data Analysis' },
  { question_text: 'What is the Consensus AI tool designed for?', options: [{ text: 'Building consensus in teams', is_correct: false }, { text: 'Providing evidence-based answers by searching 200M+ academic papers', is_correct: true }, { text: 'Consensus algorithms in blockchain', is_correct: false }, { text: 'Survey creation', is_correct: false }], explanation: 'Consensus searches over 200 million academic papers to provide evidence-based answers to research questions.', difficulty: 'easy', topic_tag: 'Research Tools' },
  { question_text: 'What should you check first when AI provides a citation?', options: [{ text: 'The font size', is_correct: false }, { text: 'Whether the source actually exists (verify DOI, URL, or title)', is_correct: true }, { text: 'The word count', is_correct: false }, { text: 'The publication date only', is_correct: false }], explanation: 'AI can fabricate citations. Always verify that the cited source actually exists before relying on it.', difficulty: 'easy', topic_tag: 'Research Evaluation' },
  { question_text: 'What is the key principle when using AI for research?', options: [{ text: 'Trust AI completely and skip verification', is_correct: false }, { text: 'Use AI as a force multiplier for gathering, but apply human judgment for interpretation', is_correct: true }, { text: 'Only use AI for simple tasks', is_correct: false }, { text: 'Avoid AI in research entirely', is_correct: false }], explanation: 'AI accelerates the gathering and processing phases, but human expertise is essential for interpretation, evaluation, and critical thinking.', difficulty: 'easy', topic_tag: 'Research Best Practices' },
];


// ─── MAIN EXECUTION ───

const ALL_CONTENT = [CONTENT_INT1, CONTENT_INT2, CONTENT_INT3, CONTENT_INT4, CONTENT_INT5];
const ALL_QUESTIONS = [QUESTIONS_INT1, QUESTIONS_INT2, QUESTIONS_INT3, QUESTIONS_INT4, QUESTIONS_INT5];

async function main() {
  console.log('\n🚀 Seeding 5 Intermediate Modules...\n');

  try {
    // 1. Check for existing intermediate modules
    const { data: existing } = await supabase
      .from('learning_modules')
      .select('id, title')
      .eq('level', 'intermediate');

    if (existing && existing.length > 0) {
      console.log(`⚠️  Found ${existing.length} existing intermediate modules. Cleaning up...`);
      const existingIds = existing.map(m => m.id);
      await supabase.from('quiz_questions').delete().in('module_id', existingIds);
      await supabase.from('module_completions').delete().in('module_id', existingIds);
      await supabase.from('quiz_attempts').delete().in('module_id', existingIds);
      await supabase.from('learning_modules').delete().in('id', existingIds);
      console.log('   Cleaned up existing intermediate data.\n');
    }

    // 2. Insert modules
    console.log('📚 Creating intermediate modules...');
    const { data: createdModules, error: modError } = await supabase
      .from('learning_modules')
      .insert(INTERMEDIATE_MODULES)
      .select();

    if (modError) throw new Error(`Module insert failed: ${modError.message}`);
    console.log(`   ✅ Created ${createdModules.length} modules\n`);

    // 3. Update content and insert questions for each module
    for (let i = 0; i < createdModules.length; i++) {
      const mod = createdModules[i];
      const content = ALL_CONTENT[i];
      const questions = ALL_QUESTIONS[i];

      // Update content
      const { error: contentError } = await supabase
        .from('learning_modules')
        .update({ content })
        .eq('id', mod.id);

      if (contentError) throw new Error(`Content update for "${mod.title}" failed: ${contentError.message}`);

      // Insert questions with module_id
      const questionsWithId = questions.map(q => ({
        ...q,
        module_id: mod.id,
        is_active: true,
      }));

      const { data: insertedQs, error: qError } = await supabase
        .from('quiz_questions')
        .insert(questionsWithId)
        .select();

      if (qError) throw new Error(`Questions for "${mod.title}" failed: ${qError.message}`);

      console.log(`   ✅ Module ${i + 1} "${mod.title}": ${content.length} chars, ${insertedQs.length} questions`);
    }

    // 4. Set up prerequisites between intermediate modules (linear unlock)
    console.log('\n🔗 Setting up prerequisites...');
    for (let i = 1; i < createdModules.length; i++) {
      const prevMod = createdModules[i - 1];
      const currMod = createdModules[i];
      // Each intermediate module also requires the previous intermediate module
      const prereqs = [
        ...(INTERMEDIATE_MODULES[i].prerequisites || []),
        prevMod.id,
      ];
      // Deduplicate
      const uniquePrereqs = [...new Set(prereqs)];
      await supabase
        .from('learning_modules')
        .update({ prerequisites: uniquePrereqs })
        .eq('id', currMod.id);
    }
    console.log('   ✅ Prerequisites configured\n');

    // 5. Verify
    console.log('🔍 Verifying...');
    for (const mod of createdModules) {
      const { data: dbMod } = await supabase
        .from('learning_modules')
        .select('title, content, prerequisites')
        .eq('id', mod.id)
        .single();

      const { count } = await supabase
        .from('quiz_questions')
        .select('*', { count: 'exact', head: true })
        .eq('module_id', mod.id)
        .eq('is_active', true);

      console.log(`   "${dbMod.title}": ${(dbMod.content || '').length} chars, ${count} questions, prereqs: ${(dbMod.prerequisites || []).length}`);
    }

    console.log('\n✅ Intermediate modules seeded successfully!\n');
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.error(err);
    process.exit(1);
  }
}

main();
