
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // Service Role Key

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStorage() {
    console.log('Setting up storage bucket: avatars...');

    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
        console.error('Error listing buckets:', listError);
        return;
    }

    const bucketExists = buckets.some(b => b.name === 'avatars');

    if (bucketExists) {
        console.log('Bucket "avatars" already exists.');
    } else {
        const { data, error } = await supabase.storage.createBucket('avatars', {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
            fileSizeLimit: 2097152 // 2MB
        });

        if (error) {
            console.error('Error creating bucket:', error);
        } else {
            console.log('Bucket "avatars" created successfully!');
        }
    }
}

setupStorage();
