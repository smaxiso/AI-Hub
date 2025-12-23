const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Prefer Transaction Pooler for consistency, or Session Pooler
const connectionString = process.env.DATABASE_URL_IPV4_SESSION_POOLER || process.env.DATABASE_URL_IPV6;

if (!connectionString) {
    console.error('❌ Missing DATABASE_URL in .env');
    process.exit(1);
}

async function executeSqlFile(filename) {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false } // Supabase requires SSL
    });

    try {
        await client.connect();

        // Find file
        let filePath = filename;
        if (!fs.existsSync(filePath)) {
            filePath = path.join(__dirname, filename); // Try relative to scripts dir
        }
        if (!fs.existsSync(filePath)) {
            filePath = path.join(process.cwd(), filename); // Try CWD
        }

        if (!fs.existsSync(filePath)) {
            console.error(`❌ File not found: ${filename}`);
            process.exit(1);
        }

        console.log(`\n📄 Reading ${filename}...`);
        const sql = fs.readFileSync(filePath, 'utf8');

        console.log(`🚀 Executing SQL...`);
        await client.query(sql);
        console.log('✅ SQL executed successfully!');

    } catch (err) {
        console.error('❌ Error executing SQL:', err.message);
    } finally {
        await client.end();
    }
}

const filename = process.argv[2];
if (!filename) {
    console.log('Usage: node run-pg-sql.js <filename>');
    process.exit(1);
}

executeSqlFile(filename);
