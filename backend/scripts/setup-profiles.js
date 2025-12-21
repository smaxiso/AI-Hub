
const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

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

const createProfilesTableQuery = `
  CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    username TEXT,
    role TEXT CHECK (role IN ('owner', 'admin', 'pending')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`;

// Enable Row Level Security (RLS) - Optional for now but good practice
const enableRLSQuery = `
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
`;

async function setup() {
    let client;
    try {
        client = await tryConnect();

        await client.query(createProfilesTableQuery);
        console.log('Table "profiles" created successfully');

        // Note: We are not enabling RLS policies via SQL here as it can be complex.
        // We will enforce RBAC via backend middleware.

    } catch (err) {
        console.error('Error creating profiles table:', err);
    } finally {
        if (client) await client.end();
    }
}

setup();
