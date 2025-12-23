const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_KEY in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSqlFile(filename) {
    try {
        // Try direct path first, then scripts folder
        let filePath = filename;
        if (!fs.existsSync(filePath)) {
            filePath = path.join(__dirname, 'scripts', filename);
        }

        if (!fs.existsSync(filePath)) {
            // Try relative to project root
            filePath = path.join(process.cwd(), filename);
        }

        if (!fs.existsSync(filePath)) {
            console.error(`❌ File not found: ${filename} (checked current dir, scripts/, and root)`);
            return;
        }

        console.log(`\n📄 Reading ${filename}...`);
        const sql = fs.readFileSync(filePath, 'utf8');

        console.log(`🚀 Executing SQL...`);
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

        if (error) {
            console.error('❌ Error executing SQL:', error.message);
            return;
        }

        console.log('✅ SQL executed successfully!');
        if (data) {
            console.log('\n📊 Results:');
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error('❌ Unexpected error:', err.message);
    }
}

// Get filename from command line arguments
const filename = process.argv[2];

if (!filename) {
    console.log(`
Usage: node run-sql.js <filename>

Examples:
  node run-sql.js verify-learning-data.sql
  node run-sql.js seed-learning-content.sql

Available scripts:
  - verify-learning-data.sql    : Check existing data
  - seed-learning-content.sql   : Add sample modules & questions
`);
    process.exit(0);
}

executeSqlFile(filename);
