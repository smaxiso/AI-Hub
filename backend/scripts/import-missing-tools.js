const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const csvData = `id,name,url,category,description,tags,pricing,icon,use_cases,added_date
qodo,Qodo,https://qodo.ai,Coding,"AI-powered code quality platform focused on agentic PR reviews, automated test generation, and code integrity at scale. Integrates with VS Code, JetBrains, terminal, and CI pipelines.","coding,test-generation,code-review,quality",Freemium,https://logo.clearbit.com/qodo.ai,"Automated Test Generation,Pull Request Review,Code Quality Analysis",2025-01-01
motion-ai,Motion AI 2.0,https://usemotion.com,Agent,"Intelligent project management orchestration system that uses AI to automatically reschedule tasks, optimize team calendars, and manage multi-step workflows.","productivity,scheduling,automation,project-management",Paid,https://logo.clearbit.com/usemotion.com,"Intelligent Calendar Management,Automated Task Scheduling,Project Workflow Automation",2025-01-01
n8n,n8n,https://n8n.io,Agent,"Open-source workflow automation platform with visual node-based interface and native AI nodes for building custom agentic pipelines without unpredictable API costs.","automation,low-code,open-source,workflows",Freemium,https://logo.clearbit.com/n8n.io,"Self-hosted AI Agents,Business Workflow Automation,API Integration",2025-01-01
langflow,Langflow,https://langflow.org,Agent,"Low-code visual builder for designing agentic conversations and complex RAG (Retrieval-Augmented Generation) workflows with drag-and-drop interface.","low-code,rag,conversation-design,open-source",Free,https://logo.clearbit.com/langflow.org,"Building Chatbots,RAG Workflows,Agent Orchestration",2025-01-01
dify,Dify,https://dify.ai,Agent,"Production-ready platform for managing agentic workflows, integrating multiple LLMs under one self-hostable framework for enterprise deployment.","agents,self-hosted,multi-llm,enterprise",Free,https://logo.clearbit.com/dify.ai,"Enterprise Agent Deployment,Multi-LLM Management,Production Workflows",2025-01-01
copilot-studio,Copilot Studio 2025,https://microsoft.com/microsoft-365/copilot/copilot-studio,Agent,"Low-code AI agent builder from Microsoft enabling multi-agent orchestration within the Microsoft 365 ecosystem for enterprise automation.","microsoft,low-code,enterprise,orchestration",Paid,https://logo.clearbit.com/microsoft.com,"M365 Automation,Multi-Agent Systems,Enterprise Workflows",2025-01-01
sintra,Sintra,https://sintra.ai,Agent,"Business-focused AI aggregator featuring persistent 'Brain AI' memory for brand guidelines and cross-session context retention with 12+ specialized AI helpers.","business,multi-model,memory,brand-guidelines",Paid,https://logo.clearbit.com/sintra.ai,"Social Media Automation,Brand-Consistent Content,Business Analysis",2025-01-01
ollama,Ollama,https://ollama.com,Coding,"Lightweight framework for serving and managing large language models locally on your own hardware for maximum privacy and zero API costs.","local-llm,open-source,privacy,self-hosted",Free,https://logo.clearbit.com/ollama.com,"Local LLM Deployment,Privacy-First AI,Offline Coding Assistant",2025-01-01
ideogram,Ideogram 2.0,https://ideogram.ai,Image,"AI branding and design suite specializing in high-fidelity typography, used for generating professional logos, brand kits, and social templates.","typography,branding,design,logos",Freemium,https://logo.clearbit.com/ideogram.ai,"Logo Design,Brand Kit Creation,Social Media Templates",2025-01-01
futurepedia,Futurepedia,https://futurepedia.io,Other,"Premier AI tool directory categorizing over 5,700 verified tools with expert reviews, tutorials, and Editor's Picks to filter market noise.","directory,discovery,education,reviews",Free,https://logo.clearbit.com/futurepedia.io,"Tool Discovery,AI Skill Building,Product Comparison",2025-01-01
taaft,There's An AI For That,https://theresanaiforthat.com,Other,"World's largest AI tool database with 14,000+ applications categorized by specific use cases and launch dates for comprehensive tool discovery.","directory,database,discovery,marketplace",Free,https://logo.clearbit.com/theresanaiforthat.com,"Use Case Search,Tool Discovery,Market Intelligence",2025-01-01
rundown-ai,The Rundown AI,https://therundown.ai,Other,"Largest AI news publisher globally, providing daily five-minute briefings on practical business applications of AI and industry trends.","news,newsletter,business-intelligence,education",Free,https://logo.clearbit.com/therundown.ai,"Daily AI Updates,Business Intelligence,Trend Tracking",2025-01-01
the-batch,The Batch,https://deeplearning.ai/the-batch,Other,"Authoritative weekly AI research analysis from Andrew Ng, bridging technical depth with business accessibility for professionals.","research,newsletter,education,andrew-ng",Free,https://logo.clearbit.com/deeplearning.ai,"Research Insights,Technical Education,Business Strategy",2025-01-01
magentic-one,Magentic-One,https://www.microsoft.com/en-us/research/articles/magentic-one-a-generalist-multi-agent-system-for-solving-complex-tasks,Agent,"Generalist multi-agent system with central Orchestrator coordinating specialized agents for complex file-based and web-based task automation.","multi-agent,orchestration,microsoft-research,automation",Free,https://logo.clearbit.com/microsoft.com,"Complex Web Tasks,File Automation,Multi-Step Workflows",2025-01-01
kiro,Kiro,https://aws.amazon.com/bedrock/agents,Agent,"AWS Bedrock autonomous developer agent capable of managing software development cycles for days with specialized 'powers' via MCP servers.","aws,autonomous,bedrock,developer-agent",Paid,https://logo.clearbit.com/aws.amazon.com,"SDLC Management,Autonomous Development,Virtual Developer",2025-01-01
data-formulator,Data Formulator,https://www.microsoft.com/en-us/research/project/data-formulator,Agent,"Experimental tool from Azure AI that blends natural language with visual interfaces for collaborative data exploration and insight discovery.","data-analytics,visualization,azure,research",Free,https://logo.clearbit.com/microsoft.com,"Data Exploration,Insight Discovery,Visual Analytics",2025-01-01
mistral,Mistral Large 3,https://mistral.ai,Chat,"High-performance open-source Mixture-of-Experts (MoE) model optimized for efficiency on NVIDIA hardware with competitive reasoning capabilities.","open-source,moe,reasoning,nvidia",Freemium,https://logo.clearbit.com/mistral.ai,"Efficient AI Deployment,Complex Reasoning,Cost-Effective Inference",2025-01-01`;

// Parse CSV
const lines = csvData.trim().split('\n');
const headers = lines[0].split(',');
const tools = [];

for (let i = 1; i < lines.length; i++) {
    const values = [];
    let currentValue = '';
    let insideQuotes = false;

    for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];

        if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            values.push(currentValue);
            currentValue = '';
        } else {
            currentValue += char;
        }
    }
    values.push(currentValue); // Push last value

    const tool = {
        id: values[0],
        name: values[1],
        url: values[2],
        category: values[3],
        description: values[4],
        tags: values[5].split(',').map(t => t.trim()),
        pricing: values[6],
        icon: values[7],
        use_cases: values[8].split(',').map(u => u.trim()),
        added_date: values[9]
    };

    tools.push(tool);
}

// Insert tools
async function importTools() {
    console.log(`Importing ${tools.length} tools...`);

    for (const tool of tools) {
        const { data, error } = await supabase
            .from('tools')
            .insert([tool]);

        if (error) {
            console.error(`Error inserting ${tool.name}:`, error.message);
        } else {
            console.log(`✓ Imported: ${tool.name}`);
        }
    }

    console.log('\nImport complete!');
}

importTools();
