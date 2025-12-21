
const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Supabase Admin Client (Service Role Key required for managing users)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // This MUST be the service role key for admin actions
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// PG Client for direct DB access to insert profile
const tryConnect = async () => {
    const connectionStrings = [
        process.env.DATABASE_URL_IPV6,
        process.env.DATABASE_URL_IPV4_SESSION_POOLER,
        process.env.DATABASE_URL_IPV4_TRANSACTION_POOLER
    ].filter(Boolean);

    for (const connectionString of connectionStrings) {
        // console.log(`Trying DB connection...`);
        const client = new Client({ connectionString });
        try {
            await client.connect();
            return client;
        } catch (err) {
            // console.warn(`Connection failed. Retrying...`);
        }
    }
    throw new Error('All DB connection attempts failed.');
};

const OWNER_EMAIL = 'sumit749284@gmail.com';
const OWNER_PASSWORD = 'Password123!'; // Temporary password
const OWNER_NAME = 'Sumit';
const OWNER_USERNAME = 'smaxiso';

async function createOwner() {
    console.log(`Creating Owner account for: ${OWNER_EMAIL}...`);

    // 1. Create Auth User
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: OWNER_EMAIL,
        password: OWNER_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: OWNER_NAME }
    });

    if (userError) {
        if (userError.message.includes('already been registered')) {
            console.log('User already exists in Auth. Updating profile role...');
            // We need to fetch the user ID to update the profile
            // Since we don't have direct access to list users easily without more setup, 
            // we will rely on the user logging in or manually checking. 
            // But better: let's try to get the ID via SQL query by email since we have DB access.
        } else {
            console.error('Error creating auth user:', userError);
            return;
        }
    } else {
        console.log('Auth user created successfully!');
    }

    // 2. Insert/Update Profile with 'owner' role
    let client;
    try {
        client = await tryConnect();

        // Upsert profile based on email lookup (join auth.users is tricky, so we will try to find ID by email from auth.users table if we have permission, OR we rely on the userData.user.id if we just created it)

        let userId;
        if (userData?.user) {
            userId = userData.user.id;
        } else {
            // If user existed, we need to find their ID. 
            // Direct query to auth.users is possible if connected as postgres superuser or similar permissions
            const res = await client.query(`SELECT id FROM auth.users WHERE email = $1`, [OWNER_EMAIL]);
            if (res.rows.length > 0) {
                userId = res.rows[0].id;
            } else {
                console.error('Could not find user ID for existing email.');
                return;
            }
        }

        if (userId) {
            const insertProfileQuery = `
            INSERT INTO profiles (id, email, full_name, username, role)
            VALUES ($1, $2, $3, $4, 'owner')
            ON CONFLICT (id) DO UPDATE 
            SET role = 'owner', full_name = $3, username = $4;
        `;

            await client.query(insertProfileQuery, [userId, OWNER_EMAIL, OWNER_NAME, OWNER_USERNAME]);
            console.log(`Profile for ${OWNER_EMAIL} promoted to OWNER.`);
        }

    } catch (err) {
        console.error('Error updating profile:', err);
    } finally {
        if (client) await client.end();
    }
}

createOwner();
