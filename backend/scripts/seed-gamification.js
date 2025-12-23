const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ACHIEVEMENTS = [
    {
        name: 'First Step',
        description: 'Complete your first learning module',
        icon_key: 'rocket',
        requirement_type: 'module_count',
        requirement_value: { count: 1 },
        points: 50
    },
    {
        name: 'Quiz Master',
        description: 'Pass 3 quizzes with a perfect 100% score',
        icon_key: 'trophy',
        requirement_type: 'perfect_quizzes',
        requirement_value: { count: 3 },
        points: 100
    },
    {
        name: 'On Fire',
        description: 'Maintain a 3-day learning streak',
        icon_key: 'fire',
        requirement_type: 'streak_days',
        requirement_value: { count: 3 },
        points: 75
    },
    {
        name: 'Beginner Graduate',
        description: 'Complete all Beginner modules',
        icon_key: 'graduation',
        requirement_type: 'level_complete',
        requirement_value: { level: 'beginner' },
        points: 200
    },
    {
        name: 'Early Bird',
        description: 'Log in and learn before 9 AM',
        icon_key: 'sun',
        requirement_type: 'time_of_day',
        requirement_value: { hour: 9 },
        points: 30
    }
];

async function seedGamification() {
    console.log('🎮 Seeding Gamification Achievements...\n');

    try {
        // Upsert achievements based on name to prevent duplicates
        for (const achievement of ACHIEVEMENTS) {
            const { data, error } = await supabase
                .from('achievements')
                .upsert(achievement, { onConflict: 'name' })
                .select();

            if (error) {
                console.error(`❌ Failed to insert "${achievement.name}":`, error.message);
            } else {
                console.log(`✅ Upserted Badge: ${achievement.name}`);
            }
        }
        console.log('\n✨ Gamification seed complete!');

    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

seedGamification();
