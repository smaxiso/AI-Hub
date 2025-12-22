const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateRoleConstraint() {
    console.log('\n🔄 Updating profiles table to support learner role...\n');

    try {
        // Read the SQL file
        const sqlPath = path.join(__dirname, 'scripts', 'add-learner-role.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split by semicolon and execute each statement
        const statements = sql.split(';').filter(s => s.trim());

        for (const statement of statements) {
            if (statement.trim().startsWith('--') || !statement.trim()) continue;

            const { error } = await supabase.rpc('exec', { sql: statement.trim() });
            if (error && !error.message.includes('does not exist')) {
                console.error('⚠️  Warning:', error.message);
            }
        }

        console.log('✅ Role constraint updated successfully!\n');
        console.log('Supported roles: owner, admin, pending, learner\n');

    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

updateRoleConstraint();
