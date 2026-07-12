const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function runMigrations() {
    console.log('🔄 Initializing Formal Database Migration System...\n');

    // Securely pool connections to avoid max_connections limits against transaction poolers
    const connectionString = process.env.DATABASE_URL_IPV4_SESSION_POOLER 
        || process.env.DATABASE_URL_IPV6;
    
    if (!connectionString) {
        console.error('❌ Database connection string is missing.');
        process.exit(1);
    }

    const pool = new Pool({
        connectionString,
        max: 5, // Strict limit to not overwhelm the pooler
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 5000,
    });

    const client = await pool.connect();
    console.log('✅ Connected to database.\n');

    try {
        // 1. Create Migration Tracking Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS _migrations (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);

        // 2. Read Migrations Folder
        const files = fs.readdirSync(MIGRATIONS_DIR)
            .filter(f => f.endsWith('.sql'))
            .sort();

        if (files.length === 0) {
            console.log('⚠️ No migration files found in migrations/ directory.');
            return;
        }

        // 3. Loop and execute in chronological sequence
        for (const file of files) {
            const filePath = path.join(MIGRATIONS_DIR, file);
            
            // Check if already applied
            const checkRes = await client.query('SELECT name FROM _migrations WHERE name = $1', [file]);
            if (checkRes.rows.length > 0) {
                console.log(`⏩ Skipping ${file} (Already Applied)`);
                continue;
            }

            console.log(`⏳ Applying ${file}...`);
            const sql = fs.readFileSync(filePath, 'utf8');

            // 4. Wrap execution in transaction
            await client.query('BEGIN');
            try {
                await client.query(sql);
                await client.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
                await client.query('COMMIT');
                console.log(`✅ Success: ${file}`);
            } catch (err) {
                await client.query('ROLLBACK');
                console.error(`❌ Migration failed at ${file}:`, err.message);
                throw err;
            }
        }

        console.log('\n🎉 All database migrations are up to date!');
        
    } catch (err) {
        console.error('\n🛑 Database Initialization Failed:', err);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigrations();
