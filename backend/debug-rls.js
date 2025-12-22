const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role to bypass RLS for this check!

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars. SUPABASE_URL:', !!supabaseUrl, 'KEY:', !!supabaseKey);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPolicies() {
    console.log('Checking active RLS policies on "profiles" table...');

    // We can query pg_policies using the RPC/Direct or just inspect if we have access
    // Note: 'pg_policies' is a system view. Supabase JS client usually only accesses 'public' schema.
    // However, with Service Role, we might have access if it's exposed or via a function.
    // If we can't query pg_policies directly via client, we will try to infer or just PRINT expected vs actual.

    try {
        const { data, error } = await supabase
            .from('pg_policies')
            .select('*')
            .eq('tablename', 'profiles');

        if (error) {
            console.error('Error querying pg_policies:', error);
            // Fallback: This confirms we can't easily check policies from here without a postgres connection string
            // or a helper function locally.
            console.log('---');
            console.log('Since we cannot list policies directly via JS Client (system view restricted),');
            console.log('We must assume the recursive policy is still there.');
        } else {
            console.log('Active Policies found:', data.length);
            data.forEach(p => {
                console.log(`- Policy: "${p.policyname}" (cmd: ${p.cmd})`);
            });
        }
    } catch (e) {
        console.error('Exception:', e);
    }
}

checkPolicies();
