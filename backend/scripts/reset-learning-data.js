const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Load from backend root

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in ../.env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const resetLearningData = async (email) => {
    if (!email) {
        console.error('Usage: node reset-learning-data.js <email>');
        process.exit(1);
    }

    console.log(`Resetting learning data for: ${email}...`);

    try {
        // 1. Get User ID
        const { data: users, error: userError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single();

        if (userError || !users) {
            console.error('User not found:', userError?.message);
            return;
        }

        const userId = users.id;
        console.log(`Found User ID: ${userId}`);

        // 2. Delete Quiz Attempts
        const { error: quizError } = await supabase
            .from('quiz_attempts')
            .delete()
            .eq('user_id', userId);

        if (quizError) console.error('Error deleting quiz attempts:', quizError.message);
        else console.log('✅ Cleared Quiz Attempts');

        // 3. Delete Module Completions
        const { error: compError } = await supabase
            .from('module_completions')
            .delete()
            .eq('user_id', userId);

        if (compError) console.error('Error deleting completions:', compError.message);
        else console.log('✅ Cleared Module Completions');

        // 4. Reset User Progress
        // Note: We don't delete the row, just reset values, or delete if you want a fresh start.
        // Let's delete it so the backend recreates it on next fetch.
        const { error: progError } = await supabase
            .from('user_progress')
            .delete()
            .eq('user_id', userId);

        if (progError) console.error('Error resetting progress:', progError.message);
        else console.log('✅ Reset User Progress Table');

        console.log('🎉 Reset Complete!');

    } catch (err) {
        console.error('Unexpected error:', err);
    }
};

const email = process.argv[2];
if (require.main === module) {
    resetLearningData(email);
}
