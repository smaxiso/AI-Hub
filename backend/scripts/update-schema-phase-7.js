
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
        const client = new Client({ connectionString });
        try {
            await client.connect();
            console.log('Connected to DB...');
            return client;
        } catch (err) { }
    }
    throw new Error('All connection attempts failed.');
};

const updateSchemaQuery = `
  -- Add avatar_url column if it doesn't exist
  ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

  -- Ensure username is unique
  -- First, we try to add the constraint. If duplicates exist, this might fail, 
  -- but since we have very few users, it should be fine.
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_username_key') THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);
    END IF;
  END $$;
`;

async function setup() {
    let client;
    try {
        client = await tryConnect();
        await client.query(updateSchemaQuery);
        console.log('Schema updated successfully: Added avatar_url and UNIQUE constraint on username.');
    } catch (err) {
        console.error('Error updating schema:', err);
    } finally {
        if (client) await client.end();
    }
}

setup();
