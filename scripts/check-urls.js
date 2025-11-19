import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration
const FILE_PATH = '../src/data/tools.js';
const CONCURRENCY = 5; // Number of simultaneous checks to avoid rate limiting
const TIMEOUT_MS = 5000;

// Helper to get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI Colors for console output
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    gray: "\x1b[90m"
};

async function checkUrl(toolName, url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        // Try a HEAD request first (faster)
        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TheAIHubX-LinkChecker/1.0'
            }
        });

        clearTimeout(timeout);

        if (response.ok) {
            return { status: 'ok', code: response.status };
        } else if (response.status === 405 || response.status === 403) {
            // Some sites block HEAD or bots, try GET
            const getResponse = await fetch(url, {
                method: 'GET',
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
            });
            return getResponse.ok
                ? { status: 'ok', code: getResponse.status }
                : { status: 'error', code: getResponse.status };
        } else {
            return { status: 'error', code: response.status };
        }
    } catch (error) {
        clearTimeout(timeout);
        return { status: 'fail', error: error.message };
    }
}

async function main() {
    const targetFile = path.resolve(__dirname, FILE_PATH);

    console.log(`${colors.cyan}🔍 Scanning for URLs in: ${targetFile}${colors.reset}\n`);

    if (!fs.existsSync(targetFile)) {
        console.error(`${colors.red}Error: File not found!${colors.reset}`);
        process.exit(1);
    }

    const content = fs.readFileSync(targetFile, 'utf8');

    // Regex to find objects with both 'name' and 'url' properties
    // This handles the specific format in your tools.js
    const toolRegex = /name:\s*['"](.+?)['"],\s*[\s\S]*?url:\s*['"](https?:\/\/[^'"]+)['"]/g;

    let match;
    const toolsToCheck = [];

    while ((match = toolRegex.exec(content)) !== null) {
        toolsToCheck.push({ name: match[1], url: match[2] });
    }

    console.log(`${colors.gray}Found ${toolsToCheck.length} tools to validate.${colors.reset}`);

    let passed = 0;
    let failed = 0;
    let warnings = 0;

    // Process in chunks
    for (let i = 0; i < toolsToCheck.length; i += CONCURRENCY) {
        const chunk = toolsToCheck.slice(i, i + CONCURRENCY);
        const promises = chunk.map(async (tool) => {
            const result = await checkUrl(tool.name, tool.url);

            if (result.status === 'ok') {
                console.log(`${colors.green}✓ [${result.code}] ${tool.name}${colors.reset} ${colors.gray}(${tool.url})${colors.reset}`);
                passed++;
            } else if (result.status === 'error') {
                // 403 often means "Bot detected" rather than "Broken link", so we warn instead of fail hard
                if (result.code === 403) {
                    console.log(`${colors.yellow}⚠ [${result.code}] ${tool.name}${colors.reset} - Access Forbidden (Check manually)`);
                    warnings++;
                } else {
                    console.log(`${colors.red}✗ [${result.code}] ${tool.name}${colors.reset} - Broken Link`);
                    failed++;
                }
            } else {
                console.log(`${colors.red}✗ [ERR] ${tool.name}${colors.reset} - ${result.error}`);
                failed++;
            }
        });

        await Promise.all(promises);
    }

    console.log(`\n${colors.cyan}--- Summary ---${colors.reset}`);
    console.log(`Total: ${toolsToCheck.length}`);
    console.log(`${colors.green}Valid: ${passed}${colors.reset}`);
    console.log(`${colors.yellow}Warnings (403): ${warnings}${colors.reset}`);
    console.log(`${colors.red}Broken: ${failed}${colors.reset}`);

    if (failed > 0) process.exit(1);
}

main();