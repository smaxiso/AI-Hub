const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const MODULE_TITLE = 'AI Image Generation Basics';

const EXPANDED_CONTENT = `
# Master AI Image Generation

Welcome to the visual revolution! AI image generators like **MidJourney**, **DALL-E 3**, and **Stable Diffusion** can turn text into stunning visuals. But to go from "cool" to "professional," you need to understand the engine under the hood.

## 1. How It Works: Diffusion Models
Most modern tools use **Diffusion Models**. Imagine taking a clear photo and slowly adding static (noise) until it's just a grey mess. The AI is trained to *reverse* this process—starting with random noise and "denoising" it step-by-step guided by your text prompt until a clear image emerges.

> **Key Concept:** This is why results can be random. The AI effectively "hallucinates" a structured image out of random chaos.

---

## 2. The Core Formula
A professional prompt usually follows this structure (The S.M.L.C. Method):

**[Subject]** + **[Medium]** + **[Lighting/Color]** + **[Composition]** + **[Parameters]**

### Example Breakdown
| Component | Prompt Segment |
| :--- | :--- |
| **Subject** | "A futuristic cyberpunk detective standing in rain" |
| **Medium** | "Digital art, trending on ArtStation, Unreal Engine 5 render" |
| **Lighting** | "Volumetric neon lighting, cyan and magenta glow, dark shadows" |
| **Composition** | "Low angle shot, wide angle lens, rule of thirds" |
| **Parameters** | "--ar 16:9 --v 6.0" |

---

## 3. Style Keywords (The "Secret Sauce")
To escape the generic "AI look," you must specify the **Medium**.

### Photorealism
*   **Keywords:** "Canon EOS 5D", "f/2.8", "ISO 100" (clean/sharp), "8k resolution", "Macro photography" (for close-ups).
*   **Effect:** Makes the image look like a high-end photograph.

### 3D & Digital Art
*   **Keywords:** "Octane Render", "Unreal Engine 5", "Ray Tracing", "Blender".
*   **Effect:** Creates a polished, high-fidelity 3D CGI look.

### Artistic Styles
*   **Keywords:** "Synthwave" (Retro 80s neon), "Vector Art" (Clean lines, flat), "Oil Painting", "Impressionist".
*   **Artists:** invoking names like "Salvador Dalí" (Surrealism) or "Van Gogh" can instantly apply their signature style.

---

## 4. Advanced Parameters (Controlling the AI)
Most tools accept "flags" or parameters at the end of the prompt.

### \`--ar\` (Aspect Ratio)
*   **1:1 (Square):** Default. Good for social media profiles.
*   **16:9 (Landscape):** Cinematic, TV, Youtube thumbnails.
*   **9:16 (Portrait):** TikTok, Reels, Phone wallpapers.

### \`--no\` (Negative Prompting)
Tells the AI what to **avoid**.
*   *Usage:* "A beautiful portrait --no glasses"
*   *MidJourney shortcut:* \`--no\`
*   *Stable Diffusion:* Put these in the "Negative Prompt" box.
*   *Common Negatives:* "text, watermark, blurry, deformed hands, extra fingers".

### \`--chaos\` or CFG Scale
*   **Chaos (MidJourney):** How "weird" or different the results should be. High chaos = unexpected results.
*   **CFG Scale (Stable Diffusion):** "Classifier Free Guidance".
    *   **High CFG (15+):** Strictly follows your prompt (can look stiff).
    *   **Low CFG (7):** Balanced creativity.

### \`--seed\` (Consistency)
Random noise usually means every image is different. If you set a specific **Seed** number (e.g., \`--seed 1234\`), the AI uses the same starting noise. This allows you to generate the *exact same image* again.

---

## 5. Troubleshooting Common Issues

### "The hands look wrong!"
AI struggles with anatomy (hands, feet, teeth) because it sees them in many complex positions in training data.
*   **Fix:** Use **Inpainting**. Select just the hand and ask the AI to regenerate *only that area*.
*   **Fix:** Hide hands in pockets or crop the image.

### "There is gibberish text!"
AI treats text as "shapes," not language. It tries to mimic the *look* of letters without knowing how to spell.
*   **Fix:** Use tools specifically generating text (like DALL-E 3) or add text later in Photoshop.

### "It keeps ignoring my main subject!"
*   **Fix:** Move the most important words to the **start** of the prompt.
*   **Fix:** Use **Prompt Weighting**. (e.g., \`cat::2 dog::1\` makes the cat twice as important as the dog).

---

## 6. Ethics & Safety

*   **Copyright:** In the US, purely AI-generated images typically **cannot be copyrighted** because they lack human authorship. You own the prompt, but not the raw output.
*   **Deepfakes:** Creating realistic images of real people (without consent) is a major ethical violation. Most platforms ban this.
*   **Bias:** AI models train on internet data, so they often reproduce stereotypes (e.g., assuming a "CEO" is always a man in a suit). Be specific in your prompt to counter this (e.g., "A female CEO").

\`\`\`flashcard
Inpainting---The process of fixing or regenerating a specific part *inside* an image (like fixing a face) while keeping the rest unchanged.
\`\`\`

## Interactive Exercise
Use the **Magic Prompt Tool** (click "Open Magic Prompt Tool" below) to generate a prompt for:
*"A cyberpunk city in the style of Van Gogh, aspect ratio 16:9"*
Then try adding a negative prompt to remove "cars".

\`\`\`interactive
Write a prompt for a "Cyberpunk Van Gogh City".
\`\`\`
`;

async function expandModule3() {
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

expandModule3();
