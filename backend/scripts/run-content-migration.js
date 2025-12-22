const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL_IPV4_SESSION_POOLER || process.env.DATABASE_URL_IPV6;

if (!connectionString) {
    console.error('Error: Missing DATABASE_URL in .env');
    process.exit(1);
}

const runMigration = async () => {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false } // Supabase requires SSL, but sometimes certs differ
    });

    try {
        await client.connect();
        console.log('Connected to Database.');

        console.log('Running migration: add-content-column.sql...');
        const sqlPath = path.join(__dirname, 'add-content-column.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        await client.query(sql);
        console.log('✅ Migration successful!');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
};

runMigration();
