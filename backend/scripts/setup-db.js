const { Client } = require('pg');
require('dotenv').config();

const tryConnect = async () => {
    const connectionStrings = [
        process.env.DATABASE_URL_IPV6,
        process.env.DATABASE_URL_IPV4_SESSION_POOLER,
        process.env.DATABASE_URL_IPV4_TRANSACTION_POOLER
    ].filter(Boolean);

    for (const connectionString of connectionStrings) {
        console.log(`Trying connection...`);
        const client = new Client({ connectionString });
        try {
            await client.connect();
            console.log('Connected successfully!');
            return client;
        } catch (err) {
            console.warn(`Connection failed: ${err.message}. Retrying with next URL...`);
        }
    }
    throw new Error('All connection attempts failed.');
};

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS tools (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT,
    description TEXT,
    tags TEXT[],
    pricing TEXT,
    use_cases TEXT[],
    added_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`;

async function setup() {
    let client;
    try {
        client = await tryConnect();
        await client.query(createTableQuery);
        console.log('Table "tools" created successfully');
    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        if (client) await client.end();
    }
}

setup();
