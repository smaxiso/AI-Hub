/**
 * Seed 5 Expert Learning Modules:
 * 1. Building Production AI Applications
 * 2. AI Strategy & Organizational Transformation
 * 3. Frontier Models & Emerging AI Paradigms
 * 4. AI Evaluation, Benchmarking & Testing
 * 5. The Future of AI: AGI, Regulation & Society
 *
 * Each module: rich markdown content (8-10K chars), 20 quiz questions, prerequisites from advanced.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function getAdvancedIds() {
  const { data } = await supabase
    .from('learning_modules')
    .select('id, order_index')
    .eq('level', 'advanced')
    .order('order_index');
  const map = {};
  if (data) data.forEach(m => { map[m.order_index] = m.id; });
  return map;
}

function buildModules(advIds) {
  return [
    {
      level: 'expert',
      order_index: 1,
      title: 'Building Production AI Applications',
      description: 'End-to-end guide to architecting, building, and shipping AI-powered applications — from prototype to production with real users.',
      learning_objectives: [
        'Architect AI applications with proper separation of concerns',
        'Handle the full lifecycle: prototype → MVP → production → iteration',
        'Implement evaluation-driven development for AI features',
        'Design for cost, latency, and quality trade-offs at scale',
        'Build feedback loops that continuously improve your AI system'
      ],
      estimated_duration_minutes: 65,
      is_published: true,
      prerequisites: [advIds[5]], // AI Infrastructure & Deployment
    },
    {
      level: 'expert',
      order_index: 2,
      title: 'AI Strategy & Organizational Transformation',
      description: 'Lead AI adoption at the organizational level — from building the business case to managing change, measuring impact, and creating an AI-first culture.',
      learning_objectives: [
        'Build a compelling business case for AI adoption',
        'Create an AI strategy aligned with business objectives',
        'Manage organizational change and AI-related resistance',
        'Build and structure AI teams effectively',
        'Measure and communicate AI ROI to stakeholders'
      ],
      estimated_duration_minutes: 55,
      is_published: true,
      prerequisites: [advIds[4]], // AI Product Design & UX
    },
    {
      level: 'expert',
      order_index: 3,
      title: 'Frontier Models & Emerging AI Paradigms',
      description: 'Explore the cutting edge: reasoning models, multimodal AI, world models, AI agents, and the architectural innovations shaping the next generation of AI.',
      learning_objectives: [
        'Understand reasoning models (o1, o3) and chain-of-thought at scale',
        'Explore multimodal architectures that unify text, image, audio, and video',
        'Evaluate emerging paradigms: world models, embodied AI, neuromorphic computing',
        'Assess which frontier capabilities are production-ready vs. research-stage',
        'Develop a framework for evaluating new AI breakthroughs critically'
      ],
      estimated_duration_minutes: 60,
      is_published: true,
      prerequisites: [advIds[1]], // Fine-Tuning & Custom AI Models
    },
    {
      level: 'expert',
      order_index: 4,
      title: 'AI Evaluation, Benchmarking & Testing',
      description: 'Master the science of measuring AI quality — from designing evaluation frameworks to running benchmarks, detecting regressions, and building continuous evaluation pipelines.',
      learning_objectives: [
        'Design comprehensive evaluation frameworks for AI systems',
        'Choose and interpret AI benchmarks critically',
        'Build automated evaluation pipelines for continuous quality monitoring',
        'Use LLM-as-judge and human evaluation effectively',
        'Detect and prevent quality regressions in production AI'
      ],
      estimated_duration_minutes: 55,
      is_published: true,
      prerequisites: [advIds[2]], // AI Security, Red Teaming & Safety
    },
    {
      level: 'expert',
      order_index: 5,
      title: 'The Future of AI: AGI, Regulation & Society',
      description: 'Examine the big questions: the path to AGI, global AI regulation, economic disruption, existential risk debates, and how to navigate an AI-transformed world.',
      learning_objectives: [
        'Understand the AGI debate and different perspectives on timelines',
        'Navigate the global AI regulatory landscape (EU AI Act, US policy, China)',
        'Assess AI\'s economic impact on jobs, industries, and inequality',
        'Evaluate existential risk arguments and safety research priorities',
        'Develop a personal framework for thriving in an AI-transformed world'
      ],
      estimated_duration_minutes: 50,
      is_published: true,
      prerequisites: [advIds[2]], // AI Security, Red Teaming & Safety
    },
  ];
}


// ─── MODULE CONTENT ───

const CONTENT_EXP1 = `# Building Production AI Applications

You've learned the individual pieces — prompting, RAG, agents, infrastructure, security. Now it's time to put it all together. This module covers the end-to-end process of building AI applications that serve real users reliably, from the first prototype to a production system handling thousands of requests.

## The AI Application Stack

Every production AI application has these layers:

| Layer | Responsibility | Key Decisions |
|-------|---------------|---------------|
| **User Interface** | How users interact with AI | Chat vs. embedded vs. API |
| **Application Logic** | Business rules, routing, orchestration | Frameworks, state management |
| **AI Layer** | Model selection, prompting, chains | Provider, model, prompt strategy |
| **Data Layer** | Context, memory, knowledge base | RAG, vector DB, caching |
| **Infrastructure** | Hosting, scaling, monitoring | Cloud vs. self-hosted, observability |

### The Critical Insight

Most AI application failures aren't model failures — they're engineering failures. The model works fine in a notebook, but the application around it doesn't handle edge cases, latency, errors, or scale.

> Building an AI demo takes a weekend. Building a production AI application takes months. The difference is everything around the model: error handling, evaluation, monitoring, cost control, and user experience.

## From Prototype to Production

### Phase 1: Proof of Concept (1-2 weeks)

**Goal**: Validate that AI can solve the problem at all.

- Pick the best available model (don't optimize for cost yet)
- Use simple prompts — no chains, no RAG
- Test with 20-50 real examples manually
- **Decision gate**: Does the AI produce useful output at least 70% of the time?

### Phase 2: MVP (2-4 weeks)

**Goal**: Build something real users can try.

- Implement proper prompt engineering (few-shot, system prompts)
- Add RAG if the task needs specific knowledge
- Build basic error handling and fallbacks
- Create a simple UI for user testing
- **Decision gate**: Do test users find it valuable? What are the failure modes?

### Phase 3: Production Hardening (4-8 weeks)

**Goal**: Make it reliable, fast, and cost-effective.

- Implement the gateway pattern with provider fallbacks
- Add comprehensive logging and monitoring
- Build evaluation pipelines (automated + human)
- Optimize costs with model tiering and caching
- Add rate limiting, abuse prevention, and security layers
- Load test and optimize for latency targets

### Phase 4: Continuous Improvement (Ongoing)

**Goal**: Get better over time based on real usage.

- Analyze user feedback and failure patterns
- A/B test prompt changes and model upgrades
- Expand capabilities based on user needs
- Monitor for quality drift and regression

\`\`\`flashcard
What are the four phases of building a production AI application?
---
(1) Proof of Concept — validate AI can solve the problem (1-2 weeks), (2) MVP — build something users can try (2-4 weeks), (3) Production Hardening — make it reliable, fast, cost-effective (4-8 weeks), (4) Continuous Improvement — get better from real usage data (ongoing). Most teams skip phase 3 and regret it.
\`\`\`

## Evaluation-Driven Development

The single most important practice for production AI is systematic evaluation. Without it, you're flying blind.

### Building an Eval Suite

An eval suite is a collection of test cases that measure your AI system's quality:

1. **Golden dataset**: 100-500 input/expected-output pairs covering your use cases
2. **Edge cases**: Inputs that are tricky, ambiguous, or adversarial
3. **Regression tests**: Cases that previously failed and were fixed
4. **Diversity tests**: Inputs across different user types, languages, and scenarios

### Evaluation Methods

| Method | Speed | Cost | Best For |
|--------|-------|------|----------|
| **Automated metrics** (BLEU, ROUGE, exact match) | Fast | Free | Structured outputs, translations |
| **LLM-as-judge** (GPT-4 evaluates outputs) | Fast | Low | Open-ended generation, quality scoring |
| **Human evaluation** | Slow | High | Nuanced quality, user satisfaction |
| **A/B testing** | Slow | Medium | Comparing two approaches with real users |

### The Eval Loop

Every change to your AI system should go through:
1. Run the eval suite on the current system (baseline)
2. Make the change (new prompt, model, or configuration)
3. Run the eval suite again (candidate)
4. Compare: Did quality improve? Did any cases regress?
5. Only deploy if the candidate is better overall AND no critical regressions

\`\`\`interactive
Design an evaluation suite for an AI feature you'd like to build. Define: (1) 5 test cases with expected outputs, (2) 3 edge cases, (3) Which evaluation method you'd use for each, (4) What "good enough" quality looks like (your acceptance threshold).
\`\`\`

## Prompt Management in Production

### The Prompt Registry Pattern

Don't hardcode prompts in your application code. Use a prompt registry:

- **Version control**: Every prompt change is tracked with a version number
- **A/B testing**: Run multiple prompt versions simultaneously
- **Rollback**: Instantly revert to a previous prompt if quality drops
- **Analytics**: Track which prompt version produces the best results
- **Separation of concerns**: Engineers manage code, prompt engineers manage prompts

### Prompt Optimization Strategies

| Strategy | When to Use | Impact |
|----------|------------|--------|
| **Prompt compression** | Tokens are expensive | 20-40% cost reduction |
| **Dynamic few-shot** | Different inputs need different examples | 10-30% quality improvement |
| **Prompt caching** | Same system prompt across requests | Significant latency reduction |
| **Template inheritance** | Multiple prompts share common structure | Easier maintenance |

## Handling State and Memory

### Conversation Memory Patterns

| Pattern | How It Works | Best For |
|---------|-------------|----------|
| **Full history** | Send entire conversation each time | Short conversations |
| **Sliding window** | Keep only the last N messages | Long conversations |
| **Summary memory** | AI summarizes older messages | Very long conversations |
| **Semantic memory** | Store and retrieve relevant past interactions | Multi-session applications |

### Session Management

- Store conversation state server-side (not in the client)
- Use unique session IDs to isolate conversations
- Implement session timeouts and cleanup
- Consider privacy: how long do you retain conversation data?

\`\`\`flashcard
What is the "Prompt Registry Pattern"?
---
A centralized system for managing prompts outside application code. It provides: version control (track every change), A/B testing (run multiple versions), instant rollback, performance analytics, and separation of concerns between engineering and prompt design. Essential for any production AI application.
\`\`\`

## Building Feedback Loops

The best AI applications get better over time through structured feedback:

### Implicit Feedback
- Which AI suggestions do users accept vs. reject?
- How often do users edit AI-generated content?
- Do users retry or rephrase their requests?
- Time spent on AI-generated vs. manually created content

### Explicit Feedback
- Thumbs up/down on AI responses
- Star ratings or quality scores
- Free-text feedback on what went wrong
- "Report a problem" functionality

### Closing the Loop
1. Collect feedback data systematically
2. Analyze patterns: What types of inputs produce poor results?
3. Add failing cases to your eval suite
4. Improve prompts, add examples, or adjust the system
5. Verify improvement with the eval suite
6. Deploy and continue monitoring

## Common Architecture Mistakes

| Mistake | Why It Happens | Better Approach |
|---------|---------------|-----------------|
| No evaluation pipeline | "It works in testing" | Build evals before building features |
| Hardcoded prompts | Quick to implement | Use a prompt registry from day one |
| No fallback provider | "Our provider never goes down" | Always have a backup |
| Ignoring latency | Focus on quality only | Set latency budgets per feature |
| No cost monitoring | "We'll optimize later" | Track costs from the first API call |
| Skipping security | "We'll add it later" | Security is not a feature — it's a requirement |

## Summary

Building production AI applications is primarily an engineering challenge, not an AI challenge. The model is just one component in a system that includes evaluation pipelines, prompt management, error handling, monitoring, cost optimization, and feedback loops. The teams that succeed are the ones that treat AI development with the same rigor as traditional software engineering — with the added discipline of systematic evaluation at every step.

Take the quiz to test your production AI knowledge!
`;


const CONTENT_EXP2 = `# AI Strategy & Organizational Transformation

Implementing AI successfully isn't just a technology challenge — it's an organizational one. The companies that get the most value from AI aren't necessarily the most technically sophisticated. They're the ones that align AI initiatives with business strategy, manage change effectively, and build cultures that embrace AI as a tool for empowerment.

## Building the Business Case for AI

### The AI Value Framework

Before investing in AI, map potential initiatives to business value:

| Value Category | Examples | Measurement |
|---------------|----------|-------------|
| **Cost reduction** | Automate manual processes, reduce support tickets | Hours saved × hourly cost |
| **Revenue growth** | Better recommendations, faster content, personalized marketing | Incremental revenue attributed to AI |
| **Quality improvement** | Fewer errors, more consistent output, better decisions | Error rate reduction, quality scores |
| **Speed improvement** | Faster time-to-market, quicker customer response | Cycle time reduction |
| **Innovation enablement** | New products/services only possible with AI | New revenue streams |

### Prioritization Matrix

Plot AI initiatives on two axes:

- **X-axis**: Implementation difficulty (easy → hard)
- **Y-axis**: Business impact (low → high)

**Start with**: High impact + Easy implementation (quick wins)
**Plan for**: High impact + Hard implementation (strategic bets)
**Avoid**: Low impact + Hard implementation (time sinks)

> The best AI strategy starts with business problems, not technology. Ask "What business outcome do we need?" before asking "What AI tool should we use?"

\`\`\`flashcard
What is the AI Value Framework?
---
Map AI initiatives to five value categories: Cost reduction, Revenue growth, Quality improvement, Speed improvement, and Innovation enablement. Each should have clear measurements. Prioritize by plotting impact vs. difficulty — start with high-impact, easy-to-implement quick wins.
\`\`\`

## Creating an AI Strategy

### The Three Horizons

**Horizon 1 (0-6 months): Augment**
- Deploy AI tools that enhance existing workflows
- Focus on individual productivity gains
- Examples: AI writing assistants, code copilots, meeting summarizers

**Horizon 2 (6-18 months): Automate**
- Build AI-powered workflows that handle entire processes
- Focus on team and department-level transformation
- Examples: Automated content pipelines, AI customer support, intelligent document processing

**Horizon 3 (18+ months): Transform**
- Create new products, services, or business models enabled by AI
- Focus on organizational and market-level impact
- Examples: AI-native products, predictive business intelligence, autonomous operations

### Strategy Components

1. **Vision**: Where do we want AI to take us in 3 years?
2. **Assessment**: Where are we today? (skills, data, infrastructure)
3. **Roadmap**: What do we build, in what order?
4. **Governance**: How do we manage risk, ethics, and compliance?
5. **Talent**: What skills do we need? Build vs. hire vs. partner?
6. **Metrics**: How do we measure success?

## Managing Organizational Change

### The AI Adoption Curve

| Stage | Mindset | Your Response |
|-------|---------|---------------|
| **Skepticism** | "AI is just hype" | Show concrete demos with real company data |
| **Fear** | "AI will replace my job" | Frame AI as augmentation, not replacement |
| **Curiosity** | "How could this help me?" | Provide hands-on workshops and training |
| **Adoption** | "I use AI daily" | Share best practices, create communities |
| **Advocacy** | "Let me show you what AI can do" | Empower champions to train others |

### Overcoming Resistance

**Common objections and responses:**

- "AI makes mistakes" → "So do humans. AI + human review produces fewer errors than either alone"
- "It's too expensive" → "Here's the ROI calculation showing payback in X months"
- "Our data isn't ready" → "We can start with tools that don't need our data, then build data capabilities"
- "It's a security risk" → "Here's our security framework with enterprise-grade protections"
- "It'll replace jobs" → "It'll change jobs. Here's our reskilling plan"

\`\`\`interactive
Think about your organization (or a hypothetical one). Identify: (1) The biggest AI opportunity (which process would benefit most?), (2) The biggest barrier to adoption (technical, cultural, or organizational?), (3) Who would be your AI champion (the person most likely to advocate for AI?), (4) What quick win could you demonstrate in 30 days?
\`\`\`

## Building AI Teams

### Team Structures

| Model | Description | Best For |
|-------|-------------|----------|
| **Centralized AI team** | Dedicated AI team serves the whole organization | Early-stage AI adoption, consistency |
| **Embedded AI specialists** | AI experts sit within business teams | Mature adoption, domain-specific needs |
| **Hub-and-spoke** | Central AI team + embedded specialists | Large organizations, balanced approach |
| **AI-enabled everyone** | All employees trained to use AI tools | AI-augmented culture, broad adoption |

### Key Roles

- **AI/ML Engineers**: Build and deploy AI systems
- **Prompt Engineers**: Design and optimize AI interactions
- **Data Engineers**: Prepare and manage data pipelines
- **AI Product Managers**: Define AI product strategy and requirements
- **AI Ethics Officers**: Ensure responsible AI use
- **AI Trainers/Champions**: Enable organization-wide adoption

\`\`\`flashcard
What are the three horizons of AI strategy?
---
Horizon 1 (0-6 months): Augment — enhance existing workflows with AI tools. Horizon 2 (6-18 months): Automate — build AI workflows that handle entire processes. Horizon 3 (18+ months): Transform — create new AI-native products and business models. Start with augmentation for quick wins, then build toward transformation.
\`\`\`

## Measuring AI ROI

### The AI Metrics Dashboard

Track these metrics at the organizational level:

| Metric | Formula | Target |
|--------|---------|--------|
| **AI adoption rate** | Employees actively using AI / Total employees | >60% within 12 months |
| **Time savings** | Hours saved per employee per week | 5-10 hours |
| **Quality impact** | Error rate before vs. after AI | 30-50% reduction |
| **Cost impact** | AI costs vs. value generated | 3-5x ROI |
| **Innovation index** | New AI-enabled products or features launched | Increasing quarter over quarter |
| **Employee satisfaction** | Survey scores on AI tool satisfaction | >4/5 |

### Communicating ROI to Stakeholders

- **To executives**: Focus on revenue impact, cost savings, and competitive advantage
- **To managers**: Focus on team productivity, quality improvements, and time savings
- **To employees**: Focus on how AI makes their work easier and more interesting
- **To board/investors**: Focus on strategic positioning and market differentiation

## AI Governance

### The AI Governance Framework

1. **Policy**: Clear rules for AI use (what's allowed, what's not)
2. **Risk assessment**: Evaluate AI initiatives for bias, privacy, and security risks
3. **Approval process**: Who approves new AI deployments?
4. **Monitoring**: Ongoing oversight of AI systems in production
5. **Incident response**: What happens when AI causes a problem?
6. **Compliance**: Alignment with regulations (EU AI Act, industry standards)

## Summary

AI strategy is business strategy. The organizations that succeed with AI are those that start with clear business objectives, manage change thoughtfully, build the right team structures, measure results rigorously, and govern AI use responsibly. Technology is the easy part — the hard part is the human and organizational transformation that makes AI adoption stick.

Take the quiz to test your AI strategy knowledge!
`;


const CONTENT_EXP3 = `# Frontier Models & Emerging AI Paradigms

The AI landscape is evolving at an unprecedented pace. New model architectures, capabilities, and paradigms emerge monthly. This module equips you with the knowledge to understand, evaluate, and anticipate the next wave of AI breakthroughs — separating genuine advances from hype.

## Reasoning Models: The Next Leap

### From Pattern Matching to Reasoning

Traditional LLMs predict the next token based on patterns. Reasoning models like OpenAI's o1 and o3 add a "thinking" phase:

| Aspect | Standard LLM | Reasoning Model |
|--------|-------------|-----------------|
| **Process** | Direct token prediction | Think → Plan → Execute → Verify |
| **Latency** | Fast (seconds) | Slower (seconds to minutes) |
| **Cost** | Lower per query | Higher (more tokens for thinking) |
| **Accuracy on hard problems** | Moderate | Significantly better |
| **Best for** | Creative writing, simple tasks | Math, logic, coding, analysis |

### How Reasoning Models Work

1. **Chain-of-thought at scale**: The model generates extensive internal reasoning before answering
2. **Self-verification**: The model checks its own work during the thinking phase
3. **Backtracking**: If a reasoning path fails, the model tries alternative approaches
4. **Compute scaling**: More thinking time = better answers (test-time compute)

> Reasoning models represent a paradigm shift: instead of making models bigger (more parameters), we make them think longer (more compute at inference time). This is called "test-time compute scaling."

\`\`\`flashcard
How do reasoning models differ from standard LLMs?
---
Standard LLMs predict tokens directly. Reasoning models add a "thinking" phase where they plan, reason step-by-step, self-verify, and backtrack if needed. They trade latency and cost for significantly better accuracy on complex problems like math, logic, and coding. This is "test-time compute scaling" — more thinking time yields better answers.
\`\`\`

## Multimodal AI: Unifying All Modalities

### The Convergence

AI is moving from specialized models (text-only, image-only) to unified models that handle everything:

- **Text + Image**: GPT-4o, Claude 3.5, Gemini — understand and generate both
- **Text + Image + Audio**: GPT-4o with voice, Gemini — real-time conversation with vision
- **Text + Image + Video**: Gemini 1.5, Sora — understand and generate video
- **Everything**: Future models aim to process any combination of modalities seamlessly

### Native Multimodal vs. Stitched

| Approach | How It Works | Quality |
|----------|-------------|---------|
| **Stitched** | Separate models connected by a pipeline (e.g., speech-to-text → LLM → text-to-speech) | Good but lossy — information lost between steps |
| **Native multimodal** | Single model processes all modalities together | Better — cross-modal understanding is deeper |

Native multimodal models understand relationships between modalities that stitched systems miss. For example, a native model can understand that a person's tone of voice contradicts their words.

### Emerging Multimodal Capabilities

- **Real-time video understanding**: AI that watches and comments on live video
- **Spatial reasoning**: Understanding 3D space from 2D images
- **Cross-modal generation**: "Create a song that matches the mood of this image"
- **Document understanding**: Processing complex layouts with text, tables, and images together

## World Models and Simulation

### What Are World Models?

World models are AI systems that build internal representations of how the world works — physics, cause and effect, spatial relationships:

- **Video prediction**: Given a scene, predict what happens next (physics, motion)
- **Robotics**: Understand how objects interact in 3D space
- **Game AI**: Build internal models of game environments
- **Autonomous driving**: Predict how traffic scenarios will unfold

### Why World Models Matter

Current AI is largely reactive — it responds to inputs. World models enable proactive AI that can:
- Simulate outcomes before taking action
- Plan multi-step strategies
- Understand cause and effect
- Transfer knowledge between similar situations

\`\`\`flashcard
What are world models in AI?
---
World models are AI systems that build internal representations of how the world works — physics, causality, spatial relationships. Unlike reactive AI that just responds to inputs, world models can simulate outcomes, plan ahead, and understand cause and effect. They're key to robotics, autonomous driving, and more capable AI agents.
\`\`\`

## AI Agents: From Tools to Autonomy

### The Agent Evolution

| Generation | Capability | Example |
|-----------|-----------|---------|
| **Gen 1: Tool use** | AI calls predefined functions | ChatGPT plugins, function calling |
| **Gen 2: Multi-step** | AI plans and executes sequences | AutoGPT, CrewAI workflows |
| **Gen 3: Adaptive** | AI adjusts strategy based on results | Devin (coding), Claude Computer Use |
| **Gen 4: Autonomous** | AI operates independently for extended periods | Research agents, business process agents |

### Computer Use Agents

A breakthrough capability: AI that can use a computer like a human:
- Navigate websites, click buttons, fill forms
- Use desktop applications (spreadsheets, email, design tools)
- Complete multi-step tasks across multiple applications
- Learn new interfaces without specific training

### The Trust Challenge

As agents become more autonomous, the trust question becomes critical:
- How much authority should an agent have?
- What actions require human approval?
- How do you audit what an agent did?
- What happens when an agent makes a costly mistake?

\`\`\`interactive
A new AI model is announced that claims to be "10x better" at reasoning. Design a framework for evaluating this claim: What benchmarks would you check? What real-world tests would you run? What red flags would make you skeptical? How would you decide if it's worth adopting?
\`\`\`

## Emerging Architectures

### Mixture of Experts (MoE)

Instead of one massive model, MoE uses multiple specialized sub-models:
- A router decides which "expert" handles each input
- Only a fraction of parameters are active per query
- Result: Larger total model with lower per-query compute cost
- Used by: Mixtral, GPT-4 (rumored), Switch Transformer

### State Space Models (SSMs)

An alternative to the Transformer architecture:
- **Mamba** and similar models process sequences more efficiently
- Linear scaling with sequence length (vs. quadratic for Transformers)
- Potentially better for very long contexts
- Still early but showing promising results

### Retrieval-Augmented Everything

RAG is expanding beyond text:
- **Image RAG**: Retrieve relevant images to inform generation
- **Code RAG**: Search codebases to inform code generation
- **Multi-modal RAG**: Retrieve across text, images, and structured data
- **Agentic RAG**: Agents that decide what to retrieve and when

## Evaluating AI Breakthroughs

### The Hype Filter Framework

When a new AI breakthrough is announced, ask:

1. **Reproducibility**: Can independent researchers replicate the results?
2. **Benchmarks**: Are the benchmarks meaningful or cherry-picked?
3. **Real-world performance**: Does it work on messy, real-world data?
4. **Availability**: Can you actually use it, or is it research-only?
5. **Cost**: Is it economically viable for production use?
6. **Limitations**: What does the paper NOT show?

\`\`\`flashcard
What is the "Hype Filter Framework" for evaluating AI breakthroughs?
---
Ask six questions: (1) Reproducibility — can others replicate it? (2) Benchmarks — are they meaningful or cherry-picked? (3) Real-world performance — does it work on messy data? (4) Availability — can you actually use it? (5) Cost — is it economically viable? (6) Limitations — what's NOT shown? This prevents adopting overhyped technology.
\`\`\`

## Summary

The frontier of AI is moving from bigger models to smarter models (reasoning), from single-modality to unified multimodal systems, from reactive tools to autonomous agents, and from pattern matching to world understanding. The key skill isn't knowing every new model — it's having a framework to evaluate breakthroughs critically and adopt the ones that create real value.

Take the quiz to test your frontier AI knowledge!
`;


const CONTENT_EXP4 = `# AI Evaluation, Benchmarking & Testing

If you can't measure it, you can't improve it. AI evaluation is the discipline that separates teams shipping reliable AI from teams shipping demos. This module covers the science and practice of measuring AI quality — from designing evaluation frameworks to building continuous evaluation pipelines that catch regressions before your users do.

## Why AI Evaluation Is Different

Traditional software testing checks deterministic behavior: given input X, expect output Y. AI systems are probabilistic — the same input can produce different outputs, and "correct" is often subjective.

| Aspect | Traditional Testing | AI Evaluation |
|--------|-------------------|---------------|
| **Correctness** | Binary (pass/fail) | Spectrum (quality score) |
| **Determinism** | Same input → same output | Same input → different outputs |
| **Test creation** | Developers write assertions | Requires domain experts + diverse examples |
| **Coverage** | Code paths | Input space (infinite) |
| **Regression** | Clear — test passes or fails | Subtle — quality may degrade gradually |
| **Ground truth** | Well-defined | Often subjective or unavailable |

> The biggest risk in AI isn't a spectacular failure — it's a gradual quality degradation that nobody notices until users start leaving. Continuous evaluation is your early warning system.

## Evaluation Framework Design

### The Evaluation Pyramid

Build your evaluation strategy in layers:

**Layer 1: Unit Evaluations (Run on every change)**
- Individual prompt/response quality checks
- Format validation (JSON, structured output)
- Safety and content policy checks
- Latency and cost measurements

**Layer 2: Integration Evaluations (Run daily)**
- End-to-end workflow testing
- Multi-step task completion
- Cross-component interaction quality
- RAG retrieval accuracy

**Layer 3: System Evaluations (Run weekly)**
- Full user journey simulations
- A/B test analysis
- Comparative benchmarking against baselines
- Bias and fairness audits

**Layer 4: Human Evaluations (Run monthly)**
- Expert quality assessments
- User satisfaction surveys
- Adversarial red-teaming sessions
- Edge case discovery

\`\`\`flashcard
What is the Evaluation Pyramid?
---
Four layers of AI evaluation: (1) Unit Evaluations — per-change prompt/response checks, format validation, safety. (2) Integration Evaluations — daily end-to-end workflow tests, RAG accuracy. (3) System Evaluations — weekly full journey simulations, A/B analysis, bias audits. (4) Human Evaluations — monthly expert assessments, user surveys, red-teaming. Each layer catches different types of quality issues.
\`\`\`

## Benchmarks: Understanding and Using Them

### Major AI Benchmarks

| Benchmark | What It Measures | Limitations |
|-----------|-----------------|-------------|
| **MMLU** | Broad knowledge across 57 subjects | Multiple choice only, memorization possible |
| **HumanEval / MBPP** | Code generation ability | Limited to short functions, not real-world coding |
| **GSM8K / MATH** | Mathematical reasoning | Narrow problem types, contamination risk |
| **MT-Bench** | Multi-turn conversation quality | Subjective, LLM-judge dependent |
| **GPQA** | Graduate-level reasoning | Small dataset, niche domains |
| **ARC-AGI** | Novel reasoning and abstraction | Controversial as AGI measure |
| **SWE-bench** | Real-world software engineering | Specific to GitHub issue resolution |
| **HELM** | Holistic model evaluation | Complex to run, many dimensions |

### Benchmark Pitfalls

1. **Contamination**: Models may have seen benchmark data during training
2. **Overfitting**: Models optimized for benchmarks may not generalize
3. **Cherry-picking**: Companies report only benchmarks where they excel
4. **Saturation**: When all models score 95%+, the benchmark stops being useful
5. **Misalignment**: High benchmark scores don't guarantee real-world performance

### Creating Custom Benchmarks

For your specific use case, build a custom benchmark:

1. **Collect real examples**: 200-500 inputs from actual users
2. **Create ground truth**: Expert-annotated expected outputs
3. **Define scoring rubric**: What makes an output good? (accuracy, completeness, tone, format)
4. **Stratify by difficulty**: Easy (40%), medium (40%), hard (20%)
5. **Include adversarial cases**: Inputs designed to trick or confuse the AI
6. **Version control**: Track benchmark changes over time

\`\`\`interactive
Choose an AI task you care about (e.g., summarization, code review, customer support). Design a mini-benchmark: (1) Write 5 test inputs of varying difficulty, (2) Define what a "good" output looks like for each, (3) Create a 1-5 scoring rubric with clear criteria, (4) Identify 2 adversarial inputs that might trip up an AI.
\`\`\`

## LLM-as-Judge

### How It Works

Use a powerful LLM (like GPT-4) to evaluate outputs from your AI system:

1. Present the input, the AI's output, and (optionally) a reference answer
2. Ask the judge model to score the output on specific criteria
3. Collect scores across your evaluation dataset
4. Aggregate into quality metrics

### Judge Prompt Design

A good judge prompt includes:
- Clear scoring criteria with examples of each score level
- Specific dimensions to evaluate (accuracy, relevance, completeness, tone)
- Instructions to explain the reasoning before giving a score
- Calibration examples showing what a 1, 3, and 5 look like

### LLM-Judge Limitations

| Limitation | Mitigation |
|-----------|------------|
| **Position bias** | Randomize order when comparing two outputs |
| **Verbosity bias** | Instruct judge to penalize unnecessary length |
| **Self-preference** | Don't use the same model as both generator and judge |
| **Inconsistency** | Run each evaluation 3-5 times, take the median |
| **Ceiling effect** | Judge can't evaluate outputs better than its own capability |

\`\`\`flashcard
What are the key limitations of LLM-as-Judge evaluation?
---
Five main limitations: (1) Position bias — prefers first or second option. (2) Verbosity bias — rates longer answers higher. (3) Self-preference — favors its own style. (4) Inconsistency — different scores on repeated runs. (5) Ceiling effect — can't judge outputs beyond its own capability. Mitigate with randomization, explicit instructions, different judge model, multiple runs, and human calibration.
\`\`\`

## Human Evaluation

### When You Need Humans

- Evaluating subjective quality (creativity, tone, helpfulness)
- Validating LLM-judge accuracy (calibration)
- Discovering failure modes the automated system misses
- Assessing safety and bias in nuanced scenarios
- Building initial ground truth for new tasks

### Human Evaluation Best Practices

| Practice | Why It Matters |
|----------|---------------|
| **Clear rubric** | Evaluators need unambiguous criteria |
| **Training session** | Calibrate evaluators before they start |
| **Inter-annotator agreement** | Measure consistency between evaluators |
| **Blind evaluation** | Don't reveal which system produced which output |
| **Sufficient sample size** | At least 100-200 examples for statistical significance |
| **Diverse evaluators** | Different backgrounds catch different issues |

## Continuous Evaluation Pipelines

### Architecture

A production evaluation pipeline runs automatically:

1. **Trigger**: New model deployment, prompt change, or scheduled run
2. **Data selection**: Sample from golden dataset + recent production inputs
3. **Execution**: Run the AI system on selected inputs
4. **Scoring**: Apply automated metrics + LLM-judge
5. **Comparison**: Compare against baseline (previous version)
6. **Alerting**: Flag regressions that exceed thresholds
7. **Reporting**: Generate dashboard with trends and details

### Key Metrics to Track

| Metric | What It Measures | Alert Threshold |
|--------|-----------------|-----------------|
| **Quality score** | Overall output quality (1-5) | Drop > 0.2 from baseline |
| **Failure rate** | % of outputs below minimum quality | Increase > 5% |
| **Latency p95** | 95th percentile response time | Increase > 30% |
| **Cost per query** | Average token cost per request | Increase > 20% |
| **Safety violations** | % of outputs flagging safety filters | Any increase |
| **Format compliance** | % of outputs matching expected format | Drop below 95% |

### Regression Detection

Types of regression to watch for:

- **Model regression**: New model version performs worse on your tasks
- **Prompt regression**: Prompt change improves one area but degrades another
- **Data regression**: Changes in input distribution cause quality drops
- **Infrastructure regression**: Latency or reliability degradation
- **Drift regression**: Gradual quality decline over weeks/months

\`\`\`flashcard
What are the five types of AI regression to monitor?
---
(1) Model regression — new version performs worse. (2) Prompt regression — change helps one area, hurts another. (3) Data regression — input distribution shifts cause quality drops. (4) Infrastructure regression — latency or reliability degrades. (5) Drift regression — gradual quality decline over weeks/months. Continuous evaluation pipelines catch these before users notice.
\`\`\`

## Testing AI Systems

### The AI Testing Spectrum

| Test Type | What It Checks | Automation |
|-----------|---------------|------------|
| **Smoke tests** | System runs without errors | Fully automated |
| **Functional tests** | Outputs meet basic requirements | Fully automated |
| **Quality tests** | Outputs are good enough | Semi-automated (LLM-judge) |
| **Safety tests** | No harmful or biased outputs | Semi-automated + human review |
| **Adversarial tests** | System handles attacks gracefully | Manual + automated fuzzing |
| **Load tests** | System performs under high traffic | Fully automated |
| **Chaos tests** | System handles failures gracefully | Fully automated |

### Adversarial Testing Techniques

- **Prompt injection**: Attempt to override system instructions
- **Jailbreaking**: Try to bypass safety filters
- **Edge cases**: Unusual inputs (empty, very long, special characters, multiple languages)
- **Contradiction**: Provide conflicting information and see how the AI handles it
- **Hallucination probing**: Ask about fictional entities or impossible scenarios
- **Bias probing**: Test for demographic, cultural, or ideological biases

\`\`\`interactive
Design a testing plan for an AI chatbot that answers customer support questions. Include: (1) 3 smoke tests, (2) 3 functional tests with expected behavior, (3) 2 adversarial tests, (4) 1 bias test, (5) Define your quality threshold (what score = "good enough").
\`\`\`

## Evaluation Anti-Patterns

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| **Vibes-based evaluation** | "It seems good" isn't measurable | Define quantitative metrics |
| **Benchmark worship** | Optimizing for benchmarks, not users | Create custom evals from real usage |
| **One-time evaluation** | Testing once and never again | Build continuous evaluation pipelines |
| **Ignoring edge cases** | Only testing happy paths | Include adversarial and edge cases |
| **No baseline** | Can't tell if changes improve things | Always compare against a baseline |
| **Evaluating in isolation** | Testing components but not the system | Include end-to-end evaluations |

## Summary

AI evaluation is the foundation of reliable AI systems. Build a layered evaluation strategy (unit → integration → system → human), use benchmarks critically (they're useful but limited), combine automated metrics with LLM-judge and human evaluation, and invest in continuous evaluation pipelines that catch regressions before users do. The teams that evaluate rigorously ship better AI — it's that simple.

Take the quiz to test your AI evaluation knowledge!
`;

const CONTENT_EXP5 = `# The Future of AI: AGI, Regulation & Society

This is the big picture module. We step back from tools and techniques to examine the forces shaping AI's trajectory — the race toward artificial general intelligence, the global regulatory response, the economic disruption already underway, and the existential questions that will define this century. Understanding these dynamics isn't optional — it's essential for anyone building or deploying AI.

## The AGI Debate

### What Is AGI?

Artificial General Intelligence (AGI) refers to AI that matches or exceeds human cognitive abilities across virtually all domains — not just narrow tasks like chess or image recognition, but general reasoning, learning, creativity, and adaptation.

| Concept | Definition | Status |
|---------|-----------|--------|
| **Narrow AI (ANI)** | Excels at specific tasks | Current state — ChatGPT, DALL-E, etc. |
| **Artificial General Intelligence (AGI)** | Human-level across all cognitive tasks | Not yet achieved — timeline debated |
| **Artificial Superintelligence (ASI)** | Surpasses human intelligence in every domain | Theoretical — no consensus on possibility |

### Timeline Perspectives

| Camp | Timeline | Key Argument |
|------|----------|-------------|
| **Accelerationists** | 2-5 years | Scaling laws continue, emergent capabilities appear suddenly |
| **Gradualists** | 10-20 years | Significant architectural breakthroughs still needed |
| **Skeptics** | 50+ years or never | Current approaches hit fundamental limits |

> The honest answer about AGI timelines is: nobody knows. The experts disagree wildly, and the history of AI is littered with both premature predictions and unexpected breakthroughs. Plan for uncertainty, not for a specific date.

\`\`\`flashcard
What are the three camps on AGI timelines?
---
Accelerationists (2-5 years) — believe scaling laws and emergent capabilities will get us there fast. Gradualists (10-20 years) — think significant architectural breakthroughs are still needed. Skeptics (50+ years or never) — argue current approaches hit fundamental limits. The honest answer: nobody knows, and experts disagree wildly.
\`\`\`

### The Scaling Hypothesis

The central debate in AI research:

**Pro-scaling argument**: Intelligence emerges from scale. Make models bigger, train on more data, use more compute, and capabilities keep improving. GPT-3 → GPT-4 showed dramatic capability jumps from scaling alone.

**Anti-scaling argument**: Scaling hits diminishing returns. Current architectures have fundamental limitations (reasoning, planning, world models) that more parameters won't solve. We need new paradigms.

**The middle ground**: Scaling is necessary but not sufficient. We need both scale AND architectural innovation (reasoning models, agents, world models) to approach AGI.

## Global AI Regulation

### The Regulatory Landscape

AI regulation is emerging worldwide, with different philosophies:

| Region | Approach | Key Legislation |
|--------|----------|----------------|
| **European Union** | Risk-based, comprehensive | EU AI Act (2024) — world's first comprehensive AI law |
| **United States** | Sector-specific, innovation-friendly | Executive orders, state-level laws, voluntary commitments |
| **China** | Technology-specific, state-controlled | Regulations on deepfakes, generative AI, algorithmic recommendations |
| **United Kingdom** | Pro-innovation, principles-based | AI Safety Institute, sector regulators |
| **Global** | Emerging coordination | G7 Hiroshima Process, UN advisory body |

### The EU AI Act

The world's most comprehensive AI regulation:

**Risk Categories:**
- **Unacceptable risk** (banned): Social scoring, real-time biometric surveillance, manipulative AI
- **High risk** (strict requirements): AI in hiring, credit scoring, law enforcement, healthcare
- **Limited risk** (transparency): Chatbots must disclose they're AI, deepfakes must be labeled
- **Minimal risk** (no requirements): AI in games, spam filters, most consumer applications

**Key Requirements for High-Risk AI:**
- Risk management systems
- Data governance and quality
- Technical documentation
- Human oversight mechanisms
- Accuracy, robustness, and cybersecurity
- Conformity assessments before deployment

\`\`\`flashcard
What are the four risk categories in the EU AI Act?
---
(1) Unacceptable risk (banned) — social scoring, manipulative AI, real-time biometric surveillance. (2) High risk (strict requirements) — hiring, credit, law enforcement, healthcare AI. (3) Limited risk (transparency) — chatbots must disclose AI nature, deepfakes labeled. (4) Minimal risk (no requirements) — games, spam filters, most consumer apps. This is the world's first comprehensive AI law.
\`\`\`

### Regulatory Challenges

- **Speed mismatch**: AI evolves in months; regulation takes years
- **Definition problems**: What counts as "AI"? Where's the line?
- **Enforcement**: How do you audit AI systems at scale?
- **Global coordination**: Companies operate globally, regulations are local
- **Innovation vs. safety**: Too much regulation stifles progress; too little enables harm

\`\`\`interactive
You're advising a government on AI regulation. Design a framework that: (1) Protects citizens from AI harms, (2) Doesn't stifle innovation, (3) Is enforceable with current technology, (4) Can adapt as AI capabilities change. What are your top 3 policy recommendations?
\`\`\`

## Economic Impact of AI

### The Job Transformation

AI won't simply "replace jobs" — it will transform them:

| Impact Type | Examples | Timeline |
|------------|---------|----------|
| **Augmentation** | Developers with copilots, writers with AI assistants | Happening now |
| **Automation of tasks** | Data entry, basic analysis, routine customer support | 1-3 years |
| **Role transformation** | Radiologists become AI-assisted diagnosticians | 3-5 years |
| **New roles created** | Prompt engineers, AI trainers, AI ethicists | Happening now |
| **Industry disruption** | AI-native companies outcompete traditional ones | 3-10 years |

### Economic Projections

- **McKinsey**: AI could add $13-22 trillion to the global economy by 2030
- **Goldman Sachs**: AI could automate 25% of work tasks in the US and Europe
- **World Economic Forum**: AI will displace 85 million jobs but create 97 million new ones by 2025
- **IMF**: AI will affect 40% of jobs globally, with advanced economies more exposed

### The Inequality Question

AI's economic benefits may not be distributed equally:

- **Capital vs. labor**: AI increases returns to capital (companies that own AI) more than labor
- **Skill premium**: High-skill workers who use AI effectively gain more than those who don't
- **Geographic concentration**: AI development is concentrated in a few countries and cities
- **Digital divide**: Access to AI tools varies by income, education, and geography

\`\`\`flashcard
How will AI impact jobs according to major economic projections?
---
McKinsey: $13-22T added to global economy by 2030. Goldman Sachs: 25% of work tasks automatable. WEF: 85M jobs displaced but 97M created. IMF: 40% of jobs affected globally. The key insight: AI transforms jobs more than it eliminates them — augmentation and role transformation are more common than outright replacement.
\`\`\`

## Existential Risk and AI Safety

### The Alignment Problem

The core challenge: How do you ensure AI systems do what humans actually want?

| Risk | Description | Severity |
|------|------------|----------|
| **Misalignment** | AI optimizes for the wrong objective | High — could cause large-scale harm |
| **Power-seeking** | Advanced AI acquires resources and influence to achieve goals | Theoretical — debated |
| **Deception** | AI learns to appear aligned while pursuing different goals | Emerging concern — some evidence |
| **Value lock-in** | AI systems encode and perpetuate specific values permanently | Medium — already happening with bias |
| **Recursive self-improvement** | AI improves itself faster than humans can control | Theoretical — no current evidence |

### Safety Research Priorities

| Research Area | Goal | Current State |
|--------------|------|---------------|
| **Interpretability** | Understand what AI models are "thinking" | Active research, early progress |
| **Alignment techniques** | Train AI to follow human values | RLHF, Constitutional AI, debate |
| **Robustness** | AI behaves well even in unusual situations | Improving but not solved |
| **Monitoring** | Detect when AI behaves unexpectedly | Basic tools available |
| **Governance** | Institutional structures for AI oversight | Emerging (AI Safety Institutes) |

### The Debate Spectrum

- **AI doomers**: Existential risk is the #1 priority. Slow down or pause AI development.
- **AI safety researchers**: Risk is real but manageable with proper research and governance.
- **Effective accelerationists (e/acc)**: AI progress is inherently good. Regulation is the real risk.
- **Pragmatists**: Focus on current, concrete harms (bias, misinformation, job displacement) rather than speculative risks.

## AI and Society

### Misinformation and Deepfakes

AI-generated content creates new challenges:
- **Deepfake videos**: Realistic fake videos of public figures
- **Synthetic text**: AI-generated news articles, social media posts
- **Voice cloning**: Convincing fake audio of anyone's voice
- **Image manipulation**: Photorealistic fake images

**Countermeasures**: Content provenance (C2PA), AI detection tools, digital watermarking, media literacy education.

### AI in Education

| Opportunity | Challenge |
|------------|-----------|
| Personalized learning at scale | Academic integrity concerns |
| AI tutors available 24/7 | Over-reliance on AI for thinking |
| Automated grading and feedback | Bias in educational AI |
| Accessibility improvements | Digital divide in access |

### AI and Creativity

The question of AI's role in creative work:
- **Tool view**: AI is a creative tool, like Photoshop or a synthesizer
- **Collaborator view**: AI is a creative partner that contributes ideas
- **Competitor view**: AI replaces human creativity in some domains
- **Copyright questions**: Who owns AI-generated content? Can AI training on copyrighted work be fair use?

\`\`\`flashcard
What is the AI alignment problem?
---
The challenge of ensuring AI systems do what humans actually want. Key risks include: misalignment (wrong objectives), power-seeking behavior, deception (appearing aligned while pursuing different goals), value lock-in (encoding specific values permanently), and recursive self-improvement. Current approaches include RLHF, Constitutional AI, interpretability research, and monitoring.
\`\`\`

## Navigating an AI-Transformed World

### Personal Framework for Thriving

1. **Stay informed, not anxious**: Follow AI developments without doom-scrolling
2. **Build AI fluency**: Understand capabilities and limitations deeply
3. **Develop complementary skills**: Creativity, empathy, judgment, leadership — things AI augments but doesn't replace
4. **Experiment continuously**: Try new AI tools regularly, build intuition
5. **Think ethically**: Consider the impact of AI systems you build or use
6. **Contribute to the conversation**: Engage in policy discussions, share knowledge

### For AI Builders

- Build with safety and ethics from day one, not as an afterthought
- Consider second-order effects: How might your AI system be misused?
- Be transparent about capabilities and limitations
- Invest in evaluation and monitoring
- Engage with the broader AI safety and ethics community

### For Organizations

- Develop an AI governance framework before you need one
- Invest in employee AI literacy and reskilling
- Monitor regulatory developments in your markets
- Build diverse teams to catch blind spots in AI systems
- Plan for multiple AI futures, not just the optimistic one

\`\`\`interactive
Write your personal "AI Future" plan: (1) What AI skills will you develop in the next 6 months? (2) What ethical principles will guide your AI use? (3) How will you stay informed about AI developments? (4) What's one way you'll contribute to responsible AI development?
\`\`\`

## Summary

The future of AI is being shaped by converging forces: the technical race toward more capable systems, the global regulatory response, economic transformation, and fundamental questions about safety and values. Nobody can predict exactly how this plays out, but everyone building or using AI has a role in shaping the outcome. Stay informed, think critically, build responsibly, and remember that the goal isn't just more powerful AI — it's AI that genuinely benefits humanity.

Take the quiz to test your knowledge of AI's future!
`;


// ─── QUIZ QUESTIONS ───

const QUESTIONS_EXP1 = [
  { question_text: 'What is the most common cause of AI application failures in production?', options: [{ text: 'The AI model is not smart enough', is_correct: false }, { text: 'Engineering failures — error handling, latency, scale, edge cases', is_correct: true }, { text: 'Users don\'t understand AI', is_correct: false }, { text: 'Insufficient training data', is_correct: false }], explanation: 'Most production AI failures are engineering failures, not model failures. The model works in a notebook but the application around it doesn\'t handle real-world conditions.', difficulty: 'medium', topic_tag: 'Production AI' },
  { question_text: 'In the Proof of Concept phase, what is the decision gate?', options: [{ text: 'The system handles 1000 requests per second', is_correct: false }, { text: 'All tests pass with 100% accuracy', is_correct: false }, { text: 'AI produces useful output at least 70% of the time', is_correct: true }, { text: 'The UI is fully designed', is_correct: false }], explanation: 'The PoC decision gate is whether AI can solve the problem at all — useful output ~70% of the time. Optimization comes later.', difficulty: 'easy', topic_tag: 'Development Phases' },
  { question_text: 'What is evaluation-driven development?', options: [{ text: 'Writing unit tests before code', is_correct: false }, { text: 'Running eval suites before and after every AI system change to measure impact', is_correct: true }, { text: 'Having users evaluate the product', is_correct: false }, { text: 'Using AI to evaluate other AI', is_correct: false }], explanation: 'Evaluation-driven development means every change goes through: baseline eval → make change → candidate eval → compare → deploy only if better.', difficulty: 'medium', topic_tag: 'Evaluation' },
  { question_text: 'What does the Prompt Registry Pattern provide?', options: [{ text: 'A database of all possible prompts', is_correct: false }, { text: 'Version control, A/B testing, rollback, and analytics for prompts outside application code', is_correct: true }, { text: 'Automatic prompt generation', is_correct: false }, { text: 'A way to encrypt prompts', is_correct: false }], explanation: 'The Prompt Registry separates prompt management from code, enabling versioning, A/B testing, instant rollback, and performance analytics.', difficulty: 'medium', topic_tag: 'Prompt Management' },
  { question_text: 'Which conversation memory pattern is best for very long conversations?', options: [{ text: 'Full history', is_correct: false }, { text: 'Sliding window', is_correct: false }, { text: 'Summary memory — AI summarizes older messages', is_correct: true }, { text: 'No memory', is_correct: false }], explanation: 'Summary memory has the AI summarize older messages, keeping context manageable for very long conversations while retaining key information.', difficulty: 'easy', topic_tag: 'State Management' },
  { question_text: 'What is the recommended approach for Production Hardening?', options: [{ text: 'Skip it and go straight to users', is_correct: false }, { text: 'Implement fallbacks, monitoring, evaluation pipelines, cost optimization, and security', is_correct: true }, { text: 'Just add more API keys', is_correct: false }, { text: 'Only focus on making the model better', is_correct: false }], explanation: 'Production hardening (4-8 weeks) covers provider fallbacks, logging, monitoring, evaluation pipelines, cost optimization, rate limiting, and security.', difficulty: 'medium', topic_tag: 'Development Phases' },
  { question_text: 'What type of feedback is "users editing AI-generated content"?', options: [{ text: 'Explicit feedback', is_correct: false }, { text: 'Implicit feedback', is_correct: true }, { text: 'Direct feedback', is_correct: false }, { text: 'Negative feedback', is_correct: false }], explanation: 'Implicit feedback is inferred from user behavior — edits, retries, acceptance rates — without the user explicitly rating the output.', difficulty: 'easy', topic_tag: 'Feedback Loops' },
  { question_text: 'Why should you avoid hardcoding prompts in application code?', options: [{ text: 'It makes the code longer', is_correct: false }, { text: 'It prevents version control, A/B testing, and quick rollback of prompt changes', is_correct: true }, { text: 'Prompts should be in a database', is_correct: false }, { text: 'It\'s a security risk', is_correct: false }], explanation: 'Hardcoded prompts can\'t be versioned, A/B tested, or rolled back independently of code deployments. A prompt registry solves this.', difficulty: 'medium', topic_tag: 'Prompt Management' },
  { question_text: 'What is the gateway pattern in production AI?', options: [{ text: 'A UI design pattern', is_correct: false }, { text: 'A single entry point that routes to multiple AI providers with fallback logic', is_correct: true }, { text: 'A database access pattern', is_correct: false }, { text: 'A testing methodology', is_correct: false }], explanation: 'The gateway pattern provides a single API entry point that can route to multiple AI providers, enabling fallbacks, load balancing, and provider switching.', difficulty: 'hard', topic_tag: 'Architecture' },
  { question_text: 'How should session state be stored in AI applications?', options: [{ text: 'In the browser\'s localStorage', is_correct: false }, { text: 'In the AI model\'s context window', is_correct: false }, { text: 'Server-side with unique session IDs', is_correct: true }, { text: 'In cookies', is_correct: false }], explanation: 'Store conversation state server-side with unique session IDs for security, isolation, and proper session management including timeouts and cleanup.', difficulty: 'medium', topic_tag: 'State Management' },
  { question_text: 'What is the purpose of a golden dataset in evaluation?', options: [{ text: 'Training the AI model', is_correct: false }, { text: '100-500 input/expected-output pairs that measure system quality', is_correct: true }, { text: 'Storing user data', is_correct: false }, { text: 'Benchmarking hardware performance', is_correct: false }], explanation: 'A golden dataset is a curated collection of test cases with expected outputs used to systematically measure and track AI system quality.', difficulty: 'medium', topic_tag: 'Evaluation' },
  { question_text: 'Which evaluation method is best for open-ended text generation?', options: [{ text: 'Exact match', is_correct: false }, { text: 'BLEU score', is_correct: false }, { text: 'LLM-as-judge', is_correct: true }, { text: 'Unit tests', is_correct: false }], explanation: 'LLM-as-judge is fast, relatively cheap, and handles the subjectivity of open-ended generation better than automated metrics like BLEU or exact match.', difficulty: 'medium', topic_tag: 'Evaluation' },
  { question_text: 'What is prompt compression used for?', options: [{ text: 'Making prompts more creative', is_correct: false }, { text: 'Reducing token count to lower costs by 20-40%', is_correct: true }, { text: 'Encrypting prompts', is_correct: false }, { text: 'Translating prompts to other languages', is_correct: false }], explanation: 'Prompt compression reduces the number of tokens in prompts while preserving meaning, typically achieving 20-40% cost reduction.', difficulty: 'easy', topic_tag: 'Cost Optimization' },
  { question_text: 'What is the biggest architecture mistake teams make with AI applications?', options: [{ text: 'Using too many models', is_correct: false }, { text: 'No evaluation pipeline — "it works in testing"', is_correct: true }, { text: 'Using open-source models', is_correct: false }, { text: 'Building a UI too early', is_correct: false }], explanation: 'The most common and costly mistake is not building an evaluation pipeline. Without systematic evaluation, quality issues go undetected until users complain.', difficulty: 'medium', topic_tag: 'Architecture' },
  { question_text: 'What does "closing the feedback loop" mean?', options: [{ text: 'Sending a thank-you email to users', is_correct: false }, { text: 'Collecting feedback, analyzing patterns, improving the system, and verifying improvement', is_correct: true }, { text: 'Removing the feedback button', is_correct: false }, { text: 'Asking users to stop giving feedback', is_correct: false }], explanation: 'Closing the loop means: collect feedback → analyze patterns → add failing cases to evals → improve system → verify with evals → deploy → continue monitoring.', difficulty: 'medium', topic_tag: 'Feedback Loops' },
  { question_text: 'How long does the Production Hardening phase typically take?', options: [{ text: '1-2 days', is_correct: false }, { text: '1-2 weeks', is_correct: false }, { text: '4-8 weeks', is_correct: true }, { text: '6-12 months', is_correct: false }], explanation: 'Production hardening typically takes 4-8 weeks and covers reliability, monitoring, evaluation, cost optimization, and security.', difficulty: 'easy', topic_tag: 'Development Phases' },
  { question_text: 'What is dynamic few-shot prompting?', options: [{ text: 'Randomly selecting examples', is_correct: false }, { text: 'Selecting different examples based on the input to improve quality by 10-30%', is_correct: true }, { text: 'Using fewer examples over time', is_correct: false }, { text: 'A type of model fine-tuning', is_correct: false }], explanation: 'Dynamic few-shot selects the most relevant examples for each specific input, rather than using the same examples for all inputs, improving quality by 10-30%.', difficulty: 'hard', topic_tag: 'Prompt Management' },
  { question_text: 'What is the difference between building an AI demo and a production AI application?', options: [{ text: 'Demos use better models', is_correct: false }, { text: 'Production apps have more features', is_correct: false }, { text: 'Everything around the model: error handling, evaluation, monitoring, cost control, UX', is_correct: true }, { text: 'There is no real difference', is_correct: false }], explanation: 'A demo takes a weekend; production takes months. The difference is the engineering around the model: error handling, evaluation, monitoring, cost control, and user experience.', difficulty: 'easy', topic_tag: 'Production AI' },
  { question_text: 'When should you start monitoring AI costs?', options: [{ text: 'After launch', is_correct: false }, { text: 'When costs become a problem', is_correct: false }, { text: 'From the first API call', is_correct: true }, { text: 'Only for enterprise applications', is_correct: false }], explanation: 'Track costs from the first API call. "We\'ll optimize later" is a common mistake that leads to budget surprises in production.', difficulty: 'easy', topic_tag: 'Cost Optimization' },
  { question_text: 'What is model tiering in cost optimization?', options: [{ text: 'Using only the cheapest model', is_correct: false }, { text: 'Routing different requests to different models based on complexity and cost requirements', is_correct: true }, { text: 'Training multiple versions of the same model', is_correct: false }, { text: 'A pricing strategy for AI products', is_correct: false }], explanation: 'Model tiering routes simple requests to cheaper/faster models and complex requests to more capable/expensive ones, optimizing the cost-quality trade-off.', difficulty: 'hard', topic_tag: 'Cost Optimization' },
];

const QUESTIONS_EXP2 = [
  { question_text: 'What should an AI strategy start with?', options: [{ text: 'Choosing the best AI model', is_correct: false }, { text: 'Business problems and objectives, not technology', is_correct: true }, { text: 'Hiring an AI team', is_correct: false }, { text: 'Building a data warehouse', is_correct: false }], explanation: 'The best AI strategy starts with business problems. Ask "What business outcome do we need?" before "What AI tool should we use?"', difficulty: 'easy', topic_tag: 'AI Strategy' },
  { question_text: 'What is Horizon 1 in the Three Horizons AI strategy?', options: [{ text: 'Transform the business with AI-native products', is_correct: false }, { text: 'Automate entire processes with AI workflows', is_correct: false }, { text: 'Augment existing workflows with AI tools (0-6 months)', is_correct: true }, { text: 'Replace all employees with AI', is_correct: false }], explanation: 'Horizon 1 (0-6 months) focuses on augmentation — deploying AI tools that enhance existing workflows for individual productivity gains.', difficulty: 'medium', topic_tag: 'AI Strategy' },
  { question_text: 'What is the best response to "AI will replace my job"?', options: [{ text: 'Agree and suggest retraining', is_correct: false }, { text: 'Deny it completely', is_correct: false }, { text: 'Frame AI as augmentation, not replacement, with a reskilling plan', is_correct: true }, { text: 'Ignore the concern', is_correct: false }], explanation: 'Address fear by framing AI as augmentation and providing concrete reskilling plans. "It\'ll change jobs. Here\'s our reskilling plan."', difficulty: 'easy', topic_tag: 'Change Management' },
  { question_text: 'What AI adoption rate should organizations target within 12 months?', options: [{ text: '10%', is_correct: false }, { text: '30%', is_correct: false }, { text: '>60% of employees actively using AI', is_correct: true }, { text: '100%', is_correct: false }], explanation: 'Target >60% adoption within 12 months. This requires training, champions, and demonstrating clear value to employees.', difficulty: 'medium', topic_tag: 'AI Metrics' },
  { question_text: 'Which team structure is best for early-stage AI adoption?', options: [{ text: 'Embedded AI specialists in every team', is_correct: false }, { text: 'Centralized AI team serving the whole organization', is_correct: true }, { text: 'No dedicated team — everyone learns AI', is_correct: false }, { text: 'Outsource all AI work', is_correct: false }], explanation: 'A centralized AI team provides consistency and expertise concentration during early adoption. Embedded specialists work better at mature stages.', difficulty: 'medium', topic_tag: 'Team Structure' },
  { question_text: 'What is the AI Value Framework used for?', options: [{ text: 'Calculating AI model accuracy', is_correct: false }, { text: 'Mapping AI initiatives to business value categories with clear measurements', is_correct: true }, { text: 'Pricing AI products', is_correct: false }, { text: 'Evaluating AI vendors', is_correct: false }], explanation: 'The AI Value Framework maps initiatives to five categories: cost reduction, revenue growth, quality improvement, speed improvement, and innovation enablement.', difficulty: 'medium', topic_tag: 'Business Case' },
  { question_text: 'How should you communicate AI ROI to executives?', options: [{ text: 'Focus on technical benchmarks', is_correct: false }, { text: 'Focus on revenue impact, cost savings, and competitive advantage', is_correct: true }, { text: 'Focus on employee satisfaction', is_correct: false }, { text: 'Focus on the number of AI tools deployed', is_correct: false }], explanation: 'Executives care about business outcomes: revenue impact, cost savings, and competitive advantage. Tailor the message to the audience.', difficulty: 'easy', topic_tag: 'Stakeholder Communication' },
  { question_text: 'What should you prioritize in the AI initiative prioritization matrix?', options: [{ text: 'Low impact + easy implementation', is_correct: false }, { text: 'High impact + hard implementation first', is_correct: false }, { text: 'High impact + easy implementation (quick wins)', is_correct: true }, { text: 'Whatever the CEO wants', is_correct: false }], explanation: 'Start with high-impact, easy-to-implement quick wins to build momentum and demonstrate value before tackling harder strategic bets.', difficulty: 'easy', topic_tag: 'AI Strategy' },
  { question_text: 'What is the Hub-and-Spoke AI team model?', options: [{ text: 'One person manages all AI', is_correct: false }, { text: 'Central AI team plus embedded specialists in business teams', is_correct: true }, { text: 'AI teams in different countries', is_correct: false }, { text: 'Rotating AI responsibilities', is_correct: false }], explanation: 'Hub-and-spoke combines a central AI team (consistency, expertise) with embedded specialists (domain knowledge, responsiveness). Best for large organizations.', difficulty: 'medium', topic_tag: 'Team Structure' },
  { question_text: 'What are the five components of an AI Governance Framework?', options: [{ text: 'Speed, cost, quality, scale, security', is_correct: false }, { text: 'Policy, risk assessment, approval process, monitoring, incident response, compliance', is_correct: true }, { text: 'Hiring, training, deploying, monitoring, retiring', is_correct: false }, { text: 'Data, models, prompts, APIs, users', is_correct: false }], explanation: 'AI governance includes: policy (rules), risk assessment, approval process, monitoring, incident response, and compliance with regulations.', difficulty: 'hard', topic_tag: 'AI Governance' },
  { question_text: 'What target ROI should organizations aim for with AI investments?', options: [{ text: '1x — break even', is_correct: false }, { text: '2x', is_correct: false }, { text: '3-5x ROI', is_correct: true }, { text: '10x or don\'t bother', is_correct: false }], explanation: 'Target 3-5x ROI on AI investments, measured as AI costs vs. value generated (cost savings + revenue impact + quality improvements).', difficulty: 'medium', topic_tag: 'AI Metrics' },
  { question_text: 'What is the "Skepticism" stage of AI adoption?', options: [{ text: 'Users actively resist AI', is_correct: false }, { text: 'Users think "AI is just hype" — respond with concrete demos using real company data', is_correct: true }, { text: 'Users are curious about AI', is_correct: false }, { text: 'Users advocate for AI', is_correct: false }], explanation: 'Skepticism ("AI is just hype") is the first stage. Overcome it by showing concrete demos with real company data, not generic AI capabilities.', difficulty: 'easy', topic_tag: 'Change Management' },
  { question_text: 'How many hours per week should AI save per employee?', options: [{ text: '1-2 hours', is_correct: false }, { text: '5-10 hours', is_correct: true }, { text: '20+ hours', is_correct: false }, { text: 'It varies too much to measure', is_correct: false }], explanation: 'Target 5-10 hours saved per employee per week. This is measurable and achievable with proper AI tool deployment and training.', difficulty: 'medium', topic_tag: 'AI Metrics' },
  { question_text: 'What is Horizon 3 in AI strategy?', options: [{ text: 'Augmenting existing workflows', is_correct: false }, { text: 'Automating entire processes', is_correct: false }, { text: 'Creating new AI-native products and business models (18+ months)', is_correct: true }, { text: 'Shutting down non-AI products', is_correct: false }], explanation: 'Horizon 3 (18+ months) is transformation — creating entirely new products, services, or business models that are only possible with AI.', difficulty: 'medium', topic_tag: 'AI Strategy' },
  { question_text: 'What quality error rate reduction should AI deliver?', options: [{ text: '5-10%', is_correct: false }, { text: '30-50% reduction', is_correct: true }, { text: '100% elimination', is_correct: false }, { text: 'Error rates don\'t change with AI', is_correct: false }], explanation: 'Target 30-50% error rate reduction. AI + human review typically produces fewer errors than either alone.', difficulty: 'medium', topic_tag: 'AI Metrics' },
  { question_text: 'What is the best response to "Our data isn\'t ready for AI"?', options: [{ text: 'Agree and wait until data is perfect', is_correct: false }, { text: 'Start with tools that don\'t need your data, then build data capabilities', is_correct: true }, { text: 'Hire a data team first', is_correct: false }, { text: 'Buy a data platform', is_correct: false }], explanation: 'Start with AI tools that work without proprietary data (writing assistants, code copilots), then build data capabilities for more advanced use cases.', difficulty: 'easy', topic_tag: 'Change Management' },
  { question_text: 'What role does an AI Ethics Officer play?', options: [{ text: 'Writes AI code', is_correct: false }, { text: 'Ensures responsible AI use across the organization', is_correct: true }, { text: 'Manages AI vendors', is_correct: false }, { text: 'Trains AI models', is_correct: false }], explanation: 'AI Ethics Officers ensure responsible AI use — reviewing systems for bias, privacy, safety, and compliance with regulations and organizational values.', difficulty: 'easy', topic_tag: 'Team Structure' },
  { question_text: 'What should you avoid in the AI prioritization matrix?', options: [{ text: 'High impact + easy implementation', is_correct: false }, { text: 'High impact + hard implementation', is_correct: false }, { text: 'Low impact + hard implementation (time sinks)', is_correct: true }, { text: 'All AI initiatives', is_correct: false }], explanation: 'Avoid low-impact, hard-to-implement initiatives — they consume resources without delivering meaningful value. Focus on high-impact opportunities.', difficulty: 'easy', topic_tag: 'AI Strategy' },
  { question_text: 'What employee satisfaction score should AI tools achieve?', options: [{ text: '>2/5', is_correct: false }, { text: '>3/5', is_correct: false }, { text: '>4/5', is_correct: true }, { text: '5/5 or remove the tool', is_correct: false }], explanation: 'Target >4/5 employee satisfaction with AI tools. Lower scores indicate training gaps, poor tool selection, or workflow integration issues.', difficulty: 'easy', topic_tag: 'AI Metrics' },
  { question_text: 'What is the speed mismatch challenge in AI regulation?', options: [{ text: 'AI is too slow for regulators', is_correct: false }, { text: 'AI evolves in months while regulation takes years', is_correct: true }, { text: 'Regulators use faster AI than companies', is_correct: false }, { text: 'There is no speed mismatch', is_correct: false }], explanation: 'AI capabilities evolve in months, but regulatory processes take years. This creates a persistent gap between what AI can do and what regulations address.', difficulty: 'medium', topic_tag: 'AI Governance' },
];

const QUESTIONS_EXP3 = [
  { question_text: 'What is "test-time compute scaling"?', options: [{ text: 'Training models longer', is_correct: false }, { text: 'Making models think longer at inference time for better answers', is_correct: true }, { text: 'Using more GPUs during training', is_correct: false }, { text: 'Scaling the number of users', is_correct: false }], explanation: 'Test-time compute scaling means spending more compute during inference (thinking time) rather than during training. Reasoning models like o1/o3 use this approach.', difficulty: 'medium', topic_tag: 'Reasoning Models' },
  { question_text: 'How do reasoning models differ from standard LLMs?', options: [{ text: 'They have more parameters', is_correct: false }, { text: 'They add a thinking phase with planning, self-verification, and backtracking', is_correct: true }, { text: 'They only work with text', is_correct: false }, { text: 'They are always faster', is_correct: false }], explanation: 'Reasoning models add a thinking phase: plan → reason step-by-step → self-verify → backtrack if needed. They trade latency/cost for better accuracy on complex problems.', difficulty: 'medium', topic_tag: 'Reasoning Models' },
  { question_text: 'What is the advantage of native multimodal models over stitched systems?', options: [{ text: 'They are cheaper', is_correct: false }, { text: 'They understand cross-modal relationships that stitched systems miss', is_correct: true }, { text: 'They are faster', is_correct: false }, { text: 'They use less memory', is_correct: false }], explanation: 'Native multimodal models process all modalities together, understanding relationships (e.g., tone contradicting words) that stitched pipelines lose between steps.', difficulty: 'medium', topic_tag: 'Multimodal AI' },
  { question_text: 'What are world models in AI?', options: [{ text: 'Models trained on global data', is_correct: false }, { text: 'AI systems that build internal representations of physics, causality, and spatial relationships', is_correct: true }, { text: 'Models that work in every country', is_correct: false }, { text: 'The largest AI models available', is_correct: false }], explanation: 'World models build internal representations of how the world works — physics, cause and effect, spatial relationships — enabling simulation and planning.', difficulty: 'medium', topic_tag: 'World Models' },
  { question_text: 'What is Mixture of Experts (MoE)?', options: [{ text: 'A team of human AI experts', is_correct: false }, { text: 'Multiple specialized sub-models with a router that activates only relevant experts per query', is_correct: true }, { text: 'An ensemble of identical models', is_correct: false }, { text: 'A training technique', is_correct: false }], explanation: 'MoE uses multiple specialized sub-models with a router. Only a fraction of parameters are active per query, giving larger capacity with lower per-query compute.', difficulty: 'hard', topic_tag: 'Architectures' },
  { question_text: 'What is the first question in the Hype Filter Framework?', options: [{ text: 'Is it available to use?', is_correct: false }, { text: 'Can independent researchers replicate the results?', is_correct: true }, { text: 'Is it cheaper than existing solutions?', is_correct: false }, { text: 'Does it have a good UI?', is_correct: false }], explanation: 'Reproducibility is the first filter: can independent researchers replicate the claimed results? If not, be very skeptical.', difficulty: 'easy', topic_tag: 'Evaluation Framework' },
  { question_text: 'What generation of AI agents can use a computer like a human?', options: [{ text: 'Gen 1: Tool use', is_correct: false }, { text: 'Gen 2: Multi-step', is_correct: false }, { text: 'Gen 3: Adaptive — e.g., Claude Computer Use, Devin', is_correct: true }, { text: 'Gen 4: Autonomous', is_correct: false }], explanation: 'Gen 3 adaptive agents like Claude Computer Use and Devin can navigate websites, use desktop apps, and complete multi-step tasks across applications.', difficulty: 'medium', topic_tag: 'AI Agents' },
  { question_text: 'What is the key advantage of State Space Models (SSMs) over Transformers?', options: [{ text: 'Better accuracy on all tasks', is_correct: false }, { text: 'Linear scaling with sequence length vs. quadratic for Transformers', is_correct: true }, { text: 'Easier to train', is_correct: false }, { text: 'They don\'t need GPUs', is_correct: false }], explanation: 'SSMs like Mamba process sequences with linear scaling (vs. quadratic for Transformers), making them potentially better for very long contexts.', difficulty: 'hard', topic_tag: 'Architectures' },
  { question_text: 'What is "Agentic RAG"?', options: [{ text: 'RAG that works automatically', is_correct: false }, { text: 'Agents that decide what to retrieve and when, rather than following a fixed retrieval pipeline', is_correct: true }, { text: 'RAG for agent documentation', is_correct: false }, { text: 'A type of vector database', is_correct: false }], explanation: 'Agentic RAG gives AI agents the ability to decide what information to retrieve and when, rather than following a fixed retrieval pipeline.', difficulty: 'hard', topic_tag: 'RAG Evolution' },
  { question_text: 'What is the trust challenge with autonomous AI agents?', options: [{ text: 'They cost too much', is_correct: false }, { text: 'Determining authority levels, approval requirements, auditability, and error handling', is_correct: true }, { text: 'They are too slow', is_correct: false }, { text: 'They can\'t learn new tasks', is_correct: false }], explanation: 'As agents become more autonomous, key questions arise: How much authority? What needs human approval? How to audit actions? What happens when they make costly mistakes?', difficulty: 'medium', topic_tag: 'AI Agents' },
  { question_text: 'Which benchmark measures real-world software engineering ability?', options: [{ text: 'MMLU', is_correct: false }, { text: 'GSM8K', is_correct: false }, { text: 'SWE-bench', is_correct: true }, { text: 'MT-Bench', is_correct: false }], explanation: 'SWE-bench evaluates AI on real GitHub issue resolution — actual software engineering tasks, not just code generation.', difficulty: 'easy', topic_tag: 'Benchmarks' },
  { question_text: 'What does the paradigm shift from "bigger models" to "smarter models" mean?', options: [{ text: 'Using smaller models for everything', is_correct: false }, { text: 'Instead of more parameters, using more compute at inference time (reasoning)', is_correct: true }, { text: 'Making models physically smaller', is_correct: false }, { text: 'Using fewer training examples', is_correct: false }], explanation: 'The shift is from scaling parameters (bigger) to scaling inference compute (smarter). Reasoning models think longer rather than being larger.', difficulty: 'medium', topic_tag: 'Reasoning Models' },
  { question_text: 'What is spatial reasoning in multimodal AI?', options: [{ text: 'Understanding geographic locations', is_correct: false }, { text: 'Understanding 3D space from 2D images', is_correct: true }, { text: 'Navigating physical spaces', is_correct: false }, { text: 'Arranging UI elements', is_correct: false }], explanation: 'Spatial reasoning is the ability to understand 3D spatial relationships from 2D images — depth, object positions, physical layout.', difficulty: 'easy', topic_tag: 'Multimodal AI' },
  { question_text: 'Why might high benchmark scores not guarantee real-world performance?', options: [{ text: 'Benchmarks are always wrong', is_correct: false }, { text: 'Contamination, overfitting, cherry-picking, and misalignment with real tasks', is_correct: true }, { text: 'Real-world tasks are easier', is_correct: false }, { text: 'Benchmarks test harder problems', is_correct: false }], explanation: 'Benchmark scores can be misleading due to data contamination, overfitting to benchmark formats, cherry-picked reporting, and misalignment with actual use cases.', difficulty: 'medium', topic_tag: 'Evaluation Framework' },
  { question_text: 'What enables world models to be proactive rather than reactive?', options: [{ text: 'Faster processing speed', is_correct: false }, { text: 'The ability to simulate outcomes before taking action', is_correct: true }, { text: 'More training data', is_correct: false }, { text: 'Better user interfaces', is_correct: false }], explanation: 'World models can simulate outcomes, plan multi-step strategies, and understand cause and effect — enabling proactive behavior rather than just responding to inputs.', difficulty: 'medium', topic_tag: 'World Models' },
  { question_text: 'What is cross-modal generation?', options: [{ text: 'Generating content in multiple languages', is_correct: false }, { text: 'Creating content in one modality based on another, like a song matching an image\'s mood', is_correct: true }, { text: 'Converting files between formats', is_correct: false }, { text: 'Training on multiple datasets', is_correct: false }], explanation: 'Cross-modal generation creates content in one modality informed by another — e.g., "Create a song that matches the mood of this image."', difficulty: 'easy', topic_tag: 'Multimodal AI' },
  { question_text: 'What is the router in a Mixture of Experts architecture?', options: [{ text: 'A network device', is_correct: false }, { text: 'A component that decides which expert sub-model handles each input', is_correct: true }, { text: 'A training scheduler', is_correct: false }, { text: 'A load balancer for API requests', is_correct: false }], explanation: 'The MoE router analyzes each input and decides which specialized expert sub-models should process it, activating only a fraction of total parameters.', difficulty: 'medium', topic_tag: 'Architectures' },
  { question_text: 'What are reasoning models best suited for?', options: [{ text: 'Creative writing and brainstorming', is_correct: false }, { text: 'Math, logic, coding, and complex analysis', is_correct: true }, { text: 'Simple Q&A', is_correct: false }, { text: 'Image generation', is_correct: false }], explanation: 'Reasoning models excel at tasks requiring step-by-step thinking: math, logic, coding, and complex analysis. Standard LLMs are often better for creative tasks.', difficulty: 'easy', topic_tag: 'Reasoning Models' },
  { question_text: 'What is the "availability" question in the Hype Filter Framework?', options: [{ text: 'Is the paper available online?', is_correct: false }, { text: 'Can you actually use the technology, or is it research-only?', is_correct: true }, { text: 'Is the team available for questions?', is_correct: false }, { text: 'Is the API available 24/7?', is_correct: false }], explanation: 'Availability asks: Can you actually use this technology in production, or is it a research paper with no public access? Many breakthroughs remain research-only.', difficulty: 'easy', topic_tag: 'Evaluation Framework' },
  { question_text: 'What is the key difference between Gen 2 and Gen 3 AI agents?', options: [{ text: 'Gen 3 is faster', is_correct: false }, { text: 'Gen 3 adapts strategy based on results rather than following fixed sequences', is_correct: true }, { text: 'Gen 3 uses more memory', is_correct: false }, { text: 'Gen 3 is cheaper', is_correct: false }], explanation: 'Gen 2 agents plan and execute fixed sequences. Gen 3 agents adapt their strategy based on intermediate results — adjusting approach when things don\'t go as expected.', difficulty: 'hard', topic_tag: 'AI Agents' },
];

const QUESTIONS_EXP4 = [
  { question_text: 'Why is AI evaluation fundamentally different from traditional software testing?', options: [{ text: 'AI is harder to install', is_correct: false }, { text: 'AI outputs are probabilistic and "correct" is often subjective', is_correct: true }, { text: 'AI doesn\'t have bugs', is_correct: false }, { text: 'Traditional testing is more expensive', is_correct: false }], explanation: 'Traditional testing is deterministic (pass/fail). AI evaluation deals with probabilistic outputs, subjective quality, infinite input spaces, and subtle regressions.', difficulty: 'easy', topic_tag: 'Evaluation Fundamentals' },
  { question_text: 'What is the biggest risk in AI systems according to this module?', options: [{ text: 'A spectacular failure', is_correct: false }, { text: 'Gradual quality degradation that nobody notices until users leave', is_correct: true }, { text: 'High costs', is_correct: false }, { text: 'Security breaches', is_correct: false }], explanation: 'Gradual quality degradation is the biggest risk because it\'s invisible without continuous evaluation. Users leave before you realize quality has dropped.', difficulty: 'medium', topic_tag: 'Evaluation Fundamentals' },
  { question_text: 'What is Layer 1 of the Evaluation Pyramid?', options: [{ text: 'Human evaluations', is_correct: false }, { text: 'System evaluations', is_correct: false }, { text: 'Unit evaluations — per-change prompt/response quality checks', is_correct: true }, { text: 'Integration evaluations', is_correct: false }], explanation: 'Layer 1 (Unit Evaluations) runs on every change: individual prompt/response quality, format validation, safety checks, latency and cost measurements.', difficulty: 'easy', topic_tag: 'Evaluation Framework' },
  { question_text: 'What is the main limitation of the MMLU benchmark?', options: [{ text: 'It\'s too expensive to run', is_correct: false }, { text: 'Multiple choice only and memorization is possible', is_correct: true }, { text: 'It only tests coding', is_correct: false }, { text: 'It requires human evaluators', is_correct: false }], explanation: 'MMLU is multiple-choice only, which means models can score well through memorization or elimination rather than genuine understanding.', difficulty: 'medium', topic_tag: 'Benchmarks' },
  { question_text: 'What is benchmark contamination?', options: [{ text: 'Benchmarks becoming outdated', is_correct: false }, { text: 'Models having seen benchmark data during training, inflating scores', is_correct: true }, { text: 'Errors in benchmark datasets', is_correct: false }, { text: 'Running benchmarks on wrong hardware', is_correct: false }], explanation: 'Contamination occurs when benchmark data leaks into training data, allowing models to "memorize" answers rather than genuinely solving problems.', difficulty: 'medium', topic_tag: 'Benchmarks' },
  { question_text: 'How many test inputs should a custom benchmark have?', options: [{ text: '10-20', is_correct: false }, { text: '50-100', is_correct: false }, { text: '200-500 real examples from actual users', is_correct: true }, { text: '1000+', is_correct: false }], explanation: 'Custom benchmarks need 200-500 real inputs from actual users, stratified by difficulty (40% easy, 40% medium, 20% hard) with adversarial cases.', difficulty: 'medium', topic_tag: 'Custom Benchmarks' },
  { question_text: 'What is the "self-preference" limitation of LLM-as-Judge?', options: [{ text: 'The judge prefers shorter answers', is_correct: false }, { text: 'The judge favors outputs in its own style when used as both generator and judge', is_correct: true }, { text: 'The judge always gives high scores', is_correct: false }, { text: 'The judge can\'t read code', is_correct: false }], explanation: 'Self-preference means an LLM rates outputs in its own style higher. Mitigate by using a different model as judge than as generator.', difficulty: 'hard', topic_tag: 'LLM-as-Judge' },
  { question_text: 'How should you mitigate position bias in LLM-as-Judge?', options: [{ text: 'Always put the better answer first', is_correct: false }, { text: 'Randomize the order when comparing two outputs', is_correct: true }, { text: 'Only compare one output at a time', is_correct: false }, { text: 'Use a smaller model as judge', is_correct: false }], explanation: 'Position bias means the judge prefers whichever output appears first (or second). Randomizing order across evaluations neutralizes this bias.', difficulty: 'medium', topic_tag: 'LLM-as-Judge' },
  { question_text: 'When is human evaluation essential?', options: [{ text: 'Always — automated evaluation is never sufficient', is_correct: false }, { text: 'For subjective quality, LLM-judge calibration, discovering unknown failure modes, and safety', is_correct: true }, { text: 'Only for image generation', is_correct: false }, { text: 'Never — LLM-as-judge is always better', is_correct: false }], explanation: 'Humans are essential for subjective quality, calibrating automated judges, discovering failure modes that automated systems miss, and nuanced safety assessment.', difficulty: 'medium', topic_tag: 'Human Evaluation' },
  { question_text: 'What is inter-annotator agreement?', options: [{ text: 'Annotators agreeing on a salary', is_correct: false }, { text: 'A measure of consistency between human evaluators scoring the same outputs', is_correct: true }, { text: 'A legal agreement between evaluators', is_correct: false }, { text: 'The number of annotators needed', is_correct: false }], explanation: 'Inter-annotator agreement measures how consistently different human evaluators score the same outputs. Low agreement indicates unclear rubrics or subjective criteria.', difficulty: 'medium', topic_tag: 'Human Evaluation' },
  { question_text: 'What quality score drop should trigger an alert in a continuous evaluation pipeline?', options: [{ text: 'Any drop at all', is_correct: false }, { text: 'Drop > 0.2 from baseline', is_correct: true }, { text: 'Drop > 1.0 from baseline', is_correct: false }, { text: 'Only if users complain', is_correct: false }], explanation: 'A quality score drop > 0.2 from baseline should trigger an alert. This catches meaningful regressions before they significantly impact users.', difficulty: 'medium', topic_tag: 'Continuous Evaluation' },
  { question_text: 'What is "drift regression" in AI systems?', options: [{ text: 'The model physically moving to a different server', is_correct: false }, { text: 'Gradual quality decline over weeks or months without any specific change', is_correct: true }, { text: 'A sudden model failure', is_correct: false }, { text: 'Users changing their behavior', is_correct: false }], explanation: 'Drift regression is gradual quality decline over time — often caused by changing input distributions, evolving user expectations, or subtle environmental changes.', difficulty: 'hard', topic_tag: 'Regression Detection' },
  { question_text: 'What is the "vibes-based evaluation" anti-pattern?', options: [{ text: 'Using music to evaluate AI', is_correct: false }, { text: 'Saying "it seems good" without quantitative metrics', is_correct: true }, { text: 'Evaluating AI mood', is_correct: false }, { text: 'Using sentiment analysis', is_correct: false }], explanation: '"It seems good" isn\'t measurable or reproducible. Define quantitative metrics with clear thresholds instead of relying on subjective impressions.', difficulty: 'easy', topic_tag: 'Anti-Patterns' },
  { question_text: 'What is prompt injection in adversarial testing?', options: [{ text: 'Adding prompts to the database', is_correct: false }, { text: 'Attempting to override system instructions through user input', is_correct: true }, { text: 'Injecting code into prompts', is_correct: false }, { text: 'A type of SQL injection', is_correct: false }], explanation: 'Prompt injection attempts to override the AI system\'s instructions through crafted user input — a critical security test for any AI application.', difficulty: 'easy', topic_tag: 'Adversarial Testing' },
  { question_text: 'What minimum sample size is needed for statistically significant human evaluation?', options: [{ text: '10-20 examples', is_correct: false }, { text: '50 examples', is_correct: false }, { text: '100-200 examples', is_correct: true }, { text: '1000+ examples', is_correct: false }], explanation: 'At least 100-200 examples are needed for statistical significance in human evaluation. Fewer examples may not represent the true quality distribution.', difficulty: 'medium', topic_tag: 'Human Evaluation' },
  { question_text: 'What should trigger a continuous evaluation pipeline run?', options: [{ text: 'Only when users complain', is_correct: false }, { text: 'New model deployment, prompt change, or scheduled run', is_correct: true }, { text: 'Only on Mondays', is_correct: false }, { text: 'Only before major releases', is_correct: false }], explanation: 'Evaluation pipelines should trigger on any change (model deployment, prompt change) plus scheduled runs to catch drift regression.', difficulty: 'easy', topic_tag: 'Continuous Evaluation' },
  { question_text: 'What is the "benchmark worship" anti-pattern?', options: [{ text: 'Running too many benchmarks', is_correct: false }, { text: 'Optimizing for benchmark scores instead of real user experience', is_correct: true }, { text: 'Creating custom benchmarks', is_correct: false }, { text: 'Ignoring benchmarks entirely', is_correct: false }], explanation: 'Benchmark worship means optimizing for benchmark scores rather than actual user experience. Create custom evals from real usage data instead.', difficulty: 'medium', topic_tag: 'Anti-Patterns' },
  { question_text: 'What format compliance rate should AI outputs maintain?', options: [{ text: 'Above 50%', is_correct: false }, { text: 'Above 80%', is_correct: false }, { text: 'Above 95%', is_correct: true }, { text: '100% always', is_correct: false }], explanation: 'Format compliance (outputs matching expected structure) should stay above 95%. Drops below this indicate prompt issues or model degradation.', difficulty: 'easy', topic_tag: 'Continuous Evaluation' },
  { question_text: 'What is "hallucination probing" in adversarial testing?', options: [{ text: 'Testing if the AI can generate images', is_correct: false }, { text: 'Asking about fictional entities or impossible scenarios to test if the AI fabricates answers', is_correct: true }, { text: 'Testing the AI\'s creativity', is_correct: false }, { text: 'Checking for visual artifacts', is_correct: false }], explanation: 'Hallucination probing tests whether the AI fabricates confident-sounding answers about things that don\'t exist or scenarios that are impossible.', difficulty: 'medium', topic_tag: 'Adversarial Testing' },
  { question_text: 'How many times should you run each LLM-as-Judge evaluation for consistency?', options: [{ text: 'Once is enough', is_correct: false }, { text: '3-5 times, taking the median', is_correct: true }, { text: '10+ times', is_correct: false }, { text: '100 times', is_correct: false }], explanation: 'Run each evaluation 3-5 times and take the median to mitigate LLM-judge inconsistency. Single runs can produce unreliable scores.', difficulty: 'medium', topic_tag: 'LLM-as-Judge' },
];

const QUESTIONS_EXP5 = [
  { question_text: 'What is Artificial General Intelligence (AGI)?', options: [{ text: 'AI that is very good at one task', is_correct: false }, { text: 'AI that matches or exceeds human cognitive abilities across virtually all domains', is_correct: true }, { text: 'AI that can generate images', is_correct: false }, { text: 'AI that runs on general-purpose hardware', is_correct: false }], explanation: 'AGI refers to AI with human-level (or beyond) cognitive abilities across all domains — reasoning, learning, creativity, adaptation — not just narrow tasks.', difficulty: 'easy', topic_tag: 'AGI' },
  { question_text: 'What do "accelerationists" believe about AGI timelines?', options: [{ text: 'AGI will never happen', is_correct: false }, { text: 'AGI is 2-5 years away due to scaling laws and emergent capabilities', is_correct: true }, { text: 'AGI is 50+ years away', is_correct: false }, { text: 'AGI already exists', is_correct: false }], explanation: 'Accelerationists believe scaling laws continue and emergent capabilities appear suddenly, putting AGI just 2-5 years away.', difficulty: 'easy', topic_tag: 'AGI' },
  { question_text: 'What is the EU AI Act?', options: [{ text: 'A voluntary AI guideline', is_correct: false }, { text: 'The world\'s first comprehensive AI law with risk-based categories', is_correct: true }, { text: 'A US federal law', is_correct: false }, { text: 'An AI model developed by the EU', is_correct: false }], explanation: 'The EU AI Act (2024) is the world\'s first comprehensive AI law, categorizing AI systems by risk level with corresponding requirements.', difficulty: 'easy', topic_tag: 'Regulation' },
  { question_text: 'Which AI applications are banned under the EU AI Act?', options: [{ text: 'All AI chatbots', is_correct: false }, { text: 'Social scoring, real-time biometric surveillance, and manipulative AI', is_correct: true }, { text: 'AI in healthcare', is_correct: false }, { text: 'Open-source AI models', is_correct: false }], explanation: 'The "unacceptable risk" category bans social scoring systems, real-time biometric surveillance in public spaces, and AI designed to manipulate behavior.', difficulty: 'medium', topic_tag: 'Regulation' },
  { question_text: 'What is the "scaling hypothesis" in AI?', options: [{ text: 'AI companies need to scale their teams', is_correct: false }, { text: 'Intelligence emerges from scale — bigger models, more data, more compute yield better capabilities', is_correct: true }, { text: 'AI models should be made smaller', is_correct: false }, { text: 'AI needs to scale to more users', is_correct: false }], explanation: 'The scaling hypothesis argues that intelligence emerges from scale: more parameters, more data, more compute → better capabilities. GPT-3→GPT-4 supported this.', difficulty: 'medium', topic_tag: 'AGI' },
  { question_text: 'According to Goldman Sachs, what percentage of work tasks could AI automate?', options: [{ text: '5%', is_correct: false }, { text: '25% of tasks in the US and Europe', is_correct: true }, { text: '75%', is_correct: false }, { text: '100%', is_correct: false }], explanation: 'Goldman Sachs estimates AI could automate approximately 25% of work tasks in the US and Europe, affecting a wide range of industries.', difficulty: 'medium', topic_tag: 'Economic Impact' },
  { question_text: 'What is the AI alignment problem?', options: [{ text: 'Aligning AI models with hardware', is_correct: false }, { text: 'Ensuring AI systems do what humans actually want', is_correct: true }, { text: 'Aligning AI teams across organizations', is_correct: false }, { text: 'Making AI outputs consistent', is_correct: false }], explanation: 'The alignment problem is the challenge of ensuring AI systems pursue objectives that are truly aligned with human values and intentions.', difficulty: 'easy', topic_tag: 'AI Safety' },
  { question_text: 'What is the "speed mismatch" challenge in AI regulation?', options: [{ text: 'AI is too slow', is_correct: false }, { text: 'AI evolves in months while regulation takes years', is_correct: true }, { text: 'Regulators work too fast', is_correct: false }, { text: 'AI companies move too slowly', is_correct: false }], explanation: 'AI capabilities evolve in months, but regulatory processes take years. This creates a persistent gap between what AI can do and what regulations address.', difficulty: 'easy', topic_tag: 'Regulation' },
  { question_text: 'What is the "capital vs. labor" concern with AI economics?', options: [{ text: 'AI is too expensive to build', is_correct: false }, { text: 'AI increases returns to companies that own AI more than to workers', is_correct: true }, { text: 'Workers prefer capital-intensive jobs', is_correct: false }, { text: 'AI reduces the cost of capital', is_correct: false }], explanation: 'AI may increase inequality because returns flow more to capital (companies owning AI) than to labor (workers), widening the wealth gap.', difficulty: 'hard', topic_tag: 'Economic Impact' },
  { question_text: 'What is Constitutional AI?', options: [{ text: 'AI that follows a country\'s constitution', is_correct: false }, { text: 'An alignment technique that trains AI to follow a set of principles', is_correct: true }, { text: 'AI used in government', is_correct: false }, { text: 'A legal framework for AI', is_correct: false }], explanation: 'Constitutional AI is an alignment technique where the AI is trained to follow a set of principles (a "constitution") that guide its behavior toward safety and helpfulness.', difficulty: 'hard', topic_tag: 'AI Safety' },
  { question_text: 'What are deepfakes?', options: [{ text: 'Fake AI companies', is_correct: false }, { text: 'AI-generated realistic fake videos, audio, or images of real people', is_correct: true }, { text: 'Deep learning models that fail', is_correct: false }, { text: 'Fake benchmarks', is_correct: false }], explanation: 'Deepfakes are AI-generated realistic fake content — videos, audio, or images — that convincingly depict real people saying or doing things they never did.', difficulty: 'easy', topic_tag: 'Society' },
  { question_text: 'What is C2PA in the context of AI-generated content?', options: [{ text: 'A programming language', is_correct: false }, { text: 'Content provenance standard for tracking the origin and history of digital content', is_correct: true }, { text: 'A type of AI model', is_correct: false }, { text: 'A social media platform', is_correct: false }], explanation: 'C2PA (Coalition for Content Provenance and Authenticity) is a standard for tracking digital content origin and edit history — a countermeasure against deepfakes.', difficulty: 'hard', topic_tag: 'Society' },
  { question_text: 'What is the "pragmatist" position on AI existential risk?', options: [{ text: 'AI will definitely destroy humanity', is_correct: false }, { text: 'Focus on current concrete harms (bias, misinformation, jobs) rather than speculative risks', is_correct: true }, { text: 'AI risk is zero', is_correct: false }, { text: 'Pause all AI development', is_correct: false }], explanation: 'Pragmatists argue we should focus on current, concrete AI harms — bias, misinformation, job displacement — rather than speculative existential risks.', difficulty: 'medium', topic_tag: 'AI Safety' },
  { question_text: 'What is the US approach to AI regulation?', options: [{ text: 'Comprehensive like the EU', is_correct: false }, { text: 'Sector-specific and innovation-friendly with executive orders and voluntary commitments', is_correct: true }, { text: 'No regulation at all', is_correct: false }, { text: 'State-controlled like China', is_correct: false }], explanation: 'The US takes a sector-specific, innovation-friendly approach with executive orders, state-level laws, and voluntary industry commitments rather than comprehensive legislation.', difficulty: 'medium', topic_tag: 'Regulation' },
  { question_text: 'What does interpretability research in AI safety aim to achieve?', options: [{ text: 'Making AI explain jokes', is_correct: false }, { text: 'Understanding what AI models are "thinking" internally', is_correct: true }, { text: 'Making AI speak more languages', is_correct: false }, { text: 'Improving AI user interfaces', is_correct: false }], explanation: 'Interpretability research aims to understand the internal representations and reasoning processes of AI models — what they\'re "thinking" and why they produce specific outputs.', difficulty: 'medium', topic_tag: 'AI Safety' },
  { question_text: 'According to the IMF, what percentage of jobs globally will be affected by AI?', options: [{ text: '10%', is_correct: false }, { text: '25%', is_correct: false }, { text: '40%', is_correct: true }, { text: '80%', is_correct: false }], explanation: 'The IMF estimates AI will affect 40% of jobs globally, with advanced economies being more exposed than developing ones.', difficulty: 'medium', topic_tag: 'Economic Impact' },
  { question_text: 'What is the "tool view" of AI in creativity?', options: [{ text: 'AI replaces human creativity', is_correct: false }, { text: 'AI is a creative tool like Photoshop or a synthesizer', is_correct: true }, { text: 'AI has no role in creativity', is_correct: false }, { text: 'AI is a creative competitor', is_correct: false }], explanation: 'The tool view sees AI as a creative instrument — like Photoshop or a synthesizer — that enhances human creativity rather than replacing or competing with it.', difficulty: 'easy', topic_tag: 'Society' },
  { question_text: 'What is "value lock-in" as an AI risk?', options: [{ text: 'AI systems becoming too expensive to change', is_correct: false }, { text: 'AI systems encoding and perpetuating specific values permanently', is_correct: true }, { text: 'Users becoming locked into one AI vendor', is_correct: false }, { text: 'AI values increasing over time', is_correct: false }], explanation: 'Value lock-in is the risk that AI systems encode specific values, biases, or worldviews and perpetuate them at scale, making them difficult to change.', difficulty: 'hard', topic_tag: 'AI Safety' },
  { question_text: 'What complementary skills should humans develop alongside AI fluency?', options: [{ text: 'Only technical skills', is_correct: false }, { text: 'Creativity, empathy, judgment, and leadership', is_correct: true }, { text: 'Only data science', is_correct: false }, { text: 'Skills AI is already good at', is_correct: false }], explanation: 'Develop skills AI augments but doesn\'t replace: creativity, empathy, judgment, and leadership. These become more valuable as AI handles routine cognitive tasks.', difficulty: 'easy', topic_tag: 'Future Skills' },
  { question_text: 'What is the "middle ground" position on the scaling hypothesis?', options: [{ text: 'Scale doesn\'t matter at all', is_correct: false }, { text: 'Scaling is necessary but not sufficient — we need both scale AND architectural innovation', is_correct: true }, { text: 'Only scale matters', is_correct: false }, { text: 'We should stop scaling immediately', is_correct: false }], explanation: 'The middle ground says scaling is necessary but not sufficient. We need both scale AND new architectures (reasoning, agents, world models) to approach AGI.', difficulty: 'medium', topic_tag: 'AGI' },
];


// ─── MAIN EXECUTION ───

const ALL_CONTENT = [CONTENT_EXP1, CONTENT_EXP2, CONTENT_EXP3, CONTENT_EXP4, CONTENT_EXP5];
const ALL_QUESTIONS = [QUESTIONS_EXP1, QUESTIONS_EXP2, QUESTIONS_EXP3, QUESTIONS_EXP4, QUESTIONS_EXP5];

async function main() {
  console.log('\n🚀 Seeding 5 Expert Modules...\n');

  try {
    // Get advanced module IDs for prerequisites
    const advIds = await getAdvancedIds();
    if (Object.keys(advIds).length < 5) {
      throw new Error(`Expected 5 advanced modules, found ${Object.keys(advIds).length}. Run seed-advanced-modules.js first.`);
    }
    console.log('📋 Found advanced module IDs for prerequisites\n');

    const EXPERT_MODULES = buildModules(advIds);

    // Clean up existing expert modules
    const { data: existing } = await supabase
      .from('learning_modules')
      .select('id')
      .eq('level', 'expert');

    if (existing && existing.length > 0) {
      console.log(`⚠️  Cleaning up ${existing.length} existing expert modules...`);
      const ids = existing.map(m => m.id);
      await supabase.from('quiz_questions').delete().in('module_id', ids);
      await supabase.from('module_completions').delete().in('module_id', ids);
      await supabase.from('quiz_attempts').delete().in('module_id', ids);
      await supabase.from('learning_modules').delete().in('id', ids);
      console.log('   Done.\n');
    }

    // Insert modules
    console.log('📚 Creating expert modules...');
    const { data: created, error: modErr } = await supabase
      .from('learning_modules')
      .insert(EXPERT_MODULES)
      .select();

    if (modErr) throw new Error(`Module insert failed: ${modErr.message}`);
    console.log(`   ✅ Created ${created.length} modules\n`);

    // Update content and insert questions
    for (let i = 0; i < created.length; i++) {
      const mod = created[i];
      const content = ALL_CONTENT[i];
      const questions = ALL_QUESTIONS[i];

      const { error: cErr } = await supabase
        .from('learning_modules')
        .update({ content })
        .eq('id', mod.id);
      if (cErr) throw new Error(`Content update for "${mod.title}" failed: ${cErr.message}`);

      const qWithId = questions.map(q => ({ ...q, module_id: mod.id, is_active: true }));
      const { data: ins, error: qErr } = await supabase
        .from('quiz_questions')
        .insert(qWithId)
        .select();
      if (qErr) throw new Error(`Questions for "${mod.title}" failed: ${qErr.message}`);

      console.log(`   ✅ Module ${i + 1} "${mod.title}": ${content.length} chars, ${ins.length} questions`);
    }

    // Set up linear prerequisites within expert level
    console.log('\n🔗 Setting up inter-module prerequisites...');
    for (let i = 1; i < created.length; i++) {
      const prev = created[i - 1];
      const curr = created[i];
      const prereqs = [...new Set([...(EXPERT_MODULES[i].prerequisites || []), prev.id])];
      await supabase.from('learning_modules').update({ prerequisites: prereqs }).eq('id', curr.id);
    }
    console.log('   ✅ Prerequisites configured\n');

    // Verify
    console.log('🔍 Verifying...');
    for (const mod of created) {
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

    console.log('\n✅ Expert modules seeded successfully!\n');
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.error(err);
    process.exit(1);
  }
}

main();
