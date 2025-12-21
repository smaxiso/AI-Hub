
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env' }); // Load from backend .env

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStorage() {
    console.log('Setting up storage bucket: tool-logos...');

    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
        console.error('Error listing buckets:', listError);
        return;
    }

    const bucketExists = buckets.some(b => b.name === 'tool-logos');

    if (bucketExists) {
        console.log('Bucket "tool-logos" already exists.');
    } else {
        // Create bucket
        const { data, error } = await supabase.storage.createBucket('tool-logos', {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'],
            fileSizeLimit: 5242880 // 5MB
        });

        if (error) {
            console.error('Error creating bucket:', error);
        } else {
            console.log('Bucket "tool-logos" created successfully!');
        }
    }

    // Set up storage policy (This is tricky via client, usually needs SQL or Dashboard)
    console.log('⚠️ Note: You may need to configure Storage Policies (RLS) in the Supabase Dashboard to allow public reads and authenticated uploads.');
}

setupStorage();
