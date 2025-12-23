const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_KEY in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyData() {
    console.log('\n🔍 Verifying Learning Platform Data...\n');

    try {
        // Check modules
        const { data: modules, error: modulesError } = await supabase
            .from('learning_modules')
            .select('level, order_index, title, is_published')
            .order('level')
            .order('order_index');

        if (modulesError) {
            console.error('❌ Error fetching modules:', modulesError.message);
            return;
        }

        console.log(`📚 Modules (${modules.length}):`);
        modules.forEach(m => {
            console.log(`  ${m.is_published ? '✅' : '⏸️ '} [${m.level}] ${m.order_index}. ${m.title}`);
        });

        // Count by level
        const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
        console.log('\n📊 Modules by Level:');
        for (const level of levels) {
            const count = modules.filter(m => m.level === level).length;
            console.log(`  ${level.padEnd(15)}: ${count}`);
        }

        // Check questions
        const { data: questions, error: questionsError } = await supabase
            .from('quiz_questions')
            .select('module_id, is_active');

        if (!questionsError) {
            console.log(`\n❓ Total Quiz Questions: ${questions.length}`);
            console.log(`   Active: ${questions.filter(q => q.is_active).length}`);
        }

        // Check progress
        const { count: progressCount } = await supabase
            .from('user_progress')
            .select('*', { count: 'exact', head: true });

        const { count: completionsCount } = await supabase
            .from('module_completions')
            .select('*', { count: 'exact', head: true });

        const { count: attemptsCount } = await supabase
            .from('quiz_attempts')
            .select('*', { count: 'exact', head: true });

        console.log('\n👥 User Activity:');
        console.log(`   Users tracked: ${progressCount || 0}`);
        console.log(`   Completions: ${completionsCount || 0}`);
        console.log(`   Quiz attempts: ${attemptsCount || 0}`);

        console.log('\n✅ Verification complete!\n');

    } catch (err) {
        console.error('❌ Unexpected error:', err.message);
    }
}

verifyData();
